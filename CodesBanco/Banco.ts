//Resenha Pay - Banco Digital Versão 1.0.1
///<reference types="node" />
import * as fs from 'fs';
import { get } from 'http';
let sairCadastro = false;

//classe para cadastrar conta, os dados da conta são salvos em um arquivo json, para isso é necessário ler o arquivo json,
//adicionar os dados da nova conta e depois escrever o arquivo json atualizado.
class CadastrarConta {
    private nome: string = "";
    private email: string = "";
    private telefone: string = "";
    private cpf: string = "";
    private senha: string = "";
    private confirmarSenha: string = "";
    private dadosConta: Array<{ getNome: string, getEmail: string, getTelefone: string, getCpf: string, getSenha: string, getSaldo: number, getnumeroConta: string }> = [];
    private saldo: number = 0;
    private numeroConta: string = "";

    //formata o telefone e cpf para o formato brasileiro e depois salva os dados da conta em um arquivo json
    constructor(nome: string, email: string, telefone: string, cpf: string, senha: string, confirmarSenha: string) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cpf = cpf;
        this.senha = senha;
        this.confirmarSenha = confirmarSenha;
        this.saldo = 0;
        this.numeroConta = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');



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
            getSenha: this.senha,
            getSaldo: this.saldo,
            getnumeroConta: this.numeroConta
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
    public getSaldo(): number {
        return this.saldo;
    }
    public getNumeroConta(): string {
        return this.numeroConta;
    }
}


//funcoes de testes
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

// funcoes de acao
function depositarValor(saldo: number, valor: number, numeroConta: string): number {
    let dignumeroConta = ""
    dignumeroConta = prompt("Digite o número da conta para depósito:")!;
    if (dignumeroConta.trim() === "") {
        console.error("O número da conta não pode ser vazio.");
        return saldo;
    }
    if (!/^\d{9}$/.test(dignumeroConta)) {
        console.error("Número da conta deve conter exatamente 9 dígitos.");
        return saldo;
    }
    fs.existsSync('dadosContas.json');
    const dadosExistentes = fs.readFileSync('dadosContas.json', 'utf-8');
    const contas = JSON.parse(dadosExistentes);
    const contaEncontrada = contas.find((conta: { getNumeroConta: string; }) => conta.getNumeroConta === dignumeroConta);
    if (contaEncontrada) {
        console.error("Número da conta não encontrado. Tente novamente.");
        return saldo;
    }
    if (valor <= 0) {
        console.error("Valor de depósito deve ser maior que zero.");
        return saldo;
    }
    return saldo + valor;
}


//menu principal do app
let contador: number = 9999;
while (contador !== null && !sairCadastro) {
    console.log("------------------------------------------------");
    console.log("Bem-vindo ao Resenha Pay!");
    console.log("------------------------------------------------");
    console.log("1. Criar Conta");
    console.log("------------------------------------------------");
    console.log("2. Fazer Login");
    console.log("------------------------------------------------");
    console.log("3. Esqueci minha senha"); //falta fazer a função de esqueci minha senha, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a recuperação da senha da conta.
    console.log("------------------------------------------------");
    console.log("0. Sair do app");
    console.log("------------------------------------------------");
    contador = Number(prompt("Digite a opção desejada:")!);

    //validação da opção escolhida
    if (contador === 0) {
        console.log("Obrigado por usar o Resenha Pay! Até a próxima.");
        break;
    }

    if (contador === 1 && sairCadastro === false) {
        console.log("Vamos começar o processo de criação da sua conta! Por favor, preencha os dados solicitados abaixo:");
        console.log("ou digite 0 para voltar ao menu principal");
        const nome = prompt("Digite seu nome:")!;
        if (nome === "0") {
            continue;
        }
        if (nome.trim() === "") {
            console.error("O nome não pode ser vazio.");
            continue;
        }

        let email = prompt("Digite seu email:")!;
        if (email === "0") {
            continue;
        }

        while (email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {


            if (email.trim() === "") {
                console.error("O email não pode ser vazio.");
            } else {
                console.error("Email deve ser válido.");
            }
            email = prompt("Digite seu email:")!;
            if (email === "0") {
                break;
            }
        }
        if (email === "0") {
            continue;
        }

        let telefone = prompt("Digite seu telefone:")!;
        if (telefone === "0") {
            continue;
        }
        while (telefone.trim() === "" || /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone)) {


            if (telefone.trim() === "") {
                console.error("O telefone não pode ser vazio.");
            } else {
                console.error("Telefone deve estar no formato (XX) XXXXX-XXXX.");
            }
            telefone = prompt("Digite seu telefone:")!;
            if (telefone === "0") {
                break;
            }
        }
        if (telefone === "0") {
            continue;
        }

        let cpf = prompt("Digite seu CPF:")!;
        if (cpf === "0") {
            continue;
        }
        while (cpf.trim() === "" || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {

            if (cpf.trim() === "") {
                console.error("O CPF não pode ser vazio.");
            } else {
                console.error("CPF deve estar no formato XXX.XXX.XXX-XX.");
            }
            cpf = prompt("Digite seu CPF:")!;
            if (cpf === "0") {
                break;
            }
        }
        if (cpf === "0") {
            continue;
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

        //verifica se o email, cpf ou telefone já estão registrados no sistema, para isso é necessário ler o arquivo json e comparar os dados com os dados do cadastro.
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

        const Conta1 = new CadastrarConta(nome, email, telefone, cpf, senha, confirmarSenha,);

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

        //apartir da conta logada, mostrar o menu de opções para o usuário, para isso é necessário comparar os dados de login com os dados armazenados no arquivo json, para depois mostrar o menu de opções para o usuário.
        const contaEncontrada = contas.find((conta: { getEmail: string; getSenha: string; }) => conta.getEmail === emailLogin && conta.getSenha === senhaLogin);

        if (contaEncontrada) {
            console.log("Login bem-sucedido! Bem-vindo, " + contaEncontrada.getNome + "!")
            while (contador !== null) {
                console.log("1. fazer uma transferência"); //falta fazer a função de transferência, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a transferência entre as contas.
                console.log("------------------------------------------------");
                console.log("2. Verificar saldo"); //falta fazer a função de verificar saldo, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o saldo da conta.
                console.log("------------------------------------------------");
                console.log("3. Consultar numero da conta");//ainda nao definido mas //falta fazer a função de consultar numero da conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o numero da conta.
                console.log("------------------------------------------------");
                console.log("4. extrato"); //falta fazer a função de extrato, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o extrato da conta.
                console.log("------------------------------------------------");
                console.log("5. Fazer um depósito"); //falta fazer a função de depósito, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar o depósito na conta.
                console.log("------------------------------------------------");
                console.log("6. Fazer um saque"); // falta fazer a função de saque, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar o saque na conta.
                console.log("------------------------------------------------");
                console.log("7. Atualizar dados da conta"); //falta fazer a função de atualizar dados da conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a atualização dos dados da conta.
                console.log("------------------------------------------------");
                console.log("8. Excluir conta");
                console.log("------------------------------------------------");
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
                if (contador === 5) {
                    let valorDeposito = Number(prompt("Digite o valor do depósito:")!);
                    while (isNaN(valorDeposito) || valorDeposito <= 0) {
                        console.error("Valor de depósito deve ser um número maior que zero. Tente novamente.");
                        valorDeposito = Number(prompt("Digite o valor do depósito:")!);
                    }
                    const novoSaldo = depositarValor(contaEncontrada.getSaldo, valorDeposito, contaEncontrada.getNumeroConta);
                    contaEncontrada.getSaldo = novoSaldo;
                    fs.writeFileSync('dadosContas.json', JSON.stringify(contas, null, 2));
                    console.log("Depósito realizado com sucesso! Novo saldo: R$ " + novoSaldo.toFixed(2));

                }

                if (contador === 2) {
                    console.log("Seu saldo atual é: R$ " + contaEncontrada.getSaldo.toFixed(2));
                }
                if (contador === 3) {
                    console.log("O número da sua conta é: " + contaEncontrada.getNumeroConta);
                }
            }


        }

        else {
            console.error("Email ou senha incorretos ou não registrados no sistema. Tente novamente.");
        }
    }
    if (contador === 3) {
        console.log("Para recuperar sua senha, preciso que você me informe o email cadastrado na sua conta.");
        console.log("------------------------------------------------");
        console.log("preciso que você me informe também o número do telefone cadastrado na sua conta para confirmar sua identidade.");
        console.log("------------------------------------------------");
        console.log("preciso também que você me informe o CPF cadastrado na sua conta para confirmar sua identidade.");
        console.log("------------------------------------------------");
        console.log("e por fim, preciso que você me informe o numero da conta cadastrado na sua conta para confirmar sua identidade.");
        console.log("------------------------------------------------");
        console.log("Após confirmar sua identidade, você poderá criar uma nova senha para sua conta.");
        console.log("------------------------------------------------");
        console.log("ou digite 0 para voltar ao menu principal");

        let emailRecuperacao = prompt("Digite seu email para recuperação de senha:")!;
        if (emailRecuperacao === "0") {
            continue;
        }
        while (!testeEmail(emailRecuperacao)) {
            console.error("Email inválido. Tente novamente.");
            emailRecuperacao = prompt("Digite seu email para recuperação de senha:")!;
            if (emailRecuperacao === "0") {
                break;
            }
        }
        if (emailRecuperacao === "0") {
            continue;
        }

        let telefoneRecuperacao = prompt("Digite seu telefone para recuperação de senha:")!;
        if (telefoneRecuperacao === "0") {
            continue;
        }
        while (telefoneRecuperacao.trim() === "" || /^\(\d{2}\) \d{5}-\d{4}$/.test(telefoneRecuperacao)) {


            if (telefoneRecuperacao.trim() === "") {
                console.error("O telefone não pode ser vazio.");
            } else {
                console.error("Telefone deve estar no formato (XX) XXXXX-XXXX.");
            }
            telefoneRecuperacao = prompt("Digite seu telefone para recuperação de senha:")!;
            telefoneRecuperacao = telefoneRecuperacao.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
            if (telefoneRecuperacao === "0") {
                break;
            }
        }
        if (telefoneRecuperacao === "0") {
            continue;
        }

        let cpfRecuperacao = prompt("Digite seu CPF para recuperação de senha:")!;
        if (cpfRecuperacao === "0") {
            continue;
        }
        while (cpfRecuperacao.trim() === "" || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpfRecuperacao)) {

            if (cpfRecuperacao.trim() === "") {
                console.error("O CPF não pode ser vazio.");
            } else {
                console.error("CPF deve estar no formato XXX.XXX.XXX-XX.");
            }
            cpfRecuperacao = prompt("Digite seu CPF para recuperação de senha:")!;
            cpfRecuperacao = cpfRecuperacao.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{2})/, '$1-$2');
            if (cpfRecuperacao === "0") {
                break;
            }
        }
        if (cpfRecuperacao === "0") {
            continue;
        }

        let numeroContaRecuperacao = prompt("Digite seu número da conta para recuperação de senha:")!;
        if (numeroContaRecuperacao === "0") {
            continue;
        }
        while (numeroContaRecuperacao.trim() === "" || !/^\d{9}$/.test(numeroContaRecuperacao)) {
            if (numeroContaRecuperacao.trim() === "") {
                console.error("O número da conta não pode ser vazio.");
            } else {
                console.error("Número da conta deve conter exatamente 9 dígitos.");
            }
            numeroContaRecuperacao = prompt("Digite seu número da conta para recuperação de senha:")!;
            if (numeroContaRecuperacao === "0") {
                break;
            }
        }
        if (numeroContaRecuperacao === "0") {
            continue;
        }

        const dadosExistentes = fs.readFileSync('dadosContas.json', 'utf-8');
        const contas = JSON.parse(dadosExistentes);
        const contaEncontrada = contas.find((conta: { getEmail: string; getTelefone: string; getCpf: string; getNumeroConta: string; }) => conta.getEmail === emailRecuperacao && conta.getTelefone === telefoneRecuperacao && conta.getCpf === cpfRecuperacao && conta.getNumeroConta === numeroContaRecuperacao);

        if (contaEncontrada) {
            console.log("Identidade confirmada! Você pode criar uma nova senha para sua conta.");
            let novaSenha = prompt("Digite sua nova senha:")!;
            while (novaSenha.trim() === "" || novaSenha.length < 8 || !/\d/.test(novaSenha) || !/[A-Z]/.test(novaSenha) || !/[a-z]/.test(novaSenha) || novaSenha.includes(" ")) {
                if (novaSenha.trim() === "") {
                    console.error("A senha não pode ser vazia.");
                } else {
                    console.error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números, e não pode conter espaços em branco.");
                }
                novaSenha = prompt("Digite sua nova senha:")!;
            }
            contaEncontrada.getSenha = novaSenha;
            fs.writeFileSync('dadosContas.json', JSON.stringify(contas, null, 2));
            console.log("Senha atualizada com sucesso! Você já pode fazer login com sua nova senha.");
        } else {
            console.error("Dados fornecidos não correspondem a nenhuma conta registrada. Tente novamente.");
        }


    }
}

//falta a transferencia, extrato, saque, atual. dados, algumas funcoes melhorias e o consultar numero que esta dando undefined e a parte de esqueci a senha que nao funciona direito
//se mecher me avise




