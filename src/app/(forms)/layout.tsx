export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] px-5 py-10 sm:py-16 fx-grid-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-16 w-72 h-72 rounded-full bg-brand-200 opacity-25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-sun-400 opacity-20 blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl space-y-5 animate-[var(--animate-fade-up)]">
        {children}
      </div>
    </main>
  );
}
