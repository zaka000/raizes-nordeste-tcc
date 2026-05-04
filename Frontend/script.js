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
        if (title) title.innerText = "Bem-vindo, Bruno! 👋";
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

// 2. Atualiza o Dashboard - CORRIGIDO: Tentando 'reports' com S
async function atualizarDashboard() {
    try {
        // Se o erro persistir, tente remover o 's' de reports aqui embaixo
        const response = await fetch(`${API_URL}/reports/dashboard`);
        if (!response.ok) throw new Error("Rota não encontrada");
        
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

// 3. Estoque
async function carregarTelaEstoque() {
    try {
        const response = await fetch(`${API_URL}/stock`);
        const estoque = await response.json();
        const tbody = document.getElementById('tabela-estoque-body');
        if (!tbody) return;
        tbody.innerHTML = ''; 

        estoque.forEach(item => {
            const corStatus = item.quantidade > 0 ? '#8ebf42' : '#ff4444';
            tbody.innerHTML += `
                <tr>
                    <td>${item.produto_nome}</td>
                    <td style="text-align: center; font-weight: bold; color: ${corStatus}">${item.quantidade}</td>
                    <td style="text-align: right;">R$ ${Number(item.preco).toFixed(2)}</td>
                    <td style="text-align: center; color: ${corStatus}">${item.quantidade > 0 ? 'Em estoque' : 'Esgotado'}</td>
                    <td style="text-align: center;">
                        <button class="btn-secundario" onclick="abrirModalEstoque(${item.produto_id}, '${item.produto_nome}')">+ Add</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro estoque:", error);
    }
}

// 4. Histórico de Vendas
async function carregarHistoricoVendas() {
    try {
        console.log("🔍 Buscando histórico em:", `${API_URL}/orders`);
        const response = await fetch(`${API_URL}/orders`);
        
        if (!response.ok) throw new Error("Erro ao buscar ordens");
        
        const vendas = await response.json();
        const tbody = document.getElementById('tabela-vendas-body');
        
        if (!tbody) return;
        tbody.innerHTML = '';

        if (vendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhuma venda encontrada.</td></tr>';
            return;
        }

        vendas.forEach(venda => {
            // O segredo está aqui: tentamos ler 'created_at' ou 'data' ou 'data_pedido'
            const dataRaw = venda.created_at || venda.data || venda.data_pedido;
            const dataObj = new Date(dataRaw);
            const dataFormatada = isNaN(dataObj) ? "Data Indisponível" : dataObj.toLocaleString('pt-BR');

            // Garantimos que o total seja um número para o toFixed não quebrar
            const valorTotal = Number(venda.total || 0).toFixed(2);

            tbody.innerHTML += `
                <tr>
                    <td>#${venda.id}</td>
                    <td>${dataFormatada}</td>
                    <td style="text-align: right; font-weight: bold; color: #8ebf42;">R$ ${valorTotal}</td>
                    <td style="text-align: center;">
                        <button class="btn-secundario" onclick="verDetalhesVenda(${venda.id})">Ver Detalhes</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        const tbody = document.getElementById('tabela-vendas-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Erro ao carregar dados.</td></tr>';
    }
}

// 5. Funções Auxiliares de Venda e Produtos
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
        console.error("Erro produtos:", error);
    }
}

function adicionarAoCarrinho() {
    const select = document.getElementById('select-produto');
    const qtd = parseInt(document.getElementById('qtd-produto').value);
    const selectedOption = select.options[select.selectedIndex];
    if (!selectedOption) return;
    const nome = selectedOption.text.split(' - ')[0];
    const preco = parseFloat(selectedOption.getAttribute('data-preco'));
    carrinho.push({ produto_id: parseInt(select.value), nome, qtd, preco_unitario: preco });
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const totalSpan = document.getElementById('total-venda');
    if (!lista) return;
    lista.innerHTML = carrinho.map((item, index) => `
        <li>${item.qtd}x ${item.nome} <button onclick="removerDoCarrinho(${index})">x</button></li>
    `).join('');
    const total = carrinho.reduce((sum, item) => sum + (item.preco_unitario * item.qtd), 0);
    totalSpan.innerText = total.toFixed(2);
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
}

async function finalizarVendaCompleta() {
    if (carrinho.length === 0) return alert("Adicione itens ao carrinho primeiro!");
    
    // Pegamos o valor total do span e garantimos que é um número
    const totalTexto = document.getElementById('total-venda').innerText;
    const totalLimpo = parseFloat(totalTexto);

    // Montando o objeto exatamente como seu orderRepository/Controller espera
    const dadosPedido = {
        usuario_id: 1, // ID padrão para teste
        unidade_id: 1, // ID padrão conforme seu log do Render
        total: totalLimpo,
        itens: carrinho.map(item => ({
            produto_id: parseInt(item.produto_id),
            quantidade: parseInt(item.qtd),
            preco_unitario: parseFloat(item.preco_unitario)
        }))
    };

    console.log("📤 Enviando pedido:", dadosPedido); 

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
            showSection('dash'); // Volta para o dashboard atualizado
        } else {
            const erro = await response.json();
            alert("Erro na venda: " + (erro.message || "Verifique o estoque."));
        }
    } catch (error) {
        console.error("Erro ao finalizar venda:", error);
        alert("Erro de conexão com o servidor.");
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => { showSection('dash'); });