module.exports = {
    name: 'stop',
    aliases: ['parar'],
    async execute(message, args, client, db, ids) {
        if (message.channel.id !== ids.canais.comandos) {
            return message.reply(`🎸 O Bardo aceita pedidos de música apenas no balcão mágico: <#${ids.canais.comandos}>.`);
        }

        const fila = client.player.nodes.get(message.guild.id);
        if (!fila) return message.reply('❌ Nenhuma música tocando.');
        
        fila.delete(); 
        return message.reply('⏹️ O Bardo guardou o alaúde.');
    }
};