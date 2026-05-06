import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sileo';
import { useAuth } from './hooks/useAuth';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Explorar } from './pages/app/Explorar';
import { Rutinas } from './pages/app/Rutinas';
import { Progreso } from './pages/app/Progreso';
import { Stats } from './pages/app/Stats';

function App() {
  useAuth(); // Initialize auth listener

  return (
    <>
      <Toaster theme="dark" position="bottom-right" />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/explorar" replace />} />
          <Route path="explorar" element={<Explorar />} />
          <Route path="rutinas" element={<Rutinas />} />
          <Route path="progreso" element={<Progreso />} />
          <Route path="stats" element={<Stats />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
