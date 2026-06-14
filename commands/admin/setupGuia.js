const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-guia')
        .setDescription('[Admin] Cria o painel oficial do Guia do Viajante no canal atual.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const imagemBanner = banners.getBanner('dinamico');

        const embedGuia = new EmbedBuilder()
            .setColor('#D4AF37')
            .setTitle('🗺️ O Guia do Viajante')
            .setDescription('**Bem-vindo à Taverna, Viajante! 🍻**\n\nVocê acaba de entrar em um espaço onde a sua interação real molda a sua jornada. Aqui, conversar, jogar e participar não são apenas ações, são formas de evoluir o seu perfil, ganhar riquezas e desbloquear privilégios.\n\n---\n\n⚖️ **As Leis da Casa:**\n1. O Mestre Taverneiro monitora as palavras. Insultos ou links suspeitos resultarão em isolamento na sala de Castigo.\n2. O Balcão é livre. Para achar grupos, utilize os cargos da `🚪・porta-da-taverna`.\n3. Ausência prolongada nas mesas de voz fará com que você seja movido aos aposentos de inatividade (AFK).\n\n---\n\n⚔️ **Como Evoluir (XP e Ouro)**\n💬 **No Salão (Texto):** Mensagens normais e envio de mídias geram XP e Ouro.\n🔊 **Nas Mesas (Voz):** Estar nos canais de voz rende recompensas a cada 5 minutos. Abrir a câmera ou iniciar uma Transmissão dobra seus ganhos.\n\n---\n\n📜 **Comandos do Forasteiro (Use a barra /)**\n*   `/perfil`: Consulte seu Nível, XP e Ouro.\n*   `/panorama`: Veja o Quadro de Líderes e os membros mais ricos.\n*   `/loja`: Abra o Mercado Negro para ver itens disponíveis.\n*   `/comprar`: Adquira patentes VIP, jogos e recompensas reais.\n*   `/jornada`: Veja todas as patentes e requisitos de nível.\n\n---\n\n🛠️ **Utilidades da Taverna**\n**➕ Criar Mesa:** Clique no canal "Criar Mesa". Uma sala de voz exclusiva será construída para você com um painel para trancar ou limitar vagas.\n**🎸 O Bardo:** Entre em uma mesa de voz e digite `/play` seguido da música para chamar o Bardo.')
            .setImage(imagemBanner)
            .setFooter({ text: 'A Taverna - As regras podem ser atualizadas pela Administração.' });

        await interaction.channel.send({ embeds: [embedGuia] });
        await interaction.reply({ content: '✅ Guia do Viajante atualizado e gerado com sucesso!', flags: MessageFlags.Ephemeral });
    },
};