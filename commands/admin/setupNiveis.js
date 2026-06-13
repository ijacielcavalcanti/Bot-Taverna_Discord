JavaScript
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
            { name: '🎒 Viajante', colorss: '#A0A0A0' }, // Cinza
            { name: '🗡️ Aventureiro', colorss: '#11806a' }, // Bronze
            { name: '🛡️ Veterano', colorss: '#1b214d' }, // Prata
            { name: '👑 Herói da Guilda', colorss: '#a07e04' }, // Ouro
            { name: '🐉 Monarca', colorss: '#8A2BE2' }, // Roxo
            { name: '🐦‍🔥 Lenda Viva', colorss: '#FF4500' }, // Laranja Fogo
            { name: '🪽 Celeste', colorss: '#00FFFF' }  // Ciano Brilhante
        ];
        let criados = 0;
        let atualizados = 0;

        for (const cargo of cargosNiveis) {
            const roleExiste = guild.roles.cache.find(r => r.name === cargo.name);

            if (!roleExiste) {
                await guild.roles.create({
                    name: cargo.name,
                    colors: cargo.colors,
                    hoist: true,
                    reason: 'Setup automático: Criação de níveis da Taverna'
                });
                criados++;
            } else {
                await roleExiste.edit({
                    colors: cargo.colors,
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