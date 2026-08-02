import { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import './DataTable.css';

/**
 * Generic sortable table.
 *
 * columns: [{ key, label, sortable?, render?: (row) => node }]
 * rows: array of data objects
 * getRowId: (row) => string|number
 *
 * Adding a new column later means adding one object to the `columns`
 * array passed in from the page — this component itself never changes.
 */
export default function DataTable({ columns, rows, getRowId, emptyMessage }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    const accessor = col?.sortValue || ((row) => row[sortKey]);
    return [...rows].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir, columns]);

  function toggleSort(key) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    }
  }

  return (
    <div className="data-table__wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.sortable ? (
                  <button type="button" className="data-table__sort-btn" onClick={() => toggleSort(col.key)}>
                    <span>{col.label}</span>
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? (
                        <ChevronUp size={13} />
                      ) : (
                        <ChevronDown size={13} />
                      )
                    ) : (
                      <ChevronsUpDown size={13} className="data-table__sort-icon--idle" />
                    )}
                  </button>
                ) : (
                  <span>{col.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          )}
          {sortedRows.map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
