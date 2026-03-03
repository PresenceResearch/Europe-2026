# Europe 2026 Control Center

Autonomous travel logistics and monitoring system for the March 2026 Europe trip.

## Features
- **Travel Dashboard**: Real-time itinerary visualization with clean, premium UI.
- **Agent Alpha (Flight Sentinel)**: Monitors flights (DL9447, OS32) via Gmail.
- **Agent Beta (Transit Scraper)**: Daily monitoring of DB Bahn/RegioJet train fares.

## Project Structure
- `/src`: Frontend React application (Vite-powered).
- `/agents`: Autonomous Node.js agents.
- `/data`: Structured travel data (itinerary).

## How to Run
### Dashboard (Frontend)
```bash
npm install
npm run dev
```

### Agents
To start the monitoring agents:
```bash
node agents/flight_sentinel.js
node agents/transit_scraper.js
```

## Status
- [x] Project Scaffolded
- [x] Dashboard UI Implemented
- [x] Agent Logic Implemented
- [ ] Google Auth Integration (Pending User Credentials)
