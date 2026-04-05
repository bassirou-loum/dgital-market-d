export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {children}
    </div>
  );
}
