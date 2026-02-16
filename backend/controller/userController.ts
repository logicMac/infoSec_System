import db from "../db.ts";

interface params {
    username: string;
    user_id: number;
}

const userModel = {
    get: async (username: params) => {
        try {   
            const [row] = await db.query(`
                SELECT * FROM users WHERE username = ?      
            `, [username]);

            return row;
        } catch (error) {
            console.log("there's problem fetching data from backend", error)
        }
    }, 

    delete: async (user_id: params) => {
        try {
            
        } catch (error) {
            
        }
    }
}

export default userModel;