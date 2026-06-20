const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-ouro')
        .setDescription('[Admin] Injeta ouro diretamente na conta de um membro.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(opt => opt.setName('usuario').setDescription('O membro que receberá o ouro').setRequired(true))
        .addIntegerOption(opt => opt.setName('quantidade').setDescription('A quantidade de moedas').setRequired(true)),

    async execute(interaction) {
        const localDb = require('../../database.js');
        const localIds = require('../../config/ids.json');

        const usuario = interaction.options.getUser('usuario');
        const quantidade = interaction.options.getInteger('quantidade');

        let membroDb = localDb.prepare('SELECT * FROM membros WHERE id = ?').get(usuario.id);
        
        if (!membroDb) {
            localDb.prepare('INSERT INTO membros (id, xp, level, gold, mensagens) VALUES (?, 0, 1, ?, 0)').run(usuario.id, quantidade);
        } else {
            localDb.prepare('UPDATE membros SET gold = gold + ? WHERE id = ?').run(quantidade, usuario.id);
        }

        const imagemBanner = banners.getBanner('add_ouro_32x9');

        const embedConfirma = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🪙 Tesouro da Guilda Injetado')
            .setDescription(`A coroa liberou fundos. **🪙 ${quantidade} Ouro** entregue diretamente para <@${usuario.id}>.`)
            .setImage(imagemBanner);

        await interaction.reply({ embeds: [embedConfirma], flags: MessageFlags.Ephemeral });

        const canalLogs = interaction.guild.channels.cache.get(localIds.canais.logsAdmin);
        if (canalLogs) {
            canalLogs.send(`🚨 **AUDITORIA DE TESOURO:** O administrador <@${interaction.user.id}> injetou **🪙 ${quantidade} Ouro** na conta de <@${usuario.id}>.`);
        }
    }
};