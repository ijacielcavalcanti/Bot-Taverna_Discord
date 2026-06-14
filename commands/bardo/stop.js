const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const ids = require('../../config/ids.json');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música e limpa a fila do Bardo.'),

    async execute(interaction) {
        const client = interaction.client;

        if (interaction.channelId !== ids.canais.comandos) {
            return interaction.reply({ content: `🎸 Use este comando no balcão: <#${ids.canais.comandos}>.`, flags: MessageFlags.Ephemeral });
        }

        const fila = client.player.nodes.get(interaction.guildId);
        if (!fila) {
            return interaction.reply({ content: '❌ Nenhuma música tocando.', flags: MessageFlags.Ephemeral });
        }
        
        fila.delete(); 

        const embedParar = new EmbedBuilder()
            .setColor('#E74C3C')
            .setDescription('⏹️ O Bardo guardou o alaúde e a fila foi limpa.')
            .setImage(banners.getBanner('bardo'));

        return interaction.reply({ embeds: [embedParar] });
    }
};