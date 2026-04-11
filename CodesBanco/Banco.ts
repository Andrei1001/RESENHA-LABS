

class CadastrarConta{
    private nome: string = "";
    private email: string = "";
    private telefone: string = "";
    private cpf: string = "";
    private senha: string = "";
    private confirmarSenha: string = "";

    constructor(nome: string, email: string, telefone: string, cpf: string, senha: string, confirmarSenha: string) {
        this.telefone = this.telefone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2' );
        this.cpf = this.cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{2})/, '$1-$2');

        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cpf = cpf;
        this.senha = senha;
        this.confirmarSenha = confirmarSenha;

        
    }

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


let contador: number = 9999;
    while (contador !== null) {
    console.log("Bem-vindo ao Resenha Pay!");
    console.log("1. Criar Conta");
    console.log("2. Fazer Login"); //falta fazer a função de login, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array.
    console.log("3. fazer uma transferência"); //falta fazer a função de transferência, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a transferência entre as contas.
    console.log("4. Verificar saldo"); //falta fazer a função de verificar saldo, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o saldo da conta.
    console.log("5. extrato"); //falta fazer a função de extrato, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o extrato da conta.
    console.log("6.Fazer um depósito"); //falta fazer a função de depósito, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar o depósito na conta.
    console.log("7. Fazer um saque"); // falta fazer a função de saque, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar o saque na conta.
    console.log("8. Esqueci minha senha"); //falta fazer a função de esqueci minha senha, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a recuperação da senha da conta.
    console.log("9. Logout"); //falta fazer a função de sair da conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar o logout da conta.
    console.log("10. Excluir conta"); //falta fazer a função de excluir conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a exclusão da conta.
    console.log("11. Atualizar dados da conta"); //falta fazer a função de atualizar dados da conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois realizar a atualização dos dados da conta.
    console.log("12. Consultar numero da conta");//ainda nao definido mas //falta fazer a função de consultar numero da conta, para isso é necessário criar um array para armazenar as contas criadas e depois comparar os dados de login com os dados armazenados no array, para depois mostrar o numero da conta.
    console.log("0. Sair do app"); 
    contador = Number(prompt("Digite a opção desejada:")!);

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
        
        const email = prompt("Digite seu email:")!;
        if (email.trim() === "") {
            console.error("O email não pode ser vazio.");
            continue;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.error("Email deve ser válido.");
            continue;
        }
        const telefone = prompt("Digite seu telefone:")!;
        if (telefone.trim() === "") {
            console.error("O telefone não pode ser vazio.");
            continue;
        }
        if(telefone.length === 15 && !/^\(\d{2}\) \d{5}-\d{4}$/.test(telefone)) {
            console.error("Telefone deve estar no formato (XX) XXXXX-XXXX.");
            continue;
        }

        const cpf = prompt("Digite seu CPF:")!;
            if (cpf.trim() === "") {
                console.error("O CPF não pode ser vazio.");
                continue;
            }
            if(cpf.length === 14 && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
                console.error("CPF deve estar no formato XXX.XXX.XXX-XX.");
                continue;
            }

        const senha = prompt("Digite sua senha:")!;
        if (senha.trim() === "") {
            console.error("A senha não pode ser vazia.");
            continue;
        }
        if(senha.length < 8 || !/\d/.test(senha) || !/[A-Z]/.test(senha) || !/[a-z]/.test(senha) || senha.includes(" ")) {
            console.error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números, e não pode conter espaços em branco.");
            continue;
        }
        const confirmarSenha = prompt("Confirme sua senha:")!;
            if (confirmarSenha.trim() === "") {
                console.error("A confirmação da senha não pode ser vazia.");
                continue;
            }
                if (senha !== confirmarSenha) {
                    console.error("As senhas não coincidem.");
                    continue;
                }

        

        const Conta1 = new CadastrarConta(nome, email, telefone, cpf, senha, confirmarSenha);

  console.log("Conta criada com sucesso!");
  console.log(nome)
  console.log(email)
  console.log(telefone)
  console.log(cpf)
  console.log(senha)
  console.log(confirmarSenha)

        break;
    }
}