import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { VerifyOtpApi } from "../api/authApi";

export default function OtpPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get user data from login page
    const userData = location.state;
    
    const inputRefs = useRef([]);

    useEffect(() => {
        // Redirect to login if no user data
        if (!userData || !userData.user_id) {
            navigate("/login");
        }
    }, [userData, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace - focus previous input
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = pastedData[i] || "";
        }
        setOtp(newOtp);

        // Focus last filled input or first empty
        const lastFilledIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastFilledIndex]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        
        if (otpValue.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await VerifyOtpApi({
                user_id: userData.user_id,
                otp: otpValue
            });

            if (!res.ok) {
                setError(res.msg || "Invalid OTP");
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0].focus();
                return;
            }

            // Store token and user data
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify({
                username: userData.username,
                role: userData.role,
                user_id: userData.user_id
            }));

            // Redirect based on role
            if (userData.role === "admin") {
                navigate("/admin");
            } else if (userData.role === "staff") {
                navigate("/staff");
            } else if (userData.role === "seller") {
                navigate("/seller");
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error("Error verifying OTP", error);
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = () => {
        // In a real app, you'd call an API to resend OTP
        setError("OTP has been resent to your phone");
    };

    return (
        <div className="flex h-screen">
            {/* Left side: Image 70% */}
            <div className="w-[70%] h-full">
                <img
                    src={Logo}
                    alt="OTP"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right side: OTP Input 30% */}
            <div className="w-[30%] flex flex-col justify-center items-center p-10 bg-gray-50 gap-y-8">
                <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
                <p className="text-gray-600 text-center">
                    Enter the 6-digit code sent to your phone
                </p>
                
                <p className="text-red-500">{error}</p>

                <form 
                    className="flex flex-col w-full justify-center items-center"
                    onSubmit={handleSubmit}
                >
                    {/* OTP Input Container */}
                    <div className="flex gap-2 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                ref={el => inputRefs.current[index] = el}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                className="w-12 h-12 text-center text-xl font-bold border border-gray-400 rounded-md focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
                            />
                        ))}
                    </div>

                    <button 
                        className="w-3/4 p-2 bg-black text-white rounded-md hover:scale-105 duration-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading || otp.join("").length !== 6}
                    >
                        {isLoading ? "Verifying..." : "Verify"}
                    </button>

                    <div className="flex flex-col items-center gap-y-2">
                        <p className="text-gray-600 text-sm">
                            Didn't receive the code?
                        </p>
                        <button 
                            type="button"
                            onClick={handleResend}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Resend OTP
                        </button>
                    </div>

                    <button 
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-gray-600 hover:underline text-sm"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}

