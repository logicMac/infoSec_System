interface registerParams {
    username: string,
    password: string,
    phone_Number: string,
    role: string
}

interface loginParams {
    username: string,
    password: string
}

interface VerifyOtpParams {
    user_id : number,
    otp:  string
}
    
export async function RegisterApi(registerData: registerParams) {
    if (!registerData) {
        return console.error("There's no data sent to API");
    }

    try {

        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/registerUser`,{
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(registerData)
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                msg: data.msg || "Registration Failed"
            }
        }

        return {
            ok: true,
            msg: data.msg,
            data
        }
        
    } catch (error) {
        console.error("Error sending data to backend", error);
    }
}

export async function LoginUserApi(loginData: loginParams) {
    if (!loginData) {
        return console.error("There's no data sent to API");
    }

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/loginUser`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({loginData})
        });
        
        const data = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                msg: data.msg || "Login Failed"
            }
        }

        return {
            ok: true,
            msg: data.msg,
            data
        }

    } catch (error) {
        console.error("Error sending data to backend");
    }
}


export async function VerifyOtpApi({user_id, otp}: VerifyOtpParams) {
    if (!user_id || !otp) {
        return console.error("There's no data sent to API");
    }

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/verifyUser`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({user_id, otp})
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                msg: data.msg || "Otp does not match"
            }
        }

        return {
            ok: true,
            msg: data.msg || "User logged in successfully",
            data
        }
    } catch (error) {
        console.log("Error sending data to backend", error);
    }
}
