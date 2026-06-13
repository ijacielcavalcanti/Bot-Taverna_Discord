const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-loja')
        .setDescription('[Admin] Cria automaticamente os cargos do Mercado Negro.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const guild = interaction.guild;

        // Lista de cargos da Loja
        const cargosLoja = [
            { name: '🎨 Tintura Carmesim', color: '#DC143C', hoist: false },
            { name: '🎨 Tintura Esmeralda', color: '#50C878', hoist: false },
            { name: '🎨 Tintura Abissal', color: '#2F004F', hoist: false },
            { name: '💎 Passaporte VIP', color: '#FFD700', hoist: true },
            { name: '👑 O Nobre', color: '#FF8C00', hoist: true }, // Título de Honra adicionado
            { name: '🗝️ Acesso ao Porão', color: '#000000', hoist: false }
        ];

        let criados = 0;

        for (const item of cargosLoja) {
            const roleExiste = guild.roles.cache.find(r => r.name === item.name);

            if (!roleExiste) {
                await guild.roles.create({
                    name: item.name,
                    color: item.color,
                    hoist: item.hoist, // VIP fica separado na lista, tinturas não.
                    reason: 'Setup automático do Mercado Negro'
                });
                criados++;
            }
        }

        return interaction.followUp({
            content: `🪙 **Setup da Loja Concluído!**\n${criados} cargos comerciais foram forjados no servidor.`,
            flags: MessageFlags.Ephemeral
        });
    },
};