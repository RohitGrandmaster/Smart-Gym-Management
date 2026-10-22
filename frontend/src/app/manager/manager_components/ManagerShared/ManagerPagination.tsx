// RESPONSIBILITY: Renders the pagination bar (Previous/Next + page info + rows-per-page) shared across all MANAGER table views.
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ManagerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // Optional detailed info props
  totalItems?: number;
  itemsPerPage?: number;
  // Optional color overrides (uses CSS vars by default)
  colors?: {
    text?: string;
    textActive?: string;
    bgActive?: string;
    border?: string;
    hoverBg?: string;
  };
}

export default function ManagerPagination({ 
  currentPage, 
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  colors,
}: ManagerPaginationProps) {

  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  const bgActive = colors?.bgActive ?? 'var(--primary)';
  const textActive = colors?.textActive ?? 'white';
  const textColor = colors?.text ?? 'var(--text-secondary)';
  const borderColor = colors?.border ?? 'var(--border)';

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div 
      className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ borderColor }}
    >
      {startItem !== null && endItem !== null && totalItems !== undefined ? (
        <div className="text-sm text-center sm:text-left" style={{ color: textColor }}>
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      ) : (
        <div className="text-sm" style={{ color: textColor }}>
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ color: textColor }}
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1 mx-1">
          {getVisiblePages().map((p, i) => (
            p === '...' ? (
              <span key={`dots-${i}`} className="px-2" style={{ color: textColor }}>...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                style={
                  currentPage === p 
                    ? { background: bgActive, color: textActive }
                    : { color: textColor }
                }
              >
                {p}
              </button>
            )
          ))}
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ color: textColor }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
