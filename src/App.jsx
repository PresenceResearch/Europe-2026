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
    Timer,
    Globe
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

const CurrencyWidget = ({ locale, city }) => {
    // If locale is provided in JSON, use it, otherwise fallback
    const currency = locale?.currency || 'EUR';
    const rate = locale?.rate_to_usd || 1.08;
    const symbol = locale?.symbol || '€';

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-500/20 shadow-lg">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Coins size={14} /> Currency Exchange
                    </h3>
                    <p className="text-lg font-bold text-slate-200">USD to {currency}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <RefreshCcw size={20} className="text-emerald-400" />
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">1.00 USD</span>
                    <span className="text-4xl font-bold text-white tracking-tight">{rate}{symbol}</span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        <TrendingDown size={14} className="text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">-0.2%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Live Rate</p>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
                <div className="flex justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Globe size={10} /> {city} Locale</span>
                    <span className="text-indigo-400 font-mono">Synced</span>
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
                        <Thermometer size={14} /> {city} Weather
                    </h3>
                    <p className="text-lg font-bold text-slate-200">{data.condition}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                    {data.icon}
                </div>
            </div>

            <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-bold text-white leading-none">{data.temp}°</span>
                <span className="text-indigo-400 font-medium pb-1">C</span>
                <div className="ml-auto text-right">
                    <p className="text-xs text-slate-500 uppercase font-black">Daily Cycle</p>
                    <p className="text-xs text-slate-300 font-bold">H: {data.high}° L: {data.low}°</p>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold">
                    <Umbrella size={12} className="text-indigo-400" />
                    <span>15% Precip</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold">
                    <Wind size={12} className="text-indigo-400" />
                    <span>12 km/h Wind</span>
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
    const currentSegment = segments[activeSegment];

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent uppercase tracking-tight">
                        Sentinel Dashboard
                    </h1>
                    <p className="text-slate-400 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        Mission Tracking Protocol Active
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Local Time */}
                    <div className="glass-card flex items-center gap-6 py-2 px-6">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Home Base</p>
                            <p className="text-xl font-mono text-indigo-300 font-bold">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                        <div className="h-8 w-px bg-slate-700"></div>
                        <Activity size={18} className="text-indigo-400 animate-pulse" />
                    </div>

                    {/* Destination Time */}
                    <div className="glass-card flex items-center gap-6 py-2 px-6 border-emerald-500/20 bg-emerald-500/5">
                        <div className="text-right">
                            <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em] font-black">Central Europe</p>
                            <p className="text-xl font-mono text-emerald-300 font-bold">
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
                        <Clock size={18} className="text-emerald-400" />
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Itinerary Navigation */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2">Operational Phases</h3>
                    {segments.map((segment, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSegment(index)}
                            className={`w-full text-left glass-card transition-all duration-300 group border-l-4 ${activeSegment === index ? 'border-indigo-500 bg-indigo-500/10' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{segment.date}</p>
                                    <p className="text-lg font-black">{segment.city}</p>
                                </div>
                                <ChevronRight
                                    size={20}
                                    className={`transition-transform duration-300 ${activeSegment === index ? 'translate-x-1 text-indigo-400' : 'text-slate-700'}`}
                                />
                            </div>
                        </button>
                    ))}

                    {/* Agent Section */}
                    <div className="mt-8 glass-card border-indigo-500/20 bg-indigo-500/5 p-6 rounded-3xl">
                        <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-6">
                            <ShieldCheck size={18} className="text-indigo-400" />
                            Intelligence Grid
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/20 transition-colors">
                                <p className="text-[11px] text-indigo-400 font-black uppercase tracking-widest mb-1">Agent Alpha</p>
                                <p className="text-xs text-slate-300 font-medium">Monitoring 7 transponders. OpenSky handshake verified.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/20 transition-colors">
                                <p className="text-[11px] text-emerald-400 font-black uppercase tracking-widest mb-1">Agent Beta</p>
                                <p className="text-xs text-slate-300 font-medium">DB Bahn Flex fare scraping active. No price drops detected.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Segment Details */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card min-h-[500px] p-8 rounded-3xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <MapPin size={28} className="text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">{currentSegment.city}</h2>
                                    {currentSegment.country && (
                                        <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentSegment.country}</span>
                                    )}
                                </div>
                                <p className="text-slate-400 font-bold mt-1 uppercase tracking-[0.2em] text-xs">{currentSegment.date}</p>
                            </div>
                        </div>

                        {/* Flights Section */}
                        {currentSegment.flights && (
                            <div className="mb-12">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Plane size={16} /> Air Logistics Status
                                </h3>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {currentSegment.flights.map((group, idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <Plane size={80} className="rotate-45" />
                                                </div>

                                                <div className="flex justify-between items-center mb-8 relative z-10">
                                                    <div>
                                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Traveler Portfolio</span>
                                                        <h4 className="text-2xl font-black text-white">{group.traveler}</h4>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sector</span>
                                                        <p className="text-xs font-mono text-slate-400 font-bold">{group.route}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-6 relative z-10">
                                                    {group.legs.map((leg, lIdx) => (
                                                        <div key={lIdx} className="space-y-4">
                                                            <div className="bg-black/30 p-5 rounded-2xl border border-white/5 relative">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{leg.id}</span>
                                                                    <div className="text-right">
                                                                        <p className="text-xs font-black text-white tracking-widest uppercase">{leg.departs} → {leg.arrives}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between gap-6 px-2">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Origin</span>
                                                                        <span className="text-2xl font-black text-white tracking-tighter">{leg.from}</span>
                                                                    </div>
                                                                    <div className="h-px flex-1 bg-slate-800 relative">
                                                                        <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 rotate-90" />
                                                                    </div>
                                                                    <div className="flex flex-col text-right">
                                                                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Dest</span>
                                                                        <span className="text-2xl font-black text-white tracking-tighter">{leg.to}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Live Telemetry Overlay */}
                                                                {leg.status === 'In Air' && (
                                                                    <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-4">
                                                                        <div className="flex flex-col text-indigo-300">
                                                                            <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-1">Altitude</span>
                                                                            <span className="text-sm font-mono font-bold tracking-tight">{leg.altitude ? Math.round(leg.altitude).toLocaleString() : '--'}m</span>
                                                                        </div>
                                                                        <div className="flex flex-col text-right text-indigo-300">
                                                                            <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-1">Airspeed</span>
                                                                            <span className="text-sm font-mono font-bold tracking-tight">{leg.velocity || '--'}km/h</span>
                                                                        </div>
                                                                        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                                                                    </div>
                                                                )}

                                                                {/* Group Hub Intelligence UNDER the Departure Hub as requested */}
                                                                {currentSegment.city === 'Departure' && (leg.from === 'IAD' || leg.from === 'BOS') && (
                                                                    <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                                                                        <SecurityWidget airportId={leg.from} />
                                                                        <WeatherWidget city={leg.from} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Logistics & Environment Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            {/* Accommodation Section */}
                            {currentSegment.accommodation && (
                                <div>
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                        <Hotel size={16} /> Base of Operations
                                    </h3>
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 h-full shadow-xl">
                                        <div className="flex items-start gap-6">
                                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
                                                <MapPin className="text-emerald-400" size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentSegment.accommodation.address || currentSegment.city)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-2xl font-black text-indigo-300 mb-2 hover:text-indigo-400 transition-colors flex items-center gap-3 group/link tracking-tight leading-tight"
                                                >
                                                    {currentSegment.accommodation.name || currentSegment.accommodation.address}
                                                    <ExternalLink size={20} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-slate-500" />
                                                </a>
                                                <p className="text-sm text-slate-400 mb-8 font-bold leading-relaxed tracking-tight">{currentSegment.accommodation.address}</p>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {Object.entries(currentSegment.accommodation).map(([key, value]) => {
                                                        if (['name', 'address', 'rules'].includes(key)) return null;
                                                        return (
                                                            <div key={key} className="bg-black/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-inner">
                                                                <p className="text-[10px] text-slate-600 uppercase font-black mb-1 px-1 tracking-widest">{key.replace('_', ' ')}</p>
                                                                <p className="text-sm font-black text-slate-200 px-1">{value}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {currentSegment.accommodation.rules && (
                                                    <div className="mt-8">
                                                        <p className="text-[10px] text-slate-600 uppercase font-black mb-4 flex items-center gap-2 tracking-[0.2em]">
                                                            <ShieldCheck size={12} className="text-indigo-400" />
                                                            Operational Directives
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {currentSegment.accommodation.rules.map((rule, idx) => (
                                                                <span key={idx} className="px-4 py-2 rounded-xl bg-indigo-500/10 text-xs text-indigo-300 border border-indigo-500/20 font-black tracking-tight flex items-center gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-indigo-400" />
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
                            <div className="space-y-8">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Activity size={16} /> Market & Environment
                                </h3>
                                {/* Only show general widgets if not already embedded in flight cards (Departure handled above) */}
                                {currentSegment.city !== 'Departure' && (
                                    <>
                                        <WeatherWidget city={currentSegment.city === 'Return' ? 'Prague' : currentSegment.city} />
                                        {currentSegment.locale && (
                                            <CurrencyWidget locale={currentSegment.locale} city={currentSegment.city} />
                                        )}
                                        {/* Show extra info for Return segment (DUB layover weather) */}
                                        {currentSegment.city === 'Return' && <WeatherWidget city="DUB" />}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Empty State fallback */}
                        {!currentSegment.flights && !currentSegment.accommodation && (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-500 opacity-30 select-none">
                                <Activity size={64} className="mb-4 animate-pulse" />
                                <p className="font-black uppercase tracking-[0.4em] text-xs">No Signal Detected</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card flex items-center gap-5 p-6 rounded-3xl hover:bg-slate-800/60 transition-colors cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner">
                                <Wifi size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Data Tunnel</p>
                                <p className="text-sm font-black text-white tracking-tight leading-none uppercase">Secure VPN Active</p>
                            </div>
                        </div>
                        <div className="glass-card flex items-center gap-5 p-6 rounded-3xl hover:bg-slate-800/60 transition-colors cursor-default border-emerald-500/20 bg-emerald-500/5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">Countdown</p>
                                <p className="text-sm font-black text-emerald-300 tracking-tight leading-none uppercase">T-Minus 72h</p>
                            </div>
                        </div>
                        <div className="glass-card flex items-center gap-5 p-6 rounded-3xl group cursor-pointer hover:bg-indigo-500/10 border-indigo-500/20 bg-indigo-500/5 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <ExternalLink size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Pre-Check</p>
                                <p className="text-sm group-hover:text-white transition-colors font-black tracking-tight leading-none uppercase">Flight Ready</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
