import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend directory
dotenv.config();

// Debug: Log the loaded environment variables
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_NAME);

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'infosec_system', // Default to infosec_system
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log("Database connected successfully to:", process.env.DB_NAME);
        connection.release();
    } catch (err: any) {
        console.error("Database connection failed:", err.message);
        console.error("Error code:", err.code);
        process.exit(1);
    }
}   

testConnection();

export default db;
