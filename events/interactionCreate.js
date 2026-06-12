const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');

// Memória temporária para impedir votos duplos nas enquetes
const memoriaEnquetes = new Map();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        // ==========================================
        // 0. DESPACHANTE DE SLASH COMMANDS (/)
        // ==========================================
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erro ao executar o comando /${interaction.commandName}:`, error);
                const resposta = { content: '❌ Ocorreu uma falha grave na Taverna ao tentar executar isso.', ephemeral: true };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(resposta);
                } else {
                    await interaction.reply(resposta);
                }
            }
            return; // Impede que o código continue rodando e verifique botões acidentalmente
        }

        // ==========================================
        // 1. MENUS DA PORTA DA TAVERNA (Cargos Múltiplos)
        // ==========================================
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'menu_jogos' || interaction.customId === 'menu_alertas') {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const member = interaction.member;
                const guild = interaction.guild;
                const selecoes = interaction.values; // Lista com os nomes dos cargos escolhidos

                // Puxa as opções originais do menu que o membro clicou para saber o que ele NÃO escolheu
                const opcoesDoMenu = interaction.component.options.map(opt => opt.value);

                try {
                    // 1. Adiciona os cargos que o membro selecionou no menu
                    for (const nomeCargo of selecoes) {
                        const cargo = guild.roles.cache.find(r => r.name === nomeCargo);
                        if (cargo && !member.roles.cache.has(cargo.id)) {
                            await member.roles.add(cargo);
                        }
                    }

                    // 2. Remove os cargos que o membro desmarcou no menu
                    for (const nomeOpcao of opcoesDoMenu) {
                        if (!selecoes.includes(nomeOpcao)) { // Se está no menu, mas não está selecionado
                            const cargoRemover = guild.roles.cache.find(r => r.name === nomeOpcao);
                            if (cargoRemover && member.roles.cache.has(cargoRemover.id)) {
                                await member.roles.remove(cargoRemover);
                            }
                        }
                    }

                    // 3. Garante o cargo de Viajante (caso seja a primeira vez dele)
                    const cargoViajante = guild.roles.cache.find(r => r.name === '🎒 Viajante');
                    if (cargoViajante && !member.roles.cache.has(cargoViajante.id)) {
                        await member.roles.add(cargoViajante);
                    }

                    return interaction.followUp({ content: '✅ Seu perfil na Taverna foi atualizado com sucesso!' });

                } catch (error) {
                    console.error('Erro ao atualizar cargos do menu:', error);
                    return interaction.followUp({ content: '❌ Ocorreu um erro ao atualizar seus registros.' });
                }
            }
        }
        // ==========================================
        // 2. BOTÕES DA MESA TEMPORÁRIA (Salas de Voz)
        // ==========================================
        if (interaction.isButton() && interaction.customId.startsWith('mesa_')) {
            const canalVoz = interaction.member.voice.channel;

            if (!canalVoz) {
                return interaction.reply({ content: '❌ Você precisa estar na sua Mesa (canal de voz) para usar isso.', ephemeral: true });
            }

            // Verifica se quem clicou é o dono da sala
            const permissoesMembro = canalVoz.permissionsFor(interaction.member);
            if (!permissoesMembro.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply({ content: '❌ Apenas o dono desta mesa pode alterar as regras dela!', ephemeral: true });
            }

            if (interaction.customId === 'mesa_lock') {
                const cargoViajante = interaction.guild.roles.cache.find(r => r.name === '🎒 Viajante');
                await canalVoz.permissionOverwrites.edit(cargoViajante || interaction.guild.roles.everyone, { Connect: false });
                return interaction.reply({ content: '🔒 **Mesa Trancada!** Ninguém mais pode entrar.', ephemeral: true });
            }

            if (interaction.customId === 'mesa_unlock') {
                const cargoViajante = interaction.guild.roles.cache.find(r => r.name === '🎒 Viajante');
                await canalVoz.permissionOverwrites.edit(cargoViajante || interaction.guild.roles.everyone, { Connect: true });
                return interaction.reply({ content: '🔓 **Mesa Destrancada!** Qualquer forasteiro pode entrar agora.', ephemeral: true });
            }

            if (interaction.customId === 'mesa_limit') {
                await canalVoz.setUserLimit(5);
                return interaction.reply({ content: '👥 **Mesa Limitada!** Apenas 5 cadeiras disponíveis agora.', ephemeral: true });
            }

            if (interaction.customId === 'mesa_rename') {
                const modal = new ModalBuilder()
                    .setCustomId('modal_rename')
                    .setTitle('Renomear Mesa');

                const inputNome = new TextInputBuilder()
                    .setCustomId('input_novo_nome')
                    .setLabel('Qual será o novo nome da sua mesa?')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Ex: Guilda do Ciel')
                    .setRequired(true)
                    .setMaxLength(25);

                const row = new ActionRowBuilder().addComponents(inputNome);
                modal.addComponents(row);

                await interaction.showModal(modal);
            }
        }

        // ==========================================
        // 3. RECEBIMENTO DO NOME DA MESA (Modal)
        // ==========================================
        if (interaction.isModalSubmit() && interaction.customId === 'modal_rename') {
            const novoNome = interaction.fields.getTextInputValue('input_novo_nome');
            const canalVoz = interaction.member.voice.channel;

            if (canalVoz) {
                try {
                    await canalVoz.setName(`🍻 ${novoNome}`);
                    return interaction.reply({ content: `✏️ O letreiro da mesa foi alterado para **🍻 ${novoNome}**!`, ephemeral: true });
                } catch (error) {
                    return interaction.reply({ content: '❌ O Discord tem um limite de renomeações. Aguarde alguns minutos e tente de novo.', ephemeral: true });
                }
            }
        }

        // ==========================================
        // 4. BOTÕES DE MÚSICA (Bardo)
        // ==========================================
        // Verifique se os customIds abaixo (music_pause, music_skip, music_stop) 
        // são os mesmos que você definiu no seu comando de música.
        if (interaction.isButton() && interaction.customId.startsWith('music_')) {

            // Avisa ao Discord que estamos processando, evitando o erro "interação falhou"
            await interaction.deferUpdate();

            const queue = client.player.nodes.get(interaction.guildId);
            if (!queue || !queue.isPlaying()) {
                return interaction.followUp({ content: 'Não há nenhuma música tocando no momento.', ephemeral: true });
            }

            try {
                if (interaction.customId === 'music_pause') {
                    queue.node.setPaused(!queue.node.isPaused());
                    const status = queue.node.isPaused() ? 'Pausada' : 'Retomada';
                    return interaction.followUp({ content: `A música foi ${status}.`, ephemeral: true });
                }

                if (interaction.customId === 'music_skip') {
                    queue.node.skip();
                    return interaction.followUp({ content: 'Música pulada.', ephemeral: true });
                }

                if (interaction.customId === 'music_stop') {
                    queue.delete();
                    return interaction.followUp({ content: 'Música parada e fila limpa.', ephemeral: true });
                }
            } catch (error) {
                console.error('Erro na interação de música:', error);
                return interaction.followUp({ content: 'Ocorreu um erro ao executar esta ação.', ephemeral: true });
            }
        }

        // ==========================================
        // 4. AÇÕES DOS BOTÕES DE MÚSICA
        // ==========================================
        if (interaction.isButton() && interaction.customId.startsWith('btn_')) {
            await interaction.deferUpdate(); // Evita a mensagem de erro no Discord

            const queue = client.player.nodes.get(interaction.guildId);
            if (!queue || !queue.isPlaying()) {
                return interaction.followUp({ content: 'Não há nenhuma música tocando.', ephemeral: true });
            }

            try {
                if (interaction.customId === 'btn_pause') {
                    queue.node.setPaused(!queue.node.isPaused());
                    return interaction.followUp({ content: queue.node.isPaused() ? '⏸️ Pausada.' : '▶️ Retomada.', ephemeral: true });
                }
                if (interaction.customId === 'btn_skip') {
                    queue.node.skip();
                    return interaction.followUp({ content: '⏭️ Música pulada.', ephemeral: true });
                }
                if (interaction.customId === 'btn_stop') {
                    queue.delete();
                    return interaction.followUp({ content: '⏹️ Fila limpa.', ephemeral: true });
                }
                if (interaction.customId === 'btn_shuffle') {
                    queue.tracks.shuffle();
                    return interaction.followUp({ content: '🔀 Fila embaralhada.', ephemeral: true });
                }
            } catch (error) {
                console.error(error);
            }
        }


        // ==========================================
        // 5. REGISTRO E ENCERRAMENTO DAS ENQUETES
        // ==========================================
        if (interaction.isButton() && interaction.customId.startsWith('enquete_')) {
            const mensagemId = interaction.message.id;
            const usuarioId = interaction.user.id;

            // --- LÓGICA DE ENCERRAR VOTAÇÃO (Apenas Admins) ---
            if (interaction.customId === 'enquete_close') {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({ content: '❌ Apenas a Alta Cúpula pode encerrar uma votação.', ephemeral: true });
                }

                const enqueteInfo = memoriaEnquetes.get(mensagemId) || { votos: {} };
                const embedAtual = interaction.message.embeds[0];
                const botoesAntigos = interaction.message.components[0].components;

                let maxVotos = -1;
                let vencedores = [];

                // Calcula quem ganhou (ignorando o botão de encerrar)
                botoesAntigos.forEach((btn, i) => {
                    if (btn.customId === 'enquete_close') return;
                    const v = enqueteInfo.votos[i] || 0;
                    if (v > maxVotos) {
                        maxVotos = v;
                        vencedores = [btn.label];
                    } else if (v === maxVotos) {
                        vencedores.push(btn.label);
                    }
                });

                let resultadoTexto = `\n\n🔒 **VOTAÇÃO ENCERRADA!**\n`;
                if (maxVotos === 0) {
                    resultadoTexto += `*Nenhum voto foi registrado.*`;
                } else if (vencedores.length > 1) {
                    resultadoTexto += `🏆 **Empate:** ${vencedores.join(', ')} (com ${maxVotos} votos)`;
                } else {
                    resultadoTexto += `🏆 **Vencedora:** ${vencedores[0]} (com ${maxVotos} votos)`;
                }

                const { EmbedBuilder } = require('discord.js');
                const novoEmbed = EmbedBuilder.from(embedAtual)
                    .setDescription(embedAtual.description + resultadoTexto)
                    .setColor(0x95A5A6); // Deixa o cartaz cinza indicando que fechou

                // Desativa todos os botões da mensagem
                const novaLinha = new ActionRowBuilder();
                botoesAntigos.forEach(btn => {
                    const novoBotao = ButtonBuilder.from(btn).setDisabled(true);
                    novaLinha.addComponents(novoBotao);
                });

                await interaction.update({ embeds: [novoEmbed], components: [novaLinha] });
                memoriaEnquetes.delete(mensagemId); // Apaga da memória para não pesar o bot
                return;
            }

            // --- LÓGICA NORMAL DE COMPUTAR O VOTO ---
            const indexOpcao = parseInt(interaction.customId.split('_')[1]);

            if (!memoriaEnquetes.has(mensagemId)) {
                memoriaEnquetes.set(mensagemId, {
                    votaram: new Set(),
                    votos: {}
                });
            }

            const enqueteInfo = memoriaEnquetes.get(mensagemId);

            if (enqueteInfo.votaram.has(usuarioId)) {
                return interaction.reply({ content: '❌ Seu voto já foi registrado pelo Conselho!', ephemeral: true });
            }

            enqueteInfo.votaram.add(usuarioId);
            enqueteInfo.votos[indexOpcao] = (enqueteInfo.votos[indexOpcao] || 0) + 1;

            const embedAtual = interaction.message.embeds[0];
            const botoesEnquete = interaction.message.components[0].components;

            let novaDescricao = 'Escolha uma das opções abaixo clicando nos botões.\n\n';
            botoesEnquete.forEach((btn, i) => {
                if (btn.customId === 'enquete_close') return; // Pula o botão vermelho no cartaz
                const totalVotos = enqueteInfo.votos[i] || 0;
                novaDescricao += `**${i + 1}️⃣ ${btn.label}** — ${totalVotos} votos\n`;
            });

            const { EmbedBuilder } = require('discord.js');
            const novoEmbed = EmbedBuilder.from(embedAtual).setDescription(novaDescricao);

            await interaction.update({ embeds: [novoEmbed] });
        }

        // ==========================================
        // BOTÕES DO PAINEL DO BARDO (MÚSICA)
        // ==========================================
        if (interaction.isButton() && interaction.customId.startsWith('btn_')) {
            const queue = client.player.nodes.get(interaction.guildId);

            if (!queue) {
                return interaction.reply({ content: '❌ Nenhuma música tocando no momento.', ephemeral: true });
            }

            // Garante que só quem está na mesma sala de voz pode clicar
            if (interaction.member.voice.channelId !== queue.connection.joinConfig.channelId) {
                return interaction.reply({ content: '❌ Você precisa estar na Mesa com o Bardo para usar os controles.', ephemeral: true });
            }

            try {
                switch (interaction.customId) {
                    case 'btn_pause':
                        const estaPausado = queue.node.isPaused();
                        queue.node.setPaused(!estaPausado);
                        await interaction.reply({ content: estaPausado ? '▶️ Música retomada.' : '⏸️ Música pausada.', ephemeral: true });
                        break;

                    case 'btn_skip':
                        queue.node.skip();
                        await interaction.reply({ content: '⏭️ Faixa pulada! O Bardo já vai trocar.', ephemeral: true });
                        break;

                    case 'btn_stop':
                        queue.delete();
                        await interaction.reply({ content: '⏹️ O Bardo guardou o instrumento e a fila foi limpa.', ephemeral: true });
                        break;

                    case 'btn_shuffle':
                        queue.tracks.shuffle();
                        await interaction.reply({ content: '🔀 As partituras foram embaralhadas com sucesso!', ephemeral: true });
                        break;
                }
            } catch (error) {
                console.error('Erro nos controles do Bardo:', error);
                await interaction.reply({ content: '❌ Houve uma falha ao tentar controlar a música.', ephemeral: true });
            }
        }

    }

};