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
    // Mock live security status
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
    // Mock rates
    const ratesMap = {
        'Berlin': { currency: 'EUR', rate: 0.94, symbol: '€', trend: <TrendingDown size={14} className="text-emerald-400" />, change: '-0.2%' },
        'Dresden': { currency: 'EUR', rate: 0.94, symbol: '€', trend: <TrendingDown size={14} className="text-emerald-400" />, change: '-0.2%' },
        'Prague': { currency: 'CZK', rate: 23.45, symbol: 'Kč', trend: <TrendingUp size={14} className="text-rose-400" />, change: '+1.1%' },
        'Return': { currency: 'CZK', rate: 23.45, symbol: 'Kč', trend: <TrendingUp size={14} className="text-rose-400" />, change: '+1.1%' },
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
    const weatherMap = {
        'Berlin': { temp: 4, condition: 'Light Rain', icon: <CloudRain className="text-blue-400" />, high: 7, low: 1 },
        'Dresden': { temp: 3, condition: 'Clear', icon: <Sun className="text-yellow-400" />, high: 6, low: 0 },
        'Prague': { temp: 2, condition: 'Mostly Cloudy', icon: <Cloud className="text-slate-400" />, high: 5, low: -2 },
        'Return': { temp: 2, condition: 'Mostly Cloudy', icon: <Cloud className="text-slate-400" />, high: 5, low: -2 },
        'IAD': { temp: 12, condition: 'Clear', icon: <Sun className="text-yellow-400" />, high: 15, low: 8 },
        'BOS': { temp: 8, condition: 'Breezy', icon: <Wind className="text-slate-300" />, high: 11, low: 4 },
        'DUB': { temp: 9, condition: 'Windy', icon: <Wind className="text-slate-400" />, high: 12, low: 5 },
        'AMS': { temp: 6, condition: 'Overcast', icon: <Cloud className="text-slate-400" />, high: 9, low: 3 },
        'VIE': { temp: 5, condition: 'Cloudy', icon: <Cloud className="text-slate-400" />, high: 8, low: 2 },
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
                            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                                    <p className="text-xs font-bold text-white uppercase tracking-widest">Connect iPhone Alerts</p>
                                </div>
                                <p className="text-[10px] text-slate-400 mb-3 leading-tight">
                                    Install the <strong>ntfy</strong> app from the App Store and subscribe to topic:
                                </p>
                                <div className="bg-black/40 p-2 rounded border border-white/10 flex items-center justify-between group/code">
                                    <code className="text-xs text-indigo-300 font-mono">sentinel_europe_2026_alerts</code>
                                    <ExternalLink size={12} className="text-slate-600 group-hover/code:text-indigo-400 transition-colors" />
                                </div>
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
                                    <Plane size={14} /> Mission Logistics
                                </h3>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {segments[activeSegment].flights.map((group, idx) => (
                                        <div key={idx} className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/30 transition-all shadow-xl">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Traveler</span>
                                                    <h4 className="text-xl font-black text-white">{group.traveler}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Route</span>
                                                    <p className="text-xs font-mono text-slate-400">{group.route}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {group.legs.map((leg, lIdx) => (
                                                    <div key={lIdx} className="bg-black/30 p-4 rounded-xl border border-white/5 group/leg relative">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{leg.id}</span>
                                                            <div className="text-right">
                                                                <p className="text-sm font-bold text-white tracking-tighter">{leg.departs} → {leg.arrives}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">From</span>
                                                                <span className="text-lg font-black">{leg.from}</span>
                                                            </div>
                                                            <div className="h-px flex-1 bg-slate-800 relative">
                                                                <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 rotate-90" />
                                                            </div>
                                                            <div className="flex flex-col text-right">
                                                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">To</span>
                                                                <span className="text-lg font-black">{leg.to}</span>
                                                            </div>
                                                        </div>
                                                        {leg.status === 'In Air' && (
                                                            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                                                                <div className="flex flex-col text-indigo-300">
                                                                    <span className="text-[10px] text-slate-500 uppercase">Alt</span>
                                                                    <span className="text-xs font-mono">{leg.altitude ? Math.round(leg.altitude).toLocaleString() : '--'}m</span>
                                                                </div>
                                                                <div className="flex flex-col text-right text-indigo-300">
                                                                    <span className="text-[10px] text-slate-500 uppercase">Vel</span>
                                                                    <span className="text-xs font-mono">{leg.velocity || '--'}km/h</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
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
                                            <div className="flex-1">
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(segments[activeSegment].accommodation.address || segments[activeSegment].city)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-lg font-black text-indigo-300 mb-2 hover:text-indigo-400 transition-colors flex items-center gap-2 group/link"
                                                >
                                                    {segments[activeSegment].accommodation.name || segments[activeSegment].accommodation.address}
                                                    <ExternalLink size={16} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                                <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">{segments[activeSegment].accommodation.address}</p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.entries(segments[activeSegment].accommodation).map(([key, value]) => {
                                                        if (['name', 'address', 'rules'].includes(key)) return null;
                                                        return (
                                                            <div key={key} className="bg-black/30 p-3 rounded-lg border border-white/5">
                                                                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">{key.replace('_', ' ')}</p>
                                                                <p className="text-sm font-bold text-slate-200">{value}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {segments[activeSegment].accommodation.rules && (
                                                    <div className="mt-6">
                                                        <p className="text-[10px] text-slate-500 uppercase font-black mb-3 text-indigo-400 tracking-widest">Mission Directives</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {segments[activeSegment].accommodation.rules.map((rule, idx) => (
                                                                <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-xs text-indigo-300 border border-indigo-500/20 font-bold">
                                                                    {rule}
                                                                </span>
                                                            ))}
                                                        </div>
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
                                ) : segments[activeSegment].city === 'Return' ? (
                                    <>
                                        <WeatherWidget city="Prague" />
                                        <CurrencyWidget city="Prague" />
                                        <WeatherWidget city="DUB" />
                                    </>
                                ) : (
                                    <>
                                        <WeatherWidget city={segments[activeSegment].city} />
                                        <CurrencyWidget city={segments[activeSegment].city} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Empty State fallback */}
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
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Connectivity</p>
                                <p className="text-sm font-black">Secure VPN Active</p>
                            </div>
                        </div>
                        <div className="glass-card flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Mission ETA</p>
                                <p className="text-sm font-black text-emerald-400">71h 56m</p>
                            </div>
                        </div>
                        <div className="glass-card flex items-center gap-4 group cursor-pointer hover:bg-slate-700/30">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <ExternalLink size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Check-in</p>
                                <p className="text-sm group-hover:text-purple-300 transition-colors font-black">Available Mar 5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
