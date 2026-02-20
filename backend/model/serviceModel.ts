import db from "../db.ts"

const serviceModel = {
    saveOtp: async(otp: string) => {
        const [row] = await db.query(`
            INSERT INTO user_otps (otp) VALUES (?)
        `, [otp]);
        
        return row;
    },

    verifyOtp: async (otp: string) => {
        const [row] = await db.query(`
            SELECT * FROM user_otps WHERE otp = ?
        `, [otp]);

        return [row];
    } 
    
}

export default serviceModel;