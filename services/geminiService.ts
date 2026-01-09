import { FireRiskData, GlobalNewsData } from "../types";

const apiPost = async (action: string, payload?: any) => {
  const res = await fetch(`/api/gemini`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error: ${res.status} ${text}`);
  }

  return res.json();
};

export const getFireRiskPrediction = async (
  location: string,
  lat?: number,
  lng?: number
): Promise<FireRiskData> => {
  return apiPost("predict", { location, lat, lng });
};

export const getLatestWildfireNews = async (): Promise<GlobalNewsData> => {
  return apiPost("news");
};
