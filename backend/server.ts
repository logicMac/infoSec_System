import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.listen(PORT, () => {
    console.log(`Server Running at PORT: ${PORT}`);
})
