// fazer tudo aq
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
}
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
