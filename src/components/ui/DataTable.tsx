import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

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
  data, columns, onRowClick, maxHeight, striped = false,
}: DataTableProps<T>) {
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
      className="overflow-auto rounded-lg"
      style={{ maxHeight, background: '#13131f', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '8px' }}
    >
      <table className="w-full font-mono border-collapse">
        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-3 py-2 text-left border-b font-normal uppercase tracking-widest cursor-pointer select-none group transition-colors"
                style={{
                  width: col.width,
                  textAlign: col.align || 'left',
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.3)',
                  letterSpacing: '0.06em',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  background: '#0f0f17',
                }}
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
              className="border-b transition-colors"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.05)',
                background: striped && rowIdx % 2 === 1 ? '#111119' : '#13131f',
                cursor: onRowClick ? 'pointer' : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = striped && rowIdx % 2 === 1 ? '#111119' : '#13131f';
              }}
            >
              {columns.map((col) => {
                const rawValue = row[col.key as keyof T];
                let cellColor = 'rgba(255, 255, 255, 0.85)';
                const cellText = col.render ? col.render(rawValue, row, rowIdx) : String(rawValue ?? '—');

                if (typeof rawValue === 'number') {
                  if (rawValue > 0) cellColor = '#00c896';
                  else if (rawValue < 0) cellColor = '#ff4d4d';
                }

                return (
                  <td
                    key={String(col.key)}
                    className="px-3 py-2"
                    style={{
                      textAlign: col.align || 'left',
                      fontSize: '12px',
                      color: cellColor,
                    }}
                  >
                    {cellText}
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