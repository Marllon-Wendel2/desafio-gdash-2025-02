import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { toast } from "react-toastify";
import { 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { post } = useApi();
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setPasswordErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validatePassword = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Senha atual é obrigatória";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Nova senha é obrigatória";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "A senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Confirme a nova senha";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = "A nova senha deve ser diferente da atual";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      await post("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success("Senha alterada com sucesso!");
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setIsChangingPassword(false);
      
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao alterar senha";
      
      if (errorMessage.includes("senha atual incorreta")) {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: "Senha atual incorreta"
        }));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Meu Perfil</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-2">
          Gerencie suas informações de acesso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-[hsl(var(--primary))]/10">
              <User className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Informações da Conta
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center text-white text-xl font-bold">
                  {user?.userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-[hsl(var(--card))]"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  {user?.userName}
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">
                  Usuário ativo
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[hsl(var(--secondary))]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Nome de usuário
                    </p>
                    <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                      @{user?.userName}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))]" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[hsl(var(--border))]">
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                  ID da Conta
                </p>
                <code className="text-xs bg-[hsl(var(--secondary))] px-2 py-1 rounded">
                  {user?.id || "ID não disponível"}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-[hsl(var(--primary))]/10">
              <Key className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Segurança
            </h2>
          </div>

          {!isChangingPassword ? (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
                      Recomendamos alterar sua senha periodicamente
                    </p>
                    <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                      Use uma senha forte com pelo menos 6 caracteres
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Key className="h-4 w-4" />
                Alterar Senha
              </button>

              <div className="text-xs text-[hsl(var(--muted-foreground))] space-y-2">
                <p className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Conta verificada</span>
                </p>
                <p className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Acesso seguro via HTTPS</span>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      passwordErrors.currentPassword 
                        ? "border-red-500" 
                        : "border-[hsl(var(--border))]"
                    } bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] pr-12`}
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      passwordErrors.newPassword 
                        ? "border-red-500" 
                        : "border-[hsl(var(--border))]"
                    } bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] pr-12`}
                    placeholder="Digite a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      passwordErrors.confirmPassword 
                        ? "border-red-500" 
                        : "border-[hsl(var(--border))]"
                    } bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] pr-12`}
                    placeholder="Confirme a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                  Requisitos da senha:
                </p>
                <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                  <li className={`flex items-center gap-2 ${
                    passwordData.newPassword.length >= 6 ? 'text-green-500' : ''
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      passwordData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span>Pelo menos 6 caracteres</span>
                  </li>
                  <li className={`flex items-center gap-2 ${
                    passwordData.newPassword !== passwordData.currentPassword && 
                    passwordData.newPassword.length > 0 ? 'text-green-500' : ''
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      passwordData.newPassword !== passwordData.currentPassword && 
                      passwordData.newPassword.length > 0 ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span>Diferente da senha atual</span>
                  </li>
                  <li className={`flex items-center gap-2 ${
                    passwordData.newPassword === passwordData.confirmPassword && 
                    passwordData.confirmPassword.length > 0 ? 'text-green-500' : ''
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      passwordData.newPassword === passwordData.confirmPassword && 
                      passwordData.confirmPassword.length > 0 ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span>As senhas coincidem</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-medium rounded-lg hover:bg-[hsl(var(--secondary))]/80 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Alterando...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      <span>Alterar Senha</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6">
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
          Dicas de Segurança
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[hsl(var(--secondary))]">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-3">
              <Key className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <h4 className="font-medium text-[hsl(var(--foreground))] mb-2">
              Senha Forte
            </h4>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Use combinações de letras, números e caracteres especiais
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[hsl(var(--secondary))]">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-3">
              <User className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <h4 className="font-medium text-[hsl(var(--foreground))] mb-2">
              Privacidade
            </h4>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Nunca compartilhe suas credenciais com outras pessoas
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[hsl(var(--secondary))]">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-3">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <h4 className="font-medium text-[hsl(var(--foreground))] mb-2">
              Atualizações
            </h4>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Altere sua senha periodicamente para maior segurança
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}