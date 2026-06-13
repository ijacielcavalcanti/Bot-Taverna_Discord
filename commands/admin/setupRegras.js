const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setupregras',
    async execute(message, args, client, db, ids) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        const embedRegras = new EmbedBuilder()
            .setcolors(0xE74C3C)
            .setTitle('📜 As Leis da Taverna O Gume')
            .setDescription('Para manter a paz e o bom convívio, todos os forasteiros devem seguir estas regras. A quebra destas leis resultará na intervenção da Guarda da Cidade.')
            .addFields(
                { name: '1. Respeito Mútuo', value: 'Proibido qualquer tipo de ofensa, racismo, machismo, homofobia ou assédio. Trate os outros como gostaria de ser tratado.' },
                { name: '2. Proibido Flood e Spam', value: 'Não envie mensagens repetidas ou divulgações não autorizadas. Tentar fraudar o ganho de XP resultará na perda total de Ouro e Nível.' },
                { name: '3. Conteúdo Sensível (NSFW)', value: 'Proibido o envio de imagens, vídeos ou links com conteúdo adulto ou explícito. Este é um ambiente seguro.' },
                { name: '4. Bom Senso na Mesa de Voz', value: 'Não interrompa canais com ruídos propositais e respeite o espaço de quem está falando.' },
                { name: '5. Mercado Negro e Recompensas', value: 'Os itens reais são prêmios de lealdade. O uso de contas falsas para inflar valores gerará banimento imediato.' }
            )
            .setFooter({ text: 'A administração reserva-se o direito de intervir com base no bom senso.' });

        await message.channel.send({ embeds: [embedRegras] });
        await message.delete().catch(() => {});
    }
};