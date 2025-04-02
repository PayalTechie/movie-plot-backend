import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.post("/generate", async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        if (!GOOGLE_API_KEY) {
            return res.status(500).json({ error: "Google API key is missing" });
        }

        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const {prompt} = req.body; 
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
          });
          
          const responseText = result.response.text();



        res.json({ response: responseText }); // Send response back to frontend
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});



app.listen(5000, () => console.log(" Server running on port 5000 "));
