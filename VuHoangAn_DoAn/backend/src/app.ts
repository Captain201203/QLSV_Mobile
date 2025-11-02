import dotenv from "dotenv";
import express from "express";
import path from "path";
import studentRoute from "./routes/student/route.js";
import classRoute from "./routes/class/route.js";
import subjectRoute from "./routes/subject/route.js";
import scheduleRoute from "./routes/schedule/route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import accountRoute from "./routes/account/route.js";
import courseRoute from "./routes/course/route.js";
import lessonRoute from "./routes/lesson/route.js";
import lessonItemRoute from "./routes/lessonItem/route.js";
import scoreRoute from "./routes/score/route.js";
import forgotPasswordRoute from "./routes/auth/forgotPassword.js";

// Load environment variables
dotenv.config({ path: ".env.local" });

const app = express();

// Middleware setup
app.use(cors({
  origin: ['http://localhost:50507', 'http://localhost:3000', 'http://127.0.0.1:50507', 'http://localhost:57373', 'http://localhost:52310', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// Root route - redirect to index.html
app.get("/student", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "student", "index.html"));
});

app.get("/class", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "class", "index.html"));
});

app.get("/subject", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "subject", "index.html"));
});

// Routes
app.use("/students", studentRoute);
app.use("/classes", classRoute);
app.use("/subjects", subjectRoute);
app.use("/schedules", scheduleRoute);
app.use("/accounts", accountRoute);
app.use("/courses", courseRoute);
app.use("/lessons", lessonRoute);
app.use("/", forgotPasswordRoute);
app.use("/lessonItems", lessonItemRoute);
app.use("/scores", scoreRoute);
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
