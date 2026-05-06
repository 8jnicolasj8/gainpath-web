import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Session = Database['public']['Tables']['sessions']['Row'];

interface StatsState {
  sessions: Session[];
  isLoading: boolean;

  fetchSessions: (userId: string) => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  sessions: [],
  isLoading: false,

  fetchSessions: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });
      if (error) throw error;
      set({ sessions: data || [] });
    } catch (e) {
      console.error('Error fetching sessions:', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
