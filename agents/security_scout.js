/**
 * Agent Gamma: Security Scout
 * Monitors TSA security wait times at IAD (Dulles) and BOS (Logan).
 */

import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityScout {
    constructor() {
        this.airports = [
            { id: 'IAD', name: 'Dulles International' },
            { id: 'BOS', name: 'Boston Logan' }
        ];
        this.itineraryPath = path.resolve(__dirname, '../data/itinerary.json');
    }

    async init() {
        console.log('[SecurityScout] Initializing TSA monitoring systems...');
        this.startMonitoring();
    }

    async checkWaitTimes() {
        console.log(`[SecurityScout] ${new Date().toISOString()} - Fetching TSA wait times for IAD and BOS...`);

        const statusData = {};

        for (const airport of this.airports) {
            try {
                // Mocking the scraping/API logic
                // In a real scenario, we'd use the Dulles Wait API for IAD and Scrape Logan's mobile site
                const waits = this.simulateWaitTimes(airport.id);
                statusData[airport.id] = waits;
                console.log(`[SecurityScout] ${airport.id}: Standard: ${waits.standard} min | PreCheck: ${waits.precheck} min`);
            } catch (error) {
                console.error(`[SecurityScout] Error checking ${airport.id}:`, error);
            }
        }

        this.saveStatus(statusData);
    }

    simulateWaitTimes(airportId) {
        // Logic based on the search research
        // IAD usually very fast, BOS can be peaky
        if (airportId === 'IAD') {
            return {
                standard: Math.floor(Math.random() * 15) + 2,
                precheck: Math.floor(Math.random() * 5) + 1,
                status: 'Green'
            };
        } else {
            // Logan peaked at 45m in terminal C
            const peak = new Date().getHours() >= 7 && new Date().getHours() <= 9 ? 30 : 10;
            return {
                standard: Math.floor(Math.random() * 15) + peak,
                precheck: Math.floor(Math.random() * 10) + 5,
                status: peak > 20 ? 'Yellow' : 'Green'
            };
        }
    }

    saveStatus(data) {
        const statusFile = path.resolve(__dirname, '../data/security_status.json');
        fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
    }

    startMonitoring() {
        // Check every 15 minutes
        cron.schedule('*/15 * * * *', () => {
            this.checkWaitTimes();
        });

        // Immediate check
        this.checkWaitTimes();
    }
}

const scout = new SecurityScout();
scout.init();

export default SecurityScout;
