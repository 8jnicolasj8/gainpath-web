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
      padding: '1rem 2rem', 
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--surface)',
      position: 'sticky',
      top: 0,
      zIndex: 10
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
            <Link to="/login" style={{ color: 'var(--text-primary)', padding: '0.5rem 1rem' }}>Ingresar</Link>
            <Link to="/register" style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--background)', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              fontWeight: 600
            }}>
              Empezar gratis
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
