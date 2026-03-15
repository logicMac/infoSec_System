import { ResultSetHeader } from "mysql2";
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
    //Fetch user by ids
    getById: async (user_id: number) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE user_id = ?
        `, [user_id]
        );

        return row;
    },

    //Fetch user by email
    getByEmail: async (email: string) => {
        const [row] = await db.query(`
            SELECT * FROM users WHERE email = ?
        `, [email]
        );

        return row;
    },

    //Fetch all user
    getAllUser: async (username: string) => {   
        const [row] = await db.query(`
            SELECT * FROM users WHERE username = ?      
        `, [username]
        );

        return row;
    }, 

    //Get all user by username
    getAllByUsername: async (username: string) => {
        const [row] = await db.query
        (`
            SELECT * FROM users WHERE username = ? 
        `, [username]
        );

        return row;
    },

    //Save user to database 
    registerUser: async (
        {
            username, password, role, 
            phone_Number, email
        }: registerUserParams) => {
            
        const [row] = await db.query<ResultSetHeader>
        (`
            INSERT INTO users (username, password, role, phone_Number, email) 
            VALUES (?, ?, ?, ?, ?)
        `, [username, password, role, phone_Number, email]
        );

        return row;
    },
    
    //login user
    loginUser: async ({username, password}: loginUserParams) => {
        const [row] = await db.query
        (`
            SELECT * FROM users WHERE username = ? AND  password = ?
        `, [username, password]
        );

        return row; 
    },

    //update user
    updateUser: async(id: string) => {
        const [row] = await db.query
        (`
            UPDATE TABLE users 
            SET username = ?, password = ?, 
            phone_number = ?, email = ?
            WHERE user.user_id = ? 
        `);

        return row;
    },

    //delete user
    deleteUser: async(id: number) => {
        const [row] = await db.query
        (`
            DELETE FROM users WHERE user_id = ?    
            `, [id]
        );

        return row;
    },

    saveSellerId: async(user_id: number) => {
        const [result] = await db.query(`
            INSERT INTO shops(user_id) VALUES (?)    
            `,[user_id]
        );

        return result;
    }
}

export default userModel;