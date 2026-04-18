const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL, // Use a Service URI aqui
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 60000
});

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ CONEXÃO ESTABELECIDA!");
        connection.release();
    } catch (error) {
        console.error("❌ ERRO NO LOG:", error.message);
    }
};
initDatabase();
module.exports = pool;