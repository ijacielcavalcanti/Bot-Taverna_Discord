module.exports = {
    dinamicos: [
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515543555702132787/Gif_loop__A_cozy_fantasy_taver-ezgif.com-video-to-webp-converter.webp?ex=6a2f636d&is=6a2e11ed&hm=19cd1450092da90f54b364a3f1ff27586fc6bf295166a5df197be26adf33887e&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515543560743813251/Pippit_20260613_CathedralLoop-ezgif.com-video-to-webp-converter.webp?ex=6a2f636e&is=6a2e11ee&hm=24c8eaab89dd19852ec0d055298ae8b2f8491869e1626d65926200816e96092c&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515543559028215970/Pippit_20260613_Adventurer_V2-ezgif.com-video-to-webp-converter.webp?ex=6a2f636d&is=6a2e11ed&hm=b8e2cd674ad8f0d8ba2481a30b896b66e27b47ed2387a1c7cc284ea7940bfb65&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515543562417213581/Pippit_20260613_TavernCounter-ezgif.com-video-to-webp-converter.webp?ex=6a2f636e&is=6a2e11ee&hm=9c0c2ee26b73bc3e873fb1148ec283bbeed3f780fb76e185836da6fdfa2df636&",
        "https://cdn.discordapp.com/attachments/1511518891594219540/1515543561624359063/Pippit_20260613_GuildBoard-ezgif.com-video-to-webp-converter.webp?ex=6a2f636e&is=6a2e11ee&hm=c7f7a8b31eed6ba943d5f0d0743b894464077e0893e4e63248d53163bf01ac4d&"
    ],
    loja: "https://cdn.discordapp.com/attachments/1511518891594219540/1515543556822138941/gif_loop__A_mysterious_undergr-ezgif.com-video-to-webp-converter.webp?ex=6a2f636d&is=6a2e11ed&hm=297a0a442a50e00b0d683927566d8abeb4275853860db1fbe4198c93f7af0d24&",
    comprar: "https://cdn.discordapp.com/attachments/1511518891594219540/1515543557723656192/gif_loop_Close_up_of_ancient-ezgif.com-video-to-webp-converter.webp?ex=6a2f636d&is=6a2e11ed&hm=d4f397021811479d3d9b4728786546851694df5922eeb0f1b1e903fa8bb17e13&",
    bardo: "https://cdn.discordapp.com/attachments/1511518891594219540/1515532315940487168/alaude_bardo_taverna.png?ex=6a2f58f5&is=6a2e0775&hm=cfb2b3f0646478324bbdfa27f528a2a47a1a404837ec067df3f9fb5e17ea8b9c&", // <-- Nova linha adicionada aqui

    getBanner: function(tipo) {
        if (tipo === 'dinamico') {
            return this.dinamicos[Math.floor(Math.random() * this.dinamicos.length)];
        }
        return this[tipo];
    }
};