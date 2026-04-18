const connection = require('../database/connection');

const unitRepository = {
    create: (nome, cidade) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO unidades (nome, cidade) VALUES (?, ?)';
            connection.query(sql, [nome, cidade], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },
    findAll: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM unidades', (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = unitRepository;