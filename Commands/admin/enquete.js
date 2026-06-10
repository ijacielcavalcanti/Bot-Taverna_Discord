const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'enquete',
    async execute(message, args, client, db, ids) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Apenas o Conselho de Líderes pode abrir votações na Taverna.');
        }

        const texto = args.join(' ');
        const partes = texto.split('|').map(p => p.trim()).filter(p => p.length > 0);

        if (partes.length < 3 || partes.length > 5) {
            return message.reply('❌ Formato incorreto. Use: `!enquete Pergunta | Opção 1 | Opção 2` (Máximo de 4 opções).');
        }

        const pergunta = partes[0];
        const opcoes = partes.slice(1, 5);

        const embedVotacao = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle(`📊 Votação: ${pergunta}`)
            .setDescription('Escolha uma das opções abaixo clicando nos botões.\n\n' + opcoes.map((op, i) => `**${i + 1}️⃣ ${op}** — 0 votos`).join('\n'))
            .setFooter({ text: 'Sistema de Votação d\'O Gume • Apenas 1 voto por membro.' });

        const botoes = opcoes.map((op, i) => {
            return new ButtonBuilder()
                .setCustomId(`enquete_${i}`)
                .setLabel(op.substring(0, 80))
                .setStyle(ButtonStyle.Primary);
        });

        botoes.push(
            new ButtonBuilder()
                .setCustomId('enquete_close')
                .setLabel('🔒 Encerrar')
                .setStyle(ButtonStyle.Danger)
        );

        const linha = new ActionRowBuilder().addComponents(botoes);

        const canalMural = client.channels.cache.get(ids.canais.mural);
        if (!canalMural) return message.reply('❌ O canal do Mural não foi encontrado!');

        await canalMural.send({ embeds: [embedVotacao], components: [linha] });
        await message.delete().catch(() => { });
    }
};