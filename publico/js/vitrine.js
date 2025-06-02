const urlBase = 'http://localhost:4000/produto';
const divVitrine = document.getElementById('vitrine');

function carregarVitrine() {
    fetch(urlBase)
        .then(res => res.json())
        .then(produtos => {
            if (produtos.length === 0) {
                divVitrine.innerHTML = `<p class="alert alert-info text-center">Nenhum produto disponível na vitrine.</p>`;
                return;
            }

            divVitrine.innerHTML = ""; 

            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'card p-2';

                card.innerHTML = `
                    <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${produto.nome}</h5>
                        <p class="card-text">${produto.categoria}</p>
                        <p class="card-text"><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
                        <p class="card-text">Qtd: ${produto.quantidade}</p>
                        <button class="btn btn-success m-1" onclick="comprarProduto('${produto.id}')">Comprar</button>
                        <button class="btn btn-primary m-1" onclick="adicionarAoCarrinho('${produto.id}')">Adicionar ao Carrinho</button>
                    </div>
                `;

                divVitrine.appendChild(card);
            });
        })
        .catch(erro => {
            divVitrine.innerHTML = `<p class="alert alert-danger text-center">Erro ao carregar a vitrine: ${erro}</p>`;
        });
}

function comprarProduto(id) {
    alert(`Produto ${id} comprado!`);
    
}

function adicionarAoCarrinho(id) {
    alert(`Produto ${id} adicionado ao carrinho!`);
    
}

carregarVitrine();
