import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  LayoutDashboard, 
  User, 
  Settings,
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      path: "/dashboard",
      icon: LayoutDashboard,
      protected: true
    },
    { 
      id: "profile", 
      label: "Perfil", 
      path: "/profile",
      icon: User,
      protected: true
    },
    { 
      id: "Insight com IA", 
      label: "Configurações", 
      path: "/settings",
      icon: Settings,
      protected: true
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      logout();
    }
  };

  return (
    <aside className="w-64 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] h-screen shadow-lg flex flex-col">
      <div className="p-6 font-bold text-[hsl(var(--primary-foreground))] text-lg border-b border-[hsl(var(--border))] flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        GDASH
      </div>

      <nav className="flex-1 mt-4 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 mb-1 rounded-[var(--radius)] transition
              ${
                isActive
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  : "hover:bg-[hsl(var(--primary))]/20"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-[var(--radius)] bg-[hsl(var(--secondary))]">
          <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name || "Usuário"}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
              {user?.name}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>

        <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] text-center text-sm text-[hsl(var(--muted-foreground))]">
          Versão 1.0
        </div>
      </div>
    </aside>
  );
}