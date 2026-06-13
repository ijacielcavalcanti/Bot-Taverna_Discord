const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const db = require('../database.js'); 
const ids = require('../config/ids.json');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {

        // ==========================================
        // 1. LIMPEZA DE SALAS TEMPORÁRIAS
        // ==========================================
        if (oldState.channelId) {
            const canalVoz = oldState.guild.channels.cache.get(oldState.channelId);
            
            if (canalVoz && (client.tempMesas.has(canalVoz.id) || canalVoz.name.startsWith('🍻'))) {
                if (canalVoz.members.size === 0 && canalVoz.id !== ids.canais.criarMesa) {
                    try {
                        await canalVoz.delete();
                        client.tempMesas.delete(oldState.channelId);
                    } catch (error) {}
                }
            }
        }

        // ==========================================
        // 2. CRIAÇÃO DA SALA TEMPORÁRIA
        // ==========================================
        if (newState.channelId === ids.canais.criarMesa) {
            const member = newState.member;
            const guild = newState.guild;

            const nomeLimpo = member.displayName.split('|')[0].trim();
            const nomeSala = `🍻 Mesa de ${nomeLimpo}`;
            const cargoViajante = guild.roles.cache.find(r => r.name === '🎒 Viajante');

            try {
                const novaSala = await guild.channels.create({
                    name: nomeSala,
                    type: ChannelType.GuildVoice,
                    parent: newState.channel.parentId,
                    permissionOverwrites: [
                        { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        ...(cargoViajante ? [{ id: cargoViajante.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect] }] : []),
                        { id: member.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers, PermissionsBitField.Flags.MoveMembers] }
                    ]
                });

                await member.voice.setChannel(novaSala);
                client.tempMesas.add(novaSala.id); 

                const painelMesa = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('mesa_rename').setEmoji('✏️').setLabel('Renomear').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('mesa_lock').setEmoji('🔒').setLabel('Trancar').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('mesa_unlock').setEmoji('🔓').setLabel('Destrancar').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('mesa_limit').setEmoji('👥').setLabel('Limitar a 5').setStyle(ButtonStyle.Primary)
                );

                await novaSala.send({
                    content: `**Sala Instanciada!**\n<@${member.id}>, você é o dono da mesa. Utilize o painel abaixo para gerenciar o acesso.`,
                    components: [painelMesa]
                });
            } catch (error) { console.error('Erro ao instanciar sala:', error); }
        }

        // ==========================================
        // 3. AVISOS DE STREAM E CÂMERA (Com Cálculo de Nível)
        // ==========================================
        if (!newState.member.user.bot) {
            const processarAviso = async (tipoAviso, recompensaXp, recompensaGold) => {
                const tempoAtual = Date.now();
                const chaveCooldown = `${newState.member.id}_${tipoAviso}`;
                const ultimoVideo = client.xpCooldowns.get(chaveCooldown) || 0;

                // Cooldown de 5 minutos para evitar spam de abrir/fechar câmera
                if (tempoAtual - ultimoVideo > 300000) { 
                    client.xpCooldowns.set(chaveCooldown, tempoAtual);
                    
                    let membroDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(newState.member.id);
                    if (!membroDb) {
                        db.prepare('INSERT INTO membros (id, xp, level, gold, mensagens) VALUES (?, 0, 1, 0, 0)').run(newState.member.id);
                        membroDb = { id: newState.member.id, xp: 0, level: 1, gold: 0, mensagens: 0 };
                    }
                    
                    const novoXp = membroDb.xp + recompensaXp;
                    const novoGold = membroDb.gold + recompensaGold;
                    const xpParaProximoNivel = (membroDb.level * membroDb.level) * 100;
                    let novoLevel = membroDb.level;
                    let subiuDeNivel = false;

                    // O bot agora percebe se o XP da Stream fez o membro evoluir
                    if (novoXp >= xpParaProximoNivel) {
                        novoLevel++;
                        subiuDeNivel = true;
                        db.prepare('UPDATE membros SET xp = ?, level = ?, gold = ? WHERE id = ?').run(novoXp, novoLevel, novoGold + 50, newState.member.id);
                    } else {
                        db.prepare('UPDATE membros SET xp = ?, gold = ? WHERE id = ?').run(novoXp, novoGold, newState.member.id);
                    }
                    
                    // Disparo do Banner 100% focado no canal de Avisos
                    const canalAvisos = newState.guild.channels.cache.get(ids.canais.avisos);
                    if (canalAvisos) {
                        const embedLive = {
                            colors: tipoAviso === 'STREAM' ? 0x9B59B6 : 0x3498DB,
                            title: tipoAviso === 'STREAM' ? `📺 TRANSMISSÃO AO VIVO!` : `🎥 CÂMERA ABERTA!`,
                            description: `<@${newState.member.id}> abriu o vídeo na sala **${newState.channel.name}**!\n\nPuxe uma cadeira, traga sua caneca e venha acompanhar!`,
                            image: { url: tipoAviso === 'STREAM' ? 'https://cdn.discordapp.com/attachments/1511518891594219540/1511522532891820113/LIVE_ON_Gume.png?ex=6a20c28e&is=6a1f710e&hm=72dabdc21c539d93aca9d0e250754893963666a8550287a79f199e73a20b60d5&.png' : 'https://cdn.discordapp.com/attachments/1511518891594219540/1511522531184476333/Camera_ON.png?ex=6a20c28e&is=6a1f710e&hm=ce1261832f81cd2e0b2a00cd51429a05387ccb465298e1973ce5303391f37dd4&.png' },
                            thumbnail: { url: newState.member.user.displayAvatarURL({ dynamic: true }) }
                        };
                        
                        try { await canalAvisos.send({ embeds: [embedLive] }); } catch (e) {}

                        if (subiuDeNivel) {
                            const embedLevelUp = {
                                colors: 0xD4AF37,
                                title: `✨ LEVEL UP EM CENA!`,
                                description: `A Taverna celebra seu avanço. <@${newState.member.id}> alcançou o **Nível ${novoLevel}** produzindo conteúdo e recebeu **50 moedas de Ouro** de bônus!`,
                                image: { url: 'https://cdn.discordapp.com/attachments/1511518891594219540/1511522532006563870/Levelup_GUme_ascend.png?ex=6a20c28e&is=6a1f710e&hm=6092a90f85d0b9b2b556f5bb066b0c8761f27ff80b42967f2579bfa1fdce8a37&.png' },
                                thumbnail: { url: newState.member.user.displayAvatarURL({ dynamic: true }) }
                            };
                            canalAvisos.send({ embeds: [embedLevelUp] });
                        }
                    }
                }
            };

            if (!oldState.streaming && newState.streaming) await processarAviso('STREAM', 50, 5);
            if (!oldState.selfVideo && newState.selfVideo) await processarAviso('CAMERA', 30, 3);
        }
    }
};