module.exports = {
    name: 'volume',
    aliases: ['vol'],
    async execute(message, args, client, db, ids) {
        if (message.channel.id !== ids.canais.comandos) {
            return message.reply(`🎸 O Bardo aceita pedidos de música apenas no balcão mágico: <#${ids.canais.comandos}>.`);
        }

        const fila = client.player.nodes.get(message.guild.id);
        if (!fila) return message.reply('❌ Nenhuma música tocando.');
        
        const vol = parseInt(args[0]);
        if (!vol || vol < 1 || vol > 100) return message.reply('❌ Digite um volume entre 1 e 100.');
        
        fila.node.setVolume(vol); 
        return message.reply(`🔊 Volume ajustado para ${vol}%.`);
    }
};