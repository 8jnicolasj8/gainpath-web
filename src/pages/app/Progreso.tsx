import React, { useEffect, useState, useRef } from 'react';
import { useProgressStore } from '../../store/useProgressStore';
import { useAuthStore } from '../../store/useAuthStore';
import { sileo } from 'sileo';
import {
  Camera, Trash2, X, Plus, Ruler,
  TrendingUp, Image as ImageIcon
} from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 1rem',
  backgroundColor: 'var(--background)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', borderRadius: '8px', outline: 'none',
};
const btnPrimary: React.CSSProperties = {
  backgroundColor: 'var(--primary)', color: 'var(--background)',
  padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600,
  border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)',
};

export const Progreso: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const {
    photos, measurements, isLoading,
    fetchPhotos, uploadPhoto, deletePhoto,
    fetchMeasurements, addMeasurement, deleteMeasurement,
  } = useProgressStore();

  const [tab, setTab] = useState<'photos' | 'measures'>('photos');
  const [showAddMeasure, setShowAddMeasure] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Measurement form
  const [mWeight, setMWeight] = useState('');
  const [mWaist, setMWaist] = useState('');
  const [mBicep, setMBicep] = useState('');
  const [mChest, setMChest] = useState('');
  const [mThigh, setMThigh] = useState('');

  useEffect(() => {
    if (user) {
      fetchPhotos(user.id);
      fetchMeasurements(user.id);
    }
  }, [user, fetchPhotos, fetchMeasurements]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      await uploadPhoto(user.id, file);
      sileo.success({ title: 'Foto subida', description: 'Tu foto de progreso fue guardada.' });
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo subir la foto.' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddMeasurement = async () => {
    if (!user) return;
    try {
      await addMeasurement({
        user_id: user.id,
        weight: mWeight ? Number(mWeight) : null,
        waist: mWaist ? Number(mWaist) : null,
        bicep: mBicep ? Number(mBicep) : null,
        chest: mChest ? Number(mChest) : null,
        thigh: mThigh ? Number(mThigh) : null,
      });
      sileo.success({ title: 'Medida registrada' });
      setShowAddMeasure(false);
      setMWeight(''); setMWaist(''); setMBicep(''); setMChest(''); setMThigh('');
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo guardar la medida.' });
    }
  };

  const toggleCompare = (id: string) => {
    setCompareSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const comparePhotos = compareSelection.map((id) => photos.find((p) => p.id === id)).filter(Boolean);

  /* ── Simple sparkline for measurements ───────────────── */
  const measureKeys = [
    { key: 'weight', label: 'Peso (kg)', color: 'var(--primary)' },
    { key: 'waist', label: 'Cintura (cm)', color: '#3b82f6' },
    { key: 'bicep', label: 'Bícep (cm)', color: 'var(--secondary)' },
    { key: 'chest', label: 'Pecho (cm)', color: '#a855f7' },
    { key: 'thigh', label: 'Muslo (cm)', color: '#f97316' },
  ] as const;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Progreso</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Visualiza tu transformación y registra tus medidas</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', backgroundColor: 'var(--surface)', padding: '0.25rem', borderRadius: '14px', width: 'fit-content' }}>
        <button onClick={() => setTab('photos')} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', backgroundColor: tab === 'photos' ? 'var(--background)' : 'transparent', color: tab === 'photos' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Camera size={18} /> Fotos
        </button>
        <button onClick={() => setTab('measures')} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', backgroundColor: tab === 'measures' ? 'var(--background)' : 'transparent', color: tab === 'measures' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ruler size={18} /> Medidas
        </button>
      </div>

      {/* ─── PHOTOS TAB ────────────────────────────────── */}
      {tab === 'photos' && (
        <>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button style={btnPrimary} onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Camera size={18} /> {uploading ? 'Subiendo...' : 'Subir Foto'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
            <button
              onClick={() => { setCompareMode(!compareMode); setCompareSelection([]); }}
              style={{ ...btnPrimary, backgroundColor: compareMode ? 'var(--secondary)' : 'var(--surface)', color: compareMode ? 'var(--background)' : 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              <ImageIcon size={18} /> {compareMode ? 'Cancelar' : 'Comparar'}
            </button>
          </div>

          {/* Compare View */}
          {compareMode && comparePhotos.length === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden' }}>
              {comparePhotos.map((p) => (
                <div key={p!.id} style={{ position: 'relative' }}>
                  <img src={p!.photo_url} alt="Progreso" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px' }} />
                  <span style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', backgroundColor: 'rgba(0,0,0,.7)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem' }}>
                    {new Date(p!.taken_at).toLocaleDateString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
          )}
          {compareMode && comparePhotos.length < 2 && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Seleccioná 2 fotos para comparar lado a lado.</p>
          )}

          {/* Photo Grid */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Cargando fotos...</div>
          ) : photos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => compareMode && toggleCompare(photo.id)}
                  style={{
                    position: 'relative', borderRadius: '16px', overflow: 'hidden',
                    border: compareSelection.includes(photo.id) ? '3px solid var(--primary)' : '1px solid var(--border)',
                    cursor: compareMode ? 'pointer' : 'default',
                    transition: 'border .15s',
                  }}
                >
                  <img src={photo.photo_url} alt="Progreso" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem', background: 'linear-gradient(transparent, rgba(0,0,0,.8))', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem' }}>{new Date(photo.taken_at).toLocaleDateString('es-AR')}</span>
                    {!compareMode && (
                      <button onClick={() => deletePhoto(photo.id)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  {photo.is_reference && (
                    <span style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', backgroundColor: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.625rem', fontWeight: 700 }}>REF</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <Camera size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No tenés fotos de progreso aún.</p>
            </div>
          )}
        </>
      )}

      {/* ─── MEASURES TAB ──────────────────────────────── */}
      {tab === 'measures' && (
        <>
          <button style={{ ...btnPrimary, marginBottom: '1.5rem' }} onClick={() => setShowAddMeasure(true)}>
            <Plus size={18} /> Registrar Medida
          </button>

          {/* Mini Charts */}
          {measurements.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {measureKeys.map(({ key, label, color }) => {
                const values = measurements
                  .slice(0, 10)
                  .map((m) => (m as any)[key] as number | null)
                  .filter((v): v is number => v !== null)
                  .reverse();
                if (values.length < 2) return null;
                const min = Math.min(...values);
                const max = Math.max(...values);
                const range = max - min || 1;
                const last = values[values.length - 1];
                const prev = values[values.length - 2];
                const diff = last - prev;
                return (
                  <div key={key} style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{last}</span>
                      <span style={{ fontSize: '0.75rem', color: diff > 0 ? 'var(--primary)' : 'var(--secondary)' }}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    </div>
                    {/* Mini SVG sparkline */}
                    <svg width="100%" height="40" viewBox={`0 0 ${values.length - 1} 40`} preserveAspectRatio="none" style={{ marginTop: '0.5rem' }}>
                      <polyline
                        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        points={values.map((v, i) => `${i},${40 - ((v - min) / range) * 36 - 2}`).join(' ')}
                      />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}

          {/* Measurement History */}
          {measurements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {measurements.map((m) => (
                <div key={m.id} style={{ backgroundColor: 'var(--surface)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flex: 1 }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minWidth: '80px' }}>{new Date(m.recorded_at).toLocaleDateString('es-AR')}</span>
                    {m.weight && <MiniStat label="Peso" value={`${m.weight} kg`} />}
                    {m.waist && <MiniStat label="Cintura" value={`${m.waist} cm`} />}
                    {m.bicep && <MiniStat label="Bícep" value={`${m.bicep} cm`} />}
                    {m.chest && <MiniStat label="Pecho" value={`${m.chest} cm`} />}
                    {m.thigh && <MiniStat label="Muslo" value={`${m.thigh} cm`} />}
                  </div>
                  <button onClick={() => deleteMeasurement(m.id)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0.5rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <TrendingUp size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Sin medidas registradas aún.</p>
            </div>
          )}
        </>
      )}

      {/* ─── ADD MEASUREMENT MODAL ─────────────────────── */}
      {showAddMeasure && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--background)', width: '100%', maxWidth: '480px', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Registrar Medida</h2>
              <button onClick={() => setShowAddMeasure(false)} style={{ background: 'var(--surface)', border: 'none', color: 'var(--text-primary)', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Peso (kg)</label>
                <input type="number" step="0.1" style={inputStyle} value={mWeight} onChange={(e) => setMWeight(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>Cintura (cm)</label><input type="number" step="0.1" style={inputStyle} value={mWaist} onChange={(e) => setMWaist(e.target.value)} /></div>
                <div><label style={labelStyle}>Bícep (cm)</label><input type="number" step="0.1" style={inputStyle} value={mBicep} onChange={(e) => setMBicep(e.target.value)} /></div>
                <div><label style={labelStyle}>Pecho (cm)</label><input type="number" step="0.1" style={inputStyle} value={mChest} onChange={(e) => setMChest(e.target.value)} /></div>
                <div><label style={labelStyle}>Muslo (cm)</label><input type="number" step="0.1" style={inputStyle} value={mThigh} onChange={(e) => setMThigh(e.target.value)} /></div>
              </div>
              <button style={{ ...btnPrimary, justifyContent: 'center', width: '100%', marginTop: '0.5rem' }} onClick={handleAddMeasurement}>
                Guardar Medida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MiniStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>{label}</span>
    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{value}</span>
  </div>
);
