# IgnisGuard

AI-Powered Forest Fire Prediction & Monitoring

IgnisGuard is a TypeScript web application that provides real-time forest-fire prediction, monitoring, and situational awareness. It combines satellite data, meteorological feeds, and machine learning models to surface high-risk zones, generate risk scores, and give actionable recommendations to responders and operators.

> NOTE: This README is tailored to the information you provided (web app, TypeScript, npm). If you want me to include framework-specific install/run instructions (e.g., Next.js, Vite, Create React App), tell me which framework you used and I will update the commands.

Contents

- [About](#about)
- [Features](#features)
- [Demo / Screenshots](#demo--screenshots)
- [Quickstart](#quickstart)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Maintainers / Contact](#maintainers--contact)

## About

IgnisGuard helps teams detect, predict, and monitor wildfires using an AI-first approach:

- Continuously ingests satellite and meteorological data to build a global risk heatmap.
- Runs trained ML models to compute localized risk scores and confidence.
- Surfaces alerts and recommended actions through a responsive web dashboard and prediction UI.

Target users: emergency responders, environmental teams, researchers, and site operators who need near real-time situational awareness and predictive insights about wildfire risk.

High-level architecture: frontend web app (TypeScript) that calls backend APIs for telemetry, model inference, and data aggregation. The frontend includes a global dashboard and a Predictor view for targeted analysis.

## Features

- Global risk dashboard with geospatial heatmap and active alerts
- Per-region AI risk analysis (confidence score, contributing factors)
- Real-time news & incident list integration
- Configurable alert thresholds and notification hooks
- Exportable reports for incidents and predictions
- Mobile-friendly responsive UI
- Extensible adapters for satellite / weather data sources

Supported platforms: modern desktop and mobile browsers. Built in TypeScript; runs with npm tooling.

## Demo / Screenshots

Replace image paths with the actual files you committed to the repo (examples below use `assets/images/`).

Dashboard (Global Overview)
![IgnisGuard Dashboard](assets/images/dashboard.png)

Predictor (AI Risk Analysis)
![IgnisGuard Predictor](assets/images/predictor.png)

If your images are named differently, update the paths above. You can also add GIFs to `assets/gifs/` for interactive demos.

## Quickstart

Prerequisites:
- Node.js (>= 16 recommended)
- npm (>= 8)
- Optional: an account/API key for your satellite/weather provider (if required)

Minimal steps (framework-agnostic):
```bash
# clone the repo
git clone https://github.com/<your-org>/IgnisGuard.git
cd IgnisGuard

# install dependencies
npm install

# run local dev server
npm run dev

# build for production
npm run build

# preview a production build (if supported)
npm run preview
```

If your project is using Next.js, Vite, or another framework, replace dev/build commands with framework-specific scripts (I can update this for you).

## Installation

From source:
```bash
git clone https://github.com/zixuanng/IgnisGuard.git
cd IgnisGuard
npm install
```

Docker (example image name; replace with your published image if available):
```bash
docker build -t ignisguard/web .
docker run --rm -p 3000:3000 -e NODE_ENV=production ignisguard/web
```

Package manager:
- Install globally (if you provide a packaged CLI or runner): `npm install -g ignisguard` (not applicable unless you publish)

## Usage

Common navigation and features:

- Dashboard: global heatmap, active alerts, response metrics, news feed.
- Predictor: enter a region (city, park, coordinates), click "Analyze Risk" to run the model and view a localized risk score with contributing factors (temperature, humidity, wind, dryness).
- Alerts: configure thresholds for automatic notifications to webhooks or email.

Example: analyze a location from the Predictor UI:
1. Open Predictor.
2. Type region (e.g. "Yosemite National Park, United States") into the input.
3. Click "Analyze Risk".
4. Review the risk score, confidence, and recommendations.

APIs
If you expose backend APIs for predictions or data ingestion, document them here with example requests. Example (replace with real endpoints):

```http
POST /api/predict
Content-Type: application/json

{
  "location": "37.8651,-119.5383",
  "radius_km": 10
}
```

Response:
```json
{
  "score": 0.05,
  "confidence": 0.942,
  "factors": {
    "temperature": "low",
    "humidity": "high",
    "wind_speed": "moderate"
  }
}
```

## Configuration

Common environment variables and config options (tweak to match your app):

GEMINI_API_KEY - Google Searches, real-time news, satellite info

## Development

Recommended npm scripts (add to your package.json if missing):
```json
{
  "scripts": {
    "dev": "vite",            // or your framework's dev command (next dev / react-scripts start)
    "build": "vite build",    // or next build / react-scripts build
    "preview": "vite preview",// or next start
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "format": "prettier --write .",
    "test": "vitest"          // or jest / mocha depending on project
  }
}
```

Local development checklist:
- Create a `.env.local` with required API keys and endpoints (see Configuration).
- Run `npm install` and then `npm run dev`.
- Use your browser to open the local dev server (default port shown in console).

Architecture notes for contributors:
- Keep UI components TypeScript-first; prefer functional components and hooks (if React).
- Isolate model/ML calls behind an API layer—frontend should call stable endpoints for inference.
- Keep providers (maps, telemetry) injectable to make testing and local dev easier.

## Testing

Unit and integration testing guidelines:
- Use a unit test runner (Jest, Vitest) for UI and utility functions.
- Mock backend requests with MSW (Mock Service Worker) for predictable UI tests.
- Run tests:
```bash
npm run test
```
- Add coverage reporting via nyc or built-in tools from your test runner.

CI: When you add CI later, configure the pipeline to:
- Run linter & formatter checks
- Run tests with coverage
- Build the production artifact

## Maintainers / Contact

- Maintainer: ZX Ng (@zixuanng)
- Email: nzx1978@hotmail.com

---
