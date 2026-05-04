Projeto Raízes Nordeste - Sistema de Gestão (TCC)
Este projeto consiste em um sistema de gestão comercial (ERP) voltado para o comércio de produtos regionais, desenvolvido como Trabalho de Conclusão de Curso (TCC). O sistema permite o controle de estoque, registro de vendas em tempo real e monitoramento de faturamento através de um dashboard integrado.  

🚀 Tecnologias Utilizadas
Front-end: HTML5, CSS3 e JavaScript (Vanilla JS).  

Back-end: Node.js com framework Express.  

Banco de Dados: PostgreSQL (hospedado via Render).  

Hospedagem: Render (API e Banco de Dados).  

🏗️ Arquitetura do Sistema
O projeto segue o padrão de arquitetura em camadas para facilitar a manutenção:

Routes: Define os caminhos da API (ex: /orders, /products, /reports).  

Controllers: Gerencia a lógica de entrada e a comunicação entre as rotas e os repositórios.  

Repositories: Camada de infraestrutura responsável pelas consultas SQL diretas ao banco de dados.  

Config: Configurações de conexão com o banco de dados via Pool do PostgreSQL/MySQL.  

⚙️ Funcionalidades Implementadas
📊 Dashboard Inteligente
Exibição de faturamento total em tempo real.

Contagem automática de pedidos realizados.  

Status de conexão com a API (Online/Offline).

🛒 Sistema de Vendas
Carrinho de compras dinâmico.

Seleção de produtos com busca de preços atualizados via API.

Validação de estoque antes da finalização da venda.

📦 Gestão de Estoque
Visualização de itens em estoque com sinalização visual (verde para disponível, vermelho para esgotado).

Funcionalidade de abastecimento de estoque via modal.  

Exclusão e cadastro de novos produtos.

📜 Histórico de Vendas
Listagem cronológica de todos os pedidos realizados.

Visualização detalhada de cada venda (itens, quantidades e preços unitários).

🛠️ Detalhamento Técnico 
Fluxo de Uma Venda
Para demonstrar a integridade do sistema, o processo de venda segue este fluxo:  

Front-end: O script.js captura o carrinho e envia um JSON via POST para a rota /orders.

Controller: O orderController.js valida se os campos (ID do usuário, itens, total) estão presentes.  

Repository: O orderRepository.js inicia uma Transação SQL:  

Verifica a disponibilidade de cada item no estoque.

Insere o registro na tabela pedidos.

Insere os itens na tabela itens_pedido.

Atualiza (decrementa) a quantidade na tabela estoque.  

Se qualquer etapa falhar, o sistema executa um rollback para evitar dados inconsistentes.  

🗄️ Estrutura do Banco de Dados (Entidade-Relacionamento)
O sistema utiliza as seguintes tabelas integradas:  

produtos: Armazena informações base (nome, preço, categoria).

estoque: Relaciona produtos a unidades e controla quantidades.  

pedidos: Registra o cabeçalho da venda (quem comprou, quando e quanto custou).

itens_pedido: Detalha quais produtos compõem cada pedido (N:N).

💡 Soluções de Problemas Implementadas
Durante o desenvolvimento, foram aplicadas soluções específicas para desafios comuns em sistemas web:

Tratamento de CORS: Configuração do middleware cors no Node.js para permitir que o front-end hospedado acesse a API no Render.

Normalização de Datas: Implementação de lógica no front-end para tratar diferentes formatos de data (created_at vs data_pedido) retornados pelo banco de dados.  

Persistência de Dados: Uso de Pool de conexões para otimizar o acesso ao banco e evitar quedas por excesso de requisições.

o mesmo está em host no site : https://raizes-nordeste-tcc.onrender.com/
