const urlCategoria = "http://localhost:4000/categoria";

const formCategoria = document.getElementById("formCadCategoria");
let listaCategorias = [];

if (localStorage.getItem("categorias")) {
    listaCategorias = JSON.parse(localStorage.getItem("categorias"));
}

formCategoria.onsubmit = function (evento) {
    evento.preventDefault();
    evento.stopPropagation();

    if (formCategoria.checkValidity()) {
        const nomeCategoria = document.getElementById("nomeCategoria").value.trim();

        
        const jaExiste = listaCategorias.some(c => c.toLowerCase() === nomeCategoria.toLowerCase());

        if (jaExiste) {
            alert("Essa categoria já está cadastrada.");
        } else {
            listaCategorias.push(nomeCategoria);
            localStorage.setItem("categorias", JSON.stringify(listaCategorias));
            alert("Categoria cadastrada com sucesso!");
            formCategoria.reset();
            mostrarCategorias();
        }
    } else {
        formCategoria.classList.add('was-validated');
    }
};

function mostrarCategorias() {
    const divTabela = document.getElementById("tabelaCategoria");
    divTabela.innerHTML = "";

    if (listaCategorias.length === 0) {
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Nenhuma categoria cadastrada.</p>";
    } else {
        const tabela = document.createElement("table");
        tabela.className = "table table-bordered table-hover";

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Nome da Categoria</th>
                <th>Ações</th>
            </tr>
        `;

        const tbody = document.createElement("tbody");

        listaCategorias.forEach((nome, index) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${nome}</td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirCategoria(${index})">Excluir</button></td>
            `;
            tbody.appendChild(linha);
        });

        tabela.appendChild(thead);
        tabela.appendChild(tbody);
        divTabela.appendChild(tabela);
    }
}

function excluirCategoria(index) {
    if (confirm(`Deseja excluir a categoria "${listaCategorias[index]}"?`)) {
        listaCategorias.splice(index, 1);
        localStorage.setItem("categorias", JSON.stringify(listaCategorias));
        mostrarCategorias();
    }
}


mostrarCategorias();

