const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'panorama',
    async execute(message, args, client, db, ids) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Apenas o Mestre Taverneiro e a Guarda da Cidade possuem a visão do Olho de Sauron.');
        }

        const alvo = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!alvo) {
            return message.reply('❌ Você precisa marcar um forasteiro. Uso correto: `!panorama @usuario` ou `!panorama ID`');
        }

        const stats = db.prepare('SELECT * FROM membros WHERE id = ?').get(alvo.id) || { level: 1, xp: 0, gold: 0, mensagens: 0 };
        const xpProximo = (stats.level * stats.level) * 100;

        const dataEntrada = alvo.joinedAt.toLocaleDateString('pt-BR');
        const contaCriada = alvo.user.createdAt.toLocaleDateString('pt-BR');
        const cargosLista = alvo.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.name).join(' • ') || 'Nenhum cargo';

        const embedPanorama = new EmbedBuilder()
            .setColor(0x8E44AD)
            .setTitle(`👁️ O Olho de Sauron: Panorama de ${alvo.user.username}`)
            .setThumbnail(alvo.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👤 Identidade e Registro', value: `**ID:** \`${alvo.id}\`\n**Conta Criada:** ${contaCriada}\n**Chegou na Taverna:** ${dataEntrada}`, inline: false },
                { name: '📊 Status RPG', value: `**Nível:** ${stats.level}\n**XP:** ${stats.xp} / ${xpProximo}\n**Ouro:** 🪙 ${stats.gold}\n**Mensagens Enviadas:** 💬 ${stats.mensagens}`, inline: false },
                { name: '🏷️ Cargos na Guilda', value: `\`${cargosLista}\``, inline: false }
            )
            .setFooter({ text: 'Arquivos Confidenciais d\'O Gume' })
            .setTimestamp();

        return message.reply({ embeds: [embedPanorama] });
    }
};