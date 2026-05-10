import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

charting_engine = """        const ChartingEngine = () => {
            const [fullData] = useState(generateChartData());
            const [data, setData] = useState(fullData);
            const [showMACD, setShowMACD] = useState(true);
            const [showRSI, setShowRSI] = useState(false);
            const [refAreaLeft, setRefAreaLeft] = useState('');
            const [refAreaRight, setRefAreaRight] = useState('');
            const [countdown, setCountdown] = useState(60);
            
            const [aiAnalysis, setAiAnalysis] = useState("");
            const [analyzing, setAnalyzing] = useState(false);
            const [mode3D, setMode3D] = useState(false);

            useEffect(() => {
                const interval = setInterval(() => {
                    setCountdown(c => c <= 1 ? 60 : c - 1);
                }, 1000);
                return () => clearInterval(interval);
            }, []);

            const zoom = () => {
                if (!refAreaLeft || !refAreaRight || refAreaLeft === refAreaRight) {
                    setRefAreaLeft(''); setRefAreaRight(''); return;
                }
                let idx1 = fullData.findIndex(d => d.time === refAreaLeft);
                let idx2 = fullData.findIndex(d => d.time === refAreaRight);
                if (idx1 > idx2) [idx1, idx2] = [idx2, idx1];
                setData(fullData.slice(idx1, idx2 + 1));
                setRefAreaLeft(''); setRefAreaRight('');
            };

            const zoomOut = () => setData(fullData);

            const exportCSV = () => {
                const header = "time,price,macd,rsi\\n";
                const rows = data.map(d => `${d.time},${d.price},${d.macd},${d.rsi}`).join("\\n");
                const blob = new Blob([header + rows], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'neural-export.csv'; a.click();
            };

            const triggerAI = async () => {
                setAnalyzing(true);
                try {
                    const res = await fetch('http://localhost:8000/api/analyze', { 
                        method: 'POST', 
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ticker: 'NVDA'}) 
                    });
                    if(!res.ok) throw new Error();
                    const result = await res.json();
                    setAiAnalysis(result.analysis);
                } catch {
                    setTimeout(() => {
                        setAiAnalysis("Mock AI Analysis: Python backend unreachable. Internal neural net indicates a strong bullish setup. MACD crosses zero line. Recommended action: HOLD.");
                        setAnalyzing(false);
                    }, 1500);
                    return;
                }
                setAnalyzing(false);
            };

            return (
                <div className="flex flex-col h-full space-y-4 pb-10">
                    <div className="qx-card p-4 flex justify-between items-center bg-void/50">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-display font-bold text-white">NVDA <span className="text-acid text-sm ml-2">Neural Engine</span></h2>
                            <div className="px-2 py-1 bg-acid/10 border border-acid/30 text-acid font-mono text-xs flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse"></span>
                                Polling in {countdown}s
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setMode3D(!mode3D)} className={`px-3 py-1 text-xs font-bold border rounded-full transition-all ${mode3D ? 'border-blue-500 text-blue-500 bg-blue-500/10 shadow-[0_0_10px_rgba(10,132,255,0.2)]' : 'border-gray-600 text-gray-400 hover:bg-gray-800'}`}>3D MODE</button>
                            <button onClick={() => setShowMACD(!showMACD)} className={`px-3 py-1 text-xs border rounded-full ${showMACD ? 'border-acid text-acid bg-acid/10' : 'border-gray-600 text-gray-400 hover:bg-gray-800'}`}>MACD</button>
                            <button onClick={() => setShowRSI(!showRSI)} className={`px-3 py-1 text-xs border rounded-full ${showRSI ? 'border-acid text-acid bg-acid/10' : 'border-gray-600 text-gray-400 hover:bg-gray-800'}`}>RSI</button>
                            <button onClick={zoomOut} className="px-3 py-1 text-xs border border-gray-600 text-gray-400 hover:bg-gray-800 rounded-full transition-colors">RESET ZOOM</button>
                            <button onClick={exportCSV} className="px-3 py-1 text-xs border border-gray-600 text-gray-400 hover:bg-gray-800 flex items-center gap-1 rounded-full transition-colors"><i data-lucide="download" size="12"></i> CSV</button>
                        </div>
                    </div>

                    <div className="qx-card flex-1 p-4 min-h-[400px] relative" onDoubleClick={zoomOut}>
                        {mode3D ? (
                            <ThreeDataChart data={data} />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data} onMouseDown={e => e && setRefAreaLeft(e.activeLabel)} onMouseMove={e => e && refAreaLeft && setRefAreaRight(e.activeLabel)} onMouseUp={zoom}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(52,211,153,0.06)" vertical={false} />
                                    <XAxis dataKey="time" stroke="#b0b8cc" fontSize={11} minTickGap={30} />
                                    <YAxis yAxisId="1" domain={['auto', 'auto']} stroke="#34d399" fontSize={11} orientation="right" />
                                    {showMACD && <YAxis yAxisId="2" domain={['auto', 'auto']} stroke="#0a84ff" fontSize={11} orientation="left" />}
                                    {showRSI && <YAxis yAxisId="3" domain={[0, 100]} stroke="#ff3b30" fontSize={11} orientation="left" hide />}
                                    <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 24 }} />
                                    <Line yAxisId="1" type="monotone" dataKey="price" stroke="#34d399" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    {showMACD && <Line yAxisId="2" type="monotone" dataKey="macd" stroke="#0a84ff" strokeWidth={1} dot={false} isAnimationActive={false} />}
                                    {showRSI && <Line yAxisId="3" type="monotone" dataKey="rsi" stroke="#ff3b30" strokeWidth={1} dot={false} isAnimationActive={false} />}
                                    {refAreaLeft && refAreaRight ? <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="rgba(52,211,153,0.2)" /> : null}
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                        {!mode3D && <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 opacity-50 pointer-events-none">Drag to Zoom | Double Click to Reset</div>}
                        {mode3D && <div className="absolute top-4 left-4 text-xs font-mono text-blue-500 opacity-50 pointer-events-none">3D Hover Rotation Active</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="qx-card p-4">
                            <div className="flex justify-between items-center border-b border-acid/20 pb-2 mb-4">
                                <h3 className="text-acid font-bold text-sm flex items-center gap-2"><i data-lucide="cpu" size="16"></i> AI Setup Analysis</h3>
                                <button onClick={triggerAI} disabled={analyzing} className="qx-btn-primary py-1 px-3 text-xs flex items-center gap-2">
                                    {analyzing ? <span className="animate-spin"><i data-lucide="loader" size="12"></i></span> : <i data-lucide="zap" size="12"></i>}
                                    {analyzing ? 'SCANNING...' : 'GENERATE'}
                                </button>
                            </div>
                            <div className="font-mono text-sm text-gray-300 min-h-[80px]">
                                {aiAnalysis ? aiAnalysis.split('\\n').map((l,i)=><p key={i} className="mb-2">{l}</p>) : <span className="text-gray-600">Awaiting trigger for neural scan...</span>}
                            </div>
                        </div>

                        <div className="qx-card p-4">
                            <h3 className="text-acid font-bold text-sm border-b border-acid/20 pb-2 mb-4">Historical Archive</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="min-w-[200px] border border-gray-800 p-3 bg-void/50 hover:border-acid/30 transition-colors cursor-pointer group">
                                        <span className="text-[10px] text-gray-500 font-mono mb-1 block">Week {52-i}</span>
                                        <p className="text-xs text-gray-300 font-display group-hover:text-acid transition-colors">Quarterly earnings beat expectations amidst infrastructure boom.</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const AuthPage = () => {"""

content = content.replace("        const AuthPage = () => {", charting_engine)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("ChartingEngine restored.")
