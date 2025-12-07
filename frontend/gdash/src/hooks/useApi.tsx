import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8001';

export const useApi = () => {
  const navigate = useNavigate();

  const getToken = useCallback((): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }, []);

  const request = useCallback(async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = getToken();
    
    // Cria headers de forma segura
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Adiciona token se existir
    if (token) {
      baseHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Combina headers
    const headers = {
      ...baseHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        toast.error('Sessão expirada. Faça login novamente.');
        
        navigate('/');
        throw new Error('Sessão expirada');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro de conexão';
      toast.error(message);
      throw error;
    }
  }, [getToken, navigate]);

  const get = useCallback(<T = any>(endpoint: string) => 
    request<T>(endpoint, { method: 'GET' }), [request]);

  const post = useCallback(<T = any>(endpoint: string, data?: any) => 
    request<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }), [request]);

  const put = useCallback(<T = any>(endpoint: string, data?: any) => 
    request<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }), [request]);

  const del = useCallback(<T = any>(endpoint: string) => 
    request<T>(endpoint, { method: 'DELETE' }), [request]);

  return {
    request,
    get,
    post,
    put,
    delete: del,
    getToken,
  };
};

export default useApi;