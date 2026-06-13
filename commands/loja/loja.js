module.exports = {
    name: 'loja',
    aliases: ['shop'],
    async execute(message, args, client, db, ids) {
        if (message.channel.id !== ids.canais.porao) {
            return message.reply(`🤫 *Shhh...* Negócios envolvendo ouro e relíquias são tratados apenas no <#${ids.canais.porao}>.`);
        }

        const embedLoja = {
            colors: 0x2ECC71,
            title: '🛒 O Mercado Negro d\'O Gume',
            description: 'Use seu Ouro suado para comprar relíquias. Digite `!comprar [id]` para adquirir.\n\n⚠️ **Aviso da Coroa:** *Os prêmios em dinheiro real possuem estoque mensal limitado. Limite de 1 resgate premium por membro a cada 30 dias.*',
            fields: [
                { name: '🎟️ Passe VIP | ID: `vip`', value: 'Custa: **500 Ouro**\nCargo exclusivo, cor destacada e Emojis externos.' },
                { name: '🗝️ Chave da Masmorra | ID: `masmorra`', value: 'Custa: **3.000 Ouro**\nAcesso aos canais secretos e logs da administração.' },
                { name: '👑 Título de Nobreza | ID: `nobre`', value: 'Custa: **8.000 Ouro**\nO auge da ostentação estética na guilda.' },
                { name: '🎲 Chave Aleatória Steam | ID: `randomkey`', value: 'Custa: **25.000 Ouro**\nUma key real de um jogo surpresa.' },
                { name: '💎 Moeda de Jogo (RP/VP) | ID: `moedajogo`', value: 'Custa: **70.000 Ouro**\nPacote básico de moedas para o seu jogo favorito.' },
                { name: '💳 Gift Card (R$20) | ID: `giftcard`', value: 'Custa: **70.000 Ouro**\nUm código real para resgatar onde quiser.' },
                { name: '🚀 Discord Nitro (1 Mês) | ID: `nitro`', value: 'Custa: **100.000 Ouro**\nO prêmio máximo da Taverna!' }
            ],
            footer: { text: 'Seu Ouro atual pode ser visto com !perfil' }
        };
        
        return message.reply({ embeds: [embedLoja] });
    }
};