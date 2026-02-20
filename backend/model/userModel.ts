import db from "../db.ts";

interface params {
    username: string;
    user_id: number;
}

interface loginUserParams  {
    username: string,
    password: string
}

interface registerUserParams {
    username: string,
    password: string,
    role: string,
    phone_Number: string,
    address: string
}

const userModel = {
    getAllUser: async (username: params) => {   
        const [row] = await db.query(`
            SELECT * FROM users WHERE username = ?      
        `, [username]);

        return row;
    }, 

    getAllByUsername: async (username: params) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE username = ? 
        `, [username]);

        return row;
    }, 

    registerUser: async ({username, password, role, phone_Number, address}: registerUserParams) => {
        const [row] = await db.query(`
            INSERT INTO users (username, password, role, phone_Number, address ) 
            VALUES (?, ?, ?, ?, ?)
        `, [username, password, role, phone_Number, address]);

        return row;
    },
    
    loginUser: async ({username, password}: loginUserParams) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE username = ? AND  password = ?
        `, [username, password]);
    } 

}

export default userModel;