require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importação das rotas
const userRoutes = require('./api/routes/userRoutes');
const unitRoutes = require('./api/routes/unitRoutes');
const productRoutes = require('./api/routes/productRoutes'); 
const stockRoutes = require('./api/routes/stockRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const reportRoutes = require('./api/routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 1. AJUSTE DE ARQUIVOS ESTÁTICOS
// O nome da pasta deve ser EXATAMENTE 'Frontend' como está no seu repositório
app.use(express.static(path.join(__dirname, '../Frontend')));

// 2. ROTAS DA API
app.use('/users', userRoutes);
app.use('/units', unitRoutes);
app.use('/products', productRoutes); 
app.use('/stock', stockRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);

// 3. ROTA PRINCIPAL
app.get('/', (req, res) => {
    // Usamos path.resolve para garantir o caminho absoluto no servidor Linux
    res.sendFile(path.resolve(__dirname, '../Frontend/index.html'));
});

// 4. ROTA DE FALLBACK (Para rotas de navegação do frontend)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`✅ Servidor ON acessando a pasta Frontend`);
  console.log(`🚀 Porta: ${PORT}`);
  console.log(`=========================================`);
});