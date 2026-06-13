const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-cargos')
        .setDescription('[Admin] Cria os cargos de Moderação, Utilidades e Notificações.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const guild = interaction.guild;

        // Lista de cargos estruturais com suas permissões específicas
        const cargosConfig = [
            { 
                name: '🛡️ Guarda da Cidade', 
                color: '#206694', 
                hoist: true, 
                permissions: [
                    PermissionFlagsBits.ManageMessages,
                    PermissionFlagsBits.MuteMembers,
                    PermissionFlagsBits.DeafenMembers,
                    PermissionFlagsBits.MoveMembers,
                    PermissionFlagsBits.KickMembers,
                    PermissionFlagsBits.BanMembers
                ] 
            },
            { 
                name: '🎨 Artesão', 
                color: '#E91E63', 
                hoist: true, 
                permissions: [PermissionFlagsBits.ManageGuildExpressions] // Controla Emojis, Stickers e Soundboard
            },
            { 
                name: '🎸 Bardo', 
                color: '#9B59B6', 
                hoist: true, 
                permissions: [] 
            },
        
            { name: '🔔 Notificar Eventos', color: '#99AAB5', hoist: false, permissions: [] },
            { name: '🎁 Notificar Sorteios', color: '#99AAB5', hoist: false, permissions: [] },
            { name: '📰 Notificar Notícias', color: '#99AAB5', hoist: false, permissions: [] }
        ];

        let criados = 0;
        let existentes = 0;

        for (const cargo of cargosConfig) {
            const roleExiste = guild.roles.cache.find(r => r.name === cargo.name);
            
            if (!roleExiste) {
                await guild.roles.create({
                    name: cargo.name,
                    color: cargo.color,
                    hoist: cargo.hoist,
                    permissions: cargo.permissions,
                    reason: 'Setup automático de cargos utilitários da Taverna'
                });
                criados++;
            } else {
                existentes++;
            }
        }

        return interaction.followUp({ 
            content: `✅ **Setup de Cargos Concluído!**\nCargos criados: ${criados}\nCargos que já existiam: ${existentes}`, 
            flags: MessageFlags.Ephemeral 
        });
    },
};