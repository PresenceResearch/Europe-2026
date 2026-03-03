import React, { useState, useEffect, useRef } from 'react';
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
    Globe,
    Cpu,
    Target,
    Terminal,
    MessageSquare,
    Bot,
    Send,
    X,
    BellRing,
    Loader2,
    Calendar,
    ArrowRight,
    Languages,
    Search
} from 'lucide-react';
import itineraryData from '../data/itinerary.json';

// Configuration from Sentinel Protocol
const GEN_AI_MODEL = "gemini-2.5-flash-preview-09-2025";
const NTFY_TOPIC = "sentinel_europe_2026_alerts";
const GEMINI_API_KEY = ""; // User to provide or environment based

const SecurityWidget = ({ airportId }) => {
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
        </div>
    );
};

const CurrencyWidget = ({ locale, city }) => {
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
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">1.00 USD</span>
                    <span className="text-4xl font-bold text-white tracking-tight">{rate}{symbol}</span>
                </div>
            </div>
        </div>
    );
};

const WeatherWidget = ({ city }) => {
    const weatherMap = {
        'Berlin': { temp: 4, condition: 'Light Rain', icon: <CloudRain className="text-blue-400" /> },
        'Dresden': { temp: 3, condition: 'Clear', icon: <Sun className="text-yellow-400" /> },
        'Prague': { temp: 2, condition: 'Mostly Cloudy', icon: <Cloud className="text-slate-400" /> },
        'IAD': { temp: 12, condition: 'Clear', icon: <Sun className="text-yellow-400" /> },
        'BOS': { temp: 8, condition: 'Breezy', icon: <Wind className="text-slate-300" /> }
    };
    const data = weatherMap[city] || { temp: '--', condition: 'Scanning...', icon: <Cloud /> };

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
            <span className="text-5xl font-bold text-white leading-none">{data.temp}°</span>
        </div>
    );
};

const SentinelConsole = () => {
    const [statusLogs, setStatusLogs] = useState([
        { id: 1, type: 'sys', msg: 'Neural handshake established.' },
        { id: 2, type: 'sentinel', msg: 'Mission Protocol: Europe 2026 active.' }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const msgs = ['Logistics packet validated.', 'Recursive loop stable.', 'BOS/IAD corridors scanned.'];
            const roll = msgs[Math.floor(Math.random() * msgs.length)];
            setStatusLogs(prev => [...prev.slice(-3), { id: Date.now(), type: 'sys', msg: roll }]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 glass-card border-indigo-500/20 bg-black/40 p-4 rounded-3xl font-mono text-[10px] space-y-2">
            {statusLogs.map(log => (
                <div key={log.id} className="flex gap-2">
                    <span className={log.type === 'sys' ? 'text-slate-600' : 'text-indigo-500'}>[{log.type.toUpperCase()}]</span>
                    <span className="text-slate-300">{log.msg}</span>
                </div>
            ))}
        </div>
    );
};

const App = () => {
    const [activeSegment, setActiveSegment] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [pushStatus, setPushStatus] = useState('idle');
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Sentinel active. Handshake diagnostics engaged. What's the status, Commander?" }
    ]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const segments = itineraryData.segments;
    const agent = itineraryData.ai_agent;
    const currentSegment = segments[activeSegment];

    const triggerTestPush = async () => {
        setPushStatus('sending');
        try {
            const response = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
                method: 'POST',
                body: 'Sentinel: Berlin Arrival Protocol Ready. Handshake Successful.',
                headers: { 'Title': 'Manual Sentinel Sync', 'Priority': 'high', 'Tags': 'shield,airplane' }
            });
            if (response.ok) {
                setPushStatus('success');
                setMessages(prev => [...prev, { role: 'assistant', text: "Push signal sent to ntfy.sh. Mission alert visible on linked devices." }]);
            } else throw new Error();
        } catch (e) {
            setPushStatus('error');
            setMessages(prev => [...prev, { role: 'assistant', text: "Handshake failed. Gateway unreachable." }]);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput('');

        // Mock Gemini Call (or real if API key provided)
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', text: `Sentinel processing: "${userMsg}". Logistics holding steady.` }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-12">
            {/* Unified Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent uppercase tracking-tight leading-none mb-2">
                        {agent.name} <span className="text-xs align-top opacity-50">v{agent.version}</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> MISSION: EUROPE 2026
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-card px-6 py-3 border-emerald-500/20 bg-emerald-500/5">
                        <p className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest mb-1 text-right">Destination Time</p>
                        <p className="text-2xl font-mono text-emerald-300 font-black">
                            {new Intl.DateTimeFormat([], { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime)}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* Mission Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2 mb-4">Tactical Phases</h3>
                    {segments.map((s, i) => (
                        <button key={i} onClick={() => setActiveSegment(i)} className={`w-full text-left p-6 rounded-3xl border transition-all ${activeSegment === i ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-slate-800/20 border-white/5 text-slate-500 hover:text-slate-300'}`}>
                            <p className="text-[10px] font-black uppercase mb-1">{s.date}</p>
                            <p className="text-xl font-black">{s.city}</p>
                        </button>
                    ))}

                    <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 mt-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                            <BellRing size={14} /> Automation Hub
                        </h4>
                        <button onClick={triggerTestPush} className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all ${pushStatus === 'success' ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                            {pushStatus === 'sending' ? 'Sending...' : 'Trigger Test Push'}
                        </button>
                    </div>

                    <SentinelConsole />
                </div>

                {/* Main Command Display */}
                <div className="lg:col-span-8 glass-card p-10 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><Target size={300} /></div>

                    <div className="relative z-10 space-y-12">
                        {/* Location Header */}
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <MapPin size={40} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{currentSegment.city}</h2>
                                <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs mt-2">{currentSegment.country}</p>
                            </div>
                        </div>

                        {/* Flights View */}
                        {currentSegment.flights && (
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-2">
                                    <Plane size={14} /> Transatlantic Corridors
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentSegment.flights.map((group, gIdx) => (
                                        <div key={gIdx} className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-white/5 relative group">
                                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">{group.traveler}</p>
                                            {group.legs.map((leg, lIdx) => (
                                                <div key={lIdx} className="space-y-6">
                                                    <div className="flex justify-between items-center px-2">
                                                        <span className="text-3xl font-black">{leg.from}</span>
                                                        <ArrowRight className="text-slate-600" />
                                                        <span className="text-3xl font-black">{leg.to}</span>
                                                    </div>
                                                    <p className="text-xs font-mono text-slate-400 text-center">{leg.departs} - {leg.arrives}</p>

                                                    {currentSegment.city === 'Departure' && (leg.from === 'IAD' || leg.from === 'BOS') && (
                                                        <div className="pt-8 space-y-4 border-t border-white/5">
                                                            <SecurityWidget airportId={leg.from} />
                                                            <WeatherWidget city={leg.from} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accommodation & Market View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {currentSegment.accommodation && (
                                <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/20 p-8 rounded-[2.5rem] border border-white/10">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Base of Operations</h4>
                                    <p className="text-2xl font-black text-indigo-300 mb-2 leading-tight">{currentSegment.accommodation.name}</p>
                                    <p className="text-xs text-slate-400 font-bold mb-6 italic">{currentSegment.accommodation.address}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {currentSegment.accommodation.rules?.map((r, i) => (
                                            <span key={i} className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-300 uppercase">{r}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-6">
                                {currentSegment.city !== 'Departure' && (
                                    <>
                                        <WeatherWidget city={currentSegment.city === 'Return' ? 'Prague' : currentSegment.city} />
                                        <CurrencyWidget locale={currentSegment.locale} city={currentSegment.city} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Trigger */}
            <button onClick={() => setIsChatOpen(true)} className="fixed bottom-10 right-10 w-20 h-20 bg-indigo-600 rounded-full shadow-[0_0_50px_rgba(79,70,229,0.4)] flex items-center justify-center hover:scale-110 transition-all z-50">
                <MessageSquare className="text-white" size={32} />
            </button>

            {/* Chat Modal */}
            {isChatOpen && (
                <div className="fixed bottom-10 right-10 w-96 h-[600px] bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10">
                    <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Bot size={24} />
                            <span className="font-black text-lg">SENTINEL</span>
                        </div>
                        <button onClick={() => setIsChatOpen(false)}><X /></button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-black/20">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed font-medium ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-6 bg-slate-800/50 border-t border-white/5 flex gap-3">
                        <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="bg-black/50 border border-white/5 rounded-2xl px-5 py-3 text-sm flex-1 outline-none text-white focus:border-indigo-500 transition-colors" placeholder="Input directive..." />
                        <button onClick={handleSendMessage} className="bg-indigo-600 p-4 rounded-2xl"><Send size={18} className="text-white" /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
