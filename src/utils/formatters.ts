export const fmt = {
  currency: (value: number, compact = false): string => {
    if (compact) {
      if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
      if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  },

  percent: (value: number, decimals = 2): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
  },

  number: (value: number, compact = false): string => {
    if (compact) {
      if (Math.abs(value) >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
      if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
      if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
      if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    }
    return new Intl.NumberFormat('en-US').format(value);
  },

  change: (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}`;
  },

  ratio: (value: number, decimals = 2): string => value.toFixed(decimals) + 'x',

  timestamp: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  },

  date: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  },

  signal: (signal: string): string => signal.replace('_', ' '),
};