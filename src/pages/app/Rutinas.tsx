import React, { useEffect, useState, useMemo } from 'react';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useExerciseStore } from '../../store/useExerciseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { sileo } from 'sileo';
import {
  Search, Plus, Trash2, X, Share2, Copy,
  ChevronRight, Clock, Dumbbell, Download
} from 'lucide-react';
import type { Database } from '../../lib/database.types';

type RoutineInsert = Database['public']['Tables']['routines']['Insert'];

/* ── styles helper ─────────────────────────────────────── */
const card: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  padding: '1.25rem',
  borderRadius: '16px',
  border: '1px solid var(--border)',
  cursor: 'pointer',
  transition: 'transform .15s',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'var(--background)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '8px',
  outline: 'none',
};
const btnPrimary: React.CSSProperties = {
  backgroundColor: 'var(--primary)',
  color: 'var(--background)',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};
const btnGhost: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

/* ── Component ─────────────────────────────────────────── */
export const Rutinas: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const {
    filteredRoutines, isLoading, fetchRoutines,
    createRoutine, deleteRoutine,
    fetchRoutineExercises, currentRoutineExercises,
    addExerciseToRoutine, removeExerciseFromRoutine, updateRoutineExercise,
    generateShareCode,
    setSearchQuery, setTypeFilter, typeFilter,
    setDifficultyFilter, difficultyFilter,
  } = useRoutineStore();
  const { exercises, fetchExercises } = useExerciseStore();

  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showShare, setShowShare] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState('');

  // Create form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Gym');
  const [newDiff, setNewDiff] = useState('Intermedio');
  const [newDuration, setNewDuration] = useState(60);

  useEffect(() => {
    if (user) {
      fetchRoutines(user.id);
      fetchExercises();
    }
  }, [user, fetchRoutines, fetchExercises]);

  /* ── Create routine ──────────────────────────────────── */
  const handleCreate = async () => {
    if (!user || !newName.trim()) return;
    const routine: RoutineInsert = {
      user_id: user.id,
      name: newName,
      type: newType,
      difficulty: newDiff,
      estimated_duration: newDuration,
    };
    const created = await createRoutine(routine);
    if (created) {
      sileo.success({ title: 'Rutina creada', description: newName });
      setShowCreate(false);
      setNewName('');
    }
  };

  /* ── Open detail ─────────────────────────────────────── */
  const openDetail = (id: string) => {
    setShowDetail(id);
    fetchRoutineExercises(id);
  };

  /* ── Share code ──────────────────────────────────────── */
  const shareCode = useMemo(() => (showShare ? generateShareCode(showShare) : ''), [showShare, generateShareCode]);

  const copyCode = () => {
    navigator.clipboard.writeText(shareCode);
    sileo.success({ title: 'Código copiado', description: shareCode });
  };

  /* ── Add exercise helper ─────────────────────────────── */
  const handleAddExercise = async (exerciseId: string) => {
    if (!showDetail) return;
    await addExerciseToRoutine({
      routine_id: showDetail,
      exercise_id: exerciseId,
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      position: currentRoutineExercises.length + 1,
    });
    setShowAddExercise(false);
  };

  /* ── Import ──────────────────────────────────────────── */
  const handleImport = () => {
    sileo.info({ title: 'Importar', description: 'Funcionalidad disponible próximamente.' });
    setShowImport(false);
  };

  const types = ['Todos', 'Gym', 'Calistenia', 'Mixta'];
  const difficulties = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  const detailRoutine = filteredRoutines.find((r) => r.id === showDetail);

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Rutinas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Organiza tu entrenamiento como un profesional</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={btnGhost} onClick={() => setShowImport(true)}>
            <Download size={18} /> Importar
          </button>
          <button style={btnPrimary} onClick={() => setShowCreate(true)}>
            <Plus size={18} /> Nueva Rutina
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Buscar rutinas..."
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '3rem', borderRadius: '12px' }}
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...inputStyle, width: 'auto', borderRadius: '12px' }}>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} style={{ ...inputStyle, width: 'auto', borderRadius: '12px' }}>
          {difficulties.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Routine List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Cargando rutinas...</div>
      ) : filteredRoutines.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredRoutines.map((routine) => (
            <div
              key={routine.id}
              style={card}
              onClick={() => openDetail(routine.id)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{routine.name}</h3>
                <ChevronRight size={20} color="var(--text-secondary)" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {routine.type && (
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(255,87,34,.12)', color: 'var(--primary)' }}>{routine.type}</span>
                )}
                {routine.difficulty && (
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--background)', color: 'var(--text-secondary)' }}>{routine.difficulty}</span>
                )}
                {routine.estimated_duration && (
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--background)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {routine.estimated_duration} min
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <Dumbbell size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>No tienes rutinas aún. ¡Crea tu primera!</p>
        </div>
      )}

      {/* ─── CREATE MODAL ──────────────────────────────── */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Nueva Rutina">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input style={inputStyle} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Mi rutina..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Tipo</label>
                <select style={inputStyle} value={newType} onChange={(e) => setNewType(e.target.value)}>
                  <option>Gym</option><option>Calistenia</option><option>Mixta</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Dificultad</label>
                <select style={inputStyle} value={newDiff} onChange={(e) => setNewDiff(e.target.value)}>
                  <option>Principiante</option><option>Intermedio</option><option>Avanzado</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Duración estimada (min)</label>
              <input type="number" style={inputStyle} value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))} />
            </div>
            <button style={{ ...btnPrimary, justifyContent: 'center', width: '100%', marginTop: '0.5rem' }} onClick={handleCreate}>
              Crear Rutina
            </button>
          </div>
        </Modal>
      )}

      {/* ─── DETAIL MODAL ──────────────────────────────── */}
      {showDetail && detailRoutine && (
        <Modal onClose={() => { setShowDetail(null); }} title={detailRoutine.name} wide>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {detailRoutine.type && <Tag>{detailRoutine.type}</Tag>}
            {detailRoutine.difficulty && <Tag>{detailRoutine.difficulty}</Tag>}
            {detailRoutine.estimated_duration && <Tag><Clock size={12} /> {detailRoutine.estimated_duration} min</Tag>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Ejercicios ({currentRoutineExercises.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={btnGhost} onClick={() => setShowShare(showDetail)}>
                <Share2 size={16} /> Compartir
              </button>
              <button style={btnPrimary} onClick={() => setShowAddExercise(true)}>
                <Plus size={16} /> Agregar
              </button>
            </div>
          </div>

          {currentRoutineExercises.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentRoutineExercises.map((re, idx) => (
                <div key={re.id} style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.875rem', width: '24px' }}>{idx + 1}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600 }}>{(re as any).exercise?.name || 'Ejercicio'}</p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <MiniInput label="Series" value={re.sets} onChange={(v) => updateRoutineExercise(re.id, { sets: v })} />
                        <MiniInput label="Reps" value={re.reps} onChange={(v) => updateRoutineExercise(re.id, { reps: v })} />
                        <MiniInput label="Peso (kg)" value={re.weight ?? 0} onChange={(v) => updateRoutineExercise(re.id, { weight: v })} />
                        <MiniInput label="Descanso (s)" value={re.rest_seconds ?? 60} onChange={(v) => updateRoutineExercise(re.id, { rest_seconds: v })} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeExerciseFromRoutine(re.id)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0.5rem' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              Sin ejercicios todavía. Agregá ejercicios a esta rutina.
            </p>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={async () => {
                await deleteRoutine(detailRoutine.id);
                setShowDetail(null);
                sileo.success({ title: 'Rutina eliminada' });
              }}
              style={{ ...btnGhost, color: '#ef4444', borderColor: '#ef4444' }}
            >
              <Trash2 size={16} /> Eliminar Rutina
            </button>
          </div>
        </Modal>
      )}

      {/* ─── ADD EXERCISE PICKER ───────────────────────── */}
      {showAddExercise && (
        <Modal onClose={() => setShowAddExercise(false)} title="Agregar Ejercicio">
          <div style={{ maxHeight: '50vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {exercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => handleAddExercise(ex.id)}
                style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div>
                  <p style={{ fontWeight: 600 }}>{ex.name}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ex.muscle_group} · {ex.difficulty}</span>
                </div>
                <Plus size={20} color="var(--primary)" />
              </div>
            ))}
            {exercises.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                No hay ejercicios disponibles. Cargá ejercicios primero.
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* ─── SHARE MODAL ───────────────────────────────── */}
      {showShare && (
        <Modal onClose={() => setShowShare(null)} title="Compartir Rutina">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Compartí este código alfanumérico para que otro usuario pueda importar tu rutina.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--background)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '0.15em', textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
              {shareCode}
            </div>
            <button style={btnPrimary} onClick={copyCode}>
              <Copy size={18} /> Copiar
            </button>
          </div>
        </Modal>
      )}

      {/* ─── IMPORT MODAL ──────────────────────────────── */}
      {showImport && (
        <Modal onClose={() => setShowImport(false)} title="Importar Rutina">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Ingresá el código alfanumérico que recibiste para importar una rutina.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: '1.125rem', textAlign: 'center', letterSpacing: '0.15em' }}
              placeholder="ABCD1234"
              value={importCode}
              onChange={(e) => setImportCode(e.target.value.toUpperCase())}
              maxLength={8}
            />
            <button style={btnPrimary} onClick={handleImport}>
              <Download size={18} /> Importar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ── Reusable sub-components ───────────────────────────── */
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' };

const Modal: React.FC<{ onClose: () => void; title: string; wide?: boolean; children: React.ReactNode }> = ({ onClose, title, wide, children }) => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
    <div style={{ backgroundColor: 'var(--background)', width: '100%', maxWidth: wide ? '700px' : '480px', maxHeight: '90vh', borderRadius: '24px', overflowY: 'auto', border: '1px solid var(--border)', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, backgroundColor: 'var(--background)', zIndex: 10 }}>
        <h2 style={{ fontSize: '1.25rem' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'var(--surface)', border: 'none', color: 'var(--text-primary)', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} />
        </button>
      </div>
      <div style={{ padding: '2rem' }}>{children}</div>
    </div>
  </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
    {children}
  </span>
);

const MiniInput: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</span>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '64px', padding: '0.375rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', textAlign: 'center', fontSize: '0.875rem' }}
    />
  </div>
);
