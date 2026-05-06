import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Header } from './Header';
import { Compass, List, TrendingUp, BarChart2 } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/app/explorar', icon: <Compass size={24} />, label: 'Explorar' },
    { to: '/app/rutinas', icon: <List size={24} />, label: 'Rutinas' },
    { to: '/app/progreso', icon: <TrendingUp size={24} />, label: 'Progreso' },
    { to: '/app/stats', icon: <BarChart2 size={24} />, label: 'Stats' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop Sidebar / Mobile Bottom Nav */}
        <nav style={{
          display: 'flex',
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderRight: 'none',
        }} className="app-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                flex: 1,
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 400
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <main style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '80px' }} className="app-main">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .app-nav {
            flex-direction: column !important;
            border-right: 1px solid var(--border) !important;
            border-top: none !important;
            width: 80px;
          }
          .app-nav a {
            flex: none !important;
            padding: 1.5rem 0 !important;
          }
          .app-main {
            padding-bottom: 1rem !important;
          }
        }
        @media (max-width: 767px) {
          .app-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 50;
          }
        }
      `}</style>
    </div>
  );
};
