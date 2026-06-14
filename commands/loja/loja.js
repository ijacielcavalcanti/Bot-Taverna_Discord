const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const ids = require('../../config/ids.json');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('Abre o catálogo completo do Mercado Negro.'),

    async execute(interaction) {
        if (interaction.channelId !== ids.canais.porao) {
            return interaction.reply({ 
                content: `🤫 *Shhh...* Negócios envolvendo ouro e relíquias são tratados apenas no <#${ids.canais.porao}>.`, 
                flags: MessageFlags.Ephemeral 
            });
        }

        const imagemBanner = banners.getBanner('loja');

        const embedLoja = new EmbedBuilder()
            .setColor('#2ECC71')
            .setTitle('🛒 O Mercado Negro d\'O Gume')
            .setDescription('Use seu Ouro suado para comprar relíquias. Use `/comprar` e escolha seu item.\n\n⚠️ **Aviso da Coroa:** *Os prêmios em dinheiro real possuem estoque mensal limitado. Limite de 1 resgate premium por membro a cada 30 dias.*')
            .addFields(
                { name: '🎟️ Passe VIP', value: 'Custa: **500 Ouro**\nCargo exclusivo, cor destacada e Emojis externos.' },
                { name: '🗝️ Chave da Masmorra', value: 'Custa: **3.000 Ouro**\nAcesso aos canais secretos e logs da administração.' },
                { name: '👑 Título de Nobreza', value: 'Custa: **8.000 Ouro**\nO auge da ostentação estética na guilda.' },
                { name: '🎲 Chave Aleatória Steam', value: 'Custa: **25.000 Ouro**\nUma key real de um jogo surpresa.' },
                { name: '💎 Moeda de Jogo (RP/VP)', value: 'Custa: **70.000 Ouro**\nPacote básico de moedas para o seu jogo favorito.' },
                { name: '💳 Gift Card (R$20)', value: 'Custa: **70.000 Ouro**\nUm código real para resgatar onde quiser.' },
                { name: '🚀 Discord Nitro (1 Mês)', value: 'Custa: **100.000 Ouro**\nO prêmio máximo da Taverna!' }
            )
            .setImage(imagemBanner)
            .setFooter({ text: 'Seu Ouro atual pode ser visto com o comando /perfil' });
        
        await interaction.reply({ embeds: [embedLoja] });
    }
};