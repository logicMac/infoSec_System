import db from "../db.ts";

interface loginUserParams  {
    username: string,
    password: string
}

interface registerUserParams {
    username: string,
    password: string,
    role: string,
    phone_Number: string,
    email: string
}

const userModel = {
    getById: async (user_id: number) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE user_id = ?
        `, [user_id]);

        return row;
    },

    getByEmail: async (email: string) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE email = ?
        `, [email]);

        return row;
    },

    getAllUser: async (username: string) => {   
        const [row] = await db.query(`
            SELECT * FROM users WHERE username = ?      
        `, [username]);

        return row;
    }, 

    getAllByUsername: async (username: string) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE username = ? 
        `, [username]);

        return row;
    },

    registerUser: async ({username, password, role, phone_Number, email}: registerUserParams) => {
        const [row] = await db.query(`
            INSERT INTO users (username, password, role, phone_Number, email) 
            VALUES (?, ?, ?, ?, ?)
        `, [username, password, role, phone_Number, email]);

        return row;
    },
    
    loginUser: async ({username, password}: loginUserParams) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE username = ? AND  password = ?
        `, [username, password]);

        return row; 
    } 

}

export default userModel;