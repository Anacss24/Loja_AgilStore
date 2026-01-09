const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

const DB_PATH = path.join(__dirname, '..', 'db.json');



function carregarDB() {
    if (!fs.existsSync(DB_PATH)) {
        return [];
    } else {
        const dados = fs.readFileSync(DB_PATH, 'utf-8');
        return dados ? JSON.parse(dados) : [];
    }
}

function salvarDB(dados) {
    const dadosConvertidos = JSON.stringify(dados, null, 2);
    fs.writeFileSync(DB_PATH, dadosConvertidos);
}

function gerarId(produtos) {
    if (produtos.length === 0) return 1;
    return produtos[produtos.length - 1].id + 1;
}



function adicionarProduto(nomeProduto, categoria, quantidade, preco) {
    const produtos = carregarDB();

    const quantidadeProduto = Number(quantidade);
    const precoProduto = Number(preco);

    const novoProduto = {
        id: gerarId(produtos),
        nomeProduto: nomeProduto,
        categoria: categoria,
        quantidade: quantidadeProduto,
        preco: precoProduto
    };

    produtos.push(novoProduto);
    salvarDB(produtos);
    console.log(`\nSucesso: Produto "${nomeProduto}" adicionado!`);
}

function listarProdutos() {
    const produtos = carregarDB();

    console.log("\n--- LISTA DE PRODUTOS ---");
    if (produtos.length === 0) {
        console.log("Não tem nenhum produto cadastrado.");
    } else {
        console.table(produtos);
    }
}

function atualizarProduto(id) {
    const produtos = carregarDB();
    const produtoEncontrado = produtos.find(p => p.id === Number(id));

    if (!produtoEncontrado) {
        console.log(`Erro: Produto com ID ${id} não foi encontrado.`);
        return;
    }

    console.log(`\nProduto encontrado: ${produtoEncontrado.nomeProduto}`);

    while (true) {
        console.log(`
        Qual campo deseja atualizar?
        1. Nome
        2. Categoria
        3. Quantidade
        4. Preço
        5. Salvar e Sair
        `);
        
        const opcao = prompt("Escolha uma opção: ");

        if (opcao === '1') {
            const nomeAtualizado = prompt("Novo Nome: ");
            produtoEncontrado.nomeProduto = nomeAtualizado;
        } else if (opcao === '2') {
            const categoriaAtualizada = prompt("Nova Categoria: ");
            produtoEncontrado.categoria = categoriaAtualizada;
        } else if (opcao === '3') {
            const quantidadeAtualizada = Number(prompt("Nova Quantidade: "));
            produtoEncontrado.quantidade = quantidadeAtualizada;
        } else if (opcao === '4') {
            const precoAtualizado = Number(prompt("Novo Preço: "));
            produtoEncontrado.preco = precoAtualizado;
        } else if (opcao === '5') {
            break;
        } else {
            console.log("Opção inválida, tente novamente.");
        }
    }

    salvarDB(produtos);
    console.log("Produto atualizado com sucesso!");
}

function excluirProduto(id) {
    const produtos = carregarDB();
   
    const indexProduto = produtos.findIndex(p => p.id === Number(id));

    if (indexProduto === -1) {
        console.log(`Erro: Produto com ID ${id} não foi encontrado.`);
        return;
    } else {
        const produto = produtos[indexProduto];
        const confirmar = prompt(`Deseja confirmar a exclusão do produto "${produto.nomeProduto}"? (1 - Confirmar, 2 - Cancelar): `);

        if (confirmar === '1') {
            produtos.splice(indexProduto, 1); 
            salvarDB(produtos);
            console.log("Produto excluído com sucesso!");
        } else {
            console.log("Exclusão cancelada.");
            return;
        }
    }
}

function buscarProdutos() {
    const produtos = carregarDB();
    const buscar = prompt("Buscar por: 1 - Nome do produto, 2 - ID do produto: ");

    if (buscar === '1') {
        const buscarNome = prompt("Digite o nome do produto: ");
        const resultados = produtos.filter((produto) => 
            produto.nomeProduto.toLowerCase().includes(buscarNome.toLowerCase())
        );

        if (resultados.length > 0) {
            console.log(`\n-- Encontramos ${resultados.length} produto(s) --`);
            console.table(resultados);
        } else {
            console.log("\nErro: Nenhum produto encontrado com esse nome.");
        }

    } else if (buscar === '2') {
        const buscarId = Number(prompt("Digite o ID do produto: ")); 
        const resultadoId = produtos.find((produto) => produto.id === buscarId);

        if (resultadoId) {
            console.table(resultadoId);
        } else {
            console.log("\nErro: Nenhum produto encontrado com esse ID.");
        }

    } else {
        console.log("Opção inválida.");
    }
}



function menu() {
    while (true) {
        console.log("\n=== CONTROLE DE INVENTÁRIO AGILSTORE ===");
        console.log(" 1 - Adicionar um novo produto");
        console.log(" 2 - Listar todos os produtos");
        console.log(" 3 - Atualizar um produto");
        console.log(" 4 - Excluir um produto");
        console.log(" 5 - Buscar um produto específico");
        console.log(" 6 - Encerrar o sistema");

        let numero = Number(prompt("\nEscolha uma opção: "));

        switch (numero) {
            case 1:
                console.log("\n--- Cadastro de Produto ---");
                const nome = prompt("Nome do produto: ");
                const categoria = prompt("Categoria do produto: ");
                const quantidade = prompt("Quantidade: ");
                const preco = prompt("Preço: ");
                adicionarProduto(nome, categoria, quantidade, preco);
                break;
            case 2:
                listarProdutos();
                break;
            case 3:
                listarProdutos();
                const idAtualizar = prompt("Digite o ID do produto a ser atualizado: ");
                atualizarProduto(idAtualizar);
                break;
            case 4:
                listarProdutos();
                const idExcluir = prompt("Digite o ID do produto a ser excluído: ");
                excluirProduto(idExcluir);
                break;
            case 5:
                buscarProdutos();
                break;
            case 6:
                console.log("\n-- Encerrando o Controle de inventário AgilStore --");
                process.exit(); 
            default:
                console.log("Opção inválida! Tente novamente.");
                break;
        }
    }
}

menu();