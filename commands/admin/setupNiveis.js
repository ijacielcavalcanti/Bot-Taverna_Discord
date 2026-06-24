const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-niveis')
        .setDescription('[Admin] Cria ou atualiza todos os cargos de progressão de Nível.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const guild = interaction.guild;

        // Lista de cargos de progressão e suas cores hexadecimais
        const cargosNiveis = [
            { name: '🎒 Viajante', color: '#A0A0A0' }, // Cinza
            { name: '🗡️ Aventureiro', color: '#b0f1e4' }, // Bronze
            { name: '🛡️ Veterano', color: '#16967e' }, // Prata
            { name: '👑 Herói da Guilda', color: '#c79c00' }, // Ouro
            { name: '🐉 Monarca', color: '#8a2be2' }, // Roxo
            { name: '🐦‍🔥 Lenda Viva', color: '#ff4500' }, // Laranja Fogo
            { name: '🪽 Celeste', color: '#00ffc7' }  // Ciano Brilhante
        ];
        let criados = 0;
        let atualizados = 0;

        for (const cargo of cargosNiveis) {
            const roleExiste = guild.roles.cache.find(r => r.name === cargo.name);

            if (!roleExiste) {
                await guild.roles.create({
                    name: cargo.name,
                    color: cargo.color,
                    hoist: true,
                    reason: 'Setup automático: Criação de níveis da Taverna'
                });
                criados++;
            } else {
                await roleExiste.edit({
                    color: cargo.color,
                    hoist: true,
                    reason: 'Setup automático: Atualização de níveis da Taverna'
                });
                atualizados++;
            }
        }

        return interaction.followUp({
            content: `✅ **Setup de Níveis Concluído!**\nCargos recém-criados: ${criados}\nCargos atualizados: ${atualizados}\n\n*Dica: Vá nas configurações do Discord e garanta que o cargo do bot esteja ACIMA de todos esses na hierarquia.*`,
            flags: MessageFlags.Ephemeral
        });
    },
};