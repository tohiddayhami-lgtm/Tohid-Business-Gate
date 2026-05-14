import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Setup
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY as string,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // API Routes
  app.post("/api/ai/suggest-activity", async (req, res) => {
    try {
      const { description } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `با توجه به این توضیح کسب‌وکار (به هر زبانی که کاربر نوشته): """${description}""" — سه فعالیت تجاری مرتبط با ثبت شرکت در عمان پیشنهاد بده. برای هر مورد:
- فیلد code: یک کد کوتاه لاتین (مثل RET-001 یا IT-02)
- فیلد label: توضیح کوتاه فقط به زبان فارسی
فقط یک آرایه JSON معتبر برگردان، بدون متن اضافه.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING },
                label: { type: Type.STRING }
              }
            }
          }
        }
      });
      res.json(JSON.parse(response.text || "[]"));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "خطا در دریافت پیشنهادها از سرویس هوش مصنوعی" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
