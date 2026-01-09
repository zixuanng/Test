import { GoogleGenAI, Type } from "@google/genai";
import { FireRiskData, GlobalNewsData } from "../types";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  const { action, payload } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).send("GEMINI_API_KEY not set on server");

  const ai = new GoogleGenAI({ apiKey });

  try {
    if (action === "predict") {
      const { location, lat, lng } = payload || {};

      const searchResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze current weather conditions, drought indexes, and recent wildfire news for ${location}. Focus on data relevant to forest fire risk.`,
        config: { tools: [{ googleSearch: {} }] },
      });

      const mapsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Identify proximity to national parks, forested areas, and accessibility for emergency services in ${location}.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig:
              lat && lng
                ? { latLng: { latitude: lat, longitude: lng } }
                : undefined,
          },
        },
      });

      const finalResponse = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `
      Based on the following data, provide a structured wildfire risk assessment for ${location}.
      
      SEARCH DATA:
      ${searchResponse.text}
      
      TERRAIN DATA:
      ${mapsResponse.text}

      Return only a JSON object matching this structure:
      {
        "score": number (0-100),
        "level": "Low" | "Moderate" | "High" | "Extreme",
        "factors": {
          "temperature": "string summary",
          "humidity": "string summary",
          "windSpeed": "string summary",
          "vegetationDryness": "string summary"
        },
        "recommendation": "detailed early warning or safety advice"
      }
    `,
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(finalResponse.text || "{}");

      const groundingSources = [
        ...(searchResponse.candidates?.[0]?.groundingMetadata
          ?.groundingChunks || []),
        ...(mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks ||
          []),
      ];

      const out: FireRiskData = { ...parsed, groundingSources } as any;
      return res.status(200).json(out);
    }

    if (action === "news") {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents:
          "Provide a global update on current wildfires. Include a catchy headline, a short summary paragraph (max 50 words) describing the overall situation (e.g., seasonal trends, major impacted regions), and a list of at least 5 significant active fires.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              fires: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fireName: { type: Type.STRING },
                    location: { type: Type.STRING },
                    size: { type: Type.STRING },
                    status: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      try {
        const parsed = JSON.parse(response.text || "{}");
        return res.status(200).json(parsed as GlobalNewsData);
      } catch (e) {
        console.error("Failed to parse wildfire news JSON:", e);
        return res
          .status(200)
          .json({
            headline: "Error",
            summary: "Failed to load wildfire news.",
            fires: [],
          });
      }
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(String(err?.message || err));
  }
}
