export default class TimeSystem {
    constructor(events = null) {
        this.events = events;

        // Game time constants
        this.SECONDS_PER_DAY = 600; // 10 minutes real time = 1 game day
        this.DAYS_PER_SEASON = 30;

        // 1 game hour = SECONDS_PER_DAY / 24
        this.SECONDS_PER_GAME_HOUR = this.SECONDS_PER_DAY / 24;

        this.accumulatedSeconds = 0; // Tracks time within the current day (0 to SECONDS_PER_DAY)
        this.day = 1;
        this.year = 1;
        this.seasonIndex = 0;
        this.seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

        // Weather for the current day: 'clear' or 'rain' (rolled each new day).
        this.weather = 'clear';

        // Start at 6:00 AM
        this.accumulatedSeconds = 6 * this.SECONDS_PER_GAME_HOUR;
    }

    // Pick the new day's weather. No rain in Winter; ~30% chance otherwise.
    rollWeather() {
        const rainChance = this.getSeason() === 'Winter' ? 0 : 0.3;
        return Math.random() < rainChance ? 'rain' : 'clear';
    }

    update(dt) {
        // Advance time
        this.accumulatedSeconds += dt;

        // Check for new day
        if (this.accumulatedSeconds >= this.SECONDS_PER_DAY) {
            this.accumulatedSeconds -= this.SECONDS_PER_DAY;
            this.advanceDay();
        }
    }

    advanceDay() {
        this.day++;
        let seasonChanged = false;
        if (this.day > this.DAYS_PER_SEASON) {
            this.day = 1;
            this.seasonIndex++;
            if (this.seasonIndex >= this.seasons.length) {
                this.seasonIndex = 0;
                this.year++;
            }
            seasonChanged = true;
        }
        console.log(`New Day: ${this.day} of ${this.seasons[this.seasonIndex]}, Year ${this.year}`);

        this.weather = this.rollWeather();

        if (this.events) {
            // Order matters: advance/clear watering (day) -> wither (season) ->
            // rain re-waters the new day (weather).
            this.events.emit('day:changed', { day: this.day, season: this.getSeason(), year: this.year });
            if (seasonChanged) this.events.emit('season:changed', { season: this.getSeason() });
            this.events.emit('weather:changed', { weather: this.weather });
        }
    }

    serialize() {
        return {
            accumulatedSeconds: this.accumulatedSeconds,
            day: this.day,
            year: this.year,
            seasonIndex: this.seasonIndex,
            weather: this.weather
        };
    }

    deserialize(d) {
        if (!d) return;
        if (typeof d.accumulatedSeconds === 'number') this.accumulatedSeconds = d.accumulatedSeconds;
        if (typeof d.day === 'number') this.day = d.day;
        if (typeof d.year === 'number') this.year = d.year;
        if (typeof d.seasonIndex === 'number') this.seasonIndex = d.seasonIndex;
        if (typeof d.weather === 'string') this.weather = d.weather;
    }

    // Sleep: jump to 6:00 AM of the next day (advanceDay fires the day/season/
    // weather events so crops grow, etc.).
    sleepUntilMorning() {
        this.advanceDay();
        this.accumulatedSeconds = 6 * this.SECONDS_PER_GAME_HOUR;
    }

    getGameTime() {
        // Calculate hours and minutes
        const totalHours = this.accumulatedSeconds / this.SECONDS_PER_GAME_HOUR;
        const hour = Math.floor(totalHours);
        const minutes = Math.floor((totalHours - hour) * 60);

        return { hour, minutes };
    }

    getFormattedTime() {
        const { hour, minutes } = this.getGameTime();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const displayMinutes = minutes.toString().padStart(2, '0');

        const season = this.seasons[this.seasonIndex];
        return `Y${this.year} ${season} ${this.day} • ${displayHour}:${displayMinutes} ${ampm}`;
    }

    getSeason() {
        return this.seasons[this.seasonIndex];
    }

    getLightLevel() {
        const totalHours = this.accumulatedSeconds / this.SECONDS_PER_GAME_HOUR;

        // Day: 6 AM to 6 PM (18:00) -> Bright (0.0)
        if (totalHours >= 6 && totalHours < 18) {
            return 0.0;
        }

        // Sunset: 6 PM to 8 PM -> Fade to Dark (0.6)
        if (totalHours >= 18 && totalHours < 20) {
            return ((totalHours - 18) / 2) * 0.6;
        }

        // Night: 8 PM to 4 AM -> Dark (0.6)
        if (totalHours >= 20 || totalHours < 4) {
            return 0.6;
        }

        // Sunrise: 4 AM to 6 AM -> Fade to Bright
        if (totalHours >= 4 && totalHours < 6) {
            return 0.6 - ((totalHours - 4) / 2) * 0.6;
        }

        return 0.0; // Fallback
    }

    getLightTint() {
        const totalHours = this.accumulatedSeconds / this.SECONDS_PER_GAME_HOUR;
        
        if (totalHours >= 20 || totalHours < 4) {
            // Night: Deep blue-black
            return { r: 5, g: 5, b: 35, a: 0.65 };
        }
        
        if (totalHours >= 4 && totalHours < 6) {
            // Sunrise: Transition from deep blue to soft pink/orange
            const t = (totalHours - 4) / 2; // 0 to 1
            return {
                r: 5 + t * (230 - 5),
                g: 5 + t * (120 - 5),
                b: 35 + t * (80 - 35),
                a: 0.65 - t * 0.35
            };
        }
        
        if (totalHours >= 6 && totalHours < 8) {
            // Morning: Soft golden glow
            const t = (totalHours - 6) / 2; // 0 to 1
            return {
                r: 230 + t * (255 - 230),
                g: 120 + t * (250 - 120),
                b: 80 + t * (200 - 80),
                a: 0.3 * (1 - t)
            };
        }
        
        if (totalHours >= 8 && totalHours < 17) {
            // Mid-day: Clear, bright (no tint)
            return { r: 255, g: 255, b: 255, a: 0.0 };
        }
        
        if (totalHours >= 17 && totalHours < 19) {
            // Late Afternoon/Golden Hour: Warm golden/orange overlay
            const t = (totalHours - 17) / 2; // 0 to 1
            return {
                r: 255,
                g: 255 - t * (255 - 140),
                b: 255 - t * (255 - 50),
                a: t * 0.35
            };
        }
        
        if (totalHours >= 19 && totalHours < 20) {
            // Sunset: Transition from orange to deep purple-blue
            const t = (totalHours - 19) / 1; // 0 to 1
            return {
                r: 255 - t * (255 - 5),
                g: 140 - t * (140 - 5),
                b: 50 + t * (35 - 50),
                a: 0.35 + t * 0.30
            };
        }
        
        return { r: 0, g: 0, b: 0, a: 0.0 };
    }
}
