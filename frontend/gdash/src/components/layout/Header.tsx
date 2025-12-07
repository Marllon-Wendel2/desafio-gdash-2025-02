import { useState } from "react";

type HeaderProps = {
  title?: string;
  userName?: string;
};

export default function Header({ title = "Dashboard", userName = "Usuário" }: HeaderProps) {
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-[hsl(var(--border))] flex items-center justify-between px-6 bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">
      <h1 className="font-semibold text-lg">{title}</h1>

      <div className="relative">
        <button
          onClick={() => setProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 px-3 py-1 rounded-[var(--radius)] hover:bg-[hsl(var(--primary))]/20 transition"
        >
          <span>{userName}</span>
          <span className="text-[hsl(var(--muted-foreground))]">▾</span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] shadow-lg z-10">
            <button className="w-full text-left px-4 py-2 hover:bg-[hsl(var(--primary))]/20 transition">
              Perfil
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-[hsl(var(--primary))]/20 transition">
              Configurações
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] transition">
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
