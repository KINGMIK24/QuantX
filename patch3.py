import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace from `const MainPulse` to just before `const root = ReactDOM...`
replacement = """
        const trendingData = [
            { symbol: 'NVDA', impact: 92, change: 4.5 },
            { symbol: 'TSLA', impact: 85, change: -1.2 },
            { symbol: 'AAPL', impact: 78, change: 0.8 },
            { symbol: 'AMD', impact: 75, change: 2.3 },
            { symbol: 'MSFT', impact: 60, change: -0.4 },
        ];

        const DashboardTab = () => {
            const [activeIndex, setActiveIndex] = useState(0);
            const [activeCategory, setActiveCategory] = useState('ALL');
            const [aiModalItem, setAiModalItem] = useState(null);
            const [newsDataList, setNewsDataList] = useState([]);

            useEffect(() => {
                fetch('http://localhost:8000/api/news')
                    .then(res => res.json())
                    .then(data => setNewsDataList(data))
                    .catch(e => console.log('Error fetching news:', e));
            }, []);

            useEffect(() => {
                const handleNodeClick = (e) => {
                    const id = e.detail.id;
                    const n = newsDataList.find(item => item.id === id);
                    if(n) setAiModalItem(n);
                };
                window.addEventListener('threeNodeClick', handleNodeClick);
                return () => window.removeEventListener('threeNodeClick', handleNodeClick);
            }, [newsDataList]);

            const categories = ['ALL', 'SPORTS', 'WAR', 'TECH', 'INNOVATION', 'BUSINESS', 'STOCK MARKET', 'S&P', 'AI', 'Oil', 'Finance', 'Energy'];

            const filteredNews = activeCategory === 'ALL' 
                ? newsDataList 
                : newsDataList.filter(n => n.category === activeCategory || n.category.toUpperCase() === activeCategory);

            const featuredNews = newsDataList.slice(0, 3);

            const moodData = [
                { name: 'Bullish', value: 65, fill: '#34d399' },
                { name: 'Bearish', value: 20, fill: '#ff3b30' },
                { name: 'Neutral', value: 15, fill: '#0a84ff' },
            ];

            return (
                <div className="space-y-10 pb-10">
                    <div className="mb-2 border-b border-gray-700/50 pb-2 flex flex-col md:flex-row justify-between items-start md:items-end">
                        <div>
                            <div className="text-gray-400 text-[10px] tracking-widest uppercase mb-1">EXPLORE OUR MULTI-DIMENSIONAL INTELLIGENCE SUITE</div>
                            <h1 className="text-3xl font-display font-bold text-white">QUANTX DASHBOARD</h1>
                        </div>
                        <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mt-2 md:mt-0">AUTO-UPDATE: 1200S CYCLE</div>
                    </div>

                    {/* Top Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Featured Intelligence Column (Spans 7) */}
                        <div className="lg:col-span-7 space-y-4">
                            <h2 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 pb-2">
                                FEATURED INTELLIGENCE
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {featuredNews.map(news => <NewsCard key={news.id} news={news} featured={true} onAiAssist={() => setAiModalItem(news)} />)}
                            </div>
                        </div>

                        {/* Market Mood & Impact (Spans 2) */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="qx-card p-4 flex flex-col items-center h-[190px]">
                                <div className="w-full flex justify-between items-center mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>MARKET MOOD</span>
                                    <i data-lucide="more-horizontal" size="14"></i>
                                </div>
                                <div className="w-full flex-1 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={moodData} cx="50%" cy="50%" innerRadius={35} outerRadius={45} dataKey="value" stroke="none" onMouseEnter={(_, index) => setActiveIndex(index)}>
                                                {moodData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center gap-3 text-[8px] font-mono text-gray-500 uppercase mt-2">
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-acid"></span> BULLISH</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> BEARISH</span>
                                </div>
                            </div>
                            
                            <div className="qx-card p-4 h-[194px]">
                                <div className="w-full flex justify-between items-center mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>TRENDING IMPACT</span>
                                </div>
                                <div className="space-y-3 font-mono text-[10px]">
                                    {trendingData.map(item => (
                                        <div key={item.symbol} className="flex justify-between items-center group cursor-pointer">
                                            <span className="font-bold text-white w-8 group-hover:text-acid transition-colors">{item.symbol}</span>
                                            <div className="flex-1 mx-2">
                                                <div className="h-1 bg-gray-800 rounded-full overflow-hidden relative">
                                                    <div className={`absolute h-full ${item.change >= 0 ? 'bg-acid shadow-[0_0_5px_#34d399] left-1/2' : 'bg-red-500 shadow-[0_0_5px_#ff3b30] right-1/2'}`} style={{width: `${item.impact/2}%`}}></div>
                                                </div>
                                            </div>
                                            <span className={`w-10 text-right ${item.change >= 0 ? 'text-acid' : 'text-red-500'}`}>
                                                {item.change >= 0 ? '+' : ''}{item.change}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI CHAT (Spans 3) */}
                        <div className="lg:col-span-3 qx-card flex flex-col h-full min-h-[400px]">
                            <div className="p-4 border-b border-gray-800/50 flex justify-between items-center shrink-0">
                                <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><i data-lucide="bot" size="14"></i> AI CHAT</span>
                                <i data-lucide="more-horizontal" size="14" className="text-gray-500"></i>
                            </div>
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-acid/20 flex items-center justify-center shrink-0 mt-1">
                                        <i data-lucide="sparkles" size="12" className="text-acid"></i>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-acid font-bold mb-1 tracking-widest">QUANTX ADVISOR</div>
                                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-xs text-gray-300 font-sans border border-white/10 shadow-sm leading-relaxed backdrop-blur-md">
                                            Market mood is shifting bullish on the S&P 500 milestone. Shall we analyze your portfolio impact?
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start justify-end gap-2 mt-4">
                                    <div>
                                        <div className="bg-blue-600/30 p-3 rounded-2xl rounded-tr-none text-xs text-white font-sans border border-blue-500/30 shadow-sm leading-relaxed backdrop-blur-md">
                                            Yes, show me key changes.
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                                        <i data-lucide="user" size="12" className="text-blue-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t border-gray-800/50 relative shrink-0">
                                <input type="text" className="w-full bg-black/40 rounded-full pl-4 pr-10 py-2.5 text-xs text-white border border-gray-700 focus:outline-none focus:border-acid transition-colors backdrop-blur-md shadow-inner" placeholder="Type message..." />
                                <button className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-acid transition-colors">
                                    <i data-lucide="send" size="14"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Quantum Newsstream */}
                    <div>
                        <div className="flex justify-between items-end mb-4 border-b border-blue-400/20 pb-2">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-blue-400 italic">QUANTUM NEWSSTREAM</h2>
                                <p className="text-yellow-500 text-xs font-mono uppercase tracking-widest mt-1">GROUNDING: QUANTX SEARCH ENGINE PRO</p>
                            </div>
                            <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-acid animate-pulse"></span> FEED STABLE
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 text-xs font-bold font-mono rounded-full border transition-all ${activeCategory === cat ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:-translate-y-1' : 'bg-void text-gray-400 border-gray-800 hover:border-gray-500 hover:text-gray-200 hover:-translate-y-1'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* News Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNews.map(news => <NewsCard key={news.id} news={news} featured={false} onAiAssist={() => setAiModalItem(news)} />)}
                        </div>
                    </div>

                    {aiModalItem && <AIAssistantModal newsItem={aiModalItem} onClose={() => setAiModalItem(null)} />}
                </div>
            );
        };

        const AILabTab = () => {
            const [query, setQuery] = useState("");
            const [response, setResponse] = useState("");
            const [loading, setLoading] = useState(false);

            const handleExecute = async () => {
                if (!query) return;
                setLoading(true);
                setResponse("");
                try {
                    const res = await fetch('http://localhost:8000/api/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ prompt: query })
                    });
                    const data = await res.json();
                    setResponse(data.text);
                } catch (e) {
                    setResponse("Error connecting to AI Server.");
                }
                setLoading(false);
            };

            return (
                <div className="h-full flex flex-col pb-10">
                    <div className="qx-card flex-1 p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
                        <i data-lucide="bot" size="48" className="text-acid mb-6"></i>
                        <h2 className="text-2xl font-display font-bold text-white mb-2">QuantX AI Lab (Multi-Modal)</h2>
                        <p className="text-gray-400 font-sans text-sm max-w-lg mb-8">
                            The Multi-Modal suite allows natural language interaction with your charting engine. Ask it to find divergence, summarize sentiment, or correlate macroeconomic data.
                        </p>
                        <div className="w-full max-w-2xl relative">
                            <input 
                                type="text" 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                                className="w-full bg-void border border-acid/30 p-4 pl-6 pr-32 rounded-full font-mono text-sm text-white focus:outline-none focus:border-acid focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all" 
                                placeholder="E.g., 'Analyze the correlation between TSLA and BTC over the last 30 days...'" 
                            />
                            <button onClick={handleExecute} disabled={loading} className="absolute right-2 top-2 bottom-2 bg-acid/10 hover:bg-acid/20 text-acid px-6 rounded-full font-bold border border-acid/30 transition-colors">
                                {loading ? 'PROCESSING...' : 'EXECUTE'}
                            </button>
                        </div>
                        {response && (
                            <div className="mt-8 w-full max-w-2xl bg-void/50 border border-acid/30 p-6 text-left relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-acid"></div>
                                <h3 className="text-acid font-bold text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <i data-lucide="sparkles" size="16"></i> AI Intelligence Report
                                </h3>
                                <div className="text-gray-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">{response}</div>
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        const App = () => {
            const [user, setUser] = useState(null);
            const [authChecking, setAuthChecking] = useState(true);
            const [activeTab, setActiveTab] = useState('dashboard');
            const [loading, setLoading] = useState(false);

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
                    <BirdAnimation />
                    <div className="qx-dynamic-bg"></div>
                    <Ticker />
                    
                    {/* Header */}
                    <header className="mt-8 border-b border-white/10 bg-void/60 backdrop-blur-xl p-4 flex justify-between items-center z-20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-acid/10 border border-acid/30 shadow-[0_0_10px_rgba(0,255,65,0.2)] flex items-center justify-center w-10 h-10 rounded-full">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(212,255,170,0.6)]">
                                    <g fill="#d4ffaa" transform="translate(50,50)">
                                        <path d="M 5,-5 A 40,40 0 0,1 45,-45 A 40,40 0 0,0 45,5 A 40,40 0 0,1 5,-5 Z" />
                                        <path d="M 5,5 A 40,40 0 0,1 45,45 A 40,40 0 0,0 -5,45 A 40,40 0 0,1 5,5 Z" />
                                        <path d="M -5,5 A 40,40 0 0,1 -45,45 A 40,40 0 0,0 -45,-5 A 40,40 0 0,1 -5,5 Z" />
                                        <path d="M -5,-5 A 40,40 0 0,1 -45,-45 A 40,40 0 0,0 5,-45 A 40,40 0 0,1 -5,-5 Z" />
                                    </g>
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold font-display tracking-widest text-white">QUANT<span className="text-acid">X</span></h1>
                        </div>
                        <div className="flex gap-2 bg-void p-1 border border-gray-800 rounded-full">
                            {['dashboard', 'terminal', 'ai lab'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`uppercase text-xs font-bold px-4 py-2 rounded-full transition-all ${activeTab === tab ? 'bg-acid/10 text-acid border border-acid/50 shadow-[0_0_15px_rgba(0,255,65,0.2)]' : 'text-gray-500 hover:text-gray-300 border border-transparent hover:bg-gray-800/50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                            <button onClick={() => auth.signOut()} className="uppercase text-xs font-bold px-4 py-2 rounded-full text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/30">
                                LOGOUT
                            </button>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 p-6 overflow-y-auto no-scrollbar z-20">
                        <div className="max-w-[1400px] mx-auto h-full">
                            {activeTab === 'dashboard' && <DashboardTab />}
                            {activeTab === 'terminal' && <ChartingEngine />}
                            {activeTab === 'ai lab' && <AILabTab />}
                        </div>
                    </main>

                    {/* Status Footer */}
                    <footer className="fixed bottom-0 left-0 right-0 border-t border-acid/20 bg-void/90 backdrop-blur-sm p-2 px-6 flex justify-between items-center text-xs text-gray-500 z-30 font-mono h-10">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-acid/10 border border-acid/30 text-acid shadow-[0_0_10px_rgba(0,255,65,0.1)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse"></div>
                                <span>SECURE UPLINK</span>
                            </div>
                            <span className="hidden md:inline">NODE: QX-ALPHA-01</span>
                        </div>
                        <div className="text-acid/70">
                            TIME: {new Date().toLocaleTimeString()}
                        </div>
                    </footer>
                </div>
            );
        };
"""

# Regex: from `const MainPulse` to right before `const root = ReactDOM.createRoot`
new_content = re.sub(r'        const MainPulse = \(\) => \{[\s\S]*?(?=        const root = ReactDOM\.createRoot)', replacement, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
