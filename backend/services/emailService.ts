import dotenv from "dotenv";
dotenv.config()

export async function sendEmailOtp(otp: string, email: string) {
    if (!otp || !email) throw new Error("No data passed to service");
    
    const message = `Your verification code is ${otp} do not share this code.`

    try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "api-key": process.env.BREVO_KEY as string
            },
            body: JSON.stringify({
                sender: { name: "ShopX", email: process.env.BREVO_EMAIL as string },
                to: [{email}],
                subject: "Your otp code",
                htmlContent: `<p>${message}</p>`
            })
        });

        const data = await res.json();


        if (!res.ok) {
            return { ok: false, msg: "Failed to send OTP" };
        }

        return { ok: true, data };
            
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { ok: false, msg: "Unexpected error" };
    }
}