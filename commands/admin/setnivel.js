const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const banners = require('../../utils/banners.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-nivel')
        .setDescription('[Admin] Define um nível específico para o membro e ajusta o XP.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(opt => opt.setName('usuario').setDescription('O membro que terá o nível alterado').setRequired(true))
        .addIntegerOption(opt => opt.setName('nivel').setDescription('O nível desejado').setRequired(true)),

    async execute(interaction) {
        const localDb = require('../../database.js');

        const membro = interaction.options.getMember('usuario');
        const alvoLevel = interaction.options.getInteger('nivel');

        if (alvoLevel < 1) {
            return interaction.reply({ content: '❌ O nível mínimo é 1.', flags: MessageFlags.Ephemeral });
        }

        const xpCalculado = ((alvoLevel - 1) * (alvoLevel - 1)) * 100;

        let membroDb = localDb.prepare('SELECT * FROM membros WHERE id = ?').get(membro.id);
        if (!membroDb) {
            localDb.prepare('INSERT INTO membros (id, xp, level, gold, mensagens) VALUES (?, ?, ?, 0, 0)').run(membro.id, xpCalculado, alvoLevel);
        } else {
            localDb.prepare('UPDATE membros SET xp = ?, level = ? WHERE id = ?').run(xpCalculado, alvoLevel, membro.id);
        }

        const guild = interaction.guild;
        
        if (alvoLevel >= 100) await membro.roles.add(guild.roles.cache.find(r => r.name === '🪽 Celeste'));
        else if (alvoLevel >= 85) await membro.roles.add(guild.roles.cache.find(r => r.name === '🐦‍🔥 Lenda Viva'));
        else if (alvoLevel >= 70) await membro.roles.add(guild.roles.cache.find(r => r.name === '🐉 Monarca'));
        else if (alvoLevel >= 50) await membro.roles.add(guild.roles.cache.find(r => r.name === '👑 Herói da Guilda'));
        else if (alvoLevel >= 25) await membro.roles.add(guild.roles.cache.find(r => r.name === '🛡️ Veterano'));
        else if (alvoLevel >= 10) await membro.roles.add(guild.roles.cache.find(r => r.name === '🗡️ Aventureiro'));
        else await membro.roles.add(guild.roles.cache.find(r => r.name === '🎒 Viajante'));

        const imagemBanner = banners.getBanner('set_nivel_32x9');

        const embedConfirma = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('🔼 Patente Ajustada')
            .setDescription(`A intervenção divina foi concluída. <@${membro.id}> foi promovido diretamente ao **Nível ${alvoLevel}** e seu histórico foi ajustado para **${xpCalculado} XP**.`)
            .setImage(imagemBanner);

        await interaction.reply({ embeds: [embedConfirma], flags: MessageFlags.Ephemeral });
    }
};