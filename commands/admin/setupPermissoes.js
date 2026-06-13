// Ajuste o caminho do require para o local exato do seu arquivo JSON
const ids = require('../../config/ids.json');
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-permissoes')
        .setDescription('[Admin] Configura as permissões locais das Categorias do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const guild = interaction.guild;

        const cargoViajante = guild.roles.cache.find(r => r.name === '🎒 Viajante');
        
        if (!cargoViajante) {
            return interaction.followUp({ 
                content: '❌ O cargo "🎒 Viajante" não foi encontrado. Execute o comando `/setup-niveis` primeiro.', 
                flags: MessageFlags.Ephemeral 
            });
        }

        let atualizadas = 0;

        try {
            // 1. Configurar Áreas de Leitura
            for (const id of ids.categorias.leitura) {
                const categoria = guild.channels.cache.get(id);
                if (categoria) {
                    await categoria.permissionOverwrites.edit(guild.id, {
                        ViewChannel: true,
                        SendMessages: false,
                        Connect: false
                    });
                    await categoria.permissionOverwrites.edit(cargoViajante.id, {
                        ViewChannel: true,
                        SendMessages: false,
                        AddReactions: true
                    });
                    atualizadas++;
                }
            }

            // 2. Configurar Áreas de Interação Livre
            for (const id of ids.categorias.interacao) {
                const categoria = guild.channels.cache.get(id);
                if (categoria) {
                    await categoria.permissionOverwrites.edit(guild.id, {
                        ViewChannel: false
                    });
                    await categoria.permissionOverwrites.edit(cargoViajante.id, {
                        ViewChannel: true,
                        SendMessages: true,
                        Connect: true,
                        Speak: true
                    });
                    atualizadas++;
                }
            }

            // 3. Configurar Áreas Ocultas
            for (const id of ids.categorias.ocultas) {
                const categoria = guild.channels.cache.get(id);
                if (categoria) {
                    await categoria.permissionOverwrites.edit(guild.id, {
                        ViewChannel: false
                    });
                    await categoria.permissionOverwrites.edit(cargoViajante.id, {
                        ViewChannel: false
                    });
                    atualizadas++;
                }
            }

            return interaction.followUp({ 
                content: `✅ **Setup de Permissões Concluído!**\nForam atualizadas as permissões base de ${atualizadas} categorias.`, 
                flags: MessageFlags.Ephemeral 
            });

        } catch (error) {
            console.error(error);
            return interaction.followUp({ 
                content: '❌ Ocorreu um erro ao aplicar as permissões. Verifique o console.', 
                flags: MessageFlags.Ephemeral 
            });
        }
    },
};