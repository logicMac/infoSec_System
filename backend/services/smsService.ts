import dotenv from "dotenv";
dotenv.config();

export async function sendOtp(otp: string, phone_Number: string) {
    if (!otp || ! phone_Number) {
        throw new Error("no data passed to service for sms otp sending");
    }

    const phone = phone_Number.replace(/^0/, "63");
    const message = `Your verification code is ${otp} Do not share this code.`

    // Log the request details
    console.log("=== PhilSMS API Request ===");
    console.log("URL: https://dashboard.philsms.com/api/v3/sms/send");
    console.log("Phone:", phone);
    console.log("Message:", message);
    console.log("API Key:", process.env.PHILSMS_API_KEY ? "✓ Set" : "✗ Not Set");
    console.log("==============================");

    try {
        const res = await fetch("https://dashboard.philsms.com/api/v3/sms/send", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PHILSMS_API_KEY}`,
                "Content-Type" : "application/json",
                Accept: "application/json"  
            },
            body: JSON.stringify({
                recipient: phone,
                sender_id: process.env.PHILSMS_SENDER_ID || "PHILSMS",
                type: 'plain',
                message: message      
            })      
        });

        const data = await res.json();
        
        // Log the full response
        console.log("=== PhilSMS API Response ===");
        console.log("Status:", res.status, res.statusText);
        console.log("Response Data:", JSON.stringify(data, null, 2));
        console.log("=============================");

        if (!res.ok) {
            return {
                ok: false,
                error: "Failed to send OTP",
            };
        }

        return {
            ok: true,
            data,
        };

    } catch (error) {       
        console.error("=== PhilSMS Error ===");
        console.error("Error sending OTP:", error);
        console.error("=====================");
        return {
            ok: false,  
            error: "Unexpected error"
        };
    }
}

