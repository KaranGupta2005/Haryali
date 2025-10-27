import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectToDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// ✅ Proper dotenv path for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectToDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Haryali Backend Server is running 🌿");
});

app.use((err, req, res, next) => {
  const status = typeof err.status === 'number' ? err.status : 500;
  const message = typeof err === 'string' ? err : err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

