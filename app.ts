class personagem {
    private _classe: string;
    private _atributos = [];
    private _pericias = [];
    private _origem: string;
    private _nex: number;
    private _protecao = 0;
    private _inventario = [];

    constructor (classe: string, forca: number, agilidade: number, vigor: number, intelecto: number, presenca: number, origem: string, nex: number){
        this._classe = classe.toUpperCase();
        this._atributos.push(forca, agilidade, vigor, intelecto, presenca);
        this._origem = origem;
        this._nex = nex/5;
    }

    adicionarItem(item:string){
        item = item.toUpperCase();
        this._inventario.push(item);
        if(item == "PROTEÇÃO LEVE"){
            this._protecao = (this._protecao>5) ? 10: 5;;
        }
        if(item == "PROTEÇÃO PESADA"){
            this._protecao = 10;
        }
    }

    get forca() {
        const atributo = this._atributos[0];
        return atributo;
    }
    get agilidade() {
        const atributo = this._atributos[1];
        return atributo;
    }
    get vigor() {
        const atributo = this._atributos[2];
        return atributo;
    }
    get intelecto() {
        const atributo = this._atributos[3];
        return atributo;
    }
    get presenca() {
        const atributo = this._atributos[4];
        return atributo;
    }
    get limite_PE(){
        const limite_PE = this._nex;
        return limite_PE;
    }
    get defesa(){
        const defesa = 10 + this._atributos[1] + this._protecao;
        return defesa;
    }

    get hp_maximo() {
        var hp_inicial:number, hp_maximo, hp_nex;
        switch(this._classe){
            case "COMBATENTE":
            hp_inicial = 20 + this._atributos[2];
            hp_nex = (4+this._atributos[2])*(this._nex-1);
            break;
            case "ESPECIALISTA":
            hp_inicial = 16 + this._atributos[2];
            hp_nex = (3+this._atributos[2])*(this._nex-1);
            break;
            case "OCULTISTA":
            hp_inicial = 12 + this._atributos[2];
            hp_nex = (2+this._atributos[2])*(this._nex-1);
            break;
        }
        hp_maximo = (this._nex > 1) ? hp_inicial + hp_nex : hp_inicial;
        return hp_maximo;
        }

        get sanidade_maxima() {
            var sanidade_inicial:number, sanidade_maxima, sanidade_nex;
        switch(this._classe){
            case "COMBATENTE":
            sanidade_inicial = 12;
            sanidade_nex = 3*(this._nex-1);
            break;
            case "ESPECIALISTA":
            sanidade_inicial = 16;
            sanidade_nex = 4*(this._nex-1);
            break;
            case "OCULTISTA":
            sanidade_inicial = 20;
            sanidade_nex = 5*(this._nex-1);
            break;
        }
        sanidade_maxima = (this._nex > 1) ? sanidade_inicial + sanidade_nex : sanidade_inicial;
        return sanidade_maxima;
        }

        get pe_maximo() {
            var pe_inicial:number, pe_maximo, pe_nex;
        switch(this._classe){
            case "COMBATENTE":
            pe_inicial = 2 + this._atributos[4];
            pe_nex = (2+this._atributos[4])*(this._nex-1);
            break;
            case "ESPECIALISTA":
            pe_inicial = 3 + this._atributos[4];
            pe_nex = (3+this._atributos[4])*(this._nex-1);
            break;
            case "OCULTISTA":
            pe_inicial = 4 + this._atributos[4];
            pe_nex = (4+this._atributos[4])*(this._nex-1);
            break;
        }
        pe_maximo = (this._nex > 1) ? pe_inicial + pe_nex : pe_inicial;
        return pe_maximo;
        }


    }
// A Sintaxe para criar um personagem é: Classe, força, destreza, vigor, intelecto, presença, origem e NEX
const Claudio = new personagem("combatente", 2, 1, 3, 3, 2, "cultista arrependido", 15);
Claudio.adicionarItem("proteção leve");
console.log(Claudio.hp_maximo,Claudio.sanidade_maxima ,Claudio.pe_maximo, Claudio.defesa)