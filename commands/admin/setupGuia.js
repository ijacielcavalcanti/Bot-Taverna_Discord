const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setupguia',
    async execute(message, args, client, db, ids) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        const embedGuia = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🧭 O Guia do Viajante')
            .setDescription('Tudo o que você precisa saber para evoluir e aproveitar os recursos da nossa Taverna.')
            .addFields(
                { name: '💰 Economia e Evolução', value: 'Ganhe **XP e Ouro** conversando no chat. Use `!perfil` para ver seus status e `!jornada` para ver as patentes que você pode alcançar!' },
                { name: '🛒 O Mercado Negro (Porão)', value: 'Acumulou ouro? Vá até o canal do porão e digite `!loja` para ver os itens. Compre desde Cargos VIPs até Gift Cards reais usando `!comprar [id]`.' },
                { name: '🚪 Mesas Temporárias', value: 'Entre no canal de voz `➕ Criar Mesa` e o bot criará uma sala de voz exclusiva para você e seus convidados.' },
                { name: '🎸 O Bardo (Música)', value: 'No canal de comandos, digite `!play [nome ou link]` para ouvir música na sua mesa. Use `!skip`, `!stop` e `!volume` para controlar.' },
                { name: '📜 Regras da Taverna', value: 'O desrespeito ao bom convívio gera punições imediatas e a perda de todo o seu Ouro e XP.' }
            )
            .setFooter({ text: 'Sistema Exclusivo - Taverna O Gume' });

        const embedGuiaAdmin = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('👑 Comandos da Alta Cúpula (Admins)')
            .setDescription('Ferramentas exclusivas para o gerenciamento do servidor:')
            .addFields(
                { name: 'Gerenciamento Rápido', value: '`!addouro @usuario [valor]`\n`!addxp @usuario [valor]`\n`!setnivel @usuario [nível]`\n`!panorama @usuario` (Raio-X completo)' },
                { name: 'Infraestrutura', value: '`!setupcargos`, `!setupentrada`, `!setupregras`, `!setupguia`, `!enquete Pergunta | Op1 | Op2`.' }
            );

        await message.channel.send({ embeds: [embedGuia, embedGuiaAdmin] });
        await message.delete().catch(() => {});
    }
};