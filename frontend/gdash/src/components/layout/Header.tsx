import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useInsights } from "../../hooks/useInsights";
import { InsightsModal } from "../InsightsModal";
import { Brain, ChevronDown, User, Settings, LogOut, Loader2 } from "lucide-react";

type HeaderProps = {
  title?: string;
};

export default function Header({ title = "Dashboard" }: HeaderProps) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isInsightsModalOpen, setInsightsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  
  // Desestruturando todas as propriedades do hook
  const { 
    insights, 
    loading, 
    error, 
    fetched,  // ← Agora esta propriedade existe
    fetchInsights, 
    refreshInsights 
  } = useInsights();
  
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      logout();
    }
  };

  const handleProfile = () => {
    navigate("/profile");
    setProfileOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setProfileOpen(false);
  };

  const handleInsightsClick = async () => {
    if (!isInsightsModalOpen) {
      // Se ainda não foi buscado OU tem erro, busca os insights
      if (!fetched || error) {
        await fetchInsights();
      }
    }
    setInsightsModalOpen(!isInsightsModalOpen);
  };

  const handleRefreshInsights = async () => {
    await refreshInsights();
  };

  return (
    <>
      <header className="h-16 border-b border-[hsl(var(--border))] flex items-center justify-between px-6 bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">
        <h1 className="font-semibold text-lg">{title}</h1>

        <div className="flex items-center gap-4">
          {/* Botão de Insights */}
          <button
            onClick={handleInsightsClick}
            disabled={loading}
            className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 ${
              loading ? "opacity-70 cursor-wait" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden md:inline text-sm font-semibold">
                  Analisando...
                </span>
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-sm font-semibold">
                  Análises IA
                </span>
                {insights.length > 0 && !loading && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 text-xs rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-sm">
                    {insights.length}
                  </span>
                )}
              </>
            )}
          </button>

          {/* Botão do Perfil */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden md:inline font-medium">
                {user?.name || "Usuário"}
              </span>
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] shadow-xl z-10 overflow-hidden">
                {/* Informações do usuário */}
                <div className="p-4 border-b border-[hsl(var(--border))]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(var(--foreground))]">
                        {user?.name || "Usuário"}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        @{user?.userName || "usuario"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu de opções */}
                <div className="p-2">
                  <button
                    onClick={handleProfile}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius)] hover:bg-[hsl(var(--secondary))] transition-colors text-[hsl(var(--foreground))]"
                  >
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </button>

                  <button
                    onClick={handleSettings}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius)] hover:bg-[hsl(var(--secondary))] transition-colors text-[hsl(var(--foreground))]"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </button>

                  <div className="my-2 border-t border-[hsl(var(--border))]"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius)] hover:bg-red-500/10 hover:text-red-600 transition-colors text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Insights */}
      <InsightsModal
        isOpen={isInsightsModalOpen}
        onClose={() => setInsightsModalOpen(false)}
        insights={insights}
        loading={loading}
        error={error}
        fetched={fetched} // ← Passando a propriedade fetched
        onRefresh={handleRefreshInsights}
      />
    </>
  );
}