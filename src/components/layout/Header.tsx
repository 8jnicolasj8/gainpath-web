import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Dumbbell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sileo } from 'sileo';

export const Header: React.FC = () => {
  const { user } = useAuthStore();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      sileo.success({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente.',
      });
    } catch (error: any) {
      sileo.error({
        title: 'Error',
        description: error.message,
      });
    }
  };

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.75rem 2rem', 
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to={user ? '/app/explorar' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
        <Dumbbell size={24} />
        GAINPATH
      </Link>
      
      <div>
        {user ? (
          <button 
            onClick={handleSignOut}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={18} />
            Salir
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--text-secondary)', padding: '0.5rem 1rem', fontWeight: 500 }}>Ingresar</Link>
            <Link to="/register" style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}>
              Empezar gratis
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
