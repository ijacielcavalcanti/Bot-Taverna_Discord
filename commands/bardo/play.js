const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Pede ao Bardo para tocar uma canção na sua Mesa.')
        .addStringOption(opt => opt.setName('busca').setDescription('Nome da música ou link da playlist').setRequired(true))
        .addBooleanOption(opt => opt.setName('ambientacao').setDescription('Ativar o modo de loop infinito (Ambientação)?').setRequired(false)),

    async execute(interaction) {
        const client = interaction.client;
        const canalVoz = interaction.member.voice.channel;

        if (!canalVoz) {
            return interaction.reply({ content: '❌ Você precisa estar em uma Mesa de voz para chamar o Bardo.', flags: MessageFlags.Ephemeral });
        }

        // Trava para forçar o uso no chat da sala de voz
        if (interaction.channelId !== canalVoz.id) {
            return interaction.reply({ 
                content: `🎸 O Bardo atende os pedidos diretamente no chat da sua Mesa. Clique aqui para pedir: <#${canalVoz.id}>`, 
                flags: MessageFlags.Ephemeral 
            });
        }

        await interaction.deferReply();

        const busca = interaction.options.getString('busca');
        const loopAtivado = interaction.options.getBoolean('ambientacao') || false;
        
        try {
            const isLink = busca.includes('http://') || busca.includes('https://');
            const result = await client.player.search(busca, {
                requestedBy: interaction.user,
                searchEngine: isLink ? 'auto' : 'youtubeSearch'
            });

            if (!result.hasTracks()) {
                return interaction.editReply('❌ O Bardo não encontrou essa partitura. Tente enviar o link direto!');
            }

            const { queue } = await client.player.play(canalVoz, result, {
                nodeOptions: {
                    metadata: { channel: interaction.channel },
                    leaveOnEmpty: false,
                    leaveOnEnd: false,
                    volume: 40
                }
            });

            let avisoLoop = '';
            if (loopAtivado) {
                queue.setRepeatMode(2); 
                avisoLoop = '\n🔂 *Modo de Ambientação (Loop Infinito) Ativado!*';
            }

            const track = result.tracks[0];
            const imagemBanner = banners.getBanner('bardo');

            const embedSucesso = new EmbedBuilder()
                .setColor('#1DB954')
                .setTitle('🎸 Partitura Adicionada')
                .setDescription(`**${track.title}** foi colocada na fila da Taverna!${avisoLoop}`)
                .setImage(imagemBanner);

            return interaction.editReply({ embeds: [embedSucesso] });

        } catch (error) {
            console.error('Erro de extração musical:', error);
            return interaction.editReply('❌ Ocorreu um erro crítico ao puxar essa música. Tente outro link.');
        }
    }
};