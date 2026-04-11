//Resenha Pay - Banco Digital Versão 1.0.1
///<reference types="node" />
import * as fs from 'fs';

//classe para cadastrar conta, os dados da conta são salvos em um arquivo json, para isso é necessário ler o arquivo json,
//adicionar os dados da nova conta e depois escrever o arquivo json atualizado.
class CadastrarConta {
    private nome: string = "";
    private email: string = "";
    private telefone: string = "";
    private cpf: string = "";
    private senha: string = "";
    private confirmarSenha: string = "";
    private dadosConta: Array<{ getNome: string, getEmail: string, getTelefone: string, getCpf: string, getSenha: string }> = [];

    //formata o telefone e cpf para o formato brasileiro e depois salva os dados da conta em um arquivo json
    constructor(nome: string, email: string, telefone: string, cpf: string, senha: string, confirmarSenha: string) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cpf = cpf;
        this.senha = senha;
        this.confirmarSenha = confirmarSenha;

        this.telefone = this.telefone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
        this.cpf = this.cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{2})/, '$1-$2');

        //le os dados se existir
        if (fs.existsSync('dadosContas.json')) {
            const dadosExistentes = fs.readFileSync('dadosContas.json', 'utf-8');
            this.dadosConta = JSON.parse(dadosExistentes);
        }

        //adiciona os dados da nova conta ao array
        this.dadosConta.push({
            getNome: this.nome,
            getEmail: this.email,
            getTelefone: this.telefone,
            getCpf: this.cpf,
            getSenha: this.senha

        });


        //escreve os dados atualizados no arquivo
        fs.writeFileSync('dadosContas.json', JSON.stringify(this.dadosConta, null, 2));
    }


    //getters para acessar os dados da conta
    public getNome(): string {
        return this.nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public getSenha(): string {
        return this.senha;
    }

    public getCpf(): string {
        return this.cpf;
    }

    public getTelefone(): string {
        return this.telefone;
    }
}

//função para validar email e senha no login
function testeEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function testeSenha(senha: string): boolean {
    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\s).{8,}$/;
    return senhaRegex.test(senha);
}
function testeTelefone(telefone: string): boolean {
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return telefoneRegex.test(telefone);
}
function testeCpf(cpf: string): boolean {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
}

//menu principal do app
let contador: number = 9999;
while (contador !== null) {
    console.log("Bem-vindo ao Resenha Pay!");
    console.log("1. Criar Conta");
    console.log("2. Fazer Login"); //falta fazer a função de login, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array.
    console.log("3. Esqueci minha senha"); //falta fazer a função de esqueci minha senha, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a recuperação da senha da conta.
    console.log("0. Sair do app");
    contador = Number(prompt("Digite a opção desejada:")!);

    //validação da opção escolhida
    if (contador === 0) {
        console.log("Obrigado por usar o Resenha Pay! Até a próxima.");
        break;
    }

    if (contador === 1) {
        const nome = prompt("Digite seu nome:")!;
        if (nome.trim() === "") {
            console.error("O nome não pode ser vazio.");
            continue;
        }

        let email = prompt("Digite seu email:")!;
        while (email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (email.trim() === "") {
                console.error("O email não pode ser vazio.");
            } else {
                console.error("Email deve ser válido.");
            }
            email = prompt("Digite seu email:")!;
        }

        let telefone = prompt("Digite seu telefone:")!;
        while (telefone.trim() === "" || /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone)) {
            if (telefone.trim() === "") {
                console.error("O telefone não pode ser vazio.");
            } else {
                console.error("Telefone deve estar no formato (XX) XXXXX-XXXX.");
            }
            telefone = prompt("Digite seu telefone:")!;
        }

        let cpf = prompt("Digite seu CPF:")!;
        while (cpf.trim() === "" || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
            if (cpf.trim() === "") {
                console.error("O CPF não pode ser vazio.");
            } else {
                console.error("CPF deve estar no formato XXX.XXX.XXX-XX.");
            }
            cpf = prompt("Digite seu CPF:")!;

        }

        let senha = prompt("Digite sua senha:")!;
        while (senha.trim() === "" || senha.length < 8 || !/\d/.test(senha) || !/[A-Z]/.test(senha) || !/[a-z]/.test(senha) || senha.includes(" ")) {
            if (senha.trim() === "") {
                console.error("A senha não pode ser vazia.");
            } else {
                console.error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números, e não pode conter espaços em branco.");
            }
            senha = prompt("Digite sua senha:")!;
        }

        let confirmarSenha = prompt("Confirme sua senha:")!;
        while (confirmarSenha.trim() === "" || senha !== confirmarSenha) {
            if (confirmarSenha.trim() === "") {
                console.error("A confirmação da senha não pode ser vazia.");
            } else {
                console.error("As senhas não coincidem.");
            }
            confirmarSenha = prompt("Confirme sua senha:")!;
        }





        if (fs.existsSync('dadosContas.json')) {
            const dadosExistentes = fs.readFileSync('dadosContas.json', 'utf-8');
            const contas = JSON.parse(dadosExistentes);
            const emailExistente = contas.some((conta: { getEmail: string; }) => conta.getEmail === email);
            const cpfExistente = contas.some((conta: { getCpf: string; }) => conta.getCpf === cpf);
            const telefoneExistente = contas.some((conta: { getTelefone: string; }) => conta.getTelefone === telefone);

            if (telefoneExistente) {
                console.error("Este telefone já está registrado. Tente novamente com um telefone diferente.");
                continue;
            }
            if (cpfExistente) {
                console.error("Este CPF já está registrado. Tente novamente com um CPF diferente.");
                continue;
            }
            if (emailExistente) {
                console.error("Este email já está registrado. Tente novamente com um email diferente.");
                continue;
            }
        }
        const Conta1 = new CadastrarConta(nome, email, telefone, cpf, senha, confirmarSenha);





        console.log("Conta criada com sucesso!");
        console.log(nome)
        console.log(email)
        console.log(telefone)
        continue;
    }

    if (contador === 2) {


        const dadosExistentes = fs.readFileSync('dadosContas.json', 'utf-8');
        const contas = JSON.parse(dadosExistentes);

        let emailLogin = prompt("Digite seu email para login:")!;
        while (!testeEmail(emailLogin)) {
            console.error("Email inválido. Tente novamente.");
            emailLogin = prompt("Digite seu email para login:")!
        }

        let senhaLogin = prompt("Digite sua senha para login:")!;
        while (testeSenha(senhaLogin)) {
            console.error("Senha inválida. Tente novamente.");
            senhaLogin = prompt("Digite sua senha para login:")!;
        }

        const contaEncontrada = contas.find((conta: { getEmail: string; getSenha: string; }) => conta.getEmail === emailLogin && conta.getSenha === senhaLogin);

        if (contaEncontrada) {
            console.log("Login bem-sucedido! Bem-vindo, " + contaEncontrada.getNome + "!")
            while (contador !== null) {
                console.log("1. fazer uma transferência"); //falta fazer a função de transferência, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a transferência entre as contas.
                console.log("2. Verificar saldo"); //falta fazer a função de verificar saldo, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o saldo da conta.
                console.log("3. Consultar numero da conta");//ainda nao definido mas //falta fazer a função de consultar numero da conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o numero da conta.
                console.log("4. extrato"); //falta fazer a função de extrato, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o extrato da conta.
                console.log("5. Fazer um depósito"); //falta fazer a função de depósito, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar o depósito na conta.
                console.log("6. Fazer um saque"); // falta fazer a função de saque, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar o saque na conta.
                console.log("7. Atualizar dados da conta"); //falta fazer a função de atualizar dados da conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a atualização dos dados da conta.
                console.log("8. Excluir conta"); 
                console.log("9. Logout"); 
                contador = Number(prompt("Digite a opção desejada:")!);


                if (contador === 9) {
                    console.log("Logout realizado com sucesso! Até a próxima.");
                    break;
                }
                if (contador === 8) {
                    console.log("Tem certeza que deseja excluir sua conta? Esta ação é irreversível. Digite 'sim' para confirmar ou 'não' para cancelar.");
                    const confirmacao = prompt("Digite sua escolha:")!.toLowerCase();
                    if (confirmacao === "sim") {
                        const indexConta = contas.findIndex((conta: { getEmail: string; getSenha: string; }) => conta.getEmail === emailLogin && conta.getSenha === senhaLogin);
                        if (indexConta !== -1) {
                            contas.splice(indexConta, 1);
                            fs.writeFileSync('dadosContas.json', JSON.stringify(contas, null, 2));
                            console.log("Conta excluída com sucesso! Até a próxima.");
                            break;
                        } else {
                            console.error("Erro ao excluir conta. Tente novamente.");
                        }
                    }

                }
            }


        }

        else {
            console.error("Email ou senha incorretos ou não registrados no sistema. Tente novamente.");
        }
    }
}

     
