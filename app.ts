class personagem {
    private _classe: string;
    private _atributos = [];
    private _nome: string;
    private _nex: number;
    private _protecao = 0;
    private _inventario = [];
    private _capacidadeInventario;
    private _habilidades: any = {};
    private _hpAtual = 0;
    private _sanidadeAtual = 0;
    private _peAtual = 0;

    constructor(nome: string, classe: string, forca: number, agilidade: number, vigor: number,
        intelecto: number, presenca: number, nex: number) {
        this._classe = classe.toUpperCase();
        this._atributos.push(forca, agilidade, vigor, intelecto, presenca);
        this._nome = nome;
        this._nex = nex / 5;
        this._capacidadeInventario = 5 * forca;
        this._hpAtual = this.hp;
        this._sanidadeAtual = this.sanidade;
        this._peAtual = this.pe;
    }

    // Método para criar habilidades
    criarHabilidade(slot: number, atributo: string, dados: number, tipo: number, bonusAcerto: number, bonusDano: number) {
        slot --;
        atributo = atributo.toUpperCase();
        // Limite de slots
        if (slot < 0 || slot > 4) {
            throw new Error("Slot inválido (1 a 5)");
        }

        // Regra das classes
        if (this._classe == "OCULTISTA") {
            // slots 0-2 = rituais | 3-4 = ataques
            if (slot <= 2 && atributo != "INTELECTO") {
                throw new Error("Slots 0-2 são apenas rituais");
            }
            if (slot >= 3 && atributo == "INTELECTO") {
                throw new Error("Slots 3-4 são apenas ataques físicos");
            }
        } else {
            // Combatentes/Especialistas não podem rituais
            if (atributo == "INTELECTO") {
                throw new Error("Apenas ocultistas podem criar rituais");
            }
        }

        this._habilidades[slot] = { atributo, dados, tipo, bonusAcerto, bonusDano };
    }

    // Método pra pegar os atributos para usar nos calculos do método "atacar"
    private getAtributoValor(nome: string) {
        switch (nome) {
            case "FORCA": return this._atributos[0];
            case "AGILIDADE": return this._atributos[1];
            case "VIGOR": return this._atributos[2];
            case "INTELECTO": return this._atributos[3];
            case "PRESENCA": return this._atributos[4];
        }
        return 0;
    }

    // Método para rolar os d20 (acerto)
    private rolarD20(qtd: number) {
        let maior = 0;
        for (let i = 0; i < qtd; i++) {
            const roll = Math.floor(Math.random() * 20) + 1;
            if (roll > maior) maior = roll;
        }
        return maior;
    }

    // Método pra rolar o dano
    private rolarDano(dados: number, tipo: number, bonus: number) {
        let total = 0;
        for (let i = 0; i < dados; i++) {
            total += Math.floor(Math.random() * tipo) + bonus;
        }
        return total;
    }

    // Método pra atacar

    atacar(alvo: personagem, indiceHab: number) {
        const hab = this._habilidades[indiceHab];

        if (!hab) {
            console.log("Habilidade inválida");
            return 0;
        }

        let atributoValor = this.getAtributoValor(hab.atributo);
        let custoPE = 0;

        if (!atributoValor) {
            console.log("Atributo inválido");
            return 0;
        }

        if (!hab.dados || !hab.tipo) {
            console.log("Dados inválidos");
            return 0;
        }

        const ehRitual = hab.atributo == "INTELECTO";

        if (ehRitual) {
            custoPE = 3;

            if (this._peAtual < custoPE) {
                console.log("PE insuficiente");
                return 0;
            }
        }

        const ataque = this.rolarD20(atributoValor) + hab.bonusAcerto;

        if (ataque >= alvo.defesa) {
            const dano = this.rolarDano(hab.dados, hab.tipo, 0) + hab.bonusDano;

            if (ehRitual) {
                this.gastarPE(custoPE);
                alvo.receberDanoSanidade(dano); // dano em SANIDADE
            } else {
                alvo.receberDanoHP(dano); // Dano normal em HP
            }

            return dano;
        }

        return 0;
    }

    // Combate
    static combate(p1: personagem, p2: personagem) {
        let turno = 0;

        while (
            p1._hpAtual > 0 && p2._hpAtual > 0 &&
            p1._sanidadeAtual > 0 && p2._sanidadeAtual > 0
        ) {

            const atacante = turno % 2 == 0 ? p1 : p2;
            const defensor = turno % 2 == 0 ? p2 : p1;

            let opcoes: number[] = [];
            let texto = atacante._nome + ", escolha: \n";

            for (let i = 0; i < 5; i++) {
                if (atacante._habilidades[i]) {
                    opcoes.push(i);

                    let tipo = atacante._habilidades[i].atributo == "INTELECTO" ? "Ritual" : "Ataque";
                    texto += i + " = " + tipo + "\n";
                }
            }

            if (opcoes.length == 0) {
                console.log("Sem habilidades");
                return;
            }

            const escolha = Number(prompt(texto));

            if (!opcoes.includes(escolha)) {
                console.log("Escolha inválida");
                continue;
            }

            const hab = atacante._habilidades[escolha];
            const dano = atacante.atacar(defensor, escolha);
            // Dano causado e tipo
            if (hab.atributo == "INTELECTO") {
                console.log(atacante._nome + " causou " + dano + " de dano de Sanidade ao " + defensor._nome);
            } else {
                console.log(atacante._nome + " causou " + dano + " de dano ao " + defensor._nome);
            }

            turno++;
        }
        // Vitória
        let vencedor;

        if (p1._hpAtual <= 0 || p1._sanidadeAtual <= 0) vencedor = p2._nome;
        else vencedor = p1._nome;

        console.log("Vencedor:", vencedor);
    }

    // Getters pro nome e Classe
    get nome() {
        const nome = this._nome.charAt(0).toUpperCase() + this._nome.slice(1).toLowerCase();
        return nome;
    }
    get classe() {
        const classe = this._classe.charAt(0).toUpperCase() + this._classe.slice(1).toLowerCase();
        return classe;
    }

    // Metodo pro inventário
    adicionarItem(item: string) {
        item = item.toUpperCase();
        this._inventario.push(item);
        if (item == "PROTEÇÃO LEVE") {
            this._protecao = (this._protecao > 5) ? 10 : 5;
        }
        if (item == "PROTEÇÃO PESADA") {
            this._protecao = 10;
        }
        if (item == 'ESCUDO') {
            this._protecao += 2;
        }
        switch (item) {
            case "FACA": case 'MARTELO': case 'PUNHAL': case 'BASTÃO': case 'MACHETE':
            case 'LANÇA': case 'PISTOLA': case 'REVÓLVER': case 'MACHADINHA': case 'NUNCHAKO': case 'CORRENTE': case 'ESPADA':
            case 'FLORETE': case 'MACHADO': case 'MAÇA': case 'SUBMETRALHADORA': case 'BALAAS CURTAS': case 'BALAS LONGAS':
            case 'CARTUCHOS': case 'COMBUSTÍVEL': case 'FLECHAS': case 'FOGUETE': case 'KIT DE PERÍCIA': case 'UTENSÍLIO':
            case 'VESTIMENTA': case 'GRANADA DE ATORDOAMENTO': case 'GRANADA DE FRAGMENTAÇÃO': case 'GRANADA DE FUMAÇA':
            case 'GRANADA INCENDIÁRIA': case 'MINA ANTIPESSOAL': case 'ALGEMAS': case 'ARPÉU': case 'BANDOLEIRA':
            case 'BINÓCULOS': case 'BLOQUEADOR DE SINAL': case 'CICATRIZANTE': case 'CORDA': case 'LANTERNA TÁTICA':
            case 'MÁSCARA DE GÁS': case 'ÓCULOS DE VISÃO TÉRMICA': case 'PÉ DE CABRA': case 'PISTOLA DE DARDOS':
            case 'PISTOLA SINALIZADORA': case 'SOQUEIRA': case 'SPRAY DE PIMENTA': case 'TASER':
                this._capacidadeInventario--;
                break;
            case 'CAJADO': case 'ARCO': case 'BESTA': case 'FUZIL DE CAÇA': case 'ACHA': case 'GADANHO': case 'KATANA': case 'MARRETA':
            case 'MONTANTE': case 'MOTOSSERRA': case 'ARCO COMPOSTO': case 'BALESTRA': case 'ESPINGARDA':
            case 'FUZIL DE ASSALTO': case 'FUZIL DE PRECISÃO': case 'BAZUCA': case 'LANÇA-CHAMAS': case 'METRALHADORA':
            case 'EQUIPAMENTO DE SOBREVIVÊNCIA': case 'TRAJE HAZMAT': case 'PROTEÇÃO LEVE': case 'ESCUDO':
                this._capacidadeInventario -= 2;
                break;
            case 'PROTEÇÃO PESADA':
                this._capacidadeInventario -= 5;
                break;
            case 'MOCHILA MILITAR':
                this._capacidadeInventario += 2;
                break;
            default:
                throw new Error('O item digitado não existe ou está digitado errado');
        }
    }

    // Getters pros 5 atributos
    get forca() {
        return this._atributos[0];
    }
    get agilidade() {
        return this._atributos[1];
    }
    get vigor() {
        return this._atributos[2];
    }
    get intelecto() {
        return this._atributos[3];
    }
    get presenca() {
        return this._atributos[4];
    }

    // Getters pro limite de PE e defesa
    get limite_PE() {
        return this._nex;
    }

    get defesa() {
        return 10 + this._atributos[1] + this._protecao;
    }

    // Getters pro HP, Sanidade e PE
    get hp() {
        let hp_inicial: number, hp_nex;
        switch (this._classe) {
            case "COMBATENTE":
                hp_inicial = 20 + this._atributos[2];
                hp_nex = (4 + this._atributos[2]) * (this._nex - 1);
                break;
            case "ESPECIALISTA":
                hp_inicial = 16 + this._atributos[2];
                hp_nex = (3 + this._atributos[2]) * (this._nex - 1);
                break;
            case "OCULTISTA":
                hp_inicial = 12 + this._atributos[2];
                hp_nex = (2 + this._atributos[2]) * (this._nex - 1);
                break;
        }
        return (this._nex > 1) ? hp_inicial + hp_nex : hp_inicial;
    }

    get sanidade() {
        let base: number, mult: number;
        switch (this._classe) {
            case "COMBATENTE": base = 12; mult = 3; break;
            case "ESPECIALISTA": base = 16; mult = 4; break;
            case "OCULTISTA": base = 20; mult = 5; break;
        }
        return (this._nex > 1) ? base + mult * (this._nex - 1) : base;
    }

    get pe() {
        let base: number, mult: number;
        switch (this._classe) {
            case "COMBATENTE": base = 2 + this._atributos[4]; mult = 2 + this._atributos[4]; break;
            case "ESPECIALISTA": base = 3 + this._atributos[4]; mult = 3 + this._atributos[4]; break;
            case "OCULTISTA": base = 4 + this._atributos[4]; mult = 4 + this._atributos[4]; break;
        }
        return (this._nex > 1) ? base + mult * (this._nex - 1) : base;
    }
    // Getter pra capacidade do inventario

    get capacidadeInventario() {
        return this._capacidadeInventario;
    }

    // Getters pro HP, Sanidade e PE atuais
    get hpAtual() {
        return this._hpAtual;
    }
    get sanidadeAtual() {
        return this._sanidadeAtual;
    }
    get peAtual() {
        return this._peAtual;
    }


    // Causar dano e curar HP fora de combate
    receberDanoHP(valor: number) {
        this._hpAtual -= valor;
        if (this._hpAtual < 0) this._hpAtual = 0;
    }
    curarHP(valor: number) {
        this._hpAtual += valor;
        if (this._hpAtual > this.hp) this._hpAtual = this.hp;
    }

    // Causar dano e curar Sanidade fora de Combate
    receberDanoSanidade(valor: number) {
        this._sanidadeAtual -= valor;
        if (this._sanidadeAtual < 0) this._sanidadeAtual = 0;
    }
    recuperarSanidade(valor: number) {
        this._sanidadeAtual += valor;
        if (this._sanidadeAtual > this.sanidade) this._sanidadeAtual = this.sanidade;
    }

    // Gastar e recuperar PE fora de combate
    gastarPE(valor: number) {
        this._peAtual -= valor;
        if (this._peAtual < 0) this._peAtual = 0;
    }

    recuperarPE(valor: number) {
        this._peAtual += valor;
        if (this._peAtual > this.pe) this._peAtual = this.pe;
    }
}
/*
    SINTAXES:

    PERSONAGEM: Nome - Classe - Força - Agilidade - Vigor - Intelecto - Presença - NEX
    Nome = Nome
    Classe = Classe - Define quanto HP você vai ter, quanta Sanidade você vai ter, quanto PE você vai ter e quais ataques você pode ter
    Força = Força - Usado para calcular o seu inventário e atacar
    Agilidade = Agilidade - Usado para calcular a Defesa e atacar
    Vigor = Vigor - Usado para calcular o HP
    Intelecto = Intelecto - Usado para possiveis habilidades
    Preseça = Presença - Usado para calcular seus PE
    NEX = NEX - É medido de 5 em 5, indo de 0 a 100


    ATAQUE: Atributo - Dados - Tipo - Acerto - Bônus
    Atributo = Atributo - Força ou Destreza para Combatentes, Especialistas e Ocultistas e Intelecto apenas para Ocultistas
    Dados = Quantidade de dados de dano
    Tipo = Quantos lados o dado possui
    Acerto = Bônus para acertar o ataque
    Bônus = Valor bônus para o dano
    Se você for um ocultista vc pode criar ataques usando Intelecto, eles se chamam "Rituais", eles gastam PE e causam dano na Sanidade)
*/

const Claudio = new personagem("Claudio", "ocultista", 3, 1, 3, 3, 2, 15);
const Marcos = new personagem("Marcos", "combatente", 2, 2, 2, 1, 1, 10);

Claudio.criarHabilidade(1, "intelecto", 2, 6, 2, 5);
Marcos.criarHabilidade(1, "FORCA", 1, 8, 1, 2);

personagem.combate(Claudio, Marcos);
