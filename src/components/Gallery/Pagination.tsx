import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  // Don't show pagination if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers to display (with ellipsis for large page counts)
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxPagesToShow = 7; // Show up to 7 page buttons

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const leftSiblingIndex = Math.max(currentPage - 1, 2);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

      const showLeftEllipsis = leftSiblingIndex > 2;
      const showRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!showLeftEllipsis && showRightEllipsis) {
        // Show pages from start
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      } else if (showLeftEllipsis && !showRightEllipsis) {
        // Show pages at end
        pages.push('ellipsis');
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else if (showLeftEllipsis && showRightEllipsis) {
        // Show current page and siblings
        pages.push('ellipsis');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      } else {
        // Show all middle pages
        for (let i = 2; i <= totalPages - 1; i++) {
          pages.push(i);
        }
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="gallery-pagination">
      <div className="pagination-info text-detail">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>

      <div className="pagination-controls">
        {/* Previous Button */}
        {/* @ts-ignore */}
        <sp-button
          variant="secondary"
          size="s"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="pagination-button"
          title="Previous page"
        >
          ‹
        {/* @ts-ignore */}
        </sp-button>

        {/* Page Numbers */}
        <div className="pagination-pages">
          {pageNumbers.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                …
              </span>
            ) : (
              /* @ts-ignore */
              <sp-button
                key={page}
                variant={currentPage === page ? 'accent' : 'secondary'}
                size="s"
                onClick={() => handlePageClick(page)}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                title={`Go to page ${page}`}
              >
                {page}
              {/* @ts-ignore */}
              </sp-button>
            )
          )}
        </div>

        {/* Next Button */}
        {/* @ts-ignore */}
        <sp-button
          variant="secondary"
          size="s"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-button"
          title="Next page"
        >
          ›
        {/* @ts-ignore */}
        </sp-button>
      </div>

      {/* Items per page selector (if callback provided) */}
      {onItemsPerPageChange && (
        <div className="pagination-per-page">
          <sp-label className="text-detail">Items per page:</sp-label>
          <sp-picker
            // @ts-expect-error - UXP component property
            size="s"
            className="per-page-picker"
            onChange={(e: any) => onItemsPerPageChange(parseInt(e.target.value, 10))}
          >
            <sp-menu slot="options">
              <sp-menu-item value="12">12</sp-menu-item>
              <sp-menu-item value="24">24</sp-menu-item>
              <sp-menu-item value="48">48</sp-menu-item>
              <sp-menu-item value="96">96</sp-menu-item>
            </sp-menu>
          </sp-picker>
        </div>
      )}
    </div>
  );
};
