import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";


dotenv.config();


const app = express();


app.use(cors());

app.use(express.json());



app.get("/", (req, res) => {
    res.send("BrightSmile Backend Running");
});



app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/bookings", bookingRoutes);



app.listen(5000, () => {
    console.log("Server running on port 5000");
});