const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auditoria')
        .setDescription('[Admin] Gera um relatório completo da estrutura de canais do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Substituindo isto:
        // await interaction.deferReply({ ephemeral: true });

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const guild = interaction.guild;
        await guild.channels.fetch(); // Força o bot a ler os canais mais recentes

        let relatorio = `=== MAPA DO SERVIDOR: ${guild.name} ===\n\n`;

        // Filtra as categorias (tipo 4) e canais soltos
        const categorias = guild.channels.cache.filter(c => c.type === 4);
        const canaisSemCategoria = guild.channels.cache.filter(c => !c.parentId && c.type !== 4);

        // Mapeia canais que não estão dentro de nenhuma categoria
        if (canaisSemCategoria.size > 0) {
            relatorio += `[SEM CATEGORIA]\n`;
            canaisSemCategoria.forEach(c => {
                relatorio += `  -> ${c.name} (${obterTipo(c.type)})\n`;
            });
            relatorio += `\n`;
        }

        // Mapeia cada categoria e seus canais internos
        categorias.forEach(categoria => {
            relatorio += `[CATEGORIA] ${categoria.name}\n`;
            const filhos = guild.channels.cache.filter(c => c.parentId === categoria.id);

            filhos.forEach(c => {
                relatorio += `  -> ${c.name} (${obterTipo(c.type)})\n`;
            });
            relatorio += `\n`;
        });

        // Transforma o texto gerado em um arquivo físico .txt
        const buffer = Buffer.from(relatorio, 'utf-8');
        const attachment = new AttachmentBuilder(buffer, { name: 'estrutura_taverna.txt' });

        await interaction.editReply({
            content: '✅ Auditoria concluída. Faça o download do mapa do servidor abaixo:',
            files: [attachment]
        });
    },
};

// Função auxiliar para traduzir o código numérico do Discord para texto legível
function obterTipo(tipo) {
    switch (tipo) {
        case 0: return 'Texto';
        case 2: return 'Voz';
        case 4: return 'Categoria';
        case 5: return 'Anúncios';
        case 15: return 'Fórum';
        default: return `Outro (${tipo})`;
    }
}