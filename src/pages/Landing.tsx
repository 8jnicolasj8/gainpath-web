import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuthStore } from '../store/useAuthStore';
import { useRealtimeUsers } from '../hooks/useRealtime';
import { Dumbbell, List, TrendingUp, BarChart2 } from 'lucide-react';

export const Landing: React.FC = () => {
  const { user, isLoading } = useAuthStore();
  const userCount = useRealtimeUsers();

  if (isLoading) {
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }} />;
  }

  if (user) {
    return <Navigate to="/app/explorar" replace />;
  }

  const features = [
    { title: 'Explorar', desc: 'Encuentra cientos de ejercicios de gym y calistenia.', icon: <Dumbbell size={32} color="var(--primary)" /> },
    { title: 'Rutinas', desc: 'Crea, edita y comparte tus rutinas personalizadas.', icon: <List size={32} color="var(--primary)" /> },
    { title: 'Progreso', desc: 'Sube fotos y registra tus medidas corporales.', icon: <TrendingUp size={32} color="var(--secondary)" /> },
    { title: 'Estadísticas', desc: 'Mantén tu racha y analiza tu volumen de entrenamiento.', icon: <BarChart2 size={32} color="var(--secondary)" /> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Tu camino hacia la <span style={{ color: 'var(--primary)' }}>mejor versión</span> de ti mismo.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            La plataforma definitiva para planificar, ejecutar y registrar tus entrenamientos. 
            Gym, calistenia y progreso real.
          </p>
          <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'inline-block' }}>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
              <span style={{ color: 'var(--secondary)' }}>{userCount}</span> personas ya están entrenando con GAINPATH
            </span>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/register" style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--background)', 
              padding: '1rem 2rem', 
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1.1rem',
              display: 'inline-block'
            }}>
              Empezar ahora
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--surface)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Todo lo que necesitas para crecer</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem' 
            }}>
              {features.map((f, i) => (
                <div key={i} style={{ 
                  backgroundColor: 'var(--background)', 
                  padding: '2rem', 
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {f.icon}
                  <h3 style={{ fontSize: '1.25rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-secondary)' }}>
        <p>&copy; {new Date().getFullYear()} GAINPATH. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
