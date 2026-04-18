require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool, initDatabase } = require('./config/db'); // Importação ajustada

const userRoutes = require('./api/routes/userRoutes');
const unitRoutes = require('./api/routes/unitRoutes');
const productRoutes = require('./api/routes/productRoutes'); 
const stockRoutes = require('./api/routes/stockRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const reportRoutes = require('./api/routes/reportRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, '../Frontend')));

app.use('/users', userRoutes);
app.use('/units', unitRoutes);
app.use('/products', productRoutes); 
app.use('/stock', stockRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend/index.html'));
});

// O Render usa portas variadas, 10000 é a padrão lá
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ON na porta ${PORT}`);
    // Tenta conectar ao banco DEPOIS que o servidor já está no ar
    initDatabase();
});