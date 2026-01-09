import React, { useState } from "react";
import { getFireRiskPrediction } from "../services/geminiService";
import { FireRiskData } from "../types";

const Predictor: React.FC = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FireRiskData | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    setLoading(true);
    try {
      const data = await getFireRiskPrediction(location);
      setResult(data);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-emerald-500";
      case "Moderate":
        return "bg-yellow-500";
      case "High":
        return "bg-orange-600";
      case "Extreme":
        return "bg-red-600";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span className="text-orange-500">🔥</span> AI Risk Analysis
        </h2>
        <p className="text-slate-400 mb-8">
          Enter a region to analyze wildfire risk using real-time satellite and
          meteorological data.
        </p>

        <form
          onSubmit={handlePredict}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Yosemite National Park, California"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{" "}
                Calculating...
              </>
            ) : (
              "Analyze Risk"
            )}
          </button>
        </form>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                <div
                  className={`w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center relative`}
                >
                  <div
                    className="absolute inset-0 rounded-full border-8 border-orange-500/20"
                    style={{ clipPath: `inset(${100 - result.score}% 0 0 0)` }}
                  ></div>
                  <span className="text-4xl font-bold">{result.score}%</span>
                </div>
                <div
                  className={`mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getRiskColor(
                    result.level
                  )}`}
                >
                  {result.level} Risk
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Temperature",
                    val: result.factors.temperature,
                    icon: "🌡️",
                  },
                  {
                    label: "Humidity",
                    val: result.factors.humidity,
                    icon: "💧",
                  },
                  {
                    label: "Wind Speed",
                    val: result.factors.windSpeed,
                    icon: "🌬️",
                  },
                  {
                    label: "Dryness",
                    val: result.factors.vegetationDryness,
                    icon: "🍂",
                  },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="bg-slate-950/50 p-4 rounded-xl border border-slate-800"
                  >
                    <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                      <span>{f.icon}</span> {f.label}
                    </div>
                    <div className="text-sm font-medium text-slate-200">
                      {f.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-950/20 border border-orange-900/50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-orange-400 mb-2 flex items-center gap-2">
                ⚠️ Recommendation
              </h3>
              <p className="text-slate-300 leading-relaxed italic">
                "{result.recommendation}"
              </p>
            </div>

            {result.groundingSources.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verification Sources
                </h4>
                <div className="flex flex-wrap gap-3">
                  {result.groundingSources.map((source, i) => {
                    const link = source.web || source.maps;
                    if (!link) return null;
                    return (
                      <a
                        key={i}
                        href={link.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        {link.title || "Source Reference"}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictor;
