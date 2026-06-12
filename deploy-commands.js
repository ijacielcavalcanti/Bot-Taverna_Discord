require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const ids = require('./config/ids.json');

const commands = [];
const commandsFolders = path.join(__dirname, 'commands');
const folders = fs.readdirSync(commandsFolders);

// Varre todas as suas pastas procurando apenas por Slash Commands
for (const folder of folders) {
    const commandFiles = fs.readdirSync(path.join(commandsFolders, folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsFolders, folder, file));
        
        // Separa os /comandos novos dos !comandos antigos
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

// Prepara a conexão direta com o Discord
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`[Registro] Iniciando envio de ${commands.length} Slash Commands (/).`);
        
        // Registra os comandos diretamente no seu servidor para atualização instantânea
        const data = await rest.put(
            Routes.applicationGuildCommands(ids.clientId, ids.guilda),
            { body: commands }
        );

        console.log(`[Registro] ✅ ${data.length} comandos de barra registrados com sucesso no Discord!`);
    } catch (error) {
        console.error('[Registro] ❌ Falha catastrófica:', error);
    }
})();