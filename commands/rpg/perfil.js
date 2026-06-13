module.exports = {
    name: 'perfil',
    aliases: ['status'],
    async execute(message, args, client, db, ids) {
        if (message.channel.id !== ids.canais.comandos) {
            return message.reply(`📜 O Mestre Taverneiro exige que as fichas sejam consultadas apenas no <#${ids.canais.comandos}>.`);
        }

        const perfilDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(message.author.id);
        if (!perfilDb) return message.reply('Ainda não há registros seus. Converse mais!');

        const xpProximo = (perfilDb.level * perfilDb.level) * 100;

        const embedPerfil = {
            colors: 0x3498db,
            title: `📜 Ficha de Forasteiro: ${message.member.displayName}`,
            thumbnail: { url: message.author.displayAvatarURL({ dynamic: true }) },
            fields: [
                { name: 'Nível', value: `\`${perfilDb.level}\``, inline: true },
                { name: 'XP', value: `\`${perfilDb.xp} / ${xpProximo}\``, inline: true },
                { name: 'Ouro', value: `\`🪙 ${perfilDb.gold}\``, inline: true },
                { name: 'Mensagens', value: `\`${perfilDb.mensagens}\``, inline: true }
            ]
        };
        return message.reply({ embeds: [embedPerfil] });
    }
};