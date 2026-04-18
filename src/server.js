require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./api/routes/userRoutes');
const unitRoutes = require('./api/routes/unitRoutes');
const productRoutes = require('./api/routes/productRoutes'); 
const stockRoutes = require('./api/routes/stockRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const reportRoutes = require('./api/routes/reportRoutes');

const app = express();

// Configurações Iniciais
app.use(cors());
app.use(express.json());

// 1. CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS
// Isso garante que o navegador encontre suas pastas de CSS, JS e Imagens
app.use(express.static(path.join(__dirname, '../')));

// 2. ROTAS DA API
app.use('/users', userRoutes);
app.use('/units', unitRoutes);
app.use('/products', productRoutes); 
app.use('/stock', stockRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);

// 3. ROTA PRINCIPAL (FRONTEND)
// Removi o res.send que travava a página. Agora ele entrega o seu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// 4. ROTA DE FALLBACK (Para evitar erros 404 ao atualizar a página)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../index.html');
    console.log("Tentando servir o arquivo de:", indexPath); // Isso vai aparecer nos Logs do Render
    res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🚀 Link: https://raizes-nordeste-tcc.onrender.com`);
  console.log(`=========================================`);
});