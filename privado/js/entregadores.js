const urlEntregador = "http://localhost:4000/entregador";

const formulario = document.getElementById("formCadEntregador");
let listaDeEntregadores = [];

formulario.onsubmit = manipularSubmissao;

function manipularSubmissao(evento) {
    evento.preventDefault();
    evento.stopPropagation();

    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        return;
    }

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const veiculo = document.getElementById("veiculo").value;

    const entregador = { nome, cpf, veiculo };
    cadastrarEntregador(entregador);

    formulario.reset();
    formulario.classList.remove('was-validated');
}

function mostrarTabelaEntregadores() {
    const divTabela = document.getElementById("tabelaEntregadores");
    divTabela.innerHTML = "";

    if (listaDeEntregadores.length === 0) {
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Nenhum entregador cadastrado</p>";
    } else {
        const tabela = document.createElement("table");
        tabela.className = "table table-striped table-hover";

        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Veículo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${listaDeEntregadores.map(ent => `
                    <tr id="ent-${ent.id}">
                        <td>${ent.nome}</td>
                        <td>${ent.cpf}</td>
                        <td>${ent.veiculo}</td>
                        <td>
                            <button class="btn btn-danger" onclick="excluirEntregador(${ent.id})">Excluir</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        `;

        divTabela.appendChild(tabela);
    }
}

function obterEntregadores() {
    fetch(urlEntregador)
        .then(res => res.json())
        .then(data => {
            listaDeEntregadores = data;
            mostrarTabelaEntregadores();
        })
        .catch(err => alert("Erro ao carregar entregadores: " + err));
}

function cadastrarEntregador(entregador) {
    fetch(urlEntregador, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entregador)
    })
    .then(res => res.json())
    .then(data => {
        alert(`Entregador cadastrado com sucesso! ID: ${data.id}`);
        listaDeEntregadores.push(data);
        mostrarTabelaEntregadores();
    })
    .catch(err => alert("Erro ao cadastrar entregador: " + err));
}

function excluirEntregador(id) {
    if (confirm("Deseja realmente excluir este entregador?")) {
        fetch(`${urlEntregador}/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            alert("Entregador excluído com sucesso!");
            listaDeEntregadores = listaDeEntregadores.filter(e => e.id !== id);
            document.getElementById(`ent-${id}`)?.remove();
        })
        .catch(err => alert("Erro ao excluir entregador: " + err));
    }
}

obterEntregadores();
