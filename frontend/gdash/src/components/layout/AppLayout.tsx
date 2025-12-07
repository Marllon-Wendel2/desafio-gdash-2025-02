import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />
        <div className="p-4 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}

