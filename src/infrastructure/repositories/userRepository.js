const connection = require('../database/connection');
const bcrypt = require('bcryptjs');

const userRepository = {
    create: async (nome, email, senha) => {
        const salt = await bcrypt.genSalt(10);
        const senhaCripto = await bcrypt.hash(senha, salt);
        
        const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        const [result] = await connection.query(sql, [nome, email, senhaCripto]);
        return result;
    },

    findByEmail: async (email) => {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await connection.query(sql, [email]);
        return rows[0];
    }
};

module.exports = userRepository;