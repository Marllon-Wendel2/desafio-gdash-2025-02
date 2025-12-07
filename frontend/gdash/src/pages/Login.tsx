import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl);
    }
  }, [isAuthenticated, navigate, returnUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.userName || !credentials.password) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(credentials);
      
      if (success) {
        navigate(returnUrl);
      }
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setCredentials({
      userName: "admin",
      password: "123456"
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md p-8 bg-[hsl(var(--card))] rounded-[var(--radius)] shadow-lg border border-[hsl(var(--border))]">
          <h1 className="text-2xl font-bold mb-2 text-center text-[hsl(var(--foreground))]">
            Bem-vindo ao GDash
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-6">
            Faça login para continuar
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="userName" className="mb-1 text-sm font-medium">
                Usuário
              </label>
              <input
                type="text"
                id="userName"
                value={credentials.userName}
                onChange={handleChange}
                placeholder="Digite seu usuário"
                className="px-4 py-2 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] disabled:opacity-50"
                disabled={isLoading}
                required
                autoComplete="username"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className="px-4 py-2 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] disabled:opacity-50"
                disabled={isLoading}
                required
                autoComplete="current-password"
              />
            </div>

            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={fillTestCredentials}
                className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-center"
              >
                Usar credenciais de teste (admin/123456)
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full py-2 rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:bg-[hsl(var(--primary))]/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}