export function LoadingView() {
  return (
    <div className="state">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}

export function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="state error">
      <p>⚠️ {message}</p>
      <button className="btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function EmptyView({
  message,
  onAction,
  actionLabel,
}: {
  message: string;
  onAction: () => void;
  actionLabel: string;
}) {
  return (
    <div className="state">
      <p>{message}</p>
      <button className="btn" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
}