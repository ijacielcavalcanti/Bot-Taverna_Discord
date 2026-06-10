// Termos que resultam em advertência imediata
const palavrasProibidas = [
    'arrombado', 
    'cuzão', 
    'fdp', 
    'vtnc', 
    'vagabundo', 
    'otario', 
    'imbecil',
    'macaco', // Ofensas raciais devem estar na lista
    'viado',  // Ofensas homofóbicas
    'suicida',
    'se mata'
];

// Links explícitos (+18) ou de golpes (Phishing)
const linksProibidos = [
    'xvideos.com', 
    'pornhub.com', 
    'redtube.com', 
    'xhamster.com',
    'onlyfans.com', 
    'privacy.com.br', 
    'fatalmodel.com',
    'discord.gg/free-nitro', 
    'steamcommunity-free.com',
    'discord-nitro-free.com'
];

module.exports = {
    verificar(texto) {
        const conteudo = texto.toLowerCase();
        
        // Retorna verdadeiro se alguma palavra ou link for detectado
        const encontrouPalavra = palavrasProibidas.some(p => conteudo.includes(p));
        const encontrouLink = linksProibidos.some(l => conteudo.includes(l));
        
        return encontrouPalavra || encontrouLink;
    }
};