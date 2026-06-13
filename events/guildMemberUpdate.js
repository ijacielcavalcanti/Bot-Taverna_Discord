module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        // ID do Quadro de Avisos ou Salão Principal
        const ID_CANAL_AVISOS = '1511186634526298143';

        // O sensor detecta se a data de Impulso (Premium) mudou de nula para existente
        if (!oldMember.premiumSince && newMember.premiumSince) {
            
            const canalAvisos = newMember.guild.channels.cache.get(ID_CANAL_AVISOS);
            if (canalAvisos) {
                const embedBoost = {
                    colors: 0xF47FFF, // Rosa do Nitro Boost
                    title: `🚀 A TAVERNA FOI IMPULSIONADA!`,
                    description: `Nobreza e honra! <@${newMember.id}> acaba de investir seus recursos para expandir nossa Guilda e tornou-se um **Mecenas**!\n\nGraças a esse impulso, as paredes d'O Gume ficam mais fortes, ganhamos mais magias de som e espaço para novas insígnias. Ergam suas canecas! 🍻`,
                    image: { url: 'https://cdn.discordapp.com/attachments/1511518891594219540/1511522534326272141/Serve_impulsionado.png?ex=6a20c28e&is=6a1f710e&hm=988c09f73110eb2dce8fd736115e31ff1c556169726a3ecdfaa33320984ce4d0&.png' }, // Gere uma arte rosa neon com o troféu/cristal!
                    thumbnail: { url: newMember.user.displayAvatarURL({ dynamic: true }) }
                };
                canalAvisos.send({ embeds: [embedBoost] });
            }
            
            // Procura o cargo VIP de Mecenas e entrega automaticamente
            const cargoMecenas = newMember.guild.roles.cache.find(r => r.name.includes('Mecenas') || r.name.includes('Monarca'));
            if (cargoMecenas) {
                await newMember.roles.add(cargoMecenas).catch(console.error);
            }
        }
    }
};