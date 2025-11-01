// src/config/db.ts
import mongoose from "mongoose";

/**
 * Hàm kết nối MongoDB dùng Mongoose
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("❌ Thiếu MONGODB_URI trong file .env.local");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Kết nối MongoDB thành công!");
  } catch (error: any) {
    console.error("❌ Lỗi khi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};
