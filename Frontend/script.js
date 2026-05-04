const API_URL = "https://raizes-nordeste-tcc.onrender.com"; 
let carrinho = [];

// 1. Função principal para trocar de telas
function showSection(section) {
    const dash = document.getElementById('section-dash');
    const vendas = document.getElementById('section-vendas');
    const estoque = document.getElementById('section-estoque');
    const relatorios = document.getElementById('section-relatorios'); 
    const title = document.getElementById('main-title');

    // Esconde tudo primeiro
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
        carregarHistoricoVendas(); // Chamando a função correta
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

// 3. Funções de Estoque e Produtos
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
                    <td style="text-align: center; display: flex; gap: 8px; justify-content: center;">
                        <button class="btn-secundario" onclick="abrirModalEstoque(${item.produto_id}, '${item.produto_nome}')">+ Add</button>
                        <button class="btn-excluir" onclick="excluirProduto(${item.produto_id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
    }
}

// FUNÇÃO NOVA: Excluir Produto
async function excluirProduto(id) {
    if (!confirm("Tem certeza que deseja excluir este produto? Isso removerá o estoque e o histórico vinculado.")) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Produto removido com sucesso! 🌵");
            await carregarTelaEstoque();
        } else {
            alert("Não foi possível excluir o produto.");
        }
    } catch (error) {
        console.error("Erro na exclusão:", error);
        alert("Erro de conexão com o servidor.");
    }
}

// 4. Histórico de Vendas
async function carregarHistoricoVendas() {
    console.log("🔄 Buscando histórico...");
    try {
        const response = await fetch(`${API_URL}/orders`); 
        const vendas = await response.json();
        
        // ID exato que está no seu HTML (linha 93 do arquivo 30)
        const tbody = document.getElementById('tabela-vendas-body'); 
        
        if (!tbody) {
            console.error("❌ Erro: Tabela 'tabela-vendas-body' não encontrada.");
            return;
        }
        
        tbody.innerHTML = '';

        if (vendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhuma venda encontrada.</td></tr>';
            return;
        }

        vendas.forEach(venda => {
            const rawDate = venda.created_at || venda.data_pedido;
            const dataObj = new Date(rawDate);
            const dataFormatada = isNaN(dataObj) ? "Data Indisponível" : dataObj.toLocaleString('pt-BR');

            tbody.innerHTML += `
                <tr>
                    <td style="padding: 10px;">#${venda.id}</td>
                    <td style="padding: 10px;">${dataFormatada}</td>
                    <td style="text-align: right; font-weight: bold; color: #8ebf42; padding: 10px;">R$ ${Number(venda.total).toFixed(2)}</td>
                    <td style="text-align: center; padding: 10px;">
                        <button class="btn-secundario" onclick="verDetalhesVenda(${venda.id})">Ver Detalhes</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("❌ Erro ao carregar histórico:", error);
    }
}

// 5. Modais e Processamentos
async function verDetalhesVenda(pedidoId) {
    try {
        // Corrigido de /items para /itens/ID conforme seu orderRoutes.js
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
                <li class="item-detalhe" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span><strong>${nome}</strong> (x${item.quantidade})</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </li>
            `;
        });

        if (totalSpan) totalSpan.innerText = `R$ ${somaTotal.toFixed(2)}`;
        document.getElementById('modal-detalhes').style.display = 'flex';
    } catch (error) {
        console.error("Erro detalhes:", error);
        alert("Não foi possível carregar os detalhes deste pedido.");
    }
}

function fecharModalDetalhes() { document.getElementById('modal-detalhes').style.display = 'none'; }

function abrirModalEstoque(id, nome) {
    document.getElementById('add-estoque-id').value = id;
    document.getElementById('modal-estoque-titulo').innerText = `Abastecer: ${nome}`;
    document.getElementById('add-estoque-qtd').value = 1;
    document.getElementById('modal-estoque').style.display = 'flex';
}

function fecharModalEstoque() { document.getElementById('modal-estoque').style.display = 'none'; }

async function processarEntradaEstoque() {
    const produto_id = document.getElementById('add-estoque-id').value;
    const quantidade = document.getElementById('add-estoque-qtd').value;
    if (!quantidade || quantidade <= 0) return alert("Digite uma quantidade válida!");

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
        console.error("Erro ao adicionar estoque:", error);
    }
}

function abrirModalProduto() { document.getElementById('modal-produto').style.display = 'flex'; }
function fecharModal() { document.getElementById('modal-produto').style.display = 'none'; }

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
            alert("Produto cadastrado! 🌵");
            fecharModal();
            carregarTelaEstoque();
        }
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
    }
}

async function carregarProdutosNoSelect() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const produtos = await response.json();
        const select = document.getElementById('select-produto');
        if (!select) return;
        select.innerHTML = produtos.map(p => 
            `<option value="${p.id}" data-preco="${p.preco}">${p.nome} - R$ ${Number(p.preco).toFixed(2)}</option>`
        ).join('');
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
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
    if (!lista) return;
    
    lista.innerHTML = carrinho.map((item, index) => `
        <li class="item-carrinho">
            <span>${item.qtd}x ${item.nome}</span>
            <span class="remover-item" onclick="removerDoCarrinho(${index})">X</span>
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
    if (carrinho.length === 0) return alert("Adicione itens ao carrinho primeiro!");
    
    // Pegamos o texto do total e removemos qualquer coisa que não seja número ou ponto
    const totalTexto = document.getElementById('total-venda').innerText;
    const totalLimpo = parseFloat(totalTexto.replace(/[^\d.]/g, ''));

    // Verificação de segurança para evitar o erro de 'NaN'
    if (isNaN(totalLimpo)) {
        return alert("Erro ao calcular o valor total. Verifique os itens do carrinho.");
    }

    const dadosPedido = {
        usuario_id: 1, 
        unidade_id: 1,
        total: totalLimpo,
        itens: carrinho.map(item => ({
            produto_id: parseInt(item.produto_id),
            quantidade: parseInt(item.qtd),
            preco_unitario: parseFloat(item.preco_unitario)
        }))
    };

    console.log("📤 Enviando pedido:", dadosPedido); // Log para conferir no console do navegador

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPedido)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert("Venda Realizada com Sucesso! 🌵");
            carrinho = [];
            renderizarCarrinho();
            showSection('dash');
        } else {
            alert("Erro na venda: " + (resultado.message || "Tente novamente."));
        }
    } catch (error) {
        console.error("Erro ao finalizar venda:", error);
        alert("Erro de conexão com o servidor.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('dash');
});