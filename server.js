import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Backend working");
} );

app.post("/send-email", async (req, res) =>{
    const {name, email, message} = req.body;

    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: "New Portfolio Contact",
            text: `
            Name: ${name}
            Email: ${email}
            Message: ${message}`,
        });

        res.status(200).json({message: "Email sent successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Email failed! "});
        
    }
});

app.listen(5000, ()=> {
    console.log("Server running on http://localhost:5000");
    
});