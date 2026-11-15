interface QueryStateProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry: () => void;
  onReset: () => void;
}

export default function QueryState({
  isLoading,
  error,
  isEmpty,
  onRetry,
  onReset,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="query-state" role="status">
        <span className="spinner" aria-hidden="true" />
        Загружаем данные…
      </div>
    );
  }

  if (error) {
    return (
      <div className="query-state" role="alert">
        <h3>Не получилось открыть портал</h3>
        <p>{error}</p>
        <button className="button" type="button" onClick={onRetry}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="query-state" role="status">
        <h3>Ничего не найдено</h3>
        <p>Попробуйте другое имя или сбросьте фильтры.</p>
        <button
          className="button button--secondary"
          type="button"
          onClick={onReset}
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  return null;
}
