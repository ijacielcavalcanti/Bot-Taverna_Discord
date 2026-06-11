module.exports = {
    name: 'skip',
    aliases: ['pular'],
    async execute(message, args, client, db, ids) {
        if (message.channel.id !== ids.canais.comandos) {
            return message.reply(`🎸 O Bardo aceita pedidos de música apenas no balcão mágico: <#${ids.canais.comandos}>.`);
        }
        
        const fila = client.player.nodes.get(message.guild.id);
        if (!fila) return message.reply('❌ Nenhuma música tocando.');
        
        fila.node.skip(); 
        return message.reply('⏭️ Música pulada!');
    }
};