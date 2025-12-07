import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Perfil" },
  ];

  return (
    <aside className="w-64 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] h-screen shadow-lg flex flex-col">
      <div className="p-6 font-bold text-[hsl(var(--primary-foreground))] text-lg border-b border-[hsl(var(--border))]">
        GDASH
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full text-left px-6 py-3 flex items-center gap-2 rounded-r-[var(--radius)] transition
              ${
                active === item.id
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  : "hover:bg-[hsl(var(--primary))]/20"
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]">
        Versão 1.0
      </div>
    </aside>
  );
}
