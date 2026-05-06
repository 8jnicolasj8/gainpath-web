import React, { useEffect, useState, useMemo } from 'react';
import { useStatsStore } from '../../store/useStatsStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ChevronLeft, ChevronRight, Flame, Trophy, Calendar as CalendarIcon,
  BarChart2, Clock
} from 'lucide-react';

export const Stats: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { sessions, isLoading, fetchSessions } = useStatsStore();
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  useEffect(() => {
    if (user) fetchSessions(user.id);
  }, [user, fetchSessions]);

  /* ── Calendar helpers ────────────────────────────────── */
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const sessionDatesSet = useMemo(() => {
    const s = new Set<string>();
    sessions.forEach((se) => {
      if (se.completed_at) s.add(se.completed_at.split('T')[0]);
      else s.add(se.started_at.split('T')[0]);
    });
    return s;
  }, [sessions]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0);
    // Monday-first offset
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    const days: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
    return days;
  }, [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  /* ── Streak ──────────────────────────────────────────── */
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (sessionDatesSet.has(key)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  }, [sessionDatesSet]);

  /* ── Volume (sessions per week / month) ──────────────── */
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);

  const weekSessions = sessions.filter((s) => new Date(s.started_at) >= weekAgo).length;
  const monthSessions = sessions.filter((s) => new Date(s.started_at) >= monthAgo).length;

  /* ── Personal records placeholder ────────────────────── */
  // PR logic would come from session details / exercise logs — placeholder for now

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Estadísticas</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Mantené tu racha y seguí creciendo</p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Cargando estadísticas...</div>
      ) : (
        <>
          {/* ── Summary Cards ──────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <SummaryCard icon={<Flame size={28} />} label="Racha Actual" value={`${currentStreak} días`} accent="var(--primary)" />
            <SummaryCard icon={<BarChart2 size={28} />} label="Esta Semana" value={`${weekSessions} sesiones`} accent="var(--secondary)" />
            <SummaryCard icon={<CalendarIcon size={28} />} label="Este Mes" value={`${monthSessions} sesiones`} accent="#3b82f6" />
            <SummaryCard icon={<Trophy size={28} />} label="Total" value={`${sessions.length} sesiones`} accent="#a855f7" />
          </div>

          {/* ── Calendar ───────────────────────────────── */}
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem' }}><ChevronLeft size={24} /></button>
              <h3 style={{ fontSize: '1.125rem' }}>{monthNames[calMonth]} {calYear}</h3>
              <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem' }}><ChevronRight size={24} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
              {dayNames.map((d) => (
                <span key={d} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>{d}</span>
              ))}
              {calendarDays.map((day, i) => {
                if (day === null) return <span key={`e${i}`} />;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const active = sessionDatesSet.has(dateStr);
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                return (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '36px', height: '36px', margin: '0 auto',
                      borderRadius: '10px', fontSize: '0.875rem', fontWeight: 500,
                      backgroundColor: active ? 'var(--primary)' : 'transparent',
                      color: active ? 'var(--background)' : isToday ? 'var(--primary)' : 'var(--text-primary)',
                      border: isToday && !active ? '1px solid var(--primary)' : 'none',
                    }}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ── Session History ─────────────────────────── */}
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Historial de Sesiones</h3>
          {sessions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sessions.slice(0, 20).map((s) => (
                <div key={s.id} style={{ backgroundColor: 'var(--surface)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{new Date(s.started_at).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    {s.notes && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.notes}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {s.completed_at && (
                      <>
                        <Clock size={14} />
                        {Math.round((new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 60000)} min
                      </>
                    )}
                    {!s.completed_at && <span style={{ color: 'var(--primary)' }}>En curso</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <CalendarIcon size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No hay sesiones registradas aún.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: string; accent: string }> = ({ icon, label, value, accent }) => (
  <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
    <div style={{ color: accent, marginBottom: '0.75rem' }}>{icon}</div>
    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
    <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{value}</p>
  </div>
);
