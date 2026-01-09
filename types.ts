
export interface FireRiskData {
  score: number; // 0-100
  level: 'Low' | 'Moderate' | 'High' | 'Extreme';
  factors: {
    temperature: string;
    humidity: string;
    windSpeed: string;
    vegetationDryness: string;
  };
  recommendation: string;
  groundingSources: Array<{ web?: { uri: string; title: string }; maps?: { uri: string; title: string } }>;
}

export interface ActiveWildfire {
  id: string;
  name: string;
  location: string;
  status: string;
  threatLevel: 'Yellow' | 'Orange' | 'Red';
  lat: number;
  lng: number;
}

export interface WildfireNewsItem {
  fireName: string;
  location: string;
  size: string;
  status: string;
}

export interface GlobalNewsData {
  headline: string;
  summary: string;
  fires: WildfireNewsItem[];
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  MAP = 'map',
  PREDICTOR = 'predictor',
  NEWS = 'news'
}
