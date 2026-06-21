const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-porta')
        .setDescription('[Admin] Cria a mensagem com os menus suspensos de cargos.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Menu 1: Gêneros de Jogos
        const menuJogos = new StringSelectMenuBuilder()
            .setCustomId('menu_jogos')
            .setPlaceholder('Escolha seus estilos de jogos favoritos')
            .setMinValues(0)
            .setMaxValues(9)
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Competitivo').setValue('🏆 Competitivo').setEmoji('🏆'),
                new StringSelectMenuOptionBuilder().setLabel('FPS').setValue('🏹 FPS').setEmoji('🏹'),
                new StringSelectMenuOptionBuilder().setLabel('MOBA').setValue('⚔️ MOBA').setEmoji('⚔️'),
                new StringSelectMenuOptionBuilder().setLabel('RPG & Aventura').setValue('🎲 RPG & Aventura').setEmoji('🎲'),
                new StringSelectMenuOptionBuilder().setLabel('Sobrevivência & Crafting').setValue('🛡️ Sobrevivência & Crafting').setEmoji('🛡️'),
                new StringSelectMenuOptionBuilder().setLabel('Casual & Party Games').setValue('🍻 Casual & Party Games').setEmoji('🍻'),
                new StringSelectMenuOptionBuilder().setLabel('Esportes & Corrida').setValue('🏎️ Esportes & Corrida').setEmoji('🏎️'),
                new StringSelectMenuOptionBuilder().setLabel('Estratégia & Cartas').setValue('🃏 Estratégia & Cartas').setEmoji('🃏'),
                new StringSelectMenuOptionBuilder().setLabel('Mobile Gaming').setValue('📱 Mobile Gaming').setEmoji('📱')
            );

        // Menu 2: Notificações
        const menuAlertas = new StringSelectMenuBuilder()
            .setCustomId('menu_alertas')
            .setPlaceholder('Quais notificações deseja receber?')
            .setMinValues(0)
            .setMaxValues(3)
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Notificar Eventos').setValue('🔔 Notificar Eventos').setEmoji('🔔'),
                new StringSelectMenuOptionBuilder().setLabel('Notificar Sorteios').setValue('🎁 Notificar Sorteios').setEmoji('🎁'),
                new StringSelectMenuOptionBuilder().setLabel('Notificar Notícias').setValue('📰 Notificar Notícias').setEmoji('📰')
            );

        const linhaJogos = new ActionRowBuilder().addComponents(menuJogos);
        const linhaAlertas = new ActionRowBuilder().addComponents(menuAlertas);

        const embed = new EmbedBuilder()
            .setColor(0xD4AF37)
            .setTitle('🚪 O Mural de Contratos')
            .setDescription('Selecione abaixo quais estilos de jogo você joga para encontrar outros viajantes com os mesmos interesses.\n\nEscolha também quais alertas você deseja receber dos Arautos da Taverna. Você pode alterar suas escolhas a qualquer momento marcando ou desmarcando as opções.')
            .setImage('https://cdn.discordapp.com/attachments/1511518891594219540/1518024518084333618/PortaBoasvindasmain.png?ex=6a386a00&is=6a371880&hm=45603c0211adbc6527129299e10d172053f61288ff40e6f941bcd0d3c6f3d2a0&.png'); // Substitua pela imagem oficial da porta

        await interaction.channel.send({ embeds: [embed], components: [linhaJogos, linhaAlertas] });

        // Confirmação invisível para você
        await interaction.reply({ content: '✅ Painel gerado com sucesso!', flags: MessageFlags.Ephemeral });
    },
};