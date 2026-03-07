// plz note this code is for Groq Server.js
import OpenAI from 'openai';
import express from "express";
// import "dotenv/config";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js";

dotenv.config();
const app = express();
const PORT = 8080;

app.use(express.json()); //middleware to parse our incoming requests
app.use(cors()); //middleware to parse our backend requests

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();//whenever server starts we ensure thta our DB is connected to it
});

//establishing mongoDB connection
const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected with DB!");
  } catch (err) {
    console.log("Failed to conncet with DB!", err);
  }
}

//similar way to do this
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch(err => console.log(err));


// Api fetching
// const client = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY, // This is the default and can be omitted
//   baseURL: "https://api.groq.com/openai/v1", // ✅ important
// });

// async function run() {
//   const userMessage = "Who is yash Chourasia";

//   const response = await client.chat.completions.create({
//     model: "llama-3.1-8b-instant", // ✅ Groq model
//     messages: [
//       { role: "system", content: "You are a helpful assistant." },
//       { role: "user", content: userMessage }
//     ],
//   });

//   console.log(response.choices[0].message.content);
// }

// run();

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         }
//       ]
//     })
//   };

//   try {
//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       options
//     );

//     const data = await response.json();

//     // console.log(data.choices[0].message.content);
//     res.send(data.choices[0].message.content);

//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error fetching Groq API");
//   }
// });

