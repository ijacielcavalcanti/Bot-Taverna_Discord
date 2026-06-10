const { DefaultExtractors } = require('@discord-player/extractor');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`✅ Raphael conectado. Sistema operante.`);
        await client.player.extractors.loadMulti(DefaultExtractors);
        console.log(`🎶 Extratores de música carregados.`);

        // ⚠️ ATENÇÃO: COLOQUE SEUS IDs REAIS AQUI ANTES DE LIGAR
        const ID_CANAL_GAMES = '1511338634928849038';
        const ID_CANAL_MEMES = '1510125245615313036';

        let ultimosJogos = [];
        let primeiraBuscaJogos = true; // <-- Adicionamos essa trava de segurança

        // ==========================================
        // 1. PATRULHA DE JOGOS (As 5 Grandes Fontes)
        // ==========================================
        const patrulhaJogos = async () => {
            console.log(`[Arauto] 🔎 Buscando jogos na Epic, Steam, GOG, Prime e Ubisoft...`);

            const canalGames = client.channels.cache.get(ID_CANAL_GAMES);
            if (!canalGames) return console.log(`[Arauto] ❌ ERRO: Canal de Jogos não encontrado!`);

            try {
                // Aqui nós amarramos as 5 fontes diretamente no link da busca
                const url = 'https://www.gamerpower.com/api/giveaways?type=game&platform=pc&sort-by=date';
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Status ${response.status}`);

                const data = await response.json();

                if (data && data.length > 0) {
                    console.log(`[Arauto] 🎮 A API encontrou ${data.length} promoções nas 5 plataformas.`);

                    // Varre os 15 mais recentes para não deixar a Epic passar despercebida
                    const jogosParaVerificar = data.slice(0, 15).reverse();

                    for (const game of jogosParaVerificar) {
                        if (!ultimosJogos.includes(game.id)) {
                            ultimosJogos.push(game.id);
                            if (ultimosJogos.length > 50) ultimosJogos.shift();

                            // Posta no chat apenas se não for a primeira leitura, ou se for um dos 3 últimos
                            if (!primeiraBuscaJogos || jogosParaVerificar.indexOf(game) >= jogosParaVerificar.length - 3) {
                                const embedGame = {
                                    color: 0x2ECC71,
                                    title: `🔥 JOGO GRÁTIS: ${game.title}`,
                                    url: game.open_giveaway_url,
                                    description: `${game.description}\n\n**Resgate agora:** [Clique aqui para pegar o jogo](${game.open_giveaway_url})`,
                                    image: { url: game.image },
                                    footer: { text: `Plataforma: ${game.platforms} | Valor Original: ${game.worth}` }
                                };
                                await canalGames.send({ embeds: [embedGame] });
                                console.log(`[Arauto] ✅ Postou: ${game.title} (${game.platforms})`);
                            }
                        }
                    }
                    primeiraBuscaJogos = false;
                }
            } catch (error) {
                console.log(`[Arauto] ❌ Erro na busca de jogos: ${error.message}`);
            }
        };

        // ==========================================
        // 2. PATRULHA DE MEMES (Alvo Corrigido)
        // ==========================================
        const patrulhaMemes = async () => {
            console.log(`[Arauto] 🔎 Iniciando busca por Memes...`);

            const canalMemes = client.channels.cache.get(ID_CANAL_MEMES);
            if (!canalMemes) return console.log(`[Arauto] ❌ ERRO: Canal de Memes não encontrado! Verifique o ID.`);

            try {
                // Mudamos o alvo para "gaming" ou "pcmasterrace", que são enormes e não dão erro 404
                const responseMeme = await fetch('https://meme-api.com/gimme/gaming');
                if (!responseMeme.ok) throw new Error(`A API de memes retornou status ${responseMeme.status}`);

                const dataMeme = await responseMeme.json();

                if (dataMeme && dataMeme.url) {
                    await canalMemes.send({ content: `📜 **O Arauto trouxe um pergaminho:** *${dataMeme.title}*\n${dataMeme.url}` });
                    console.log(`[Arauto] ✅ Postou o meme: ${dataMeme.title}`);
                } else {
                    console.log(`[Arauto] ⚠️ A API não enviou uma imagem válida.`);
                }
            } catch (error) {
                console.log(`[Arauto] ❌ Falha catastrófica na busca de memes: ${error.message}`);
            }
        };

        // Roda a primeira vez ao iniciar o bot
        //patrulhaJogos();
        //patrulhaMemes();

        // Se você colocou 5000 (5 segundos) para testar, troque aqui:
        setInterval(patrulhaJogos, 14400000);
        //setInterval(patrulhaMemes, 1800000);


        // ==========================================
        // NOVO MOTOR DE XP POR VOZ (IMUNE A QUEDAS)
        // ==========================================
        const db = require('../database.js');
        const ids = require('../config/ids.json');

        setInterval(() => {
            const guilda = client.guilds.cache.get(ids.guilda);
            if (!guilda) return;

            // Varre todos os canais de voz do servidor
            guilda.channels.cache.filter(c => c.isVoiceBased()).forEach(canalVoz => {
                // Ignora o canal de Criar Mesa e canais vazios
                if (canalVoz.id === ids.canais.criarMesa || canalVoz.members.size === 0) return;

                canalVoz.members.forEach(member => {
                    if (member.user.bot) return;

                    // Sistema Anti-AFK: Se estiver mutado ou ensurdecido pelo headset, não farma Ouro.
                    if (member.voice.deaf || member.voice.mute) return;

                    let membroDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(member.id);
                    if (!membroDb) {
                        db.prepare('INSERT INTO membros (id, xp, level, gold, mensagens) VALUES (?, 0, 1, 0, 0)').run(member.id);
                        membroDb = { id: member.id, xp: 0, level: 1, gold: 0, mensagens: 0 };
                    }

                    const xpGanho = 10; // 10 de XP a cada 5 min
                    const goldGanho = 2; // 2 de Ouro a cada 5 min

                    const novoXp = membroDb.xp + xpGanho;
                    const novoGold = membroDb.gold + goldGanho;
                    const xpParaProximoNivel = (membroDb.level * membroDb.level) * 100;
                    let novoLevel = membroDb.level;

                    if (novoXp >= xpParaProximoNivel) {
                        novoLevel++;
                        db.prepare('UPDATE membros SET xp = ?, level = ?, gold = ? WHERE id = ?').run(novoXp, novoLevel, novoGold + 50, member.id);
                        
                        const canalAvisos = guilda.channels.cache.get(ids.canais.avisos);
                        if (canalAvisos) {
                            const embedLevelUp = {
                                color: 0xD4AF37,
                                title: `✨ LEVEL UP NAS MESAS!`,
                                description: `A Taverna celebra seu avanço. <@${member.id}> conversou tanto que alcançou o **Nível ${novoLevel}** e recebeu **50 moedas de Ouro** de bônus!`,
                                image: { url: 'https://cdn.discordapp.com/attachments/1511518891594219540/1511522532006563870/Levelup_GUme_ascend.png?ex=6a20c28e&is=6a1f710e&hm=6092a90f85d0b9b2b556f5bb066b0c8761f27ff80b42967f2579bfa1fdce8a37&.png' },
                                thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) }
                            };
                            canalAvisos.send({ embeds: [embedLevelUp] });
                        }
                    } else {
                        db.prepare('UPDATE membros SET xp = ?, gold = ? WHERE id = ?').run(novoXp, novoGold, member.id);
                    }
                });
            });
        }, 300000); // Executa exatamente a cada 5 minutos (300.000 ms)
    },
};