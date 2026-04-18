// const API_URL = "http://127.0.0.1:3000"; // Comente a local
const API_URL = "https://raizes-backend.onrender.com"; // Coloque o link do Render
let carrinho = [];

// 1. Função principal para trocar de telas
function showSection(section) {
    const dash = document.getElementById('section-dash');
    const vendas = document.getElementById('section-vendas');
    const estoque = document.getElementById('section-estoque');
    const relatorios = document.getElementById('section-relatorios'); // Novo elemento
    const title = document.getElementById('main-title');

    // Esconde todas as seções
    if (dash) dash.style.display = 'none';
    if (vendas) vendas.style.display = 'none';
    if (estoque) estoque.style.display = 'none';
    if (relatorios) relatorios.style.display = 'none';

    if (section === 'dash') {
        dash.style.display = 'block';
        title.innerText = "Bem-vindo, Bruno! 👋";
        atualizarDashboard(); 
    } else if (section === 'vendas') {
        vendas.style.display = 'block';
        title.innerText = "Registrar Venda 🛒";
        carregarProdutosNoSelect();
    } else if (section === 'estoque') {
        estoque.style.display = 'block';
        title.innerText = "Gestão de Estoque 📦";
        carregarTelaEstoque();
    } else if (section === 'relatorios') {
        relatorios.style.display = 'block';
        title.innerText = "Histórico de Vendas 📊";
        carregarHistoricoVendas(); 
    }
}

// 2. Atualiza os números do Dashboard
async function atualizarDashboard() {
    try {
        const response = await fetch(`${API_URL}/reports/dashboard`);
        const data = await response.json();
        document.getElementById('faturamento').innerText = `R$ ${Number(data.faturamento || 0).toFixed(2)}`;
        document.getElementById('qtd-pedidos').innerText = data.qtd_pedidos || 0;
        const statusServer = document.getElementById('status-server');
        statusServer.innerText = "● API Online";
        statusServer.style.color = "#8ebf42";
    } catch (error) {
        console.error("Erro no dashboard:", error);
        const statusServer = document.getElementById('status-server');
        statusServer.innerText = "○ API Offline";
        statusServer.style.color = "#ff4444";
    }
}

// 3. Funções de Estoque e Produtos
async function carregarTelaEstoque() {
    try {
        const response = await fetch(`${API_URL}/stock`); 
        const estoque = await response.json();
        const tbody = document.getElementById('tabela-estoque-body');
        tbody.innerHTML = '';

        estoque.forEach(item => {
            const corStatus = item.quantidade > 0 ? '#8ebf42' : '#ff4444';
            const statusTexto = item.quantidade > 0 ? 'Em estoque' : 'Esgotado';

            tbody.innerHTML += `
                <tr style="border-bottom: 1px solid #333;">
                    <td style="padding: 12px;">${item.produto_nome}</td>
                    <td style="text-align: center; font-weight: bold; color: ${corStatus}">${item.quantidade}</td>
                    <td style="text-align: right;">R$ ${Number(item.preco).toFixed(2)}</td>
                    <td style="text-align: center;">
                        <span style="color: ${corStatus}">${statusTexto}</span>
                    </td>
                    <td style="text-align: center;">
                        <button class="btn-secundario" 
                                style="padding: 5px 10px; font-size: 12px; margin: 0;" 
                                onclick="abrirModalEstoque(${item.produto_id}, '${item.produto_nome}')">
                            + Add
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
    }
}

// Funções de Histórico de Vendas
async function carregarHistoricoVendas() {
    try {
        const response = await fetch(`${API_URL}/orders`); 
        const vendas = await response.json();
        const tbody = document.getElementById('tabela-vendas-body');
        tbody.innerHTML = '';

        vendas.forEach(venda => {
            // Tenta pegar 'created_at' ou 'data_pedido'. Se for nulo, usa a data de agora.
            const rawDate = venda.created_at || venda.data_pedido || new Date();
            const dataObj = new Date(rawDate);
            
            // Verifica se a data é válida antes de formatar
            const dataFormatada = isNaN(dataObj) 
                ? "Data Indisponível" 
                : dataObj.toLocaleString('pt-BR');

            tbody.innerHTML += `
                <tr style="border-bottom: 1px solid #333;">
                    <td style="padding: 12px;">#${venda.id}</td>
                    <td>${dataFormatada}</td>
                    <td style="text-align: right; font-weight: bold; color: #8ebf42;">R$ ${Number(venda.total).toFixed(2)}</td>
                    <td style="text-align: center;">
                        <button class="btn-secundario" style="padding: 5px 10px; font-size: 11px;" onclick="verDetalhesVenda(${venda.id})">
                            Ver Detalhes
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
}

async function verDetalhesVenda(pedidoId) {
    console.log("Buscando detalhes do pedido:", pedidoId);
    try {
        // Mudamos a rota para bater exatamente com o que o Express espera agora
        const response = await fetch(`${API_URL}/orders/${pedidoId}/items`);
        
        if (!response.ok) {
            throw new Error(`Erro na rota: ${response.status}`);
        }

        const itens = await response.json();
        console.log("Itens recebidos:", itens);

        if (!itens || itens.length === 0) {
            alert("Venda realizada, mas os detalhes dos produtos não foram encontrados no banco.");
            return;
        }

        const lista = document.getElementById('lista-detalhes-itens');
        const totalSpan = document.getElementById('detalhe-total');
        
        document.getElementById('detalhe-titulo').innerText = `Pedido #${pedidoId}`;
        lista.innerHTML = '';
        let somaTotal = 0;

        itens.forEach(item => {
            // Aceita 'produto' ou 'produto_nome' conforme o seu SQL
            const nome = item.produto || item.produto_nome || "Produto";
            const subtotal = item.quantidade * item.preco_unitario;
            somaTotal += subtotal;
            
            lista.innerHTML += `
                <li style="padding:10px 0; border-bottom:1px solid #444; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-weight:bold; color:#fff;">${nome}</span>
                        <span style="font-size:12px; color:#aaa;">Qtd: ${item.quantidade} x R$ ${Number(item.preco_unitario).toFixed(2)}</span>
                    </div>
                    <span style="font-weight:bold; color:#8ebf42;">R$ ${subtotal.toFixed(2)}</span>
                </li>
            `;
        });

        totalSpan.innerText = `R$ ${somaTotal.toFixed(2)}`;
        document.getElementById('modal-detalhes').style.display = 'flex';

    } catch (error) {
        console.error("Erro detalhado:", error);
        alert("Ops! Não conseguimos buscar os itens desse pedido. Tente fazer uma nova venda para testar.");
    }
}

function fecharModalDetalhes() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

// Funções do Modal de Entrada de Estoque
function abrirModalEstoque(id, nome) {
    document.getElementById('add-estoque-id').value = id;
    document.getElementById('modal-estoque-titulo').innerText = `Abastecer: ${nome}`;
    document.getElementById('add-estoque-qtd').value = 1;
    document.getElementById('modal-estoque').style.display = 'flex';
}

function fecharModalEstoque() {
    document.getElementById('modal-estoque').style.display = 'none';
}

async function processarEntradaEstoque() {
    const produto_id = document.getElementById('add-estoque-id').value;
    const quantidade = document.getElementById('add-estoque-qtd').value;
    if (!quantidade || quantidade <= 0) return alert("Digite uma quantidade válida!");

    const dados = {
        unidade_id: 1, 
        produto_id: parseInt(produto_id),
        quantidade: parseInt(quantidade)
    };

    try {
        const response = await fetch(`${API_URL}/stock/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (response.ok) {
            fecharModalEstoque();
            await carregarTelaEstoque();
        }
    } catch (error) {
        console.error("Erro ao adicionar estoque:", error);
    }
}

// Funções do Modal de Cadastro
function abrirModalProduto() {
    document.getElementById('modal-produto').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-produto').style.display = 'none';
}

async function salvarNovoProduto() {
    const nome = document.getElementById('new-nome').value;
    const preco = document.getElementById('new-preco').value;
    const categoria = document.getElementById('new-categoria').value;
    if (!nome || !preco) return alert("Preencha nome e preço!");

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco, categoria })
        });
        if (response.ok) {
            alert("Produto cadastrado com sucesso! 🌵");
            fecharModal();
            carregarTelaEstoque();
        }
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
    }
}

// 4. Funções de Venda
async function carregarProdutosNoSelect() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const produtos = await response.json();
        const select = document.getElementById('select-produto');
        select.innerHTML = produtos.map(p => 
            `<option value="${p.id}" data-preco="${p.preco}">${p.nome} - R$ ${Number(p.preco).toFixed(2)}</option>`
        ).join('');
    } catch (error) {
        console.error("Erro ao carregar produtos no select:", error);
    }
}

function adicionarAoCarrinho() {
    const select = document.getElementById('select-produto');
    const qtd = parseInt(document.getElementById('qtd-produto').value);
    const selectedOption = select.options[select.selectedIndex];
    if (!selectedOption) return alert("Selecione um produto!");
    const nome = selectedOption.text.split(' - ')[0];
    const preco = parseFloat(selectedOption.getAttribute('data-preco'));
    const produto_id = parseInt(select.value);
    carrinho.push({ produto_id, nome, qtd, preco_unitario: preco });
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const totalSpan = document.getElementById('total-venda');
    
    
    lista.innerHTML = carrinho.map((item, index) => `
        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; background: #262626; padding: 8px; border-radius: 5px;">
            <span>${item.qtd}x ${item.nome}</span>
            <span style="color: #ff4444; cursor: pointer; font-weight: bold; padding: 0 10px;" 
                  onclick="removerDoCarrinho(${index})" 
                  title="Remover item">
                X
            </span>
        </li>
    `).join('');

    const total = carrinho.reduce((sum, item) => sum + (item.preco_unitario * item.qtd), 0);
    totalSpan.innerText = total.toFixed(2);
}
function removerDoCarrinho(index) {
    // Remove 1 elemento na posição do index
    carrinho.splice(index, 1);
    
    // Atualiza a lista visual e o valor total
    renderizarCarrinho();
}
async function finalizarVendaCompleta() {
    if (carrinho.length === 0) return alert("Adicione itens!");
    const dadosPedido = {
        usuario_id: 1, 
        unidade_id: 1,
        total: parseFloat(document.getElementById('total-venda').innerText),
        itens: carrinho 
    };
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPedido)
    });
    if (response.ok) {
        alert("Venda Realizada!");
        carrinho = [];
        renderizarCarrinho();
        showSection('dash');
    }
}

// Inicialização
atualizarDashboard();
