const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula a música atual do Bardo.'),

    async execute(interaction) {
        const client = interaction.client;
        const canalVoz = interaction.member.voice.channel;

        if (!canalVoz) return interaction.reply({ content: '❌ Você precisa estar em uma Mesa.', flags: MessageFlags.Ephemeral });
        if (interaction.channelId !== canalVoz.id) return interaction.reply({ content: `🎸 Use este comando no chat da sua Mesa: <#${canalVoz.id}>`, flags: MessageFlags.Ephemeral });
        
        const fila = client.player.nodes.get(interaction.guildId);
        if (!fila || !fila.isPlaying()) {
            return interaction.reply({ content: '❌ Nenhuma música tocando no momento.', flags: MessageFlags.Ephemeral });
        }
        
        fila.node.skip(); 

        const embedPular = new EmbedBuilder()
            .setColor('#1DB954')
            .setDescription('⏭️ A música atual foi pulada! O Bardo já vai trocar as partituras.')
            .setImage(banners.getBanner('bardo'));

        return interaction.reply({ embeds: [embedPular] });
    }
};