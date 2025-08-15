import express from "express";
import "dotenv/config";
 import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from "./controllers/clerkWebhooks.js";


connectDB()
 

 const app= express()
app.use(cors()) 


// clerk middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listem to clerk Webhooks
app.get("/api/clerk", clerkWebHooks);

app.get('/', (req, res) => res.send("API is working "))
 
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Server is running on port ${PORT}`));