import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();


const db = mysql.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnetion() {
    try {
        const connection = await db.getConnection();
         console.log("Database connected");
         connection.release();
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
}   

testConnetion();

export default db;