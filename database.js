const Database = require('better-sqlite3');
const path = require('path');

// Cria o arquivo do banco de dados na raiz do projeto
const dbPath = path.join(__dirname, 'taverna.sqlite');
const db = new Database(dbPath);

// Cria a tabela de usuários (caso ela ainda não exista)
db.exec(`
    CREATE TABLE IF NOT EXISTS membros (
        id TEXT PRIMARY KEY,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        gold INTEGER DEFAULT 0,
        mensagens INTEGER DEFAULT 0
    )
`);

console.log('📦 Banco de dados da Taverna carregado com sucesso.');

module.exports = db;