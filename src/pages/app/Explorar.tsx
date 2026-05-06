import React, { useEffect, useState } from 'react';
import { useExerciseStore } from '../../store/useExerciseStore';
import { Search, Filter, ChevronRight, X, Play, Dumbbell } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Exercise = Database['public']['Tables']['exercises']['Row'];

export const Explorar: React.FC = () => {
  const { 
    filteredExercises, 
    isLoading, 
    fetchExercises, 
    setSearchQuery, 
    setTypeFilter,
    typeFilter,
    setMuscleFilter,
    muscleFilter,
    setDifficultyFilter,
    difficultyFilter
  } = useExerciseStore();

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const muscles = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];
  const difficulties = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Explorar</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Encuentra el ejercicio perfecto para tu rutina</p>
      </div>

      {/* Search and Main Toggle */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar ejercicios..." 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', 
              backgroundColor: 'var(--surface)', border: '1px solid var(--border)', 
              color: 'var(--text-primary)', borderRadius: '12px', outline: 'none' 
            }}
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0 1.5rem', backgroundColor: showFilters ? 'var(--primary)' : 'var(--surface)',
            color: showFilters ? 'var(--background)' : 'var(--text-primary)',
            border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 600
          }}
        >
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Type Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--surface)', padding: '0.25rem', borderRadius: '14px', width: 'fit-content' }}>
        <button 
          onClick={() => setTypeFilter('all')}
          style={{ 
            padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none',
            backgroundColor: typeFilter === 'all' ? 'var(--background)' : 'transparent',
            color: typeFilter === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600
          }}
        >
          Todos
        </button>
        <button 
          onClick={() => setTypeFilter('gym')}
          style={{ 
            padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none',
            backgroundColor: typeFilter === 'gym' ? 'var(--background)' : 'transparent',
            color: typeFilter === 'gym' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600
          }}
        >
          Gym
        </button>
        <button 
          onClick={() => setTypeFilter('calisthenics')}
          style={{ 
            padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none',
            backgroundColor: typeFilter === 'calisthenics' ? 'var(--background)' : 'transparent',
            color: typeFilter === 'calisthenics' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600
          }}
        >
          Calistenia
        </button>
      </div>

      {/* Detailed Filters Panel */}
      {showFilters && (
        <div style={{ 
          backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', 
          border: '1px solid var(--border)', marginBottom: '1.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Músculo</label>
            <select 
              value={muscleFilter}
              onChange={(e) => setMuscleFilter(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem', backgroundColor: 'var(--background)', 
                border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '8px'
              }}
            >
              {muscles.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dificultad</label>
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ 
                width: '100%', padding: '0.75rem', backgroundColor: 'var(--background)', 
                border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '8px'
              }}
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Exercise List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Cargando ejercicios...</div>
      ) : filteredExercises.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredExercises.map((exercise) => (
            <div 
              key={exercise.id} 
              onClick={() => setSelectedExercise(exercise)}
              style={{ 
                backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: '16px', 
                border: '1px solid var(--border)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--background)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{exercise.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--background)', padding: '2px 6px', borderRadius: '4px' }}>{exercise.muscle_group}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', backgroundColor: 'rgba(255, 87, 34, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{exercise.difficulty}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          No se encontraron ejercicios con esos filtros.
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', padding: '1rem' 
        }}>
          <div style={{ 
            backgroundColor: 'var(--background)', width: '100%', maxWidth: '600px', 
            maxHeight: '90vh', borderRadius: '24px', overflowY: 'auto',
            border: '1px solid var(--border)', position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedExercise(null)}
              style={{ 
                position: 'absolute', right: '1.5rem', top: '1.5rem', 
                background: 'var(--surface)', border: 'none', color: 'var(--text-primary)',
                width: '36px', height: '36px', borderRadius: '18px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--surface)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Dumbbell size={32} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem' }}>{selectedExercise.name}</h2>
                  <p style={{ color: 'var(--primary)' }}>{selectedExercise.type === 'gym' ? 'Gimnasio' : 'Calistenia'}</p>
                </div>
              </div>

              {selectedExercise.video_url && (
                <div style={{ 
                  width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--surface)', 
                  borderRadius: '16px', marginBottom: '1.5rem', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
                  flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)',
                  padding: '3rem 0'
                }}>
                  <Play size={48} />
                  <span>Ver Video Instructivo</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Músculo</p>
                  <p style={{ fontWeight: 600 }}>{selectedExercise.muscle_group}</p>
                </div>
                <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Dificultad</p>
                  <p style={{ fontWeight: 600 }}>{selectedExercise.difficulty}</p>
                </div>
                <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Equipo</p>
                  <p style={{ fontWeight: 600 }}>{selectedExercise.equipment || 'Ninguno'}</p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Descripción</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedExercise.description || 'No hay descripción disponible para este ejercicio.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
