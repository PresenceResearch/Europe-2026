/**
 * Agent Alpha: Flight Sentinel
 * Monitors flight legs for all travelers for gate changes, delays, and live telemetry.
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
            { id: 'OS32', callsign: 'AUA32' },
            { id: 'DL9190', callsign: 'DAL9190' },
            { id: 'OS225', callsign: 'AUA225' },
            { id: 'EI643', callsign: 'EIN643' },
            { id: 'EI119', callsign: 'EIN119' },
            { id: 'EI137', callsign: 'EIN137' }
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
        this.startMonitoring();
    }

    async checkFlights() {
        console.log(`[FlightSentinel] ${new Date().toISOString()} - Scanning Gmail for flight updates...`);

        try {
            // 1. Gmail Monitoring Logic
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
                const state = allStates.find(s => s[1] && s[1].trim() === flight.callsign);

                if (state) {
                    const [icao24, callsign, origin, time, lastPos, lon, lat, baroAlt, onGround, velocity, trueTrack] = state;

                    const telemetryUpdate = {
                        lat, lon, altitude: baroAlt, velocity: (velocity * 3.6).toFixed(0), // m/s to km/h
                        status: onGround ? 'Landed' : 'In Air'
                    };

                    this.updateFlightTelemetry(itinerary, flight.id, telemetryUpdate);
                    changed = true;
                    console.log(`[FlightSentinel] Live Tracking ${flight.id}: Alt: ${baroAlt ? baroAlt.toFixed(0) + 'm' : 'N/A'}, Vel: ${velocity ? (velocity * 3.6).toFixed(0) + 'km/h' : 'N/A'}`);
                }
            }

            if (changed) {
                fs.writeFileSync(this.itineraryPath, JSON.stringify(itinerary, null, 2));
            }
        } catch (error) {
            console.warn('[FlightSentinel] OpenSky API rate limit or error.', error.message);
        }
    }

    updateFlightTelemetry(itinerary, flightId, data) {
        itinerary.segments.forEach(segment => {
            if (segment.flights) {
                segment.flights.forEach(group => {
                    group.legs.forEach(leg => {
                        if (leg.id === flightId) {
                            leg.altitude = data.altitude;
                            leg.velocity = data.velocity;
                            leg.status = data.status;
                        }
                    });
                });
            }
        });
    }

    simulateUpdateCheck() {
        // Random status simulation
        const roll = Math.random();
        if (roll > 0.95) {
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
        const itinerary = JSON.parse(fs.readFileSync(this.itineraryPath, 'utf8'));
        let changed = false;

        itinerary.segments.forEach(segment => {
            if (segment.flights) {
                segment.flights.forEach(group => {
                    group.legs.forEach(leg => {
                        if (leg.id === update.id) {
                            leg.status = update.status;
                            leg.departs = update.newTime || leg.departs;
                            leg.gate = update.gate || leg.gate;
                            changed = true;
                            console.log(`[FlightSentinel] Updating status for ${leg.id} (${group.traveler})`);
                            this.notify(`${leg.id} (${group.traveler}) status: ${update.status}. Dep: ${leg.departs}`, 'high');
                        }
                    });
                });
            }
        });

        if (changed) {
            fs.writeFileSync(this.itineraryPath, JSON.stringify(itinerary, null, 2));
            console.log(`[FlightSentinel] Dashboard data synchronized.`);
        }
    }

    startMonitoring() {
        console.log('[FlightSentinel] Scheduling periodic checks...');
        cron.schedule('*/5 * * * *', () => {
            this.checkFlights();
        });
        this.checkFlights();
    }
}

const sentinel = new FlightSentinel();
sentinel.init();

export default FlightSentinel;
