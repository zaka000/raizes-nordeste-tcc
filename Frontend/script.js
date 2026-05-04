const API_URL = "https://raizes-nordeste-tcc.onrender.com"; 
let carrinho = [];

// 1. Função principal para trocar de telas
function showSection(section) {
    const dash = document.getElementById('section-dash');
    const vendas = document.getElementById('section-vendas');
    const estoque = document.getElementById('section-estoque');
    const relatorios = document.getElementById('section-relatorios'); 
    const title = document.getElementById('main-title');

    if (dash) dash.style.display = 'none';
    if (vendas) vendas.style.display = 'none';
    if (estoque) estoque.style.display = 'none';
    if (relatorios) relatorios.style.display = 'none';

    if (section === 'dash') {
        if (dash) dash.style.display = 'block';
        if (title) title.innerText = "Bem-vindo, Samuel! 👋";
        atualizarDashboard(); 
    } else if (section === 'vendas') {
        if (vendas) vendas.style.display = 'block';
        if (title) title.innerText = "Registrar Venda 🛒";
        carregarProdutosNoSelect();
    } else if (section === 'estoque') {
        if (estoque) estoque.style.display = 'block';
        if (title) title.innerText = "Gestão de Estoque 📦";
        carregarTelaEstoque();
    } else if (section === 'relatorios') {
        if (relatorios) relatorios.style.display = 'block';
        if (title) title.innerText = "Histórico de Vendas 📊";
        carregarHistoricoVendas(); 
    }
}

// 2. Atualiza os números do Dashboard
async function atualizarDashboard() {
    try {
        const response = await fetch(`${API_URL}/reports/dashboard`);
        if (!response.ok) throw new Error("Erro na API");
        
        const data = await response.json();
        const fatElement = document.getElementById('faturamento');
        const pedElement = document.getElementById('qtd-pedidos');
        const statusServer = document.getElementById('status-server');

        if (fatElement) fatElement.innerText = `R$ ${Number(data.faturamento || 0).toFixed(2)}`;
        if (pedElement) pedElement.innerText = data.qtd_pedidos || 0;
        
        if (statusServer) {
            statusServer.innerText = "● API Online";
            statusServer.style.color = "#8ebf42";
        }
    } catch (error) {
        console.error("Erro no dashboard:", error);
        const statusServer = document.getElementById('status-server');
        if (statusServer) {
            statusServer.innerText = "○ API Offline";
            statusServer.style.color = "#ff4444";
        }
    }
}

// 3. Funções de Estoque
async function carregarTelaEstoque() {
    try {
        const response = await fetch(`${API_URL}/stock`);
        const estoque = await response.json();
        const tbody = document.getElementById('tabela-estoque-body');
        if (!tbody) return;
        
        tbody.innerHTML = ''; 

        estoque.forEach(item => {
            const corStatus = item.quantidade > 0 ? '#8ebf42' : '#ff4444';
            const statusTexto = item.quantidade > 0 ? 'Em estoque' : 'Esgotado';

            tbody.innerHTML += `
                <tr>
                    <td>${item.produto_nome}</td>
                    <td style="text-align: center; font-weight: bold; color: ${corStatus}">${item.quantidade}</td>
                    <td style="text-align: right;">R$ ${Number(item.preco).toFixed(2)}</td>
                    <td style="text-align: center; color: ${corStatus}">${statusTexto}</td>
                    <td style="text-align: center;">
                        <button class="btn-secundario" onclick="abrirModalEstoque(${item.produto_id}, '${item.produto_nome}')">+ Add</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
    }
}

// 4. Histórico de Vendas (Corrigido para evitar erro de JSON)
async function carregarHistoricoVendas() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) throw new Error("Erro ao buscar histórico");
        
        const vendas = await response.json();
        const tbody = document.getElementById('tabela-vendas-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!vendas || vendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhuma venda encontrada.</td></tr>';
            return;
        }

        vendas.forEach(venda => {
            const dataBruta = venda.created_at || venda.data_pedido || venda.data || new Date();
            const dataFormatada = new Date(dataBruta).toLocaleString('pt-BR');
            const total = Number(venda.total || 0).toFixed(2);

            tbody.innerHTML += `
                <tr>
                    <td>#${venda.id}</td>
                    <td>${dataFormatada}</td>
                    <td style="text-align: right; font-weight: bold; color: #8ebf42;">R$ ${total}</td>
                    <td style="text-align: center;">
                        <button class="btn-secundario" onclick="verDetalhesVenda(${venda.id})">Ver Detalhes</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        const tbody = document.getElementById('tabela-vendas-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Erro ao conectar com a API de vendas.</td></tr>';
    }
}

// 5. Detalhes da Venda 
async function verDetalhesVenda(pedidoId) {
    try {
        const response = await fetch(`${API_URL}/orders/itens/${pedidoId}`);
        if (!response.ok) throw new Error("Erro ao buscar detalhes");
        
        const itens = await response.json();
        const lista = document.getElementById('lista-detalhes-itens');
        const totalSpan = document.getElementById('detalhe-total');
        
        if (!lista) return;

        document.getElementById('detalhe-titulo').innerText = `Pedido #${pedidoId}`;
        lista.innerHTML = '';
        let somaTotal = 0;

        itens.forEach(item => {
            const nome = item.produto_nome || "Produto";
            const subtotal = item.quantidade * item.preco_unitario;
            somaTotal += subtotal;
            
            lista.innerHTML += `
                <li style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span><strong>${nome}</strong> (x${item.quantidade})</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </li>
            `;
        });

        if (totalSpan) totalSpan.innerText = `R$ ${somaTotal.toFixed(2)}`;
        document.getElementById('modal-detalhes').style.display = 'flex';
    } catch (error) {
        console.error("Erro detalhes:", error);
    }
}

function fecharModalDetalhes() { document.getElementById('modal-detalhes').style.display = 'none'; }

// 6. Funções de Venda e Carrinho
async function carregarProdutosNoSelect() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const produtos = await response.json();
        const select = document.getElementById('select-produto');
        if (select) {
            select.innerHTML = produtos.map(p => 
                `<option value="${p.id}" data-preco="${p.preco}">${p.nome} - R$ ${Number(p.preco).toFixed(2)}</option>`
            ).join('');
        }
    } catch (error) {
        console.error("Erro select:", error);
    }
}

function adicionarAoCarrinho() {
    const select = document.getElementById('select-produto');
    const qtd = parseInt(document.getElementById('qtd-produto').value);
    const selectedOption = select.options[select.selectedIndex];
    if (!selectedOption || isNaN(qtd) || qtd <= 0) return alert("Selecione um produto e quantidade válida!");
    
    const nome = selectedOption.text.split(' - ')[0];
    const preco = parseFloat(selectedOption.getAttribute('data-preco'));
    const produto_id = parseInt(select.value);
    
    carrinho.push({ produto_id, nome, qtd, preco_unitario: preco });
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const totalSpan = document.getElementById('total-venda');
    if (!lista) return;
    
    lista.innerHTML = carrinho.map((item, index) => `
        <li style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>${item.qtd}x ${item.nome}</span>
            <button onclick="removerDoCarrinho(${index})" style="background:none; border:none; color:red; cursor:pointer;">X</button>
        </li>
    `).join('');

    const total = carrinho.reduce((sum, item) => sum + (item.preco_unitario * item.qtd), 0);
    if (totalSpan) totalSpan.innerText = total.toFixed(2);
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
}

async function finalizarVendaCompleta() {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    
    const totalTexto = document.getElementById('total-venda').innerText;
    const totalLimpo = parseFloat(totalTexto);

    const dadosPedido = {
        usuario_id: 1, 
        unidade_id: 1,
        total: totalLimpo,
        itens: carrinho.map(item => ({
            produto_id: item.produto_id,
            quantidade: item.qtd,
            preco_unitario: item.preco_unitario
        }))
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPedido)
        });

        if (response.ok) {
            alert("Venda Realizada com Sucesso! 🌵");
            carrinho = [];
            renderizarCarrinho();
            showSection('dash');
        } else {
            const erro = await response.json();
            alert("Erro: " + (erro.message || "Tente novamente."));
        }
    } catch (error) {
        console.error("Erro finalização:", error);
    }
}

// 7. Modais de Estoque
function abrirModalEstoque(id, nome) {
    document.getElementById('add-estoque-id').value = id;
    document.getElementById('modal-estoque-titulo').innerText = `Abastecer: ${nome}`;
    document.getElementById('modal-estoque').style.display = 'flex';
}

function fecharModalEstoque() { document.getElementById('modal-estoque').style.display = 'none'; }

async function processarEntradaEstoque() {
    const produto_id = document.getElementById('add-estoque-id').value;
    const quantidade = document.getElementById('add-estoque-qtd').value;

    try {
        const response = await fetch(`${API_URL}/stock/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unidade_id: 1, produto_id: parseInt(produto_id), quantidade: parseInt(quantidade) })
        });
        if (response.ok) {
            fecharModalEstoque();
            await carregarTelaEstoque();
        }
    } catch (error) {
        console.error("Erro estoque:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => { showSection('dash'); });