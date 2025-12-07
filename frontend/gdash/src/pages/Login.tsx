
export default function Login() {
  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md p-8 bg-[hsl(var(--card))] rounded-[var(--radius)] shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-[hsl(var(--primary-foreground))]">
            Bem-vindo
          </h1>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-sm font-medium">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                placeholder="Digite seu usuário"
                className="px-4 py-2 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium">
                Senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                className="px-4 py-2 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full py-2 rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:bg-[hsl(var(--primary))]/90 transition"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-sm text-[hsl(var(--muted-foreground))] text-center">
            Não tem conta?{" "}
            <a href="#" className="text-[hsl(var(--accent))] hover:underline">
              Registre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
