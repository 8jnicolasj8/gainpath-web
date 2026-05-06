import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Exercise = Database['public']['Tables']['exercises']['Row'];

interface ExerciseState {
  exercises: Exercise[];
  filteredExercises: Exercise[];
  isLoading: boolean;
  searchQuery: string;
  typeFilter: 'gym' | 'calisthenics' | 'all';
  muscleFilter: string;
  difficultyFilter: string;
  
  fetchExercises: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: 'gym' | 'calisthenics' | 'all') => void;
  setMuscleFilter: (muscle: string) => void;
  setDifficultyFilter: (difficulty: string) => void;
  applyFilters: () => void;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  filteredExercises: [],
  isLoading: false,
  searchQuery: '',
  typeFilter: 'all',
  muscleFilter: 'Todos',
  difficultyFilter: 'Todos',

  fetchExercises: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ exercises: data || [], filteredExercises: data || [] });
      get().applyFilters();
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setTypeFilter: (type) => {
    set({ typeFilter: type });
    get().applyFilters();
  },

  setMuscleFilter: (muscle) => {
    set({ muscleFilter: muscle });
    get().applyFilters();
  },

  setDifficultyFilter: (difficulty) => {
    set({ difficultyFilter: difficulty });
    get().applyFilters();
  },

  applyFilters: () => {
    const { exercises, searchQuery, typeFilter, muscleFilter, difficultyFilter } = get();
    
    let filtered = [...exercises];

    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.type === typeFilter);
    }

    if (muscleFilter !== 'Todos') {
      filtered = filtered.filter(e => e.muscle_group === muscleFilter);
    }

    if (difficultyFilter !== 'Todos') {
      filtered = filtered.filter(e => e.difficulty === difficultyFilter);
    }

    set({ filteredExercises: filtered });
  }
}));
