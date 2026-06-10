const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'addouro',
    async execute(message, args, client, db, ids) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        const usuario = message.mentions.users.first();
        const quantidade = parseInt(args[1]); // Lê o segundo argumento após o nome do comando
        
        if (!usuario || isNaN(quantidade)) return message.reply('❌ Uso: `!addouro @usuario 100`');

        db.prepare('UPDATE membros SET gold = gold + ? WHERE id = ?').run(quantidade, usuario.id);
        message.reply(`✅ **🪙 ${quantidade} Ouro** entregue para <@${usuario.id}>.`);

        const canalLogs = message.guild.channels.cache.get(ids.canais.logsAdmin);
        if (canalLogs) {
            canalLogs.send(`🚨 **AUDITORIA DE TESOURO:** O administrador <@${message.author.id}> injetou **🪙 ${quantidade} Ouro** na conta de <@${usuario.id}>.`);
        }
    }
};