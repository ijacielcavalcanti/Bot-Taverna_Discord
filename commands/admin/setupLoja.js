const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-loja')
        .setDescription('[Admin] Cria ou atualiza os cargos do Mercado Negro.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const guild = interaction.guild;

        // Lista completa de cargos da Loja
        const cargosLoja = [
            { name: '🎨 Tintura Carmesim', colors: '#DC143C', hoist: false },
            { name: '🎨 Tintura Esmeralda', colors: '#50C878', hoist: false },
            { name: '🎨 Tintura Abissal', colors: '#2F004F', hoist: false },
            { name: '🎟️ VIP', colors: '#ff1493', hoist: true },
            { name: '👑 O Nobre', colors: '#e74c3c', hoist: true }, // Título de Honra adicionado
            { name: '🗝️ Acesso ao Porão', colors: '#000000', hoist: false }
        ];

        let criados = 0;
        let atualizados = 0;

        for (const item of cargosLoja) {
            const roleExiste = guild.roles.cache.find(r => r.name === item.name);

            if (!roleExiste) {
                await guild.roles.create({
                    name: item.name,
                    colors: item.colors,
                    hoist: item.hoist,
                    reason: 'Setup automático: Criação de itens do Mercado Negro'
                });
                criados++;
            } else {
                await roleExiste.edit({
                    colors: item.colors,
                    hoist: item.hoist,
                    reason: 'Setup automático: Atualização de itens do Mercado Negro'
                });
                atualizados++;
            }
        }

        return interaction.followUp({
            content: `🪙 **Setup da Loja Concluído!**\nCargos recém-criados: ${criados}\nCargos atualizados: ${atualizados}`,
            flags: MessageFlags.Ephemeral
        });
    },
};