import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Zap, ChevronRight, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Stock, MarketIndex } from '@/types';
import { fmt } from '@/utils/formatters';
import Card from '@/components/ui/Card';

interface TerminalProps {
  stocks: Stock[];
  indices: MarketIndex[];
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'success';
  content: string;
}

const HELP_TEXT = [
  '╔══════════════════════════════════════════════════════════╗',
  '║          QUANTX TERMINAL v2.1.0  —  COMMAND REFERENCE   ║',
  '╚══════════════════════════════════════════════════════════╝',
  '',
  '  MARKET DATA',
  '  ─────────────────────────────────────────────────────────',
  '  price <SYMBOL>        → Current price & stats',
  '  quote <SYMBOL>        → Full quote with technicals',
  '  watchlist             → Show all tracked securities',
  '',
  '  PORTFOLIO',
  '  ─────────────────────────────────────────────────────────',
  '  portfolio             → Portfolio summary',
  '  positions             → All open positions',
  '',
  '  ANALYSIS',
  '  ─────────────────────────────────────────────────────────',
  '  scan                  → AI signal scan (top picks)',
  '  movers                → Top gainers & losers',
  '  indices               → All market indices',
  '',
  '  SYSTEM',
  '  ─────────────────────────────────────────────────────────',
  '  help                  → Show this message',
  '  clear                 → Clear terminal output',
  '  version               → Build info',
];

const Terminal: React.FC<TerminalProps> = ({ stocks, indices }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', content: '╔════════════════════════════════════════════════╗' },
    { type: 'info', content: '║   QUANTX TERMINAL v2.1.0  —  READY             ║' },
    { type: 'info', content: '╚════════════════════════════════════════════════╝' },
    { type: 'output', content: 'Type "help" for available commands.' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const addLines = (newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  };

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const arg = parts[1]?.toUpperCase();

    // Echo input
    addLines([{ type: 'input', content: `> ${cmd}` }]);

    switch (command) {
      case 'help':
        addLines(HELP_TEXT.map((l) => ({ type: 'output' as const, content: l })));
        break;

      case 'clear':
        setLines([]);
        break;

      case 'version':
        addLines([
          { type: 'info', content: 'QUANTX Terminal v2.1.0' },
          { type: 'output', content: `Build: ${new Date().toLocaleDateString()}` },
          { type: 'output', content: 'Engine: React 18 + TypeScript 5 + Vite 5' },
        ]);
        break;

      case 'price':
      case 'quote': {
        if (!arg) {
          addLines([{ type: 'error', content: `Usage: ${command} <SYMBOL>  (e.g. ${command} AAPL)` }]);
          break;
        }
        const stock = stocks.find((s) => s.symbol === arg);
        if (!stock) {
          addLines([{ type: 'error', content: `Symbol not found: ${arg}` }]);
          break;
        }
        const isPos = stock.changePercent >= 0;
        addLines([
          { type: 'info', content: `──────────────── ${stock.symbol} ────────────────` },
          { type: 'output', content: `Name    : ${stock.name}` },
          { type: 'output', content: `Price   : ${fmt.currency(stock.price)}` },
          { type: isPos ? 'success' : 'error', content: `Change  : ${fmt.change(stock.change)} (${fmt.percent(stock.changePercent)})` },
          { type: 'output', content: `Volume  : ${fmt.number(stock.volume, true)} (avg ${fmt.number(stock.avgVolume, true)})` },
          { type: 'output', content: `Mkt Cap : ${fmt.currency(stock.marketCap, true)}` },
          ...(command === 'quote' ? [
            { type: 'output' as const, content: `P/E     : ${stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}` },
            { type: 'output' as const, content: `RSI     : ${stock.rsi.toFixed(1)}` },
            { type: 'output' as const, content: `Beta    : ${stock.beta.toFixed(2)}` },
            { type: 'output' as const, content: `Signal  : ${fmt.signal(stock.signal)}` },
            { type: 'output' as const, content: `Score   : ${stock.score}/100` },
            { type: 'output' as const, content: `52W Hi  : ${fmt.currency(stock.high52)}` },
            { type: 'output' as const, content: `52W Lo  : ${fmt.currency(stock.low52)}` },
          ] : []),
        ]);
        break;
      }

      case 'watchlist':
        addLines([
          { type: 'info', content: '─── WATCHLIST ─────────────────────────────────' },
          { type: 'output', content: 'SYMBOL    PRICE       CHG        SIGNAL   SCORE' },
          { type: 'output', content: '──────────────────────────────────────────────' },
          ...stocks.map((s) => ({
            type: 'output' as const,
            content: `${s.symbol.padEnd(9)} ${fmt.currency(s.price).padEnd(11)} ${fmt.percent(s.changePercent).padEnd(10)} ${fmt.signal(s.signal).padEnd(10)} ${s.score}`,
          })),
        ]);
        break;

      case 'positions':
        addLines([
          { type: 'info', content: '─── OPEN POSITIONS ────────────────────────────' },
          { type: 'output', content: 'AAPL  ×120   @ $178.40  →  $227.52  +27.5%' },
          { type: 'output', content: 'NVDA  ×200   @ $48.20   →  $128.30  +166.2%' },
          { type: 'output', content: 'MSFT  ×60    @ $384.20  →  $448.82  +16.8%' },
          { type: 'output', content: 'META  ×40    @ $312.80  →  $582.14  +86.1%' },
          { type: 'output', content: 'AMZN  ×80    @ $168.40  →  $218.74  +29.9%' },
          { type: 'output', content: 'GOOGL ×100   @ $158.20  →  $192.40  +21.6%' },
          { type: 'output', content: 'PLTR  ×500   @ $18.40   →  $38.42   +108.8%' },
          { type: 'output', content: 'JPM   ×80    @ $196.40  →  $234.18  +19.2%' },
        ]);
        break;

      case 'portfolio':
        addLines([
          { type: 'info', content: '─── PORTFOLIO SUMMARY ─────────────────────────' },
          { type: 'success', content: 'Total Value   : $248,740.82' },
          { type: 'success', content: 'Unrealized P&L: +$64,540.82  (+35.04%)' },
          { type: 'success', content: 'Day P&L       : +$2,840.18  (+1.15%)' },
          { type: 'output', content: 'Cash          : $24,800.00' },
          { type: 'output', content: 'Sharpe Ratio  : 1.84' },
          { type: 'output', content: 'Max Drawdown  : -18.4%' },
          { type: 'output', content: 'Beta          : 1.24' },
          { type: 'output', content: 'Alpha (Ann.)  : +8.4%' },
        ]);
        break;

      case 'movers': {
        const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
        const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);
        addLines([
          { type: 'info', content: '─── TOP GAINERS ───────────────────────────────' },
          ...gainers.map((s) => ({ type: 'success' as const, content: `${s.symbol.padEnd(8)} ${fmt.currency(s.price).padEnd(12)} ${fmt.percent(s.changePercent)}` })),
          { type: 'output', content: '' },
          { type: 'info', content: '─── TOP LOSERS ────────────────────────────────' },
          ...losers.map((s) => ({ type: 'error' as const, content: `${s.symbol.padEnd(8)} ${fmt.currency(s.price).padEnd(12)} ${fmt.percent(s.changePercent)}` })),
        ]);
        break;
      }

      case 'indices':
        addLines([
          { type: 'info', content: '─── MARKET INDICES ────────────────────────────' },
          { type: 'output', content: 'INDEX         VALUE         CHG        %CHG' },
          { type: 'output', content: '──────────────────────────────────────────────' },
          ...indices.map((idx) => ({
            type: idx.changePercent >= 0 ? 'success' as const : 'error' as const,
            content: `${idx.symbol.padEnd(13)} ${idx.value.toLocaleString('en-US', { maximumFractionDigits: 2 }).padEnd(13)} ${fmt.change(idx.change).padEnd(10)} ${fmt.percent(idx.changePercent)}`,
          })),
        ]);
        break;

      case 'scan':
        addLines([
          { type: 'info', content: '─── AI SIGNAL SCAN ────────────────────────────' },
          ...stocks
            .filter((s) => s.signal === 'STRONG_BUY' || s.signal === 'BUY')
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((s) => ({
              type: 'success' as const,
              content: `${s.symbol.padEnd(8)} ${fmt.signal(s.signal).padEnd(14)} Score: ${s.score}  RSI: ${s.rsi.toFixed(1)}`,
            })),
          { type: 'output', content: '' },
          { type: 'info', content: '─── CAUTION SIGNALS ───────────────────────────' },
          ...stocks
            .filter((s) => s.signal === 'STRONG_SELL' || s.signal === 'SELL')
            .map((s) => ({
              type: 'error' as const,
              content: `${s.symbol.padEnd(8)} ${fmt.signal(s.signal).padEnd(14)} Score: ${s.score}  RSI: ${s.rsi.toFixed(1)}`,
            })),
        ]);
        break;

      case '':
        addLines([{ type: 'output', content: '' }]);
        break;

      default:
        addLines([
          { type: 'error', content: `Command not found: "${command}". Type "help" to see available commands.` },
        ]);
    }

    addLines([{ type: 'output', content: '' }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (input.trim()) {
        setHistory((h) => [input, ...h]);
        setHistIdx(-1);
      }
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = histIdx + 1;
      if (next < history.length) {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
    }
  };

  const lineColors: Record<string, string> = {
    input: isDark ? '#b0b8cc' : '#374151',
    output: isDark ? '#5a6080' : '#6b7280',
    error: '#ff3b30',
    info: isDark ? '#00ff41' : '#0a84ff',
    success: isDark ? '#00ff41' : '#059669',
  };

  return (
    <div className={`p-4 space-y-4 ${isDark ? 'text-steel-200' : 'text-lm-text'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-display text-lg font-bold flex items-center gap-2 ${isDark ? 'text-steel-50' : 'text-lm-text'}`}>
            <TerminalIcon size={18} className={isDark ? 'text-acid-500' : 'text-signal-blue'} />
            QUANTX Terminal
          </h1>
          <p className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '10px' }}>
            COMMAND-LINE INTERFACE · TYPE "HELP" FOR COMMANDS
          </p>
        </div>
        <button
          onClick={() => setLines([])}
          className={`flex items-center gap-1 font-mono text-xs px-2 py-1 border transition-colors ${isDark ? 'border-steel-700/50 text-steel-500 hover:text-signal-red hover:border-signal-red/40' : 'border-lm-border text-lm-muted hover:text-red-500'}`}
        >
          <X size={10} />
          CLEAR
        </button>
      </div>

      {/* Terminal window */}
      <Card accent noPadding>
        {/* Terminal header bar */}
        <div className={`flex items-center gap-2 px-3 py-2 border-b ${isDark ? 'border-acid-500/10 bg-void-950/50' : 'border-lm-border bg-gray-50'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-signal-red opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-signal-yellow opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-signal-green opacity-80" />
          <span className={`ml-2 font-mono text-xs ${isDark ? 'text-steel-500' : 'text-lm-muted'}`}>
            quantx-terminal — bash
          </span>
          <div className="flex-1" />
          <div className={`flex items-center gap-1 font-mono ${isDark ? 'text-acid-500/60' : 'text-signal-blue/60'}`} style={{ fontSize: '9px' }}>
            <Zap size={8} />
            QUANTX v2.1.0
          </div>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          className={`font-mono p-4 overflow-y-auto ${isDark ? 'bg-void-900/50' : 'bg-white'}`}
          style={{ height: '420px', fontSize: '12px', lineHeight: '1.7' }}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{ color: lineColors[line.type] || lineColors.output, whiteSpace: 'pre' }}
            >
              {line.content}
            </div>
          ))}
        </div>

        {/* Input area */}
        <div
          className={`flex items-center gap-2 px-4 py-3 border-t ${isDark ? 'border-acid-500/10 bg-void-950/30' : 'border-lm-border'}`}
        >
          <ChevronRight size={12} className={isDark ? 'text-acid-500' : 'text-signal-blue'} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Enter command..."
            className={`flex-1 font-mono bg-transparent outline-none ${isDark ? 'text-steel-100 placeholder-steel-700 caret-acid-500' : 'text-lm-text placeholder-lm-muted caret-signal-blue'}`}
            style={{ fontSize: '12px' }}
          />
          <button
            onClick={() => { processCommand(input); setInput(''); }}
            className={`font-mono text-xs px-3 py-1 border transition-all ${isDark ? 'border-acid-500/30 text-acid-500 hover:bg-acid-500/10' : 'border-signal-blue/30 text-signal-blue hover:bg-signal-blue/10'}`}
          >
            RUN
          </button>
        </div>
      </Card>

      {/* Quick commands */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-mono text-xs ${isDark ? 'text-steel-600' : 'text-lm-muted'}`}>QUICK:</span>
        {['help', 'watchlist', 'portfolio', 'movers', 'indices', 'scan'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => { processCommand(cmd); }}
            className={`font-mono text-xs px-2 py-0.5 border transition-all ${isDark ? 'border-steel-700/50 text-steel-400 hover:border-acid-500/40 hover:text-acid-500' : 'border-lm-border text-lm-muted hover:border-signal-blue/40 hover:text-signal-blue'}`}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
