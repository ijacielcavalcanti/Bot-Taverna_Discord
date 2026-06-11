const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'addxp',
    async execute(message, args, client, db, ids) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        const usuario = message.mentions.users.first();
        const quantidade = parseInt(args[1]);
        
        if (!usuario || isNaN(quantidade)) return message.reply('❌ Uso: `!addxp @usuario 500`');

        db.prepare('UPDATE membros SET xp = xp + ? WHERE id = ?').run(quantidade, usuario.id);
        message.reply(`✅ **${quantidade} pontos de XP** concedidos a <@${usuario.id}>.`);

        const canalLogs = message.guild.channels.cache.get(ids.canais.logsAdmin);
        if (canalLogs) {
            canalLogs.send(`🚨 **AUDITORIA DE NÍVEL:** O administrador <@${message.author.id}> deu **✨ ${quantidade} XP** para <@${usuario.id}>.`);
        }
    }
};