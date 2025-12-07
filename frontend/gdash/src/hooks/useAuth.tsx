import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthState, User, LoginCredentials } from '../types/auth';

const API_URL = 'http://localhost:8001';

const cookie = {
  get: (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  },

  set: (name: string, value: string, days = 7): void => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  },

  remove: (name: string): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

export const useAuth = () => {
  const navigate = useNavigate();
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuthOnMount = async () => {
      const token = cookie.get('token');
      
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          cookie.remove('token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuthOnMount();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Status da resposta:', response.status);
      
      const data = await response.json();
      console.log('Resposta completa:', data);

      const token = data.accessToken || data.token;
      
      if (response.ok && token) {
        cookie.set('token', token);

        const userData = data.user || data;
        const normalizedUser: User = {
          id: userData.id,
          userName: userData.userName,
          name: userData.name || userData.userName,
        };

        console.log('Usuário normalizado:', normalizedUser);
        
        setAuthState({
          user: normalizedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast.success('Login realizado com sucesso!');
        return true;
      } else {
        const errorMsg = data.message || data.error || 'Erro ao fazer login';
        toast.error(errorMsg);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error('Erro de conexão com o servidor');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    const token = cookie.get('token');
    
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        cookie.remove('token');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (authState.user) {
      setAuthState(prev => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));
    }
  };

  const logout = (): void => {
    cookie.remove('token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.info('Você saiu da sua conta');
    navigate('/');
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
    checkAuth,
  };
};