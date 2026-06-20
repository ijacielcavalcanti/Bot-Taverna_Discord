const { PermissionsBitField } = require('discord.js');
const db = require('../database.js');
const ids = require('../config/ids.json');
const filtro = require('../utils/filtro.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.webhookId) return;
        if (message.author.bot) return;

        // ==========================================
        // 1. SISTEMA DE MODERAÇÃO E FILTRO
        // ==========================================
        if (filtro.verificar(message.content)) {
            // Apaga a mensagem imediatamente
            message.delete().catch(() => {});

            const userId = message.author.id;
            const avisosAtuais = (client.warns.get(userId) || 0) + 1;
            client.warns.set(userId, avisosAtuais);

            const canalMural = client.channels.cache.get(ids.canais.muralEventos);

            // Se for a 3ª infração, aplica o castigo
            if (avisosAtuais >= 3) {
                try {
                    // Silencia o membro no Discord por 10 minutos
                    await message.member.timeout(10 * 60 * 1000, 'Violação repetida das regras de vocabulário e links.');
                    
                    // Se o membro estiver em uma chamada de voz, arrasta ele para a sala de castigo
                    if (message.member.voice.channelId) {
                        await message.member.voice.setChannel(ids.canais.castigo).catch(() => {});
                    }

                    message.channel.send(`⛔ <@${userId}> atingiu o limite de advertências e foi enviado para o Castigo pelo Mestre Taverneiro.`);
                    
                    if (canalMural) {
                        canalMural.send(`🚨 **PUNIÇÃO APLICADA:** O forasteiro <@${userId}> foi silenciado por 10 minutos e movido para a prisão (3 advertências por vocabulário/link).`);
                    }

                    // Limpa a ficha do membro após a punição
                    client.warns.delete(userId);
                } catch (error) {
                    console.error('Erro ao punir membro:', error);
                }
            } else {
                // Se for a 1ª ou 2ª vez, apenas avisa
                message.channel.send(`⚠️ <@${userId}>, modos! Esta é a sua advertência ${avisosAtuais}/3. A próxima infração resultará em castigo.`);
                
                if (canalMural) {
                    canalMural.send(`⚠️ **ADVERTÊNCIA (${avisosAtuais}/3):** <@${userId}> tentou usar vocabulário proibido ou link suspeito.`);
                }
            }
            
            return; // Interrompe o código. O membro não ganha XP e a mensagem não aciona comandos.
        }

        // ==========================================
        // 2. SISTEMA DE XP D&D E PROGRESSÃO PASSIVA
        // ==========================================
        const tempoAtual = Date.now();
        const tempoAnterior = client.xpCooldowns.get(message.author.id) || 0;
        const tempoDeEspera = 60000;

        if (tempoAtual - tempoAnterior > tempoDeEspera) {
            client.xpCooldowns.set(message.author.id, tempoAtual);

            let membroDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(message.author.id);
            if (!membroDb) {
                db.prepare('INSERT INTO membros (id, xp, level, gold, mensagens) VALUES (?, 0, 1, 0, 0)').run(message.author.id);
                membroDb = { id: message.author.id, xp: 0, level: 1, gold: 0, mensagens: 0 };
            }

            // Ganhos base
            let xpGanho = Math.floor(Math.random() * 11) + 10;
            let goldGanho = 0;

            if (message.attachments.size > 0 || message.content.includes('http')) {
                xpGanho += 20;
                goldGanho += Math.floor(Math.random() * 3) + 1;
            }
            if (Math.random() < 0.10) goldGanho += 1;
            if (message.content.startsWith('!')) { xpGanho = 5; goldGanho = 0; }

            // --- BÔNUS DE MACENA (SERVER BOOSTER) ---
            // Verifica se o membro tem o cargo 'Macena' ou se o Discord acusa o boost ativo
            const isMacena = message.member.roles.cache.some(r => r.name === 'Macena') || message.member.premiumSinceTimestamp !== null;
            
            if (isMacena) {
                xpGanho = Math.floor(xpGanho * 1.5); // +50% de XP
                goldGanho = goldGanho > 0 ? Math.floor(goldGanho * 2) : 1; // Dobro de ouro (ou pelo menos 1 garantido)
            }
            // ----------------------------------------

            const novoXp = membroDb.xp + xpGanho;
            const novaQtdMensagens = membroDb.mensagens + 1;
            const xpParaProximoNivel = (membroDb.level * membroDb.level) * 100;
            let novoLevel = membroDb.level;

            if (novoXp >= xpParaProximoNivel) {
                novoLevel++;
                
                // Ouro de Level Up: 50 normal, 100 para Macenas
                const bonusLevelUp = isMacena ? 100 : 50; 
                
                db.prepare('UPDATE membros SET xp = ?, level = ?, gold = ?, mensagens = ? WHERE id = ?').run(novoXp, novoLevel, membroDb.gold + goldGanho + bonusLevelUp, novaQtdMensagens, message.author.id);

                let textoDescricao = `A Taverna celebra seu avanço. Você recebeu **${bonusLevelUp} moedas de Ouro** de bônus!`;
                if (isMacena) textoDescricao += `\n💎 *Bônus de Macena aplicado!*`;

                const embedLevelUp = {
                    color: isMacena ? 0xF47FFF : 0xD4AF37, // Rosa/Roxo se for Macena, Dourado se for normal
                    title: `✨ LEVEL UP! ${message.member.displayName} alcançou o Nível ${novoLevel}!`,
                    description: textoDescricao,
                    image: { url: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000312949014638/levelup1.png?ex=6a385375&is=6a3701f5&hm=7c3627387c5a489b0f94c3b8f666f3f4e53fbdae55cd74fa13537f47b0be3db5&.png' },
                    thumbnail: { url: message.author.displayAvatarURL({ dynamic: true }) }
                };

                message.channel.send({ embeds: [embedLevelUp] });

                const canalAvisos = client.channels.cache.get(ids.canais.avisos);
                if (canalAvisos && canalAvisos.id !== message.channel.id) {
                    canalAvisos.send({ embeds: [embedLevelUp] });
                }

                // ... (O resto do código que distribui os cargos de Nível continua igual a partir daqui)
                const guild = message.guild;
                const cargos = {
                    10: guild.roles.cache.find(r => r.name === '🗡️ Aventureiro'),
                    25: guild.roles.cache.find(r => r.name === '🛡️ Veterano'),
                    50: guild.roles.cache.find(r => r.name === '👑 Herói da Guilda'),
                    70: guild.roles.cache.find(r => r.name.includes('🐉 Monarca')),
                    85: guild.roles.cache.find(r => r.name.includes('🐦‍🔥 Lenda Viva')),
                    100: guild.roles.cache.find(r => r.name.includes('🪽 Celeste'))
                };

                try {
                    if (novoLevel === 10 && cargos[10]) {
                        await message.member.roles.add(cargos[10]);
                        message.channel.send(`🎉 As habilidades de <@${message.author.id}> foram reconhecidas! O título de **🗡️ Aventureiro** foi forjado!`);
                    } else if (novoLevel === 25 && cargos[25]) {
                        await message.member.roles.add(cargos[25]);
                        message.channel.send(`🎉 As cicatrizes provam seu valor! <@${message.author.id}> ascendeu para **🛡️ Veterano**!`);
                    } else if (novoLevel === 50 && cargos[50]) {
                        await message.member.roles.add(cargos[50]);
                        message.channel.send(`👑 Uma lenda caminha entre nós! <@${message.author.id}> agora é um **👑 Herói da Guilda**!`);
                    } else if (novoLevel === 70 && cargos[70]) {
                        await message.member.roles.add(cargos[70]);
                        message.channel.send(`🐉 O poder de um rei! <@${message.author.id}> assumiu o trono como **🐉 Monarca**!`);
                    } else if (novoLevel === 85 && cargos[85]) {
                        await message.member.roles.add(cargos[85]);
                        message.channel.send(`🐦‍🔥 Um mito vivo! <@${message.author.id}> transcendeu para **Lenda Viva**! A Taverna estremece com a sua presença.`);
                    } else if (novoLevel === 100 && cargos[100]) {
                        await message.member.roles.add(cargos[100]);
                        message.channel.send(`🪽 O ápice da existência foi atingido! Inclinem-se perante <@${message.author.id}>, o novo **Celeste** deste reino!`);
                    }
                } catch (error) { console.error('Erro ao atualizar cargo por nível:', error); }

            } else {
                db.prepare('UPDATE membros SET xp = ?, gold = ?, mensagens = ? WHERE id = ?').run(novoXp, membroDb.gold + goldGanho, novaQtdMensagens, message.author.id);
            }
        }
    }
};