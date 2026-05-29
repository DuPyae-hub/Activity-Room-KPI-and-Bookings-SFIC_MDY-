export function PageLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-border-strong border-t-brand-red"
        aria-hidden
      />
      <p className="text-sm text-foreground-muted">{label}</p>
    </div>
  );
}
