import cors from 'cors';
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
 
const app = express();
const port = 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
}));

 
app.all("/api/auth/{*any}", toNodeHandler(auth));
// app.all("/api/auth/*splat", toNodeHandler(auth)); For ExpressJS v5 
 
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());
 
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
