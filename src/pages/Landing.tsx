import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuthStore } from '../store/useAuthStore';
import { useRealtimeUsers } from '../hooks/useRealtime';
import { Dumbbell, List, TrendingUp, BarChart2, Smartphone, Globe, Download, ArrowRight } from 'lucide-react';

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
    { 
      title: 'Explorar', 
      desc: 'Cientos de ejercicios con videos, guías y tips técnicos para gym y calistenia.', 
      icon: <Dumbbell size={28} color="var(--primary)" />,
      glow: 'var(--primary-glow)'
    },
    { 
      title: 'Rutinas Inteligentes', 
      desc: 'Crea planes dinámicos o usa nuestras plantillas de expertos.', 
      icon: <List size={28} color="var(--primary)" />,
      glow: 'var(--primary-glow)'
    },
    { 
      title: 'Evolución Visual', 
      desc: 'Registra tus medidas y compara fotos de progreso con IA.', 
      icon: <TrendingUp size={28} color="var(--secondary)" />,
      glow: 'var(--secondary-glow)'
    },
    { 
      title: 'Métricas Avanzadas', 
      desc: 'Volumen de carga, racha de días y análisis de rendimiento.', 
      icon: <BarChart2 size={28} color="var(--secondary)" />,
      glow: 'var(--secondary-glow)'
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'radial-gradient(circle at 50% -20%, #2A1005 0%, #050505 50%)',
      position: 'relative'
    }}>
      <Header />
      
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ 
          padding: '8rem 2rem 4rem', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }} className="animate-fade-in">
          
          <div style={{ 
            padding: '0.5rem 1rem', 
            background: 'rgba(255, 87, 34, 0.1)', 
            borderRadius: '100px', 
            border: '1px solid rgba(255, 87, 34, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {userCount} usuarios activos hoy
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: 900, 
            lineHeight: 1, 
            letterSpacing: '-0.04em',
            margin: '1rem 0'
          }}>
            Entrena sin <span style={{ 
              background: 'linear-gradient(90deg, var(--primary), #FFB347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>gravedad.</span>
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', 
            color: 'var(--text-secondary)', 
            maxWidth: '700px',
            lineHeight: 1.5
          }}>
            La plataforma definitiva para dominar el gimnasio y la calistenia. 
            Registra tus marcas, diseña rutinas y visualiza tu progreso como nunca antes.
          </p>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1.5rem', 
            marginTop: '2rem',
            justifyContent: 'center'
          }}>
            <Link to="/register" style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '1.2rem 2.5rem', 
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              boxShadow: '0 10px 30px var(--primary-glow)'
            }} className="hover-lift">
              Comenzar Gratis <ArrowRight size={20} />
            </Link>

            <a href="https://www.mediafire.com/file/eka2vy9wncp0ep4/application-39edd90d-2b95-4471-a111-1ae8012c6190.apk/file" target="_blank" rel="noopener noreferrer" style={{ 
              backgroundColor: 'var(--surface)', 
              color: 'white', 
              padding: '1.2rem 2.5rem', 
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              border: '1px solid var(--border-bright)'
            }} className="hover-lift">
              <Download size={20} /> Descargar APK
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '2.5rem' 
            }}>
              {features.map((f, i) => (
                <div key={i} style={{ 
                  padding: '2.5rem', 
                  gap: '1.5rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }} className="glass-card hover-lift">
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    marginBottom: '1rem'
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Device Preview Section */}
        <section style={{ padding: '4rem 2rem', overflow: 'hidden' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '4rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Sincronización Total</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Entrena en el celular, analiza en la web. Todo conectado en tiempo real.</p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '3rem', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* Mobile Mockup */}
              <div style={{ 
                width: '280px', 
                height: '560px', 
                borderRadius: '40px', 
                border: '8px solid #222',
                background: '#000',
                position: 'relative',
                boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px'
              }}>
                <Smartphone size={40} color="var(--primary)" />
                <p style={{ marginTop: '1rem', fontWeight: 700 }}>Mobile App</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>iOS & Android</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}></div>
                <div style={{ padding: '0.8rem', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                   <Globe size={24} color="white" />
                </div>
                <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, var(--secondary), var(--primary))' }}></div>
              </div>

              {/* Web App Mockup */}
              <div style={{ 
                width: '500px', 
                height: '320px', 
                borderRadius: '20px', 
                border: '8px solid #222',
                background: '#000',
                position: 'relative',
                boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px'
              }}>
                <Globe size={40} color="var(--secondary)" />
                <p style={{ marginTop: '1rem', fontWeight: 700 }}>Web PWA</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>Cualquier navegador</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border)', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        color: 'var(--text-secondary)' 
      }}>
        <div style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>GAINPATH</div>
        <p>&copy; {new Date().getFullYear()} GAINPATH Team. Entrena con propósito.</p>
      </footer>
    </div>
  );
};

