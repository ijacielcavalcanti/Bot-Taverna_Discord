const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-niveis')
        .setDescription('[Admin] Cria automaticamente todos os cargos de progressão de Nível.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const guild = interaction.guild;

        // Lista de cargos de progressão e suas cores hexadecimais (do menor pro maior)
        const cargosNiveis = [
            { name: '🎒 Viajante', colors: '#A0A0A0' }, // Cinza
            { name: '🗡️ Aventureiro', colors: '#11806a' }, // Bronze
            { name: '🛡️ Veterano', colors: '#1b214d' }, // Prata
            { name: '👑 Herói da Guilda', colors: '#a07e04' }, // Ouro
            { name: '🐉 Monarca', colors: '#8A2BE2' }, // Roxo
            { name: '🐦‍🔥 Lenda Viva', colors: '#FF4500' }, // Laranja Fogo
            { name: '🪽 Celeste', colors: '#00FFFF' }  // Ciano Brilhante
        ];

        let criados = 0;
        let existentes = 0;

        for (const cargo of cargosNiveis) {
            const roleExiste = guild.roles.cache.find(r => r.name === cargo.name);
            
            if (!roleExiste) {
                await guild.roles.create({
                    name: cargo.name,
                    colors: cargo.colors,
                    hoist: true, // Separa na lista de membros online
                    reason: 'Setup automático de níveis da Taverna'
                });
                criados++;
            } else {
                existentes++;
            }
        }

        return interaction.followUp({ 
            content: `✅ **Setup de Níveis Concluído!**\nCargos criados: ${criados}\nCargos que já existiam: ${existentes}\n\n*Dica: Vá nas configurações do Discord e garanta que o cargo do bot (Taverna Bot) esteja ACIMA de todos esses na hierarquia, senão ele não conseguirá entregá-los aos membros.*`, 
            flags: MessageFlags.Ephemeral 
        });
    },
};