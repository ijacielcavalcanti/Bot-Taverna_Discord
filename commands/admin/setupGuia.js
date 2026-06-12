const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-guia')
        .setDescription('[Admin] Cria o painel oficial do Guia do Viajante no canal atual.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const embedGuia = new EmbedBuilder()
            .setColor(0xD4AF37)
            .setTitle('🗺️ O Guia do Viajante')
            .setDescription('**Bem-vindo à Taverna, Viajante! 🍻**\n\nVocê acaba de entrar em um espaço onde a sua interação real molda a sua jornada. Aqui, conversar, jogar e participar não são apenas ações, são formas de evoluir o seu perfil, ganhar riquezas e desbloquear privilégios.\n\n---\n\n⚖️ **As Leis da Casa:**\n1. O Mestre Taverneiro (nosso Bot) monitora as palavras. Insultos pesados, links suspeitos ou desrespeito direto resultarão em advertências automáticas e, posteriormente, isolamento na sala de Castigo.\n2. O Balcão e a Conversa Fiada são livres. Para assuntos específicos, utilize os cargos da `🚪・porta-da-taverna` para mencionar apenas quem joga o mesmo que você.\n3. Ausência prolongada nas mesas de voz fará com que você seja movido aos aposentos de inatividade (AFK), interrompendo seus ganhos.\n\n---\n\n⚔️ **Como Evoluir: O Sistema de XP e Ouro**\nA Taverna possui uma economia própria e recompensa os membros ativos:\n\n💬 **No Salão (Texto):**\n* Mensagens normais geram XP (com intervalo para evitar excessos).\n* Enviar imagens ou vídeos no chat gera um bônus de XP e moedas de Ouro.\n\n🔊 **Nas Mesas (Voz):**\n* Estar em qualquer canal de voz rende **XP e Ouro a cada 5 minutos**.\n* **Bônus de Presença:** Abrir a câmera ou iniciar uma Transmissão ativa um ganho dobrado de XP e avisa a comunidade sobre a sua atividade.\n* *Atenção:* Membros mutados no fone de ouvido não recebem recompensas.\n\n🏅 **Os Títulos (Level Up):**\nAo acumular XP, você sobe de nível e recebe Ouro extra. Níveis altos forjam novos cargos no seu perfil, desde *🗡️ Aventureiro (Nv. 10)* até o glorioso título de *🪽 Celeste (Nv. 100)*.\n\n---\n\n🛠️ **Utilidades da Taverna**\n\n**➕ Criar Mesa (Salas Temporárias):**\nClique no canal de voz "Criar Mesa". Uma sala exclusiva será construída para você, junto com um painel de botões no chat para renomeá-la, trancá-la ou limitar o número de pessoas. Ao ficar vazia, ela é removida.\n\n**🎸 O Bardo (Música):**\nEntre em uma mesa de voz e chame o Bardo pelo chat. Ele trará um painel de controle interativo com botões para você gerenciar a fila de canções.')
            .setImage('https://cdn.discordapp.com/attachments/1511518891594219540/1511522533592272947/Saudacoes_forasteiro.png') // Você pode trocar este link pela imagem definitiva depois
            .setFooter({ text: 'A Taverna - As regras podem ser atualizadas pela Administração.' });

        // Envia o painel no canal de texto
        await interaction.channel.send({ embeds: [embedGuia] });

        // Retorna uma confirmação invisível para você
        await interaction.reply({ content: '✅ Guia do Viajante gerado com sucesso!', flags: MessageFlags.Ephemeral });
    },
};