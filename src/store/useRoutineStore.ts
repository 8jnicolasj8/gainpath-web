import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Routine = Database['public']['Tables']['routines']['Row'];
type RoutineExercise = Database['public']['Tables']['routine_exercises']['Row'] & {
  exercise?: Database['public']['Tables']['exercises']['Row'];
};

interface RoutineState {
  routines: Routine[];
  filteredRoutines: Routine[];
  currentRoutineExercises: RoutineExercise[];
  isLoading: boolean;
  searchQuery: string;
  typeFilter: string;
  difficultyFilter: string;

  fetchRoutines: (userId: string) => Promise<void>;
  fetchRoutineExercises: (routineId: string) => Promise<void>;
  createRoutine: (routine: Database['public']['Tables']['routines']['Insert']) => Promise<Routine | null>;
  updateRoutine: (id: string, updates: Database['public']['Tables']['routines']['Update']) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  addExerciseToRoutine: (re: Database['public']['Tables']['routine_exercises']['Insert']) => Promise<void>;
  removeExerciseFromRoutine: (id: string) => Promise<void>;
  updateRoutineExercise: (id: string, updates: Database['public']['Tables']['routine_exercises']['Update']) => Promise<void>;
  generateShareCode: (routineId: string) => string;
  importByCode: (code: string, userId: string) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: string) => void;
  setDifficultyFilter: (difficulty: string) => void;
  applyFilters: () => void;
}

// Simple encode/decode for share codes
function encodeShareCode(routineId: string): string {
  return btoa(routineId).replace(/=/g, '').substring(0, 8).toUpperCase();
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
  routines: [],
  filteredRoutines: [],
  currentRoutineExercises: [],
  isLoading: false,
  searchQuery: '',
  typeFilter: 'Todos',
  difficultyFilter: 'Todos',

  fetchRoutines: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ routines: data || [], filteredRoutines: data || [] });
      get().applyFilters();
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRoutineExercises: async (routineId: string) => {
    try {
      const { data, error } = await supabase
        .from('routine_exercises')
        .select('*, exercise:exercises(*)')
        .eq('routine_id', routineId)
        .order('position');

      if (error) throw error;
      set({ currentRoutineExercises: (data as any) || [] });
    } catch (error) {
      console.error('Error fetching routine exercises:', error);
    }
  },

  createRoutine: async (routine) => {
    try {
      const { data, error } = await supabase
        .from('routines')
        .insert([routine] as any)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set((s) => ({ routines: [data, ...s.routines], filteredRoutines: [data, ...s.filteredRoutines] }));
      }
      return data;
    } catch (error) {
      console.error('Error creating routine:', error);
      return null;
    }
  },

  updateRoutine: async (id, updates) => {
    try {
      // @ts-ignore – Supabase generic inference issue with update+eq chain
      const { error } = await supabase.from('routines').update(updates).eq('id', id);
      if (error) throw error;
      set((s) => ({
        routines: s.routines.map((r) => (r.id === id ? { ...r, ...updates } as Routine : r)),
        filteredRoutines: s.filteredRoutines.map((r) => (r.id === id ? { ...r, ...updates } as Routine : r)),
      }));
    } catch (error) {
      console.error('Error updating routine:', error);
    }
  },

  deleteRoutine: async (id) => {
    try {
      const { error } = await supabase.from('routines').delete().eq('id', id);
      if (error) throw error;
      set((s) => ({
        routines: s.routines.filter((r) => r.id !== id),
        filteredRoutines: s.filteredRoutines.filter((r) => r.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting routine:', error);
    }
  },

  addExerciseToRoutine: async (re) => {
    try {
      const { data, error } = await supabase
        .from('routine_exercises')
        .insert([re] as any)
        .select('*, exercise:exercises(*)')
        .single();

      if (error) throw error;
      if (data) {
        set((s) => ({ currentRoutineExercises: [...s.currentRoutineExercises, data as any] }));
      }
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  },

  removeExerciseFromRoutine: async (id) => {
    try {
      const { error } = await supabase.from('routine_exercises').delete().eq('id', id);
      if (error) throw error;
      set((s) => ({ currentRoutineExercises: s.currentRoutineExercises.filter((re) => re.id !== id) }));
    } catch (error) {
      console.error('Error removing exercise:', error);
    }
  },

  updateRoutineExercise: async (id, updates) => {
    try {
      // @ts-ignore – Supabase generic inference issue with update+eq chain
      const { error } = await supabase.from('routine_exercises').update(updates).eq('id', id);
      if (error) throw error;
      set((s) => ({
        currentRoutineExercises: s.currentRoutineExercises.map((re) =>
          re.id === id ? { ...re, ...updates } as RoutineExercise : re
        ),
      }));
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  },

  generateShareCode: (routineId: string) => {
    return encodeShareCode(routineId);
  },

  importByCode: async (_code: string, _userId: string) => {
    // In a real implementation this would look up the code in a share_codes table
    // For now, this is a placeholder
    console.log('Import by code not yet backed by a share_codes table');
    return false;
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setTypeFilter: (type) => {
    set({ typeFilter: type });
    get().applyFilters();
  },

  setDifficultyFilter: (difficulty) => {
    set({ difficultyFilter: difficulty });
    get().applyFilters();
  },

  applyFilters: () => {
    const { routines, searchQuery, typeFilter, difficultyFilter } = get();
    let filtered = [...routines];

    if (searchQuery) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (typeFilter !== 'Todos') {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }
    if (difficultyFilter !== 'Todos') {
      filtered = filtered.filter((r) => r.difficulty === difficultyFilter);
    }
    set({ filteredRoutines: filtered });
  },
}));
