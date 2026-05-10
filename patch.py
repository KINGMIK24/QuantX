import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Fonts
content = re.sub(
    r'<link href="https://fonts\.googleapis\.com/css2\?family=Instrument\+Sans.*?" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet">',
    content
)

# 2. Update Tailwind config
content = re.sub(
    r"sans: \['\"Instrument Sans\"', 'sans-serif'\],",
    "sans: ['\"Plus Jakarta Sans\"', 'sans-serif'],",
    content
)
content = re.sub(
    r"display: \['Lora', 'serif'\],",
    "display: ['\"Playfair Display\"', 'serif'],",
    content
)

# 3. Update Body CSS
body_css = """      body {
        background-color: #0d1117;
        background-image: 
          radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
          radial-gradient(at 50% 0%, hsla(225,39%,30%,0.2) 0, transparent 50%), 
          radial-gradient(at 100% 0%, hsla(339,49%,30%,0.2) 0, transparent 50%);
        background-attachment: fixed;
        color: #b0b8cc;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        font-weight: 500;
        letter-spacing: 0.01em;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        overflow: hidden;
        opacity: 0;
        animation: pageFadeIn 1.2s ease-out forwards;
      }"""
content = re.sub(r'      body \{[\s\S]*?\}', body_css, content, count=1)

# 4. Update qx-card CSS
card_css = """      .qx-card {
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        background: linear-gradient(135deg, rgba(10, 15, 30, 0.7) 0%, rgba(10, 15, 30, 0.4) 100%);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation: cardFadeIn 0.8s ease-out forwards;
        opacity: 0;
      }

      @keyframes cardFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .qx-card:hover {
        transform: scale(1.02);
        z-index: 10;
      }

      .qx-card:hover .card-bg-img {
        filter: brightness(1.2);
      }"""
content = re.sub(r'      \.qx-card \{[\s\S]*?\.qx-card::before \{[\s\S]*?\}', card_css, content)


# 5. React Components Injection
react_components = """
        const NewsCard = ({ news }) => {
            const [expanded, setExpanded] = useState(false);
            
            const categoryImages = {
                'S&P': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
                'Oil': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
                'AI': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
                'Finance': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
                'Tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                'Energy': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80'
            };
            
            const imageUrl = categoryImages[news.category] || categoryImages['AI'];
            const glowColor = news.sentiment_score > 0 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 59, 48, 0.4)';
            const sentimentLabel = news.sentiment_score > 0 ? 'BULLISH' : 'BEARISH';
            const sentimentDot = news.sentiment_score > 0 ? 'bg-acid' : 'bg-red-500';
            
            return (
                <div 
                    className={`qx-card flex flex-col group transition-all duration-500 ease-in-out ${expanded ? 'h-auto' : 'h-[420px]'}`}
                    style={{ boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 15px ${glowColor}`, borderColor: glowColor }}
                >
                    <div className="h-48 relative overflow-hidden shrink-0">
                        <img src={imageUrl} alt={news.title} className="card-bg-img w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 flex gap-2">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{news.category}</span>
                        </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 bg-gradient-to-t from-void to-transparent">
                        <h3 className="text-white font-display font-bold text-xl leading-snug mb-3 group-hover:text-blue-400 transition-colors">{news.title}</h3>
                        
                        <div className={`text-gray-300 text-sm font-sans mb-4 overflow-hidden transition-all duration-500 ${expanded ? 'max-h-[500px]' : 'line-clamp-2 max-h-[44px]'}`}>
                            <p className="mb-2 leading-relaxed">{news.snippet}</p>
                            {expanded && <p className="leading-relaxed text-gray-400 mt-2">Detailed analysis indicates a strong correlation between these events and broader macroeconomic trends. The sentiment index reflects significant institutional movements, signaling potential long-term impacts on the asset class.</p>}
                        </div>
                        
                        <div className="mt-auto border-t border-gray-700/50 pt-4 shrink-0">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full">
                                    <span className={`w-2 h-2 rounded-full ${sentimentDot} shadow-[0_0_8px_${glowColor}]`}></span>
                                    <span className="text-gray-300 text-[10px] font-mono uppercase font-bold tracking-widest">IMPACT: {sentimentLabel}</span>
                                </div>
                            </div>
                            <button onClick={() => setExpanded(!expanded)} className="w-full qx-btn-primary py-2 text-xs bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center rounded-xl flex justify-center items-center gap-2">
                                {expanded ? 'COLLAPSE' : 'READ FULL INTELLIGENCE'} <i data-lucide={expanded ? 'chevron-up' : 'chevron-down'} size="14"></i>
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        const MainPulse = () => {
            const [newsDataList, setNewsDataList] = useState([]);
            
            useEffect(() => {
                fetch('http://localhost:8000/api/news')
                    .then(res => res.json())
                    .then(data => setNewsDataList(data))
                    .catch(e => console.log('Error fetching news:', e));
            }, []);

            return (
                <div className="space-y-6 h-full pb-10">
                    <div className="mb-6">
                        <h2 className="text-4xl font-display font-bold text-white mb-2">Global Pulse</h2>
                        <p className="text-gray-400 font-sans text-sm">Real-time intelligence aggregation and sentiment analysis.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsDataList.map(news => <NewsCard key={news.id} news={news} />)}
                    </div>
                </div>
            );
        };

        const SectorDeepDive = () => {
            return (
                <div className="space-y-6 h-full pb-10">
                    <div className="mb-6">
                        <h2 className="text-4xl font-display font-bold text-white mb-2">Sector Deep Dive</h2>
                        <p className="text-gray-400 font-sans text-sm">Granular heatmap and stream analysis across major sectors.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {['Tech', 'Energy', 'Finance'].map((sector, i) => (
                            <div key={sector} className="qx-card flex flex-col p-5">
                                <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                                    <i data-lucide={i===0 ? 'cpu' : i===1 ? 'zap' : 'dollar-sign'} className="text-blue-400"></i> {sector} Sector
                                </h3>
                                <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-gray-900 to-black mb-4 relative overflow-hidden border border-gray-800">
                                    {/* Mock Heatmap */}
                                    <div className="absolute inset-0 flex flex-wrap opacity-60">
                                        {[...Array(24)].map((_, j) => (
                                            <div key={j} className={`w-1/6 h-1/4 ${Math.random() > 0.5 ? 'bg-acid/20' : 'bg-red-500/20'} border border-black/50 transition-colors duration-1000`} style={{opacity: Math.random()}}></div>
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-black/60 px-3 py-1 rounded-full text-xs font-mono text-white">Live Heatmap</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Stream {j+1}</span>
                                                <span className="text-[10px] text-gray-500">Just now</span>
                                            </div>
                                            <p className="text-sm font-sans text-gray-300 leading-snug">Algorithmic shifts detected in {sector.toLowerCase()} derivatives market.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const AdvisorSidebar = () => {
            const [query, setQuery] = useState("");
            const [chat, setChat] = useState([
                { role: 'assistant', text: "Welcome to QuantX. I am tracking a bullish sentiment divergence in the S&P. Shall we analyze the trend or generate a sector report?" }
            ]);
            const [loading, setLoading] = useState(false);

            const handleExecute = async (overrideQuery) => {
                const text = overrideQuery || query;
                if (!text) return;
                
                setChat(prev => [...prev, { role: 'user', text }]);
                setQuery("");
                setLoading(true);
                
                try {
                    const res = await fetch('http://localhost:8000/api/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ prompt: text })
                    });
                    const data = await res.json();
                    setChat(prev => [...prev, { role: 'assistant', text: data.text }]);
                } catch (e) {
                    setTimeout(() => {
                        setChat(prev => [...prev, { role: 'assistant', text: "Based on current terminal data, the trajectory remains stable. I recommend a scaled entry in the tech sector over the next 48 hours." }]);
                        setLoading(false);
                    }, 1000);
                    return;
                }
                setLoading(false);
            };

            return (
                <div className="flex flex-col h-full bg-void/50 backdrop-blur-xl relative z-10">
                    <div className="p-5 border-b border-gray-700/50 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-acid/20 flex items-center justify-center border border-acid/30 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                <i data-lucide="bot" size="20" className="text-acid"></i>
                            </div>
                            <div>
                                <h3 className="text-white font-display font-bold text-lg leading-none">QuantX Advisor</h3>
                                <div className="text-[10px] text-acid font-mono uppercase tracking-widest mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse"></span> Online
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 p-5 space-y-6 overflow-y-auto no-scrollbar flex flex-col">
                        {chat.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-acid/20 flex items-center justify-center shrink-0 mr-2 mt-1">
                                        <i data-lucide="sparkles" size="12" className="text-acid"></i>
                                    </div>
                                )}
                                <div className={`max-w-[85%] p-4 text-sm font-sans shadow-lg ${msg.role === 'user' ? 'bg-blue-600/30 text-white border border-blue-500/30 rounded-3xl rounded-tr-sm backdrop-blur-md' : 'bg-white/5 text-gray-200 border border-white/10 rounded-3xl rounded-tl-sm backdrop-blur-md'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start w-full">
                                <div className="w-6 h-6 rounded-full bg-acid/20 flex items-center justify-center shrink-0 mr-2 mt-1">
                                    <i data-lucide="sparkles" size="12" className="text-acid"></i>
                                </div>
                                <div className="max-w-[85%] p-4 text-sm font-sans bg-white/5 text-gray-400 border border-white/10 rounded-3xl rounded-tl-sm backdrop-blur-md flex items-center gap-2">
                                    <i data-lucide="loader" className="animate-spin" size="14"></i> Analyzing...
                                </div>
                            </div>
                        )}
                        
                        {/* Interactive Suggestions */}
                        {!loading && chat[chat.length-1].role === 'assistant' && (
                            <div className="flex flex-wrap gap-2 ml-8 mt-2">
                                <button onClick={() => handleExecute('Analyze Sentiment Trend')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-acid font-medium transition-colors">
                                    Analyze Sentiment Trend
                                </button>
                                <button onClick={() => handleExecute('Generate Report')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-acid font-medium transition-colors">
                                    Generate Report
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 border-t border-gray-700/50 shrink-0">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                                className="w-full bg-black/40 border border-gray-600 rounded-full pl-5 pr-12 py-3.5 text-sm font-sans text-white focus:outline-none focus:border-acid focus:bg-black/60 transition-all shadow-inner" 
                                placeholder="Message Advisor..." 
                            />
                            <button onClick={() => handleExecute()} disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-acid/20 flex items-center justify-center text-acid hover:bg-acid hover:text-void transition-colors">
                                <i data-lucide="arrow-up" size="18"></i>
                            </button>
                        </div>
                    </div>
                </div>
            );
        };
"""

app_replacement = """        const App = () => {
            const [user, setUser] = useState(null);
            const [authChecking, setAuthChecking] = useState(true);
            const [activeTab, setActiveTab] = useState('pulse'); // 'pulse', 'sector', 'terminal'

            useEffect(() => {
                if (window.lucide) window.lucide.createIcons();
            });

            useEffect(() => {
                const unsubscribe = auth.onAuthStateChanged(u => {
                    setUser(u);
                    setAuthChecking(false);
                });
                return () => unsubscribe();
            }, []);

            if (authChecking) {
                return <div className="h-screen flex items-center justify-center bg-void text-acid font-mono">Initializing Neural Link...</div>;
            }

            if (!user) {
                return (
                    <div className="h-screen flex flex-col font-sans relative z-10 text-gray-300">
                        <ThreeBackground />
                        <div className="absolute top-4 right-4 z-50 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full text-xs font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> OFFLINE
                        </div>
                        <AuthPage />
                    </div>
                );
            }

            return (
                <div className="h-screen flex flex-col font-sans relative z-10 text-gray-300">
                    <ThreeBackground />
                    <div className="qx-dynamic-bg"></div>
                    
                    {/* Header */}
                    <header className="mt-6 mx-8 border border-white/10 bg-void/60 backdrop-blur-xl p-4 px-8 rounded-full flex justify-between items-center z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold font-display tracking-widest text-white">QUANT<span className="text-acid">X</span></h1>
                        </div>
                        <div className="flex gap-2 bg-black/40 p-1.5 border border-white/5 rounded-full backdrop-blur-md">
                            {['pulse', 'sector', 'terminal'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`uppercase text-xs font-bold px-6 py-2.5 rounded-full transition-all duration-300 ${activeTab === tab ? 'bg-acid/20 text-acid shadow-[0_0_15px_rgba(52,211,153,0.3)] scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                                >
                                    {tab === 'pulse' ? 'Main Pulse' : tab === 'sector' ? 'Sector Deep Dive' : 'The Terminal'}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => auth.signOut()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-white/10">
                            <i data-lucide="power" size="18"></i>
                        </button>
                    </header>

                    {/* Main Layout: Left View + Right Sidebar */}
                    <div className="flex-1 flex overflow-hidden p-8 gap-8 z-20">
                        {/* Main Content Area */}
                        <main className="flex-1 overflow-y-auto no-scrollbar relative rounded-[32px] max-w-[1200px]">
                            <div className="transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] absolute inset-0 w-full" style={{ opacity: activeTab === 'pulse' ? 1 : 0, pointerEvents: activeTab === 'pulse' ? 'auto' : 'none', transform: activeTab === 'pulse' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)' }}>
                                <MainPulse />
                            </div>
                            <div className="transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] absolute inset-0 w-full" style={{ opacity: activeTab === 'sector' ? 1 : 0, pointerEvents: activeTab === 'sector' ? 'auto' : 'none', transform: activeTab === 'sector' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)' }}>
                                <SectorDeepDive />
                            </div>
                            <div className="transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] absolute inset-0 w-full" style={{ opacity: activeTab === 'terminal' ? 1 : 0, pointerEvents: activeTab === 'terminal' ? 'auto' : 'none', transform: activeTab === 'terminal' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)' }}>
                                <ChartingEngine />
                            </div>
                        </main>

                        {/* Right Sidebar: QuantX Advisor */}
                        <aside className="w-[400px] flex flex-col qx-card rounded-[32px] h-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] shrink-0">
                            <AdvisorSidebar />
                        </aside>
                    </div>
                </div>
            );
        };"""

# I need to locate `const DashboardTab = ...` to `const AuthPage = ...`
# and replace that whole chunk with `react_components`
content = re.sub(r'        const DashboardTab = \(\) => \{[\s\S]*?(?=        const AuthPage =)', react_components, content)

# I need to remove `const AILabTab = ...` as it's no longer used
content = re.sub(r'        const AILabTab = \(\) => \{[\s\S]*?(?=        // --- Authentication Page ---)', '', content)

# Also replace the old App component
content = re.sub(r'        const App = \(\) => \{[\s\S]*?(?=        const root = ReactDOM\.createRoot)', app_replacement, content)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied.")
