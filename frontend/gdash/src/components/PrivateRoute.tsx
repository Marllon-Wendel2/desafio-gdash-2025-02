import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Não faz nada aqui - o loading é tratado no AppLayout
  if (isLoading) {
    return null;
  }

  // Redireciona para login se não autenticado
  if (!isAuthenticated) {
    const returnUrl = location.pathname !== '/' ? location.pathname : '/dashboard';
    return <Navigate to={`/?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  return <>{children}</>;
}