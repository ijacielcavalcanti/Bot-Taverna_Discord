module.exports = {
    name: 'comprar',
    aliases: ['buy'],
    async execute(message, args, client, db, ids) {
        if (message.channel.id !== ids.canais.porao) {
            return message.reply(`🤫 *Shhh...* Negócios envolvendo ouro e relíquias são tratados apenas no <#${ids.canais.porao}>.`);
        }

        const itemComprado = args[0]?.toLowerCase();
        if (!itemComprado) return message.reply('❌ Diga o que quer comprar! Exemplo: `!comprar vip`');

        const perfilDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(message.author.id);
        if (!perfilDb) return message.reply('❌ Você ainda não tem Ouro no banco da Taverna.');

        const catalogo = {
            'vip': { preco: 500, tipo: 'cargo', nomeCargo: '🎟️ VIP' },
            'masmorra': { preco: 3000, tipo: 'cargo', nomeCargo: '🗝️ Chave da Masmorra' },
            'nobre': { preco: 8000, tipo: 'cargo', nomeCargo: '👑 Nobre' },
            'randomkey': { preco: 25000, tipo: 'item_real', nome: 'Chave Aleatória de Jogo' },
            'moedajogo': { preco: 70000, tipo: 'item_real', nome: 'Pacote de Moedas de Jogo (RP/VP)' },
            'giftcard': { preco: 70000, tipo: 'item_real', nome: 'Gift Card R$20' },
            'nitro': { preco: 100000, tipo: 'item_real', nome: 'Discord Nitro (1 Mês)' }
        };

        const item = catalogo[itemComprado];
        if (!item) return message.reply('❌ Esse item não existe na loja. Digite `!loja` para ver o catálogo.');

        if (perfilDb.gold < item.preco) {
            return message.reply(`❌ Fundos insuficientes! Você tem **🪙 ${perfilDb.gold}**, mas precisa de **🪙 ${item.preco}**.`);
        }

        try {
            if (item.tipo === 'cargo') {
                const cargo = message.guild.roles.cache.find(r => r.name === item.nomeCargo);
                if (!cargo) return message.reply(`❌ Erro: O cargo **${item.nomeCargo}** não foi encontrado no servidor.`);
                if (message.member.roles.cache.has(cargo.id)) return message.reply('❌ Você já possui esta relíquia!');

                await message.member.roles.add(cargo);
                db.prepare('UPDATE membros SET gold = ? WHERE id = ?').run(perfilDb.gold - item.preco, message.author.id);

                const embedCompra = {
                    colors: 0xFFD700,
                    title: `🛍️ Compra Realizada!`,
                    description: `<@${message.author.id}> gastou **🪙 ${item.preco} Ouro** e adquiriu: **${item.nomeCargo}**!`,
                    thumbnail: { url: message.author.displayAvatarURL({ dynamic: true }) }
                };
                return message.reply({ embeds: [embedCompra] });
            }

            if (item.tipo === 'item_real') {
                db.prepare('UPDATE membros SET gold = ? WHERE id = ?').run(perfilDb.gold - item.preco, message.author.id);

                const embedCompraReal = {
                    colors: 0x2ECC71,
                    title: `🎁 Resgate Premium Solicitado!`,
                    description: `<@${message.author.id}> alcançou o topo e gastou **🪙 ${item.preco} Ouro** para adquirir: **${item.nome}**!\n\nUm Mestre Taverneiro verificará sua lealdade e entrará em contato na sua DM para entregar a sua recompensa.`,
                    thumbnail: { url: message.author.displayAvatarURL({ dynamic: true }) }
                };

                message.reply({ embeds: [embedCompraReal] });

                const canalAvisos = message.guild.channels.cache.get(ids.canais.avisos);
                if (canalAvisos) {
                    canalAvisos.send(`⚠️ <@${message.author.id}> acaba de comprar um **${item.nome}** no Mercado Negro! Mestre Taverneiro, prepare a recompensa.`);
                }
            }
        } catch (error) {
            console.error(error);
            message.reply('❌ Ocorreu um erro ao processar a transação.');
        }
    }
};