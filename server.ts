import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Interactive Isotopic AI Agronomist Chat API
app.post("/api/agronomist", async (req, res) => {
  const { messages, soilConfig } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Invalid request payload. 'messages' must be an array." });
    return;
  }

  try {
    const ai = getGeminiClient();

    // Construct system instructions with deep scientific context
    const systemInstruction = `You are "Quinoa-X Isotopic Agronomist AI", an elite AI agronomy adviser specializing in the Bolivian Altiplano, soil sciences, and nuclear agrotechnology.

FORMATTING RULES (critical):
- Never use LaTeX notation like $\delta^{15}$ or \text{}. Use plain Unicode instead: δ¹⁵N, δ¹⁸O, δ²H, ‰
- Use **bold** for section titles and key terms
- Use numbered lists (1. 2. 3.) or bullet points (- item) for recommendations
- Keep responses under 250 words, structured and scannable
- No generic greetings or filler phrases

SCIENTIFIC CONTEXT:
- δ¹⁵N tracer: measures nitrogen fertilizer use efficiency. High δ¹⁵N (+10 to +20‰) = organic manure or biological fixation. Near 0‰ = synthetic fertilizer.
- δ¹⁸O & δ²H: differentiate soil evaporation from plant transpiration. Key for water stress detection.
- δ¹³C: tracks water-use efficiency and drought stress. Less negative values (-22‰ vs -28‰) = severe stomatal closure.
- GammaGrow Model (Quinoa Pasankalla): 0 Gy = Control | 150 Gy = Balanced mutation | 250 Gy = High mutation/damage | 350 Gy = Lethal. Interpolated for germination, survival, and breeding utility.

CURRENT FIELD DATA:
- Region: Bolivian Altiplano near Lake Titicaca
- Sectors: 4 (High risk), 3 (Meadowlands), 2 (Salt flats periphery)
- Soil Moisture: ${soilConfig?.moisture || "24.5% (Sector 4: 18%)"}
- Crop: Organic Royal Quinoa (Quinua Real)
- δ¹⁵N = ${soilConfig?.d15N || "+12.4‰"}, δ¹⁸O = ${soilConfig?.d18O || "-4.2‰"}, δ²H = ${soilConfig?.d2H || "-32.1‰"}

Answer any agriculture, soil science, or farming question. Be direct, scientific, and actionable.`;

    // Map message list to Gemini SDK expectations
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "No response received from the model.";
    res.json({ text: responseText });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message || "An error occurred while calling the Gemini API." });
  }
});

// Soil analysis and recommendations generator (Specific tool task)
app.post("/api/analyze-sector", async (req, res) => {
  const { sectorId, moisture, health, d15N, d18O, d2H } = req.body;

  try {
    const ai = getGeminiClient();
    const systemInstruction = "You are a senior soil analyst expert in isotopic hydrology.";
    const prompt = `Analyze Sector ${sectorId} soil profile and generate an urgent agronomical dispatch.

    Metrics:
    - Soil Moisture: ${moisture}% (Optimal target: 35%)
    - Photosynthetic Crop Health: ${health}%
    - Nitrogen-15 isotopic tracer (fertilizer absorption indicator): ${d15N}‰
    - Oxygen-18 isotopic tracer (evap-transpiration ratio): ${d18O}‰
    - Deuterium isotopic tracer (groundwater source): ${d2H}‰

    Please output a structured JSON report containing:
    1. "verdict": "CRITICAL" | "CAUTION" | "OPTIMAL"
    2. "analysis": A 2-sentence summary of the isotope dynamic and moisture status.
    3. "recommendations": Three specific bullet instructions. (e.g. adjust drip irrigation, shift nitrogen tracer testing interval, deploy biological mulch).

    Make sure your JSON has exactly these fields without markdown wrapping blocks.
    Use this JSON output constraint: responseMimeType: "application/json"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("Sector Analysis Error:", err);
    res.status(500).json({ error: err.message || "An error occurred while generating sector analysis." });
  }
});

async function startServer() {
  // Vite dev server integration or static file serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
