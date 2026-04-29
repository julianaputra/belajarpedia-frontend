export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-5 py-10 sm:py-16 fx-grid-paper overflow-hidden">
      {/* Decorative blobs — clipped by parent's overflow-hidden so the
          negative offsets don't cause horizontal scroll. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-16 w-72 h-72 rounded-full bg-brand-200 opacity-30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-sun-400 opacity-25 blur-3xl"
      />

      <div className="relative w-full max-w-md space-y-5 animate-[var(--animate-fade-up)]">
        {children}
      </div>
    </main>
  );
}
