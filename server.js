import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://candid-pixie-df759e.netlify.app"
}));
app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Backend working");
} );

app.post("/send-email", async (req, res) =>{
    const {name, email, message} = req.body;
    if (!name || !email || !message) {
  return res.status(400).json({ message: "All fields required" });
}

    try{
      const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
       await transporter.sendMail({
  from: `"Portfolio Contact" <${process.env.EMAIL}>`,
  to: process.env.EMAIL,
  replyTo: email,
  subject: `New Message from ${name}`,
  text: `
Name: ${name}
Email: ${email}
Message: ${message}
  `,
});

        res.status(200).json({message: "Email sent successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Email failed! "});
        
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});