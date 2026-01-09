import { GoogleGenAI, Type } from "@google/genai";
import { FireRiskData, GlobalNewsData } from "../types";

export const getFireRiskPrediction = async (
  location: string,
  lat?: number,
  lng?: number
): Promise<FireRiskData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Gather environmental data via Search Grounding
  const searchResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze current weather conditions, drought indexes, and recent wildfire news for ${location}. Focus on data relevant to forest fire risk.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // 2. Gather location-specific terrain data via Maps Grounding (using 2.5 Flash as requested)
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

  // 3. Synthesize into a structured risk prediction using Pro
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
    config: {
      responseMimeType: "application/json",
    },
  });

  const parsed = JSON.parse(finalResponse.text || "{}");

  // Combine grounding metadata for UI display
  const groundingSources = [
    ...(searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks ||
      []),
    ...(mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || []),
  ];

  return {
    ...parsed,
    groundingSources,
  };
};

export const getLatestWildfireNews = async (): Promise<GlobalNewsData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    return JSON.parse(
      response.text ||
        '{"headline": "No Data", "summary": "Unable to fetch news.", "fires": []}'
    );
  } catch (e) {
    console.error("Failed to parse wildfire news JSON:", e);
    return {
      headline: "Error",
      summary: "Failed to load wildfire news.",
      fires: [],
    };
  }
};
