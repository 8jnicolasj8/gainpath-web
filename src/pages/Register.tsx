import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sileo } from 'sileo';
import { Dumbbell, Mail, Lock, User } from 'lucide-react';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      if (error) throw error;
      
      // Attempt to create profile if not handled by Supabase Trigger
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, username }] as any);
        
        if (profileError && profileError.code !== '23505') {
          // ignore unique violation if trigger already created it
          console.error(profileError);
        }
      }

      sileo.success({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada.',
      });
      
      navigate('/app/explorar');
    } catch (error: any) {
      sileo.error({
        title: 'Error de registro',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (error: any) {
      sileo.error({
        title: 'Error OAuth',
        description: error.message,
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'var(--surface)', 
        padding: '2.5rem', 
        borderRadius: '16px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <Dumbbell size={32} />
            GAINPATH
          </Link>
          <h2 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>Crea tu cuenta</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Únete y empieza a entrenar en serio</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Nombre de usuario" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', 
                backgroundColor: 'var(--background)', border: '1px solid var(--border)', 
                color: 'var(--text-primary)', borderRadius: '8px', outline: 'none' 
              }}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', 
                backgroundColor: 'var(--background)', border: '1px solid var(--border)', 
                color: 'var(--text-primary)', borderRadius: '8px', outline: 'none' 
              }}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', 
                backgroundColor: 'var(--background)', border: '1px solid var(--border)', 
                color: 'var(--text-primary)', borderRadius: '8px', outline: 'none' 
              }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: 'var(--primary)', color: 'var(--background)', 
              padding: '0.875rem', borderRadius: '8px', fontWeight: 600,
              marginTop: '0.5rem', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flex: 1 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>O</span>
          <div style={{ height: '1px', backgroundColor: 'var(--border)', flex: 1 }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', padding: '0.875rem', borderRadius: '8px', 
            backgroundColor: 'var(--background)', border: '1px solid var(--border)', 
            color: 'var(--text-primary)', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Registrarse con Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Ingresa</Link>
        </p>
      </div>
    </div>
  );
};
