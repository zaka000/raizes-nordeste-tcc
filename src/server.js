require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

// IMPORTANTE: Importamos o initDatabase do arquivo de configuração do banco
const { initDatabase } = require('./config/db'); 

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

// Servindo arquivos estáticos da pasta Frontend
// Usamos path.join para evitar erros de caminho no Linux do Render
const frontendPath = path.join(__dirname, '..', 'Frontend');
app.use(express.static(frontendPath));

// Rotas da API
app.use('/users', userRoutes);
app.use('/units', unitRoutes);
app.use('/products', productRoutes); 
app.use('/stock', stockRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);

// Rota para o Frontend (Single Page Application)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Porta padrão do Render ou 10000
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 SERVIDOR ON NA PORTA: ${PORT}`);
  console.log(`=========================================`);
  
  // Chama a função que importamos lá em cima
  initDatabase();

  app.listen(PORT, async () => {
  console.log(`🚀 SERVIDOR ON NA PORTA: ${PORT}`);
  try {
    await initDatabase();
    console.log("✅ Banco de dados inicializado com sucesso!");
  } catch (err) {
    console.error("❌ ERRO AO INICIAR BANCO:", err.message);
    // Não deixa o processo morrer sem logar o erro
  }
});
});