const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-xp')
        .setDescription('[Admin] Injeta experiência (XP) diretamente na conta de um membro.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(opt => opt.setName('usuario').setDescription('O membro que receberá o XP').setRequired(true))
        .addIntegerOption(opt => opt.setName('quantidade').setDescription('A quantidade de pontos').setRequired(true)),

    async execute(interaction) {
        const localDb = require('../../database.js');
        const localIds = require('../../config/ids.json');

        const usuario = interaction.options.getUser('usuario');
        const quantidade = interaction.options.getInteger('quantidade');

        let membroDb = localDb.prepare('SELECT * FROM membros WHERE id = ?').get(usuario.id);
        
        if (!membroDb) {
            localDb.prepare('INSERT INTO membros (id, xp, level, gold, mensagens) VALUES (?, ?, 1, 0, 0)').run(usuario.id, quantidade);
        } else {
            localDb.prepare('UPDATE membros SET xp = xp + ? WHERE id = ?').run(quantidade, usuario.id);
        }

        const imagemBanner = banners.getBanner('dinamico');

        const embedConfirma = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('✨ Experiência Concedida')
            .setDescription(`Um conhecimento ancestral foi passado. **✨ ${quantidade} XP** concedidos a <@${usuario.id}>.\n\n*(Lembre-se: O nível não sobe automaticamente, o membro precisa interagir para o bot recalcular).*`)
            .setImage(imagemBanner);

        await interaction.reply({ embeds: [embedConfirma], flags: MessageFlags.Ephemeral });

        const canalLogs = interaction.guild.channels.cache.get(localIds.canais.logsAdmin);
        if (canalLogs) {
            canalLogs.send(`🚨 **AUDITORIA DE NÍVEL:** O administrador <@${interaction.user.id}> deu **✨ ${quantidade} XP** para <@${usuario.id}>.`);
        }
    }
};