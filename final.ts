class personagem {
    private _classe: string;
    private _atributos = [];
    private _nome: string;
    private _nex: number;
    private _protecao = 0;
    private _inventario = [];
    private _capacidadeInventario;
    private _inventarioMax;
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
        this._inventarioMax = this.capacidadeInventario;
        this._hpAtual = this.hp;
        this._sanidadeAtual = this.sanidade;
        this._peAtual = this.pe;
    }

    // Método para criar habilidades
    criarHabilidade(slot: number, atributo: string, dados: number, tipo: number, bonusAcerto: number, bonusDano: number) {
        slot--;
        atributo = atributo.toUpperCase();
        // Limite de slots
        if (slot < 0 || slot > 4) {
            console.error("Slot inválido (1 a 5)");
        }
        if(atributo != "FORÇA" || "AGILIDADE" || "INTELECTO"){
            console.error('Atributo Invalido')
            return;
        }
        // Regra das classes
        if (this._classe == "OCULTISTA") {
            // slots 0-2 = rituais | 3-4 = ataques
            if (slot <= 2 && atributo != "INTELECTO") {
                console.error("Slots 0-2 são apenas rituais");
            }
            if (slot >= 3 && atributo == "INTELECTO") {
                console.error("Slots 3-4 são apenas ataques físicos");
            }
        } else {
            // Combatentes/Especialistas não podem rituais
            if (atributo == "INTELECTO") {
                console.error("Apenas ocultistas podem criar rituais");
            }
        }

        this._habilidades[slot] = { atributo, dados, tipo, bonusAcerto, bonusDano };
    }

    // Método pra pegar os atributos para usar nos calculos do método "atacar"
    private getAtributoValor(nome: string) {
        switch (nome) {
            case "FORÇA": return this._atributos[0];
            case "AGILIDADE": return this._atributos[1];
            case "VIGOR": return this._atributos[2];
            case "INTELECTO": return this._atributos[3];
            case "PRESENÇA": return this._atributos[4];
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
                return dano;
            }
            alvo.receberDanoHP(dano); // Dano normal em HP
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

        const grupo1 = [
    "FACA","MARTELO","PUNHAL","BASTÃO","MACHETE","LANÇA","PISTOLA","REVÓLVER","MACHADINHA",
    "NUNCHAKO","CORRENTE","ESPADA","FLORETE","MACHADO","MAÇA","SUBMETRALHADORA",
    "BALAAS CURTAS","BALAS LONGAS","CARTUCHOS","COMBUSTÍVEL","FLECHAS","FOGUETE",
    "KIT DE PERÍCIA","UTENSÍLIO","VESTIMENTA","GRANADA DE ATORDOAMENTO",
    "GRANADA DE FRAGMENTAÇÃO","GRANADA DE FUMAÇA","GRANADA INCENDIÁRIA",
    "MINA ANTIPESSOAL","ALGEMAS","ARPÉU","BANDOLEIRA","BINÓCULOS",
    "BLOQUEADOR DE SINAL","CICATRIZANTE","CORDA","LANTERNA TÁTICA",
    "MÁSCARA DE GÁS","ÓCULOS DE VISÃO TÉRMICA","PÉ DE CABRA",
    "PISTOLA DE DARDOS","PISTOLA SINALIZADORA","SOQUEIRA","SPRAY DE PIMENTA","TASER"
];

const grupo2 = [
    "CAJADO","ARCO","BESTA","FUZIL DE CAÇA","ACHA","GADANHO","KATANA","MARRETA",
    "MONTANTE","MOTOSSERRA","ARCO COMPOSTO","BALESTRA","ESPINGARDA",
    "FUZIL DE ASSALTO","FUZIL DE PRECISÃO","BAZUCA","LANÇA-CHAMAS","METRALHADORA",
    "EQUIPAMENTO DE SOBREVIVÊNCIA","TRAJE HAZMAT","PROTEÇÃO LEVE","ESCUDO"
];

const grupo3 = ["PROTEÇÃO PESADA"];
const grupo4 = ["MOCHILA MILITAR"];

if (grupo1.includes(item)) {
    this._capacidadeInventario--;
    this._inventario.push(item);
    return
} 
if (grupo2.includes(item)) {
    this._capacidadeInventario -= 2;
    if (item == 'ESCUDO') {
            this._protecao += 2;
        }
        if (item == "PROTEÇÃO LEVE") {
            this._protecao = (this._protecao > 5) ? 10 : 5;
        }
        this._inventario.push(item);
        return
} 
if (item == "PROTEÇÃO PESADA") {
            this._protecao = 10;
            this.capacidadeInventario - 5;
            this._inventario.push(item);
            return
        }
if (grupo4.includes(item)) {
    this._capacidadeInventario += 2;
    this._inventario.push(item);
    return
} 
    console.error("[error] Item não existe"); 
    prompt('Pressione Enter para continuar')
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
            case "COMBATENTE": base = 12; mult = 3 * (this._nex - 1); break;
            case "ESPECIALISTA": base = 16; mult = 4 * (this._nex - 1); break;
            case "OCULTISTA": base = 20; mult = 5 * (this._nex - 1); break;
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

    get habilidades(): any[] {
    return Object.values(this._habilidades);
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

let listaPersonagens: personagem[] = []
function menu() {
    console.log("====== MENU =======")
    console.log("1- Criar Personagem")
    console.log("2- Criar Ataque")
    console.log("3- Combate")
    console.log("4- Listar Personagens")
    console.log("5- Listar Ataques")
    console.log("6- Adicionar Item")
    console.log("7- Listar Itens")
    console.log("8- Verificar status")
    console.log("9- Alterar HP, San ou PE")
    console.log("0- Sair")
    return Number(prompt('Escolha uma opção: '))
}
function criarPersonagem() {
        console.clear();
    let nome = String(prompt("Digite o nome do seu personagem"));
    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    const classe = String(prompt("Digite a classe do seu personagem"));
    const forca = Number(prompt("Digite a forca do seu personagem"));
    const agil = Number(prompt("Agilidade do personagem"));
    const vig = Number(prompt("Vigor do personagem"));
    const int = Number(prompt("Inteligencia do personagem"));
    const pre = Number(prompt("Presenca do personagem"));
    const nex = Number(prompt("Nex do personagem"));
    const perso = new personagem (nome, classe, forca, agil, vig, int, pre, nex)
    listaPersonagens.push(perso)
    prompt('Aperte Enter para continuar');
}
function criarAtaque() {
        console.clear();
    let nome = String(prompt('Escolha um personagem ja criado'))
    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    const perso = listaPersonagens.find(
        (p: personagem) => p.nome === nome
    ) as personagem;

    if (!perso) {
        console.error("personagem não encontrado");
    }
    let slot = Number(prompt('Qual slot ira ficar essa habilidade? (1 a 5) '))
    const atri = String(prompt('Escolha o atributo que você vai usar'))
    atri.toUpperCase
    const dados = Number(prompt('Digite quantos dados de dano serão causados'))
    const lados = Number(prompt("Digite quantos lados os dados possuem"))
    const hit = Number(prompt("Digite o acerto do ataque"));
    const dmg = Number(prompt("Digite o bonus de dano"));
    const ataque = perso.criarHabilidade(slot, atri, dados, lados, hit, dmg)
    prompt('Aperte Enter para continuar');
}
function combate () {
    let nome1 = String(prompt('Digite o nome do primeiro personagem'))
    nome1 = nome1.charAt(0).toUpperCase() + nome1.slice(1).toLowerCase()
    let nome2 = String(prompt('Digite o nome do segundo personagem'))
    nome2 = nome2.charAt(0).toUpperCase() + nome2.slice(1).toLowerCase()
    const perso1 = listaPersonagens.find(
        (p: personagem) => p.nome === nome1
    ) as personagem;
    const perso2 = listaPersonagens.find(
        (p: personagem) => p.nome === nome2
    ) as personagem;

    if (!perso2) {
        console.error("personagem não encontrado")
    }
    if (!perso1) {
        console.error("personagem não encontrado")
    }
    personagem.combate(perso1, perso2)
}
function listarPersonagens() {
  console.clear();
  console.log("======= Lista de Personagens =======");

  if (listaPersonagens.length === 0) {
    console.log("Nenhum personagem adicionado.");
    prompt("Pressione Enter para continuar.");
    return;
  }

  for (const personagem of listaPersonagens) {
    console.log('- ', personagem.nome);
  }

  prompt("Pressione Enter para continuar.");
}
function listarAtaques() {
        console.clear();
    let nome = String(prompt('Escolha um personagem ja criado'))
    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    const perso = listaPersonagens.find(
        (p: personagem) => p.nome === nome
    ) as personagem;

    if (!perso) {
        console.error("personagem não encontrado");
    }
    const habilidades = perso.habilidades;

    if (!habilidades || habilidades.length === 0) {
        console.log("Nenhuma habilidade cadastrada");
        return;
    }

    habilidades.forEach((hab, index) => {
        console.log(`Habilidade ${index + 1}:`);
        console.log(`Atributo: ${hab.atributo}`);
        console.log(`Dados: ${hab.dados}`);
        console.log(`Tipo: ${hab.tipo}`);
        console.log(`Bônus de Acerto: ${hab.bonusAcerto}`);
        console.log(`Bônus de Dano: ${hab.bonusDano}`);
        console.log('------------------------');
    });
    prompt('Aperte Enter para continuar');
}
function adicionarItem(){
    let nome = String(prompt('Escolha um personagem ja criado'))
    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    const perso = listaPersonagens.find(
        (p: personagem) => p.nome === nome
    ) as personagem;

    if (!perso) {
        console.error("personagem não encontrado");
    }
    const item = String(prompt('Escolha um item'))
    perso.adicionarItem(item);
    prompt('Aperte Enter para continuar');
}
function listarItens(){
    let nome = String(prompt('Escolha um personagem ja criado'))
    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    const perso = listaPersonagens.find(
        (p: personagem) => p.nome === nome
    ) as personagem;

    if (!perso) {
        console.error("personagem não encontrado");
    }
    const inventario = (perso as any)._inventario;

    if (!inventario || inventario.length === 0) {
        console.log("Inventário vazio");
        return;
    }

    inventario.forEach((item: any, index: number) => {
        console.log(`Item ${index + 1}: ${item}`);
    });
    prompt('Aperte Enter para continuar');
}
function statusPersonagem() {
    let nome = String(prompt('Escolha um personagem ja criado'))
    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    const perso = listaPersonagens.find(
        (p: personagem) => p.nome === nome
    ) as personagem;

    if (!perso) {
        console.error("personagem não encontrado");
    }
    const p = perso as any;

    console.log(`Nome: ${p._nome}`);
    console.log(`Classe: ${p._classe}`);

    console.log("Atributos:");
    console.log(`Força: ${p._atributos[0]}`);
    console.log(`Agilidade: ${p._atributos[1]}`);
    console.log(`Vigor: ${p._atributos[2]}`);
    console.log(`Intelecto: ${p._atributos[3]}`);
    console.log(`Presença: ${p._atributos[4]}`);

    console.log(`Proteção: ${p._protecao}`);

    console.log(`HP: ${p._hpAtual} / ${p.hp}`);
    console.log(`Sanidade: ${p._sanidadeAtual} / ${p.sanidade}`);
    console.log(`PE: ${p._peAtual} / ${p.pe}`);

    const inventarioAtual = p._inventario?.length || 0;
    console.log(`Inventário: ${inventarioAtual} / ${p._capacidadeInventario}`);
    prompt('Aperte Enter para continuar');
}
function alterarStatus(){
    let nome = String(prompt('Escolha um personagem ja criado'))
    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    const perso = listaPersonagens.find(
        (p: personagem) => p.nome === nome
    ) as personagem;

    if (!perso) {
        console.error("personagem não encontrado");
    }
    const p = perso as any;

    const tipo = String(prompt("O que deseja alterar? (HP / SANIDADE / PE)")).toUpperCase();

    let atual: number;
    let max: number;
    let chave: string;

    if (tipo === "HP") {
        atual = p._hpAtual;
        max = p.hp;
        chave = "_hpAtual";
    } else if (tipo === "SANIDADE") {
        atual = p._sanidadeAtual;
        max = p.sanidade;
        chave = "_sanidadeAtual";
    } else if (tipo === "PE") {
        atual = p._peAtual;
        max = p.pe;
        chave = "_peAtual";
    } else {
        console.error("Opção inválida");
        return;
    }

    console.log(`Valor atual: ${atual} / ${max}`);

    const operacao = String(prompt("Deseja aumentar ou reduzir? (A / R)")).toUpperCase();
    const valor = Number(prompt("Digite o valor:"));

    if (isNaN(valor) || valor < 0) {
        console.error("Valor inválido");
        return;
    }

    if (operacao === "A") {
        p[chave] = Math.min(atual + valor, max);
    } else if (operacao === "R") {
        p[chave] = Math.max(atual - valor, 0);
    } else {
        console.error("Operação inválida");
        return;
    }

    console.log(`Novo valor: ${p[chave]} / ${max}`);
    prompt('Aperte Enter para continuar');
}
while(true){
    const opcao = menu();
    if(opcao == null){
        console.error("Opção Invalida")
        continue
    }
    if(opcao == 1){
        criarPersonagem();
        continue;
    }
    if(opcao == 2){
        criarAtaque();
        continue;
    }
    if(opcao == 3){
        combate();
        continue;
    }
    if(opcao == 4){
        listarPersonagens();
        continue;
    }
    if(opcao == 5){
        listarAtaques()
        continue;
    }
    if(opcao == 6){
        adicionarItem();
        continue;
    }
    if(opcao == 7){
        listarItens();
        continue;
    }
    if(opcao == 8){
        statusPersonagem();
        continue;
    }
    if(opcao == 9){
        alterarStatus();
        continue;
    }
    if(opcao == 0){
        console.log('Obrigado por jogar')
        break;
    }
    
    prompt("[erro] Opção inválida. pressione Enter para continuar.");

}
