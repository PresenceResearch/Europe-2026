import React, { useState, useEffect } from 'react';
import {
    Plane,
    Hotel,
    Train,
    MapPin,
    ShieldCheck,
    Activity,
    Clock,
    ExternalLink,
    ChevronRight,
    Wifi,
    Wind,
    Cloud,
    Sun,
    CloudRain,
    Thermometer,
    Umbrella,
    Coins,
    RefreshCcw,
    TrendingDown,
    TrendingUp,
    ShieldAlert,
    Fingerprint,
    Timer
} from 'lucide-react';
import itineraryData from '../data/itinerary.json';

const SecurityWidget = ({ airportId }) => {
    // Mock live security status - in a real app this would fetch from security_status.json
    const statusMap = {
        'IAD': { standard: 4, precheck: 2, status: 'Green', name: 'Dulles International' },
        'BOS': { standard: 28, precheck: 12, status: 'Yellow', name: 'Logan Intl (Terminal E)' }
    };

    const data = statusMap[airportId] || { standard: '--', precheck: '--', status: 'Gray', name: 'Security Scanning' };

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-amber-500/20 shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <ShieldAlert size={14} className="text-amber-500" /> TSA Wait Times
                    </h3>
                    <p className="text-lg font-bold text-slate-200">{data.name}</p>
                </div>
                <div className={`w-3 h-3 rounded-full animate-pulse ${data.status === 'Green' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-2">
                        <Fingerprint size={12} className="text-indigo-400" /> STANDARD
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{data.standard}</span>
                        <span className="text-xs text-slate-500">min</span>
                    </div>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-2">
                        <ShieldAlert size={12} className="text-emerald-400" /> PRE✓
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-emerald-400">{data.precheck}</span>
                        <span className="text-xs text-slate-500">min</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Timer size={14} className="text-indigo-400" />
                    <span>Last Poll: 10:35 AM</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 tracking-tighter uppercase">Live Network Sync</span>
            </div>
        </div>
    );
};

const CurrencyWidget = ({ city }) => {
    // Mock rates - in a real app this would fetch from an API like fixer.io or exchangeratesapi.io
    const ratesMap = {
        'Berlin': { currency: 'EUR', rate: 0.94, symbol: '€', trend: <TrendingDown size={14} className="text-emerald-400" />, change: '-0.2%' },
        'Prague': { currency: 'CZK', rate: 23.45, symbol: 'Kč', trend: <TrendingUp size={14} className="text-rose-400" />, change: '+1.1%' },
        'Departure': { currency: 'EUR', rate: 0.94, symbol: '€', trend: <TrendingDown size={14} className="text-emerald-400" />, change: '-0.2%' }
    };

    const data = ratesMap[city] || ratesMap['Berlin'];

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-500/20 shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Coins size={14} /> Exchange Rate
                    </h3>
                    <p className="text-lg font-bold text-slate-200">USD to {data.currency}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <RefreshCcw size={20} className="text-emerald-400" />
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">1.00 USD</span>
                    <span className="text-4xl font-bold text-white tracking-tight">{data.rate}{data.symbol}</span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        {data.trend}
                        <span className={`text-sm font-bold ${data.change.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {data.change}
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">24h Change</p>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>Official Rate</span>
                    <span className="text-indigo-400 font-mono">Synced 09:00 CET</span>
                </div>
            </div>
        </div>
    );
};

const WeatherWidget = ({ city }) => {
    // Mock weather data - in a real app this would fetch from OpenWeatherMap
    const weatherMap = {
        'Berlin': { temp: 4, condition: 'Light Rain', icon: <CloudRain className="text-blue-400" />, high: 7, low: 1 },
        'Dresden': { temp: 3, condition: 'Clear', icon: <Sun className="text-yellow-400" />, high: 6, low: 0 },
        'Prague': { temp: 2, condition: 'Mostly Cloudy', icon: <Cloud className="text-slate-400" />, high: 5, low: -2 },
        'IAD': { temp: 12, condition: 'Clear', icon: <Sun className="text-yellow-400" />, high: 15, low: 8 },
        'BOS': { temp: 8, condition: 'Breezy', icon: <Wind className="text-slate-300" />, high: 11, low: 4 },
        'Departure': { temp: 12, condition: 'Clear', icon: <Sun className="text-yellow-400" />, high: 15, low: 8 }
    };

    const currentCity = city === 'Departure' ? 'IAD' : city;
    const data = weatherMap[currentCity] || { temp: '--', condition: 'Scanning...', icon: <Cloud />, high: '--', low: '--' };

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-indigo-500/20 shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Thermometer size={14} /> Local Weather
                    </h3>
                    <p className="text-lg font-bold text-slate-200">{city}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                    {data.icon}
                </div>
            </div>

            <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-bold text-white leading-none">{data.temp}°</span>
                <span className="text-indigo-400 font-medium pb-1">C</span>
                <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-slate-200">{data.condition}</p>
                    <p className="text-xs text-slate-500">H: {data.high}° L: {data.low}°</p>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Umbrella size={14} className="text-indigo-400" />
                    <span>15% Precip</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Wind size={14} className="text-indigo-400" />
                    <span>12 km/h</span>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [activeSegment, setActiveSegment] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const segments = itineraryData.segments;

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                        Europe 2026 Control Center
                    </h1>
                    <p className="text-slate-400 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        Autonomous Monitoring Active
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Local Time */}
                    <div className="glass-card flex items-center gap-6 py-2 px-6">
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Local Time</p>
                            <p className="text-xl font-mono text-indigo-300">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                        <div className="h-8 w-px bg-slate-700"></div>
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <Activity size={14} className="text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    {/* Destination Time */}
                    <div className="glass-card flex items-center gap-6 py-2 px-6 border-emerald-500/20 bg-emerald-500/5">
                        <div className="text-right">
                            <p className="text-xs text-emerald-500 uppercase tracking-widest font-bold">Berlin/Prague</p>
                            <p className="text-xl font-mono text-emerald-300">
                                {new Intl.DateTimeFormat([], {
                                    timeZone: 'Europe/Berlin',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                }).format(currentTime)}
                            </p>
                        </div>
                        <div className="h-8 w-px bg-slate-700"></div>
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <Clock size={14} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Itinerary Navigation */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Trip Timeline</h3>
                    {segments.map((segment, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSegment(index)}
                            className={`w-full text-left glass-card transition-all duration-300 group ${activeSegment === index ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">{segment.date}</p>
                                    <p className="text-lg font-bold">{segment.city}</p>
                                </div>
                                <ChevronRight
                                    size={20}
                                    className={`transition-transform duration-300 ${activeSegment === index ? 'translate-x-1 text-indigo-400' : 'text-slate-600'}`}
                                />
                            </div>
                        </button>
                    ))}

                    {/* Agent Section */}
                    <div className="mt-8 glass-card border-indigo-500/20 bg-indigo-500/5">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <ShieldCheck size={18} className="text-indigo-400" />
                            Agent Intelligence
                        </h4>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                <p className="text-xs text-indigo-300 font-bold mb-1">Agent Alpha (Flight Sentinel)</p>
                                <p className="text-sm text-slate-300">Ready to monitor DL9447 / OS32. Start signal in 48h.</p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                <p className="text-xs text-emerald-300 font-bold mb-1">Agent Beta (Transit Scraper)</p>
                                <p className="text-sm text-slate-300">Monitoring DB Bahn Flex fares. Current: €54.90.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Segment Details */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card min-h-[500px]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <MapPin size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{segments[activeSegment].city}</h2>
                                <p className="text-slate-400">{segments[activeSegment].date}</p>
                            </div>
                        </div>

                        {/* Flights Section */}
                        {segments[activeSegment].flights && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Plane size={14} /> Scheduled Flights
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {segments[activeSegment].flights.map((flight, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                                                    {flight.id}
                                                </span>
                                                <span className="text-sm font-mono text-slate-300">{flight.departs}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-500">From</p>
                                                    <p className="text-xl font-bold">{flight.from}</p>
                                                </div>
                                                <Plane size={18} className="text-slate-600 rotate-90" />
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">Status</p>
                                                    <p className={`text-sm font-bold ${flight.status === 'In Air' ? 'text-indigo-400 animate-pulse' : 'text-emerald-400'}`}>
                                                        {flight.status || 'Scheduled'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Live Telemetry Overlay */}
                                            {flight.status === 'In Air' && (
                                                <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Altitude</p>
                                                        <p className="text-sm font-mono text-indigo-300">{flight.altitude ? Math.round(flight.altitude).toLocaleString() : '--'} m</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Velocity</p>
                                                        <p className="text-sm font-mono text-indigo-300">{flight.velocity || '--'} km/h</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Logistics & Environment Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Accommodation Section */}
                            {segments[activeSegment].accommodation && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Hotel size={14} /> Living Arrangements
                                    </h3>
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 h-full">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <MapPin className="text-emerald-400" />
                                            </div>
                                            <div>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(segments[activeSegment].accommodation.address || segments[activeSegment].accommodation.details + " " + segments[activeSegment].city)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-lg font-medium text-slate-200 mb-4 lh-relaxed hover:text-indigo-400 transition-colors flex items-center gap-2 group/link"
                                                >
                                                    {segments[activeSegment].accommodation.address || segments[activeSegment].accommodation.details}
                                                    <ExternalLink size={16} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                                {segments[activeSegment].accommodation.rules && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {segments[activeSegment].accommodation.rules.map((rule, idx) => (
                                                            <span key={idx} className="px-3 py-1 rounded-lg bg-black/40 text-xs text-slate-400 border border-white/5">
                                                                {rule}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Weather & Financial Column */}
                            <div className="space-y-6">
                                {/* Multi-Airport Support for Departure */}
                                {segments[activeSegment].city === 'Departure' ? (
                                    <>
                                        <SecurityWidget airportId="IAD" />
                                        <WeatherWidget city="IAD" />
                                        <SecurityWidget airportId="BOS" />
                                        <WeatherWidget city="BOS" />
                                    </>
                                ) : (
                                    <>
                                        <WeatherWidget city={segments[activeSegment].city} />
                                        <CurrencyWidget city={segments[activeSegment].city} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Weather/Environment Placeholder fallback if empty */}
                        {!segments[activeSegment].flights && !segments[activeSegment].accommodation && (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-500 opacity-50">
                                <Wind size={48} className="mb-4" />
                                <p>No logistics recorded for this segment.</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Wifi size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold">Connectivity</p>
                                <p className="text-sm">Secure VPN Active</p>
                            </div>
                        </div>
                        <div className="glass-card flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold">ETA Berlin</p>
                                <p className="text-sm">72h 14m</p>
                            </div>
                        </div>
                        <div className="glass-card flex items-center gap-4 group cursor-pointer hover:bg-slate-700/30">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <ExternalLink size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold">Check-in</p>
                                <p className="text-sm group-hover:text-purple-300 transition-colors">Available Mar 5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
