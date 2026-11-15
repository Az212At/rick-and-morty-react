interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  pages,
  onPageChange,
}: PaginationProps) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Пагинация">
      <button
        className="button button--secondary"
        type="button"
        aria-label="Предыдущая страница"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <span aria-hidden="true">←</span> Назад
      </button>
      <span className="pagination__info" aria-live="polite">
        Страница {page} из {pages}
      </span>
      <button
        className="button button--secondary"
        type="button"
        aria-label="Следующая страница"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Далее <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
