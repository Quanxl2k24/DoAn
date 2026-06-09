const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnBase = 'px-3 py-1.5 text-sm rounded-lg transition-colors font-medium';

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} ${currentPage <= 1 ? 'text-secondary opacity-40 cursor-not-allowed' : 'text-secondary hover:text-on-surface hover:bg-white/5'}`}
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={`${btnBase} text-secondary hover:text-on-surface hover:bg-white/5`}>1</button>
          {start > 2 && <span className="text-secondary px-1">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${btnBase} ${page === currentPage ? 'bg-[#E50914] text-white' : 'text-secondary hover:text-on-surface hover:bg-white/5'}`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-secondary px-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className={`${btnBase} text-secondary hover:text-on-surface hover:bg-white/5`}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} ${currentPage >= totalPages ? 'text-secondary opacity-40 cursor-not-allowed' : 'text-secondary hover:text-on-surface hover:bg-white/5'}`}
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
