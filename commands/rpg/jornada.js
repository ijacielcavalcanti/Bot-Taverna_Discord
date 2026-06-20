const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jornada')
        .setDescription('Visualiza as patentes e a trilha de evolução na Guilda.'),

    async execute(interaction) {
        const imagemBanner = banners.getBanner('jornada_21x9');

        const embedJornada = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle('🗺️ A Jornada do Forasteiro')
            .setDescription('O caminho da glória exige tempo e muita conversa na Taverna. Veja as patentes que você pode conquistar ao acumular XP:')
            .addFields(
                { name: 'Nível 1 ao 9', value: '🎒 **Viajante:** Um novato conhecendo o local. Direitos básicos.', inline: false },
                { name: 'Nível 10', value: '🗡️ **Aventureiro:** Você provou seu valor. Liberado o envio de imagens e links.', inline: false },
                { name: 'Nível 25', value: '🛡️ **Veterano:** As cicatrizes impõem respeito. Liberado o uso de emojis externos.', inline: false },
                { name: 'Nível 50', value: '👑 **Herói da Guilda:** Uma lenda local. Permissão para trocar de apelido e criar tópicos.', inline: false },
                { name: 'Nível 70', value: '🐉 **Monarca:** O poder de um rei. Uma autoridade reconhecida por todos.', inline: false },
                { name: 'Nível 85', value: '🐦‍🔥 **Lenda Viva:** Um mito entre os mortais. O servidor inteiro estremece com a sua presença.', inline: false },
                { name: 'Nível 100', value: '🪽 **Celeste:** O ápice absoluto da existência! Você transcendeu e faz parte da história da Taverna.', inline: false }
            )
            .setImage(imagemBanner)
            .setFooter({ text: 'Dica: Digite /perfil para acompanhar o seu progresso rumo ao topo.' });

        return interaction.reply({ embeds: [embedJornada] });
    }
};