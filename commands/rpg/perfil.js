const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const db = require('../../database.js');
const ids = require('../../config/ids.json');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Exibe sua ficha, nível e riquezas na Taverna.'),

    async execute(interaction) {
        if (interaction.channelId !== ids.canais.comandos) {
            return interaction.reply({ 
                content: `📜 O Mestre Taverneiro exige que as fichas sejam consultadas apenas no <#${ids.canais.comandos}>.`, 
                flags: MessageFlags.Ephemeral 
            });
        }

        const perfilDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(interaction.user.id);
        
        if (!perfilDb) {
            return interaction.reply({ 
                content: 'Ainda não há registros seus no banco de dados da Guilda. Converse mais nas mesas e no salão!', 
                flags: MessageFlags.Ephemeral 
            });
        }

        const xpProximo = (perfilDb.level * perfilDb.level) * 100;
        const imagemBanner = banners.getBanner('perfil_dinamico');

        const embedPerfil = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`📜 Ficha de Forasteiro: ${interaction.member.displayName}`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setImage(imagemBanner)
            .addFields(
                { name: 'Nível', value: `\`${perfilDb.level}\``, inline: true },
                { name: 'XP', value: `\`${perfilDb.xp} / ${xpProximo}\``, inline: true },
                { name: 'Ouro', value: `\`🪙 ${perfilDb.gold}\``, inline: true },
                { name: 'Mensagens', value: `\`${perfilDb.mensagens}\``, inline: true }
            );

        await interaction.reply({ embeds: [embedPerfil] });
    }
};