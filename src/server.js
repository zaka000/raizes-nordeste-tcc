require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDatabase } = require('./config/db'); 

const userRoutes = require('./api/routes/userRoutes');
const unitRoutes = require('./api/routes/unitRoutes');
const productRoutes = require('./api/routes/productRoutes'); 
const stockRoutes = require('./api/routes/stockRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const reportRoutes = require('./api/routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, '..', 'Frontend');
app.use(express.static(frontendPath));

app.use('/users', userRoutes);
app.use('/units', unitRoutes);
app.use('/products', productRoutes); 
app.use('/stock', stockRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`🚀 SERVIDOR ON NA PORTA: ${PORT}`);
  console.log(`=========================================`);
  
  try {
    await initDatabase();
    console.log("✅ Banco de dados inicializado com sucesso!");
  } catch (err) {
    console.error("❌ ERRO AO INICIAR BANCO:", err.message);
  }
});