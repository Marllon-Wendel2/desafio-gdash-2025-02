import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto"></div>
          <p className="mt-4 text-[hsl(var(--muted-foreground))]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="p-6 flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-[hsl(var(--border))] flex items-center justify-between px-6 bg-[hsl(var(--card))]">
          <div className="font-bold text-[hsl(var(--primary))] text-lg">GDASH</div>
          <div className="text-sm text-[hsl(var(--muted-foreground))]">Sistema de Dashboard</div>
        </div>
        
        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
          {children}
        </div>
      </main>
    </div>
  );
}