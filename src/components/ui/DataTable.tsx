import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  maxHeight?: string;
  striped?: boolean;
  compact?: boolean;
}

function DataTable<T extends Record<string, unknown>>({
  data, columns, onRowClick, maxHeight, striped = false, compact = false,
}: DataTableProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey as keyof T];
      const bv = b[sortKey as keyof T];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const as = String(av ?? '');
      const bs = String(bv ?? '');
      return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }, [data, sortKey, sortDir]);

  return (
    <div
      className={`overflow-auto ${isDark ? 'scrollbar-thin scrollbar-thumb-steel-700' : ''}`}
      style={{ maxHeight }}
    >
      <table className="w-full font-mono border-collapse">
        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-3 ${compact ? 'py-1.5' : 'py-2'} text-left border-b font-normal uppercase tracking-widest cursor-pointer select-none group transition-colors ${
                  isDark
                    ? 'border-acid-500/10 bg-void-900/90 text-acid-500/40 hover:text-acid-500/70'
                    : 'border-lm-border bg-lm-bg text-lm-muted hover:text-lm-text'
                }`}
                style={{ width: col.width, textAlign: col.align || 'left', fontSize: '9px' }}
                onClick={() => col.sortable !== false && handleSort(String(col.key))}
              >
                <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                  {col.label}
                  {col.sortable !== false && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp size={8} /> : <ChevronDown size={8} />
                      ) : (
                        <ChevronsUpDown size={8} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick?.(row)}
              className={`border-b transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              } ${
                isDark
                  ? `border-acid-500/5 hover:bg-acid-500/4 ${striped && rowIdx % 2 === 1 ? 'bg-steel-900/20' : ''}`
                  : `border-lm-border hover:bg-lm-bg ${striped && rowIdx % 2 === 1 ? 'bg-gray-50/80' : ''}`
              }`}
            >
              {columns.map((col) => {
                const rawValue = row[col.key as keyof T];
                return (
                  <td
                    key={String(col.key)}
                    className={`px-3 ${compact ? 'py-1' : 'py-1.5'} ${isDark ? 'text-steel-300' : 'text-lm-text'}`}
                    style={{ textAlign: col.align || 'left', fontSize: '11px' }}
                  >
                    {col.render ? col.render(rawValue, row, rowIdx) : String(rawValue ?? '—')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;