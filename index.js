require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Inicialização de Instâncias e Memória
client.player = new Player(client);
client.tempMesas = new Set();
client.xpCooldowns = new Map();
client.warns = new Map(); // Memória temporária de infrações
client.voiceJoinTimes = new Map();
client.commands = new Collection();

// -----------------------------------------------------
// 1. CARREGAMENTO MODULAR DE COMANDOS
// -----------------------------------------------------
const commandsFolders = path.join(__dirname, 'commands');
if (fs.existsSync(commandsFolders)) {
    const folders = fs.readdirSync(commandsFolders);
    for (const folder of folders) {
        const commandFiles = fs.readdirSync(path.join(commandsFolders, folder)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(path.join(commandsFolders, folder, file));
            
            // O bot agora aceita tanto comandos clássicos (!) quanto comandos de barra (/)
            const nomeDoComando = command.name || (command.data && command.data.name);
            
            if (nomeDoComando) {
                client.commands.set(nomeDoComando, command);
            }
        }
    }
}
// -----------------------------------------------------
// 2. CARREGAMENTO MODULAR DE EVENTOS
// -----------------------------------------------------
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// -----------------------------------------------------
// 3. PAINEL DO BARDO (MÚSICA)
// -----------------------------------------------------
let painelAtual = null;

// 2. O evento automático de quando uma música começa
client.player.events.on('playerStart', async (queue, track) => {
    // Se já existir um painel no chat, o bot apaga para não poluir
    if (painelAtual) {
        try { await painelAtual.delete(); } catch (error) { }
    }

    // Puxa a arte sutil do Bardo
    const imagemBanner = require('./utils/banners.js').getBanner('bardo');

    const embedBardo = new EmbedBuilder()
        .setColor('#1DB954') 
        .setTitle('🎸 O Bardo está tocando')
        .setDescription(`**${track.title}**\n👤 Autor: ${track.author}`)
        .setThumbnail(track.thumbnail || null)
        .setImage(imagemBanner) // <-- O Banner foi adicionado aqui!
        .setFooter({ text: `Adicionada por ${track.requestedBy.username}` });

    // Mantém os botões originais
    const botoes = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('btn_pause').setLabel('Pausar / Voltar').setStyle(ButtonStyle.Primary).setEmoji('⏯️'),
        new ButtonBuilder().setCustomId('btn_skip').setLabel('Pular').setStyle(ButtonStyle.Secondary).setEmoji('⏭️'),
        new ButtonBuilder().setCustomId('btn_stop').setLabel('Parar').setStyle(ButtonStyle.Danger).setEmoji('⏹️'),
        new ButtonBuilder().setCustomId('btn_shuffle').setLabel('Embaralhar').setStyle(ButtonStyle.Success).setEmoji('🔀')
    );

    const canalTexto = queue.metadata.channel || queue.metadata;

    if (canalTexto) {
        painelAtual = await canalTexto.send({ embeds: [embedBardo], components: [botoes] });
    }
});

client.login(process.env.DISCORD_TOKEN);