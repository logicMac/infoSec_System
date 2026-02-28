import db from "../db.ts"

const serviceModel = {
    saveOtp: async(otp: string, user_id: number) => {
        // Delete any existing OTPs for this user first (to avoid duplicates)
        await db.query(`DELETE FROM user_otps WHERE user_id = ?`, [user_id]);
        
        // Insert new OTP
        const [row] = await db.query(`
            INSERT INTO user_otps (user_id, otp, created_at) VALUES (?, ?, NOW())
        `, [user_id, otp]);
        
        return row;
    },

    verifyOtp: async (otp: string, user_id: number) => {
        // Verify OTP matches AND is for the specific user, and not expired (within 5 minutes)
        const [row]: any = await db.query(`
            SELECT * FROM user_otps 
            WHERE otp = ? 
            AND user_id = ?
            AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
        `, [otp, user_id]);

        // If valid, delete the OTP to prevent reuse
        if (row && row.length > 0) {
            await db.query(`DELETE FROM user_otps WHERE user_id = ?`, [user_id]);
        }
        
        return row;
    },

    saveOtpAttempts: async (attempts: number) => {
        const [row] = await db.query(`
            INSERT INTO user_otps (attempts) VALUES (?)   
        `, [attempts]);

        return row;
    }
    
}

export default serviceModel;
