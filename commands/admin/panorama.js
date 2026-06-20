const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const db = require('../../database.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panorama')
        .setDescription('[Admin] Visão do Olho de Sauron: Exibe o panorama completo de um forasteiro.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(opt => 
            opt.setName('alvo')
               .setDescription('O membro que será investigado')
               .setRequired(true)),

    async execute(interaction) {
        const alvo = interaction.options.getMember('alvo');

        if (!alvo) {
            return interaction.reply({ content: '❌ Membro não encontrado no servidor.', flags: MessageFlags.Ephemeral });
        }

        const stats = db.prepare('SELECT * FROM membros WHERE id = ?').get(alvo.id) || { level: 1, xp: 0, gold: 0, mensagens: 0 };
        const xpProximo = (stats.level * stats.level) * 100;

        const dataEntrada = alvo.joinedAt.toLocaleDateString('pt-BR');
        const contaCriada = alvo.user.createdAt.toLocaleDateString('pt-BR');
        const cargosLista = alvo.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.name).join(' • ') || 'Nenhum cargo';

        const imagemBanner = banners.getBanner('panorama_32x9');

        const embedPanorama = new EmbedBuilder()
            .setColor('#8E44AD')
            .setTitle(`👁️ O Olho de Sauron: Panorama de ${alvo.user.username}`)
            .setThumbnail(alvo.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setImage(imagemBanner)
            .addFields(
                { name: '👤 Identidade e Registro', value: `**ID:** \`${alvo.id}\`\n**Conta Criada:** ${contaCriada}\n**Chegou na Taverna:** ${dataEntrada}`, inline: false },
                { name: '📊 Status RPG', value: `**Nível:** ${stats.level}\n**XP:** ${stats.xp} / ${xpProximo}\n**Ouro:** 🪙 ${stats.gold}\n**Mensagens Enviadas:** 💬 ${stats.mensagens}`, inline: false },
                { name: '🏷️ Cargos na Guilda', value: `\`${cargosLista}\``, inline: false }
            )
            .setFooter({ text: 'Arquivos Confidenciais d\'O Gume' })
            .setTimestamp();

        return interaction.reply({ embeds: [embedPanorama] });
    }
};