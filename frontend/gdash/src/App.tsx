import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Components
import AppLayout from "./components/layout/AppLayout";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AppLayout>
                {/* <Settings /> */}
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        {/* Rota não encontrada */}
        <Route
          path="*"
          element={
            <AppLayout>
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold text-[hsl(var(--destructive))]">404</h1>
                <p className="mt-4 text-[hsl(var(--muted-foreground))]">Página não encontrada</p>
              </div>
            </AppLayout>
          }
        />
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}