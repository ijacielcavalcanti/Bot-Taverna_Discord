const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setnivel',
    async execute(message, args, client, db, ids) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        const usuario = message.mentions.members.first();
        const alvoLevel = parseInt(args[1]);

        if (!usuario || isNaN(alvoLevel) || alvoLevel < 1) return message.reply('❌ Uso correto: `!setnivel @usuario 25`');

        const xpCalculado = ((alvoLevel - 1) * (alvoLevel - 1)) * 100;

        let membroDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(usuario.id);
        if (!membroDb) {
            db.prepare('INSERT INTO membros (id, xp, level, gold, mensagens) VALUES (?, ?, ?, 0, 0)').run(usuario.id, xpCalculado, alvoLevel);
        } else {
            db.prepare('UPDATE membros SET xp = ?, level = ? WHERE id = ?').run(xpCalculado, alvoLevel, usuario.id);
        }

        const guild = message.guild;
        if (alvoLevel >= 50) {
            await usuario.roles.add(guild.roles.cache.find(r => r.name === '👑 Herói da Guilda'));
        } else if (alvoLevel >= 25) {
            await usuario.roles.add(guild.roles.cache.find(r => r.name === '🛡️ Veterano'));
        } else if (alvoLevel >= 10) {
            await usuario.roles.add(guild.roles.cache.find(r => r.name === '🗡️ Aventureiro'));
        } else {
            await usuario.roles.add(guild.roles.cache.find(r => r.name === '🎒 Viajante'));
        }
        message.reply(`✅ <@${usuario.id}> foi promovido diretamente ao **Nível ${alvoLevel}**.`);
    }
};