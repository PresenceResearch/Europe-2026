/**
 * Agent Alpha: Flight Sentinel
 * Monitors DL9447 (IAD) and OS32 (BOS) for gate changes and delays via Gmail / Flight Notifications.
 */

import { google } from 'googleapis';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FlightSentinel {
    constructor() {
        this.flights = ['DL9447', 'OS32'];
        this.itineraryPath = path.resolve(__dirname, '../data/itinerary.json');
        this.statusPath = path.resolve(__dirname, './flight_status.json');
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
            // Mock logic: scanning for specific flight IDs in messasge snippets
            // Real implementation would use gmail.users.messages.list({ q: 'flight status DL9447' })

            const updatesFound = this.simulateUpdateCheck();

            if (updatesFound) {
                await this.updateDashboard(updatesFound);
            }
        } catch (error) {
            console.error('[FlightSentinel] Error checking flight status:', error);
        }
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
