const urlBase = 'http://localhost:4000/produto';

const formulario = document.getElementById("formCadProduto");
let listaDeProdutos = [];

if (localStorage.getItem("produtos")) {
    listaDeProdutos = JSON.parse(localStorage.getItem("produtos"));
}

formulario.onsubmit = manipularSubmissao;

function manipularSubmissao(evento) {
    const categorias = JSON.parse(localStorage.getItem("categorias") || "[]");

    if (categorias.length === 0) {
        alert("Você precisa cadastrar pelo menos uma categoria antes de cadastrar produtos.");
        evento.preventDefault();
        evento.stopPropagation();
        return;
    }

    const categoriaSelecionada = document.getElementById("categoria").value.trim();

    if (!categorias.includes(categoriaSelecionada)) {
        alert("A categoria selecionada não está cadastrada. Por favor, selecione uma categoria válida.");
        evento.preventDefault();
        evento.stopPropagation();
        return;
    }

    if (formulario.checkValidity()) {
        const codigo = document.getElementById("codigo").value;
        const nome = document.getElementById("nome").value;
        const preco = parseFloat(document.getElementById("preco").value);
        const quantidade = parseInt(document.getElementById("quantidade").value);
        const imagem = document.getElementById("imagem").value;

        const produto = { codigo, nome, categoria: categoriaSelecionada, preco, quantidade, imagem };

        cadastrarProduto(produto);
        formulario.reset();
        mostrarTabelaProdutos();
    } else {
        formulario.classList.add('was-validated');
    }

    evento.preventDefault();
    evento.stopPropagation();
}

function mostrarTabelaProdutos() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = "";

    if (listaDeProdutos.length === 0) {
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Não há produtos cadastrados</p>";
    } else {
        const tabela = document.createElement('table');
        tabela.className = "table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');

        cabecalho.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço (R$)</th>
                <th>Quantidade</th>
                <th>Imagem</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        for (let i = 0; i < listaDeProdutos.length; i++) {
            const linha = document.createElement('tr');
            linha.id = listaDeProdutos[i].id;
            linha.innerHTML = `
                <td>${listaDeProdutos[i].codigo}</td>
                <td>${listaDeProdutos[i].nome}</td>
                <td>${listaDeProdutos[i].categoria}</td>
                <td>${listaDeProdutos[i].preco.toFixed(2)}</td>
                <td>${listaDeProdutos[i].quantidade}</td>
                <td><img src="${listaDeProdutos[i].imagem}" style="max-width: 80px;"></td>
                <td><button type="button" class="btn btn-danger" onclick="excluirProduto('${listaDeProdutos[i].id}')">Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }

        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirProduto(id) {
    if (confirm("Deseja realmente excluir o produto " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        }).then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
        }).then((dados) => {
            alert("Produto excluído com sucesso!");
            listaDeProdutos = listaDeProdutos.filter((produto) => {
                return produto.id !== id;
            });
            document.getElementById(id)?.remove();
        }).catch((erro) => {
            alert("Não foi possível excluir o produto: " + erro);
        });
    }
}

function obterDadosProdutos() {
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok) {
            return resposta.json();
        }
    })
    .then((produtos) => {
        listaDeProdutos = produtos;
        mostrarTabelaProdutos();
    })
    .catch((erro) => {
        alert("Erro ao tentar recuperar produtos do servidor!");
    });
}

function cadastrarProduto(produto) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(produto)
    })
    .then((resposta) => {
        if (resposta.ok) {
            return resposta.json();
        }
    })
    .then((dados) => {
        alert(`Produto incluído com sucesso! ID: ${dados.id}`);
        listaDeProdutos.push(produto);
        mostrarTabelaProdutos();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar o produto: " + erro);
    });
}

function preencherSelectCategorias() {
    const select = document.getElementById("categoria");
    const categorias = JSON.parse(localStorage.getItem("categorias") || "[]");

    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    categorias.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
}

obterDadosProdutos();
preencherSelectCategorias();
