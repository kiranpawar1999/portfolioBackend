import express from "express";
import { Resend } from "resend";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Resend setup
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Middleware
app.use(cors({
  origin: "https://candid-pixie-df759e.netlify.app"
}));
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend working");
});

// ✅ Email route
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // ✅ Send email using Resend
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["kiranpawar6519@gmail.com"], // 👈 अपना email डालो
      subject: `New Message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.log("EMAIL ERROR:", error);
    res.status(500).json({ message: "Email failed!" });
  }
});

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});