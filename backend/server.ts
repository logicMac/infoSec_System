import express from 'express';
import cors from 'cors';
import db from './db.ts';
import userRoutes from './routes/userRoutes.ts'

const app = express();
const PORT = 3000;

app.use(express.json()); 

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

console.log(db);

app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server Running at PORT: ${PORT}`);
})
