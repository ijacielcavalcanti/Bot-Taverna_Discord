const fs = require('fs');
const path = require('path');

// Pastas que o script vai ler. Você pode adicionar outras se precisar.
const pastasParaLer = ['./commands', './events', './utils', './config'];
const arquivoSaida = 'codigo_taverna.txt';

let conteudoTotal = '=== CONTEXTO DO PROJETO TAVERNA ===\n';

function lerPasta(diretorio) {
    if (!fs.existsSync(diretorio)) return;
    
    const arquivos = fs.readdirSync(diretorio);
    
    for (const arquivo of arquivos) {
        const caminhoCompleto = path.join(diretorio, arquivo);
        const status = fs.statSync(caminhoCompleto);
        
        if (status.isDirectory()) {
            lerPasta(caminhoCompleto);
        } else if (arquivo.endsWith('.js') || arquivo.endsWith('.json')) {
            const conteudo = fs.readFileSync(caminhoCompleto, 'utf-8');
            conteudoTotal += `\n\n// ==========================================\n`;
            conteudoTotal += `// ARQUIVO: ${caminhoCompleto}\n`;
            conteudoTotal += `// ==========================================\n\n`;
            conteudoTotal += conteudo;
        }
    }
}

// Adiciona o index.js principal separadamente
if (fs.existsSync('./index.js')) {
    conteudoTotal += `\n\n// ==========================================\n`;
    conteudoTotal += `// ARQUIVO: ./index.js\n`;
    conteudoTotal += `// ==========================================\n\n`;
    conteudoTotal += fs.readFileSync('./index.js', 'utf-8');
}

// Executa a leitura das pastas
pastasParaLer.forEach(lerPasta);

// Cria o arquivo final
fs.writeFileSync(arquivoSaida, conteudoTotal);
console.log(`✅ Arquivo ${arquivoSaida} gerado com sucesso! Você já pode enviá-lo no chat.`);