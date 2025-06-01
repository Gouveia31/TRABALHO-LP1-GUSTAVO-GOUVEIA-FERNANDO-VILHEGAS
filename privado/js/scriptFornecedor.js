document.addEventListener("DOMContentLoaded", () => {
  const urlBase = 'http://localhost:4000/fornecedor';

  const formulario = document.getElementById("formCadFornecedor");
  let listaDeFornecedores = [];

  formulario.onsubmit = manipularSubmissao;

  function manipularSubmissao(evento) {
    evento.preventDefault();
    evento.stopPropagation();

    if (formulario.checkValidity()) {
      const cnpj = document.getElementById("cnpj").value;
      const nome = document.getElementById("nome").value;
      const uf = document.getElementById("uf").value;
      const cep = document.getElementById("cep").value;

      const fornecedor = { cnpj, nome, uf, cep };
      cadastrarFornecedor(fornecedor);

      formulario.reset();
      formulario.classList.remove("was-validated");
    } else {
      formulario.classList.add("was-validated");
    }
  }

  function mostrarTabelaFornecedores() {
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML = "";

    if (listaDeFornecedores.length === 0) {
      divTabela.innerHTML = "<p class='alert alert-info text-center'>Nenhum fornecedor cadastrado</p>";
    } else {
      const tabela = document.createElement("table");
      tabela.className = "table table-striped table-hover";

      const cabecalho = document.createElement("thead");
      const corpo = document.createElement("tbody");

      cabecalho.innerHTML = `
        <tr>
          <th>CNPJ</th>
          <th>Nome</th>
          <th>UF</th>
          <th>CEP</th>
          <th>Ações</th>
        </tr>
      `;

      tabela.appendChild(cabecalho);

      for (let i = 0; i < listaDeFornecedores.length; i++) {
        const linha = document.createElement("tr");
        linha.id = listaDeFornecedores[i].id;
        linha.innerHTML = `
          <td>${listaDeFornecedores[i].cnpj}</td>
          <td>${listaDeFornecedores[i].nome}</td>
          <td>${listaDeFornecedores[i].uf}</td>
          <td>${listaDeFornecedores[i].cep}</td>
          <td>
            <button type="button" class="btn btn-danger" onclick="excluirFornecedor('${listaDeFornecedores[i].id}')">
              Excluir
            </button>
          </td>
        `;
        corpo.appendChild(linha);
      }

      tabela.appendChild(corpo);
      divTabela.appendChild(tabela);
    }
  }

  function excluirFornecedor(id) {
    if (confirm("Deseja realmente excluir o fornecedor?")) {
      fetch(`${urlBase}/${id}`, {
        method: "DELETE"
      })
        .then(res => res.ok && res.json())
        .then(() => {
          listaDeFornecedores = listaDeFornecedores.filter(f => f.id !== id);
          document.getElementById(id)?.remove();
          alert("Fornecedor excluído!");
        })
        .catch(erro => alert("Erro ao excluir fornecedor: " + erro));
    }
  }

  function obterDadosFornecedores() {
    fetch(urlBase)
      .then(res => res.ok && res.json())
      .then(fornecedores => {
        listaDeFornecedores = fornecedores;
        mostrarTabelaFornecedores();
      })
      .catch(erro => alert("Erro ao buscar fornecedores: " + erro));
  }

  function cadastrarFornecedor(fornecedor) {
    fetch(urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fornecedor)
    })
      .then(res => res.ok && res.json())
      .then(dados => {
        alert(`Fornecedor cadastrado com sucesso! ID: ${dados.id}`);
        listaDeFornecedores.push(dados);
        mostrarTabelaFornecedores();
      })
      .catch(erro => alert("Erro ao cadastrar fornecedor: " + erro));
  }

  obterDadosFornecedores();
});
