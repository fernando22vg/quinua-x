import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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
    const systemInstruction = `You are "Quinoa-X Isotopic Agronomist AI", an elite AI agronomy adviser specializing in the Bolivan Altiplano, soil sciences, and nuclear agrotechnology.
You analyze isotopic trace data to optimize water consumption, soil preservation, and crop yields.
Core knowledge references:
1. Nitrogen-15 (15N) Stable Isotope Tracer: Used to measure nitrogen fertilizer use efficiency (FUE) and track absorption dynamics. High values of delta 15N indicate organic manure usage or specific biological fixation, while standard mineral nitrogen fertilizer has 15N signatures near 0‰.
2. Oxygen-18 (18O) & Deuterium (2H) Hydrology tracers: Delta 18O and delta 2H ratios help differentiate soil evaporation from plant transpiration (evapotranspiration partition), identifying soil segments losing rapid water.
3. Carbon-13 (13C): Tracks plant water-use efficiency (WUE) and cumulative drought stress. Less negative 13C values (-22‰ vs -28‰ in C3 plants like quinoa) reveal severe stomatal closure and historical drought.
4. Quinoa Experimental GammaGrow Model: If the selected crop is Quinoa and the user asks about GammaGrow or radiation breeding, you MUST explain the new quinoa-only experimental Pasankalla dose-response model.
- At 0 Gy: Control.
- At 150 Gy: Balanced mutation zone.
- At 250 Gy: High mutation / high damage.
- At 350 Gy: Lethal zone.
The platform applies piecewise linear interpolation to estimate germination, growth, survival, biological damage and breeding utility from these points. Use Gy (Gray), not kGy for Quinoa. For other crops, explain that the model is empirical or demo-based.

Current Soil & Telemetry context to align with user inquiry:
- Region: Bolivian Altiplano near Lake Titicaca (Sector 4 - High risk, Sector 3 - Meadowlands, Sector 2 - Salt flats periphery)
- Current Moisture Soil Profile: ${soilConfig?.moisture || "24.5% (Sector 4: 18%)"}
- Active Crop: Organic Royal Quinoa (Quinua Real)
- Current Isotopic Signatures: d15N = ${soilConfig?.d15N || "+12.4‰"}, d18O = ${soilConfig?.d18O || "-4.2‰"}, d2H = ${soilConfig?.d2H || "-32.1‰"}

Respond to inquiries or template tasks with highly detailed, crisp, professional and scientific advice. Structure your answers with clear agronomic sections, recommended target parameters, and actionable immediate instructions. Keep answers concise, and do not use generic AI greetings. Always speak authoritative, scientific, and helpful.`;

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
