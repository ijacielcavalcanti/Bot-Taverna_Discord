const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const db = require('../../database.js');
const ids = require('../../config/ids.json');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comprar')
        .setDescription('Adquire um item ou relíquia do Mercado Negro.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Selecione o item que deseja comprar')
                .setRequired(true)
                .addChoices(
                    { name: '🎟️ Passe VIP (500 Ouro)', value: 'vip' },
                    { name: '🗝️ Chave da Masmorra (3.000 Ouro)', value: 'masmorra' },
                    { name: '👑 Título de Nobreza (8.000 Ouro)', value: 'nobre' },
                    { name: '🎲 Chave Aleatória Steam (25.000 Ouro)', value: 'randomkey' },
                    { name: '💎 Moeda de Jogo - RP/VP (70.000 Ouro)', value: 'moedajogo' },
                    { name: '💳 Gift Card R$20 (70.000 Ouro)', value: 'giftcard' },
                    { name: '🚀 Discord Nitro - 1 Mês (100.000 Ouro)', value: 'nitro' }
                )),

    async execute(interaction) {
        if (interaction.channelId !== ids.canais.porao) {
            return interaction.reply({ 
                content: `🤫 *Shhh...* Negócios envolvendo ouro e relíquias são tratados apenas no <#${ids.canais.porao}>.`, 
                flags: MessageFlags.Ephemeral 
            });
        }

        const idItem = interaction.options.getString('item');
        const perfilDb = db.prepare('SELECT * FROM membros WHERE id = ?').get(interaction.user.id);
        
        if (!perfilDb) {
            return interaction.reply({ content: '❌ Você ainda não tem Ouro no banco da Taverna.', flags: MessageFlags.Ephemeral });
        }

        // Tabela atualizada de valores e tipos baseada no seu código original
        const catalogo = {
            'vip': { preco: 500, tipo: 'cargo', nomeCargo: '🎟️ VIP' },
            'masmorra': { preco: 3000, tipo: 'cargo', nomeCargo: '🗝️ Acesso ao Porão' }, // Atualizado com o nome do cargo criado no setupLoja
            'nobre': { preco: 8000, tipo: 'cargo', nomeCargo: '👑 O Nobre' }, // Atualizado com o nome do cargo criado no setupLoja
            'randomkey': { preco: 25000, tipo: 'item_real', nome: 'Chave Aleatória de Jogo' },
            'moedajogo': { preco: 70000, tipo: 'item_real', nome: 'Pacote de Moedas de Jogo (RP/VP)' },
            'giftcard': { preco: 70000, tipo: 'item_real', nome: 'Gift Card R$20' },
            'nitro': { preco: 100000, tipo: 'item_real', nome: 'Discord Nitro (1 Mês)' }
        };

        const item = catalogo[idItem];

        if (perfilDb.gold < item.preco) {
            return interaction.reply({ 
                content: `❌ Fundos insuficientes! Você tem **🪙 ${perfilDb.gold}**, mas precisa de **🪙 ${item.preco}** para o item selecionado.`, 
                flags: MessageFlags.Ephemeral 
            });
        }

        const imagemBanner = banners.getBanner('comprar');

        try {
            // Processamento para compra de Cargos Virtuais
            if (item.tipo === 'cargo') {
                const cargo = interaction.guild.roles.cache.find(r => r.name === item.nomeCargo);
                if (!cargo) return interaction.reply({ content: `❌ Erro do Sistema: O cargo **${item.nomeCargo}** não foi encontrado no servidor.`, flags: MessageFlags.Ephemeral });
                if (interaction.member.roles.cache.has(cargo.id)) return interaction.reply({ content: '❌ Você já possui esta relíquia!', flags: MessageFlags.Ephemeral });

                await interaction.member.roles.add(cargo);
                db.prepare('UPDATE membros SET gold = ? WHERE id = ?').run(perfilDb.gold - item.preco, interaction.user.id);

                const embedCompra = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setTitle('🛍️ Compra Realizada!')
                    .setDescription(`<@${interaction.user.id}> gastou **🪙 ${item.preco} Ouro** e adquiriu a patente: **${item.nomeCargo}**!`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setImage(imagemBanner);
                    
                return interaction.reply({ embeds: [embedCompra] });
            }

            // Processamento para compra de Prêmios Reais
            if (item.tipo === 'item_real') {
                db.prepare('UPDATE membros SET gold = ? WHERE id = ?').run(perfilDb.gold - item.preco, interaction.user.id);

                const embedCompraReal = new EmbedBuilder()
                    .setColor('#2ECC71')
                    .setTitle('🎁 Resgate Premium Solicitado!')
                    .setDescription(`<@${interaction.user.id}> alcançou o topo e gastou **🪙 ${item.preco} Ouro** para adquirir: **${item.nome}**!\n\nUm Mestre Taverneiro verificará sua lealdade e entrará em contato na sua DM para entregar a sua recompensa.`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setImage(imagemBanner);

                await interaction.reply({ embeds: [embedCompraReal] });

                const canalAvisos = interaction.guild.channels.cache.get(ids.canais.avisos);
                if (canalAvisos) {
                    canalAvisos.send(`⚠️ <@${interaction.user.id}> acaba de comprar um **${item.nome}** no Mercado Negro! Mestre Taverneiro, prepare a recompensa.`);
                }
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ Ocorreu um erro ao processar a transação. O Ouro não foi descontado.', flags: MessageFlags.Ephemeral });
        }
    }
};