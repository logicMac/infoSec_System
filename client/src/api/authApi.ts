interface registerParams {
    username: string,
    password: string,
    phone_Number: string,
    role: string
}

export async function  registerApi(registerData: registerParams) {
    if (!registerData) {
        return console.error("There's no data sent to API");
    }

    try {

        const res = await fetch("https://localhost:1573")
        
    } catch (error) {
        console.error("Error sending data to backend", error);
    }
}