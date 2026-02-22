import dotenv from "dotenv";
import { sendOtp } from "./services/smsService.js";

dotenv.config();

// Test configuration
const TEST_PHONE = "09761295003"; // Replace with your test phone number
const TEST_OTP = "123456";

async function testSendOtp() {
    console.log("=== Testing sendOtp Function ===");
    console.log("Phone:", TEST_PHONE);
    console.log("OTP:", TEST_OTP);
    console.log("API Key Set:", process.env.PHILSMS_API_KEY ? "YES" : "NO");
    console.log("================================\n");

    if (!process.env.PHILSMS_API_KEY) {
        console.error("ERROR: PHILSMS_API_KEY is not set in .env file!");
        console.log("\nPlease add your API key to backend/.env:");
        console.log("PHILSMS_API_KEY=your_api_key_here");
        return;
    }

    try {
        console.log("Calling sendOtp function...");
        const result = await sendOtp(TEST_OTP, TEST_PHONE);
        
        console.log("\n=== Result ===");
        console.log(result);
        
        if (result.ok) {
            console.log("\n✅ SUCCESS: OTP sent successfully!");
        } else {
            console.log("\n❌ FAILED: Failed to send OTP");
            console.log("Error:", result.error);
        }
    } catch (error) {
        console.error("\n❌ ERROR:", error);
    }
}

testSendOtp();
