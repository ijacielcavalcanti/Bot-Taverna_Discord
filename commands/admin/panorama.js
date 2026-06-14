const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panorama')
        .setDescription('Exibe o quadro de líderes e os membros mais ricos da Taverna.'),

    async execute(interaction) {
        // Puxa os 10 maiores níveis e desempata pelo Ouro
        const topMembros = db.prepare('SELECT * FROM membros ORDER BY level DESC, gold DESC LIMIT 10').all();
        
        if (topMembros.length === 0) {
            return interaction.reply({ content: 'A Guilda ainda está vazia. Nenhuma lenda para contar.', ephemeral: true });
        }

        let descricaoRank = 'Estes são os forasteiros mais influentes e prósperos d\'O Gume:\n\n';
        
        topMembros.forEach((membro, index) => {
            let medalha = '🏅';
            if (index === 0) medalha = '🥇';
            if (index === 1) medalha = '🥈';
            if (index === 2) medalha = '🥉';

            descricaoRank += `${medalha} **<@${membro.id}>**\n└ Nível: \`${membro.level}\` | Ouro: \`🪙 ${membro.gold}\` | Msg: \`${membro.mensagens}\`\n\n`;
        });

        const imagemBanner = banners.getBanner('dinamico');

        const embedPanorama = new EmbedBuilder()
            .setColor('#FF4500')
            .setTitle('🏆 Panorama da Guilda')
            .setDescription(descricaoRank)
            .setImage(imagemBanner)
            .setFooter({ text: 'Atualizado em tempo real pelo banco de dados da Taverna.' });

        await interaction.reply({ embeds: [embedPanorama] });
    }
};