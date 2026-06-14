module.exports = {
    dinamicos: [
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515510872129274006/Pippit_20260613_Adventurer_V2.gif?ex=6a2f44fc&is=6a2df37c&hm=c6ac2c5be3359fcd059f3417d785828e0587a5ef9c3f5608b41d7daf8ce11f22&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515510875274870844/Pippit_20260613_GuildBoard.gif?ex=6a2f44fd&is=6a2df37d&hm=ece61bb4e34f8d600f0a6f9c7ca4cf305f6bb3178fefd9db9e0d23604f764eb5&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515510870812393472/gif_loop_Close_up_of_ancient.gif?ex=6a2f44fc&is=6a2df37c&hm=dfdd884a1db3487427f266a0848021ae67beddec651e71d4d873dd559c82f990&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515510869335740486/Gif_loop__A_cozy_fantasy_taver.gif?ex=6a2f44fc&is=6a2df37c&hm=4d9364fc3e81e377139f109887247b5f12eca681733ee1e94c25d856d5bdadc5&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515511988350877766/Pippit_20260613_CathedralLoop.gif?ex=6a2f4606&is=6a2df486&hm=86ab0a775f99723efdea08f8fd3860b69a89fceb458ab39a5790c263121d9019&"
    ],
    loja: "https://cdn.discordapp.com/attachments/1511518891594219540/1515510870095036548/gif_loop__A_mysterious_undergr.gif?ex=6a2f44fc&is=6a2df37c&hm=092ac7c5c3d1779b711611537af6807c5d792e2f8f33f9f83529bfb57f1298ff&",
    comprar: "https://cdn.discordapp.com/attachments/1511518891594219540/1515524408817750086/image_Pippit_202606131810.png?ex=6a2f5198&is=6a2e0018&hm=b67a0508eb08bf3895ac8df17a9334a2b077c08c498b8917d15504880b0c7328&",
    bardo: "https://cdn.discordapp.com/attachments/1511518891594219540/1515532315940487168/alaude_bardo_taverna.png?ex=6a2f58f5&is=6a2e0775&hm=cfb2b3f0646478324bbdfa27f528a2a47a1a404837ec067df3f9fb5e17ea8b9c&", // <-- Nova linha adicionada aqui

    getBanner: function(tipo) {
        if (tipo === 'dinamico') {
            return this.dinamicos[Math.floor(Math.random() * this.dinamicos.length)];
        }
        return this[tipo];
    }
};