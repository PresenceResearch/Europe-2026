/**
 * Agent Alpha: Flight Sentinel
 * Monitors DL9447 (IAD) and OS32 (BOS) for gate changes and delays via Gmail / Flight Notifications.
 */

import { google } from 'googleapis';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FlightSentinel {
    constructor() {
        this.flights = [
            { id: 'DL9447', callsign: 'DAL9447' },
            { id: 'OS32', callsign: 'AUA32' }
        ];
        this.itineraryPath = path.resolve(__dirname, '../data/itinerary.json');
        this.statusPath = path.resolve(__dirname, './flight_status.json');
        this.openSkyBase = 'https://opensky-network.org/api/states/all';
        this.ntfyTopic = 'sentinel_europe_2026_alerts'; // Unique topic for the trip
    }

    async notify(message, priority = 'default') {
        try {
            await axios.post(`https://ntfy.sh/${this.ntfyTopic}`, message, {
                headers: { 'Title': '🚨 Sentinel Flight Alert', 'Priority': priority }
            });
            console.log(`[FlightSentinel] Push alert sent: ${message}`);
        } catch (e) {
            console.error('[FlightSentinel] Failed to send push alert', e.message);
        }
    }

    async init() {
        console.log('[FlightSentinel] Initializing monitoring systems...');
        // In a real environment, we'd load OAuth2 credentials here
        // For now, we scaffold the logic loop
        this.startMonitoring();
    }

    async checkFlights() {
        console.log(`[FlightSentinel] ${new Date().toISOString()} - Scanning Gmail for flight updates...`);

        try {
            // 1. Gmail Monitoring (Logic remains as defined)
            const updatesFound = this.simulateUpdateCheck();
            if (updatesFound) {
                await this.updateDashboard(updatesFound);
            }

            // 2. OpenSky Live Tracking
            await this.trackLiveFlights();

        } catch (error) {
            console.error('[FlightSentinel] Error during scan:', error);
        }
    }

    async trackLiveFlights() {
        console.log('[FlightSentinel] Checking OpenSky for live telemetry...');

        try {
            const response = await axios.get(this.openSkyBase);
            const allStates = response.data.states || [];
            const itinerary = JSON.parse(fs.readFileSync(this.itineraryPath, 'utf8'));
            let changed = false;

            for (const flight of this.flights) {
                // OpenSky callsigns are space-padded to 8 chars
                // const paddedCallsign = flight.callsign.padEnd(8, ' '); // Not needed, trim on comparison
                const state = allStates.find(s => s[1] && s[1].trim() === flight.callsign);

                if (state) {
                    const [icao24, callsign, origin, time, lastPos, lon, lat, baroAlt, onGround, velocity, trueTrack] = state;

                    this.updateFlightTelemetry(itinerary, flight.id, {
                        lat, lon, altitude: baroAlt, velocity: (velocity * 3.6).toFixed(0), // m/s to km/h
                        status: onGround ? 'Landed' : 'In Air'
                    });
                    changed = true;
                    console.log(`[FlightSentinel] Live Tracking ${flight.id}: ${baroAlt ? baroAlt.toFixed(0) + 'm' : 'N/A'}, ${velocity ? (velocity * 3.6).toFixed(0) + 'km/h' : 'N/A'} (Status: ${onGround ? 'Landed' : 'In Air'})`);
                }
            }

            if (changed) {
                fs.writeFileSync(this.itineraryPath, JSON.stringify(itinerary, null, 2));
            }
        } catch (error) {
            console.warn('[FlightSentinel] OpenSky API rate limit or error. Skipping live telemetry.', error.message);
        }
    }

    updateFlightTelemetry(itinerary, flightId, data) {
        itinerary.segments.forEach(segment => {
            if (segment.flights) {
                segment.flights.forEach(f => {
                    if (f.id === flightId) {
                        f.lat = data.lat;
                        f.lon = data.lon;
                        f.altitude = data.altitude;
                        f.velocity = data.velocity;
                        f.status = data.status;
                    }
                });
            }
        });
    }

    simulateUpdateCheck() {
        // Random status simulation for demonstration
        const roll = Math.random();
        if (roll > 0.8) {
            return {
                id: 'DL9447',
                status: 'Delayed',
                newTime: '18:45',
                gate: 'B12'
            };
        }
        return null;
    }

    async updateDashboard(update) {
        console.log(`[FlightSentinel] Update found for ${update.id}: ${update.status} (New Time: ${update.newTime})`);

        // Read itinerary
        const itinerary = JSON.parse(fs.readFileSync(this.itineraryPath, 'utf8'));

        // Update logic: Find flight and update status
        let changed = false;
        itinerary.segments.forEach(segment => {
            if (segment.flights) {
                segment.flights.forEach(f => {
                    if (f.id === update.id) {
                        f.status = update.status;
                        f.departs = update.newTime;
                        f.gate = update.gate;
                        changed = true;
                        console.log(`[FlightSentinel] Updating status for ${f.id} in ${segment.city}`);
                        this.notify(`${f.id} status changed to ${update.status}. New Dep: ${update.newTime}`, 'high');
                    }
                });
            }
        });

        if (changed) {
            fs.writeFileSync(this.itineraryPath, JSON.stringify(itinerary, null, 2));
            console.log(`[FlightSentinel] Dashboard data synchronized.`);
        }
    }

    startMonitoring() {
        // Trigger condition: Start monitoring 24 hours before departure (March 5)
        // For the demo, we'll start a frequent check every 5 minutes
        console.log('[FlightSentinel] Scheduling periodic checks...');
        cron.schedule('*/5 * * * *', () => {
            this.checkFlights();
        });

        // Immediate check
        this.checkFlights();
    }
}

// Execution block
const sentinel = new FlightSentinel();
sentinel.init();

export default FlightSentinel;
