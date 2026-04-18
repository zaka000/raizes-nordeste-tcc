
const { pool } = require('../../config/db');

const productRepository = {
    
    create: async (nome, preco, categoria) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)',
                [nome, preco, categoria]
            );
            return result;
        } catch (error) {
            console.error("🚨 Erro no SQL de Produto (Create):", error.message);
            throw error; 
        }
    },
    
    
    findAll: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
            return rows;
        } catch (error) {
            console.error("🚨 Erro no SQL de Produto (FindAll):", error.message);
            return []; 
        }
    },

   
    delete: async (id) => {
        try {
            
            const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error("🚨 Erro no SQL de Produto (Delete):", error.message);
            throw error;
        }
    }
};

module.exports = productRepository;