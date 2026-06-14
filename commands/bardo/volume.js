const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Ajusta o volume do Bardo.')
        .addIntegerOption(opt => 
            opt.setName('nivel')
               .setDescription('Nível do volume (1 a 100)')
               .setMinValue(1)
               .setMaxValue(100)
               .setRequired(true)),

    async execute(interaction) {
        const client = interaction.client;
        const canalVoz = interaction.member.voice.channel;

        if (!canalVoz) return interaction.reply({ content: '❌ Você precisa estar em uma Mesa.', flags: MessageFlags.Ephemeral });
        if (interaction.channelId !== canalVoz.id) return interaction.reply({ content: `🎸 Use este comando no chat da sua Mesa: <#${canalVoz.id}>`, flags: MessageFlags.Ephemeral });

        const fila = client.player.nodes.get(interaction.guildId);
        if (!fila) {
            return interaction.reply({ content: '❌ Nenhuma música tocando.', flags: MessageFlags.Ephemeral });
        }
        
        const vol = interaction.options.getInteger('nivel');
        fila.node.setVolume(vol); 

        const embedVolume = new EmbedBuilder()
            .setColor('#1DB954')
            .setDescription(`🔊 O volume do Bardo foi ajustado para **${vol}%**.`)
            .setImage(banners.getBanner('bardo'));

        return interaction.reply({ embeds: [embedVolume] });
    }
};