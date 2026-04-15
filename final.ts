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

    get hp() {
        let hp_inicial: number, hp_nex;
        switch (this._classe) {
            case "COMBATENTE":
                hp_inicial = 20 + this._atributos[2]
                hp_nex = (4 + this._atributos[2]) * (this._nex - 1)

                return (this._nex > 1) ? hp_inicial + hp_nex : hp_inicial;

            case "OCULTISTA":
                hp_inicial = 12 + this._atributos[2]
                hp_nex = (2 + this._atributos[2]) * (this._nex - 1)

                return (this._nex > 1) ? hp_inicial + hp_nex : hp_inicial;
            default:
                hp_inicial = 16 + this._atributos[2]
                hp_nex = (3 + this._atributos[2]) * (this._nex - 1)

                return (this._nex > 1) ? hp_inicial + hp_nex : hp_inicial;


        }

    }

    get pe() {
        let pe_inicial: number, pe_nex;
        switch (this._classe) {
            case "COMBATENTE":
                pe_inicial = 2 + this._atributos[4]
                pe_nex = (2 + this._atributos[4]) * (this._nex - 1)

                return (this._nex > 1) ? pe_inicial + pe_nex : pe_inicial;

            default:
                pe_inicial = 3 + this._atributos[4]
                pe_nex = (3 + this._atributos[4]) * (this._nex - 1)

                return (this._nex > 1) ? pe_inicial + pe_nex : pe_inicial;

            case "OCULTISTA":
                pe_inicial = 4 + this._atributos[4]
                pe_nex = (4 + this._atributos[4]) * (this._nex - 1)

                return (this._nex > 1) ? pe_inicial + pe_nex : pe_inicial;

        }
    }

    get sanidade() {
        let sanidade_inicial: number, sanidade_nex;
        switch (this._classe) {
            case "COMBATENTE":
                sanidade_inicial = 12;
                sanidade_nex = 3 * (this._nex - 1);
                return (this._nex > 1) ? sanidade_inicial + sanidade_nex : sanidade_inicial;

            default:
                sanidade_inicial = 16;
                sanidade_nex = 4 * (this._nex - 1);
                return (this._nex > 1) ? sanidade_inicial + sanidade_nex : sanidade_inicial;

            case "OCULTISTA":
                sanidade_inicial = 20;
                sanidade_nex = 5 * (this._nex - 1);
                return (this._nex > 1) ? sanidade_inicial + sanidade_nex : sanidade_inicial;
        }
    }

    receberDanoHP(valor: number) {
        this._hpAtual -= valor;
        if (this._hpAtual <= 0) {
            this._hpAtual = 0;
        }
    }
    curarHP(valor: number) {
        this._hpAtual += valor;
        if (this._hpAtual > this.hp) {
            this._hpAtual = this.hp;
        }
    }
    receberDanoSanidade(valor: number) {
        this._sanidadeAtual -= valor;
        if (this._sanidadeAtual <= 0) {
            this._sanidadeAtual = 0;
        }
    }

    curarSanidade(valor: number) {
        this._sanidadeAtual += valor;
        if (this._sanidadeAtual > this.sanidade) {
            this._sanidadeAtual = this.sanidade;
        }
    }
    gastarPE(valor: number) {
        this._peAtual -= valor;
        if (this._peAtual <= 0) {
            this._peAtual = 0;
        }
    }

    recuperarPE(valor: number) {
        this._peAtual += valor;
        if (this._peAtual > this.pe) {
            this._peAtual = this.pe;
        }

    }
    get hpAtual (){
        return this._hpAtual;
    }
     get peAtual (){
        return this._peAtual;
    }
     get sanidadeAtual (){
        return this._sanidadeAtual;
    }
    
}
