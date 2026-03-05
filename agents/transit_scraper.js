/**
 * Agent Beta: Transit Scraper
 * Monitors DB Bahn and RegioJet for the lowest "Flex" fares for train segments.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TransitScraper {
    constructor() {
        this.segments = [
            { from: 'Berlin', to: 'Dresden', date: '2026-03-11' }
        ];
        this.itineraryPath = path.resolve(__dirname, '../data/itinerary.json');
        this.ntfyTopic = 'sentinel_europe_2026_alerts';
    }

    async notify(message) {
        try {
            await axios.post(`https://ntfy.sh/${this.ntfyTopic}`, message, {
                headers: { 'Title': '🚆 Transit Price alert', 'Tags': 'euro,train' }
            });
        } catch (e) {
            console.error('[TransitScraper] Failed to send notification:', e.message);
        }
    }

    async init() {
        console.log('[TransitScraper] Initializing scraper agent...');
        this.scheduleChecks();
    }

    async scrapeFares() {
        console.log(`[TransitScraper] ${new Date().toISOString()} - Fetching fares for train segments...`);

        for (const segment of this.segments) {
            try {
                // In a real scenario, we'd use a headless browser or an API
                // For now, we simulate the scraping logic
                const price = await this.simulateScrape(segment);
                console.log(`[TransitScraper] Found Flex fare for ${segment.from} -> ${segment.to}: €${price}`);

                await this.updatePriceWidget(segment, price);
            } catch (error) {
                console.error(`[TransitScraper] Failed to scrape fares for ${segment.from}:`, error);
            }
        }
    }

    async simulateScrape(segment) {
        // Return a random price between 30 and 70
        return (35 + Math.random() * 40).toFixed(2);
    }

    async updatePriceWidget(segment, price) {
        // In a real app, this might update a database or a state file
        // Here we'll log it as the primary action
        console.log(`[TransitScraper] Price update: ${segment.from} -> ${segment.to} is €${price}`);

        const currentPrice = parseFloat(price);
        if (currentPrice < 55) {
            console.log(`[TransitScraper] Price drop detected! Current: €${currentPrice}`);
            // this.notify(`Price drop for ${segment.from} -> ${segment.to}! Now only €${currentPrice}. Check DB Bahn.`);
        }
    }

    scheduleChecks() {
        // Trigger: Daily check at 09:00 CET
        // For demo: Check every hour
        cron.schedule('0 * * * *', () => {
            this.scrapeFares();
        });

        // Immediate check
        this.scrapeFares();
    }
}

const scraper = new TransitScraper();
scraper.init();

export default TransitScraper;
