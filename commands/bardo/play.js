module.exports = {
    name: 'play',
    aliases: ['iniciarbardo'],
    async execute(message, args, client, db, ids) {
        if (message.channel.id !== ids.canais.comandos) {
            return message.reply(`🎸 O Bardo aceita pedidos de música apenas no balcão mágico: <#${ids.canais.comandos}>.`);
        }

        const canalVoz = message.member.voice.channel;
        if (!canalVoz) return message.reply('❌ Você precisa estar em uma Mesa de voz.');

        const busca = args.join(' ');
        if (!busca) return message.reply('❌ Me diga o nome da música ou envie o link da playlist.');

        const mensagemCarregando = await message.reply('⏳ Afinando o alaúde e procurando as partituras...');

        try {
            const isLink = busca.includes('http://') || busca.includes('https://');
            const result = await client.player.search(busca, {
                requestedBy: message.author,
                searchEngine: isLink ? 'auto' : 'youtubeSearch'
            });

            if (!result.hasTracks()) {
                return mensagemCarregando.edit('❌ Não encontrei a música. Tente enviar o link direto!');
            }

            // O bot extrai o objeto 'queue' (fila) no momento em que dá o play
            const { queue } = await client.player.play(canalVoz, result, {
                nodeOptions: {
                    metadata: { channel: message.channel },
                    leaveOnEmpty: false, // O Bardo fixa residência na sala (não sai se ficar vazia)
                    leaveOnEnd: false,   // Permanece na sala mesmo se a fila acabar
                    volume: 40
                }
            });

            const isIniciarbardo = message.content.toLowerCase().startsWith('!iniciarbardo');

            // Se o gatilho foi o comando de ambientação, ele tranca o repeat na fila inteira
            if (isIniciarbardo) {
                queue.setRepeatMode(2); // 2 = Repetir a Fila (Queue Repeat)
            }

            const track = result.tracks[0];
            const avisoLoop = isIniciarbardo ? '\n🔂 *Modo de Ambientação (Loop Infinito) Ativado!*' : '';

            return mensagemCarregando.edit(`✅ **${track.title}** adicionada à fila da Taverna!${avisoLoop}`);

        } catch (error) {
            console.error('Erro de extração musical:', error);
            return mensagemCarregando.edit('❌ Ocorreu um erro crítico ao puxar essa música. Tente outro link.');
        }
    }
};