import express from "express";
import path from "path";
import studentRoute from "./routes/student/route.js";
import classRoute from "./routes/class/route.js";
import subjectRoute from "./routes/subject/route.js";
import { connectDB } from "./config/db.js";
const app = express();
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
// Routes
app.use("/students", studentRoute);
app.use("/classes", classRoute);
app.use("/subjects", subjectRoute);
const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB connected successfully!");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=app.js.map