import { ChevronLeft, ChevronRight } from 'lucide-react';
import IconButton from './IconButton';
import './Pagination.css';

export default function Pagination({ page, totalPages, totalElements, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <span className="pagination__summary">
        Page {page + 1} of {totalPages} · {totalElements} total
      </span>
      <div className="pagination__controls">
        <IconButton icon={ChevronLeft} label="Previous page" disabled={page === 0} onClick={() => onPageChange(page - 1)} />
        <IconButton
          icon={ChevronRight}
          label="Next page"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}
