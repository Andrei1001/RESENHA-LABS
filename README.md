# RESENHA-LABS
O grupo mais resenha do IFC!


CÓDIGO
=================================================================
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
    get nome (){
    const nome=this._nome.charAt(0).toUpperCase() + this._nome.slice(1).toLocaleLowerCase()
    return nome
}

get classe() {
        const classe = this._classe.charAt(0).toUpperCase() + this._classe.slice(1).toLowerCase();
        return classe;
    }

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
    get capacidadeInventario() {
        return this._capacidadeInventario;
    }

    adicionarItem(item:string){
        item=item.toUpperCase()
switch(item){
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
    default: throw new Error("item não existe");
}

    this._inventario.push(item)

    if ('PROTECÃO PESADA'){
        this._protecao += 10
    } 
    if('PROTEÇÃO LEVE'){
        this._protecao += 5 
    }
    if('ESCUDO'){
        this._protecao += 2
    }
}

}
let nome_personagem, classe 
    let forca, agil, vig, int, presence, nex;
    let contador = 99999;


    

 while (contador !== null){
 nome_personagem = String(prompt("Digite o nome do seu personagem"));
 classe = String(prompt("Digite a classe do seu personagem"));  
 forca = Number(prompt("Digite a forca do seu personagem"));
 agil = Number(prompt("Agilidade do personagem"));
 vig = Number(prompt("Vigor do personagem"));
 int = Number(prompt("Inteligencia do personagem"));
 presence = Number(prompt("Presenca do personagem"));
 nex = Number(prompt("Nex do personagem"));
 

 const Boneco1 = new personagem (nome_personagem, classe, forca, agil, vig, int, presence, nex);
 break;
 }
 console.log(nome_personagem)
 console.log(classe)
 console.log(forca)
 console.log(agil)
 console.log(vig)
 console.log(int)
 console.log(presence)
 console.log(nex)

}
