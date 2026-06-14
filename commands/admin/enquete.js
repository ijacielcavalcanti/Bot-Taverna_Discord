const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const ids = require('../../config/ids.json');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enquete')
        .setDescription('[Admin] Cria uma votação oficial no Mural da Taverna.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(opt => opt.setName('pergunta').setDescription('A pergunta da votação').setRequired(true))
        .addStringOption(opt => opt.setName('opcao1').setDescription('Primeira opção').setRequired(true))
        .addStringOption(opt => opt.setName('opcao2').setDescription('Segunda opção').setRequired(true))
        .addStringOption(opt => opt.setName('opcao3').setDescription('Terceira opção (Opcional)').setRequired(false))
        .addStringOption(opt => opt.setName('opcao4').setDescription('Quarta opção (Opcional)').setRequired(false)),

    async execute(interaction) {
        const pergunta = interaction.options.getString('pergunta');
        const opcoes = [
            interaction.options.getString('opcao1'),
            interaction.options.getString('opcao2'),
            interaction.options.getString('opcao3'),
            interaction.options.getString('opcao4')
        ].filter(Boolean); // Remove as opções que foram deixadas em branco

        const imagemBanner = banners.getBanner('dinamico'); 

        const embedVotacao = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle(`📊 Votação: ${pergunta}`)
            .setDescription('Escolha uma das opções abaixo clicando nos botões.\n\n' + opcoes.map((op, i) => `**${i + 1}️⃣ ${op}** — 0 votos`).join('\n'))
            .setImage(imagemBanner)
            .setFooter({ text: 'Sistema de Votação d\'O Gume • Apenas 1 voto por membro.' });

        const botoes = opcoes.map((op, i) => {
            return new ButtonBuilder()
                .setCustomId(`enquete_${i}`)
                .setLabel(op.substring(0, 80))
                .setStyle(ButtonStyle.Primary);
        });

        botoes.push(
            new ButtonBuilder()
                .setCustomId('enquete_close')
                .setLabel('🔒 Encerrar')
                .setStyle(ButtonStyle.Danger)
        );

        const linha = new ActionRowBuilder().addComponents(botoes);

        const canalMural = interaction.guild.channels.cache.get(ids.canais.mural);
        if (!canalMural) {
            return interaction.reply({ content: '❌ O canal do Mural não foi encontrado!', flags: MessageFlags.Ephemeral });
        }

        await canalMural.send({ embeds: [embedVotacao], components: [linha] });
        await interaction.reply({ content: '✅ Votação enviada com sucesso para o Mural!', flags: MessageFlags.Ephemeral });
    }
};