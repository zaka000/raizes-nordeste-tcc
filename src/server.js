require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importação das rotas (mantendo as suas)
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
// Agora apontamos para a pasta 'frontend' que está um nível acima de 'src'
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. ROTAS DA API
app.use('/users', userRoutes);
app.use('/units', unitRoutes);
app.use('/products', productRoutes); 
app.use('/stock', stockRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);

// 3. ROTA PRINCIPAL (APONTANDO PARA DENTRO DE FRONTEND)
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/index.html'));
});

// 4. ROTA DE FALLBACK
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ON rodando na pasta frontend`);
});