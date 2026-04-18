const { pool } = require('../../config/db');

const unitRepository = {
    create: async (nome, cidade) => {
        const [result] = await pool.query('INSERT INTO unidades (nome, cidade) VALUES (?, ?)', [nome, cidade]);
        return result;
    },
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM unidades');
        return rows;
    }
};
module.exports = unitRepository;