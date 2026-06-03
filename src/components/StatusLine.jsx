export function StatusLine({ loading, error, resultCount, totalCount, onRetry }) {
  if (loading) {
    return <p className="status-line">Loading countries from REST Countries...</p>;
  }

  if (error) {
    return (
      <div className="status-line error-line">
        <span>{error}</span>
        <button type="button" onClick={() => onRetry()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <p className="status-line">
      Showing <strong>{resultCount}</strong> of <strong>{totalCount}</strong> countries.
    </p>
  );
}
