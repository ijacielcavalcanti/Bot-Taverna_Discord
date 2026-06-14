const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const ids = require('../../config/ids.json');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música e limpa a fila do Bardo.'),

    async execute(interaction) {
        const client = interaction.client;
        const canalVoz = interaction.member.voice.channel;

        if (!canalVoz) return interaction.reply({ content: '❌ Você precisa estar em uma Mesa.', flags: MessageFlags.Ephemeral });
        
        if (interaction.channelId !== ids.canais.comandos && interaction.channelId !== canalVoz.id) {
            return interaction.reply({ content: `🎸 Use este comando no <#${ids.canais.comandos}> ou no chat da sua Mesa: <#${canalVoz.id}>`, flags: MessageFlags.Ephemeral });
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