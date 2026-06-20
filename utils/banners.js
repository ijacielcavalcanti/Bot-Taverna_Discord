module.exports = {
    banners: {
        // ==========================================
        // 1. ÁREA DO FORASTEIRO (Público)
        // ==========================================
        perfil_dinamico: [
            'https://cdn.discordapp.com/attachments/1511518891594219540/1518000487566278727/Perfil3.png?ex=6a38539f&is=6a37021f&hm=fcf3e2b6d524171121b012271223d7305c93ac556648f9c651d192a22cb60748&.png',
            'https://cdn.discordapp.com/attachments/1511518891594219540/1518000487151177768/Perfil4.png?ex=6a38539f&is=6a37021f&hm=3f684fdb9b91a4660de8151aff5b58430174802cba113f2c3cb76ce00685c900&.png',
            'https://cdn.discordapp.com/attachments/1511518891594219540/1518000486719029401/Perfil1.png?ex=6a38539f&is=6a37021f&hm=c24724e3191c9ec2e408512d9c5b0252887eaeb827891fe9c75ed2fb40bb7371&.png'
        ],
        jornada_21x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000485116805130/Jornada.png?ex=6a38539e&is=6a37021e&hm=2c5d77b205993dd15852adc781e2ec674ce0fc6fefb6010a4acb900d73cd2f45&.png',
        loja_dinamico: [
            'https://cdn.discordapp.com/attachments/1511518891594219540/1518000484483600454/Mercadornegro.png?ex=6a38539e&is=6a37021e&hm=22f03566a8ca0517b87c4e334ae0cbcdd29e99783d8177dce4ceb8f58461e142&.png',
            'https://cdn.discordapp.com/attachments/1511518891594219540/1518000385997013052/Mercadornegro1.png?ex=6a385387&is=6a370207&hm=0a228e8704c4dc1503c1e527c301e0322c87f19fa8a592029e5123b3ef5e7e52&.png'
        ],
        comprar_32x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000383048290384/Compra.png?ex=6a385386&is=6a370206&hm=6c7f1ac09a1afb699880c6959b5300003c5b2dcaae70c9fed407b4edd68140c5&.png',

        // ==========================================
        // 2. O BARDO (Música)
        // ==========================================
        bardo_32x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000384570822757/BArdo2.png?ex=6a385386&is=6a370206&hm=2a9741e9edaf4e2f6ae39b2b96bd863d99263228f852c277d6ab2b30e0532f82&.png',

        // ==========================================
        // 3. AÇÕES DA COROA (Administrativo)
        // ==========================================
        panorama_32x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000314219893057/panorama.png?ex=6a385375&is=6a3701f5&hm=324e6479bce5230423a891a810741d933ea83fae34f76772fe2557b0d421e062&.png',
        add_ouro_32x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518021158409207818/Addouro2.png?ex=6a3866df&is=6a37155f&hm=89bfc618302ed4d2e0ad497e028731e38fd910cc30157dfd128c2d184e480915&.png',
        add_xp_32x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518016694742810674/Gemini_Generated_Image_xg9zexxg9zexxg9z.png?ex=6a3862b7&is=6a371137&hm=aba70d53d0061edf531ac7997ba6b56850d1470c7ed1c01f01f0bd9cdd8c32c4&.png',
        set_nivel_32x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000312949014638/levelup1.png?ex=6a385375&is=6a3701f5&hm=7c3627387c5a489b0f94c3b8f666f3f4e53fbdae55cd74fa13537f47b0be3db5&.png',

        // ==========================================
        // 4. SISTEMAS FIXOS (Setup)
        // ==========================================
        setup_guia_21x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000311904505967/setupguia1.png?ex=6a385375&is=6a3701f5&hm=32c3a9555dfecaffd1c6ee8e51b22f826ff1d8aa34fd5d37455585f8c6b53d94&.png',
        setup_enquete_21x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000309916532756/setup-enquete2.png?ex=6a385374&is=6a3701f4&hm=ec5d6de5282dcec2338e025ff621c0bf2afdc6b526d9e83c4f829a10e15f39cf&.png',
        porta_taverna_21x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000309186859330/PortaTaverna01.png?ex=6a385374&is=6a3701f4&hm=5f5b8633f94865ee0dae79b3f43165630248b2f3353e88d0063dc0498e3a6bbf&.png',
        regras_21x9: 'https://cdn.discordapp.com/attachments/1511518891594219540/1518000311464100021/setupguia.png?ex=6a385375&is=6a3701f5&hm=78f95219f9339ee851498aa7f6cb562393dfcaf607f6fb32f93ce3dbf33c554d&.png'
    },

    getBanner(tipo) {
        const banner = this.banners[tipo];
        
        // Se a chave não existir, não quebra o bot, apenas retorna null
        if (!banner) return null;

        // Se for um array (como o perfil e a loja), sorteia um aleatório
        if (Array.isArray(banner)) {
            const indexAleatorio = Math.floor(Math.random() * banner.length);
            return banner[indexAleatorio];
        }
        
        // Se for string fixa, retorna ela mesma
        return banner;
    }
};