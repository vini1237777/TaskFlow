import app, { prisma } from "../src/app";

let isConnected = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isConnected) {
      await prisma.$connect();
      isConnected = true;
      console.log("Database connected");
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel function error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
