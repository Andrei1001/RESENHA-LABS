class personagem {
    private _classe: string;
    private _atributos = [];
    private _pericias = [];
    private _origem: string;
    private _nex: number;
    private _protecao = 0;
    private _inventario = [];
    private _capacidadeInventario;

    constructor (classe: string, forca: number, agilidade: number, vigor: number,
        intelecto: number, presenca: number, origem: string, nex: number){
        this._classe = classe.toUpperCase();
        this._atributos.push(forca, agilidade, vigor, intelecto, presenca);
        this._origem = origem;
        this._nex = nex/5;
        this._capacidadeInventario = 5*forca;
    }



    adicionarItem(item:string){ // Sistema de adicionar um item pro inventario e calcular o peso dele  
        item = item.toUpperCase();
        this._inventario.push(item);
        if(item == "PROTEÇÃO LEVE"){ // Se a proteção for leve aumenta a defesa em 5
            this._protecao = (this._protecao>5) ? 10: 5;;
        }
        if(item == "PROTEÇÃO PESADA"){ // Se a proteção for pesada aumenta a defesa em 10
            this._protecao = 10;
        }
        if(item == 'ESCUDO'){ // Se for um escudo aumenta a defesa em 2
            this._protecao+=2;
        }
                switch(item){ // Verifica se o item existe, se existir adiciona o peso dele corretamente
                case "FACA":case 'MARTELO':case 'PUNHAL':case 'BASTÃO':case 'MACHETE':
                case 'LANÇA': case 'PISTOLA':case 'REVÓLVER':case 'MACHADINHA':case 'NUNCHAKO':case 'CORRENTE':case 'ESPADA':
                case 'FLORETE':case 'MACHADO': case 'MAÇA':case 'SUBMETRALHADORA': case 'BALAAS CURTAS':case 'BALAS LONGAS':
                case 'CARTUCHOS': case 'COMBUSTÍVEL': case 'FLECHAS': case 'FOGUETE': case 'KIT DE PERÍCIA': case 'UTENSÍLIO':
                case 'VESTIMENTA':case 'GRANADA DE ATORDOAMENTO': case 'GRANADA DE FRAGMENTAÇÃO': case 'GRANADA DE FUMAÇA':
                case 'GRANADA INCENDIÁRIA': case 'MINA ANTIPESSOAL': case 'ALGEMAS': case 'ARPÉU': case 'BANDOLEIRA':
                case 'BINÓCULOS': case 'BLOQUEADOR DE SINAL': case 'CICATRIZANTE': case 'CORDA': case  'LANTERNA TÁTICA':
                case 'MÁSCARA DE GÁS': case 'ÓCULOS DE VISÃO TÉRMICA': case 'PÉ DE CABRA': case 'PISTOLA DE DARDOS':
                case 'PISTOLA SINALIZADORA':case 'SOQUEIRA': case 'SPRAY DE PIMENTA': case 'TASER':
                    this._capacidadeInventario = this._capacidadeInventario - 1;
                    break;
                case 'CAJADO': case 'ARCO': case 'BESTA':case 'FUZIL DE CAÇA': case 'ACHA':case 'GADANHO': case 'KATANA': case 'MARRETA':
                case 'MONTANTE': case 'MOTOSSERRA': case 'ARCO COMPOSTO': case 'BALESTRA': case 'ESPINGARDA':
                case 'FUZIL DE ASSALTO': case 'FUZIL DE PRECISÃO': case 'BAZUCA': case 'LANÇA-CHAMAS': case 'METRALHADORA':
                case 'EQUIPAMENTO DE SOBREVIVÊNCIA': case 'TRAJE HAZMAT': case 'PROTEÇÃO LEVE': case 'ESCUDO':
                    this._capacidadeInventario = this._capacidadeInventario - 2;
                    break;
                case 'PROTEÇÃO PESADA':
                    this._capacidadeInventario = this._capacidadeInventario - 5;
                    break;
                case 'MOCHILA MILITAR':
                    this._capacidadeInventario = this._capacidadeInventario + 2;
                    break;
                default:
                    throw new Error('O item digitado não existe ou está digitado errado'); // Se o item não existir da um erro
                    break;
                }

    }
        // Getters pros 5 atributos 
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
        // Getters pros recursos adicionais na ficha
    get limite_PE(){
        const limite_PE = this._nex;
        return limite_PE;
    }
    get defesa(){
        const defesa = 10 + this._atributos[1] + this._protecao;
        return defesa;
    }
        // Getters pro HP, Sanidade e PE
    get hp() {
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

        get sanidade() {
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

        get pe() {
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
            // Getter pra capacidade do inventario
        get capacidadeInventario() {
            const capacidadeInventario = this._capacidadeInventario;
            return capacidadeInventario;
        }
            // Coisas do ataque q eu ainda to fazendo
    
    }
// A Sintaxe para criar um personagem é: Classe, força, destreza, vigor, intelecto, presença, origem e NEX
const Claudio = new personagem("combatente", 3, 1, 3, 3, 2, "cultista arrependido", 15);
Claudio.adicionarItem('proteção pesada');
Claudio.adicionarItem('faca');
console.log(Claudio.hp,Claudio.sanidade ,Claudio.pe, Claudio.defesa, Claudio.capacidadeInventario, Claudio.limite_PE)
