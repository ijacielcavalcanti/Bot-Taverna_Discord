module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const ID_CANAL_BOAS_VINDAS = '1510124350722805994'; 
        
        const canal = member.guild.channels.cache.get(ID_CANAL_BOAS_VINDAS);
        if (!canal) return;

        try {
            // Força o bot a baixar os dados completos do perfil do membro para achar o banner
            await member.user.fetch();

            // Pega o banner do membro. Se ele não tiver, usa a imagem padrão da Taverna
            const urlBanner = member.user.bannerURL({ dynamic: true, size: 1024 }) || 'https://cdn.discordapp.com/attachments/1511518891594219540/1511522533592272947/Saudacoes_forasteiro.png?ex=6a20c28e&is=6a1f710e&hm=4897a134620638e1ac7ce3b711b925d1fea8f7a0352002b3f3c1cdcf0e075f2d&.png'; 

            const embedWelcome = {
                color: 0xD4AF37,
                title: `🚪 As portas se abrem!`,
                description: `Saudações, <@${member.id}>! Eu sou o Mestre taverneiro, e é uma honra recebê-lo(a) em **O Gume**.\n\n🗡️ **Seu primeiro passo:** Dirija-se ao canal **Porta da Taverna** para escolher sua classe e liberar seu acesso ao salão.\n\n📜 **Dica:** Leia o **Guia do Viajante** para entender como ganhar Ouro e XP em nosso servidor. Puxe uma cadeira e aproveite a estadia!`,
                image: { url: urlBanner }, // Agora usa o banner pessoal do membro!
                thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 512 }) },
                footer: { text: `Agora somos ${member.guild.memberCount} membros na Taverna!` }
            };

            await canal.send({ embeds: [embedWelcome] });
        } catch (error) {
            console.error('Erro ao enviar boas-vindas:', error);
        }
    }
};