import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ProgressPhoto = Database['public']['Tables']['progress_photos']['Row'];
type Measurement = Database['public']['Tables']['measurements']['Row'];

interface ProgressState {
  photos: ProgressPhoto[];
  measurements: Measurement[];
  isLoading: boolean;

  fetchPhotos: (userId: string) => Promise<void>;
  uploadPhoto: (userId: string, file: File, isReference?: boolean) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;

  fetchMeasurements: (userId: string) => Promise<void>;
  addMeasurement: (m: Database['public']['Tables']['measurements']['Insert']) => Promise<void>;
  deleteMeasurement: (id: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  photos: [],
  measurements: [],
  isLoading: false,

  fetchPhotos: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', userId)
        .order('taken_at', { ascending: false });
      if (error) throw error;
      set({ photos: data || [] });
    } catch (e) {
      console.error('Error fetching photos:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  uploadPhoto: async (userId, file, isReference = false) => {
    try {
      const ext = file.name.split('.').pop();
      const path = `${userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('progress_photos')
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('progress_photos')
        .getPublicUrl(path);

      const { data, error } = await supabase
        .from('progress_photos')
        .insert([{ user_id: userId, photo_url: urlData.publicUrl, is_reference: isReference }] as any)
        .select()
        .single();
      if (error) throw error;
      if (data) set((s) => ({ photos: [data, ...s.photos] }));
    } catch (e) {
      console.error('Error uploading photo:', e);
      throw e;
    }
  },

  deletePhoto: async (id) => {
    try {
      const { error } = await supabase.from('progress_photos').delete().eq('id', id);
      if (error) throw error;
      set((s) => ({ photos: s.photos.filter((p) => p.id !== id) }));
    } catch (e) {
      console.error('Error deleting photo:', e);
    }
  },

  fetchMeasurements: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      set({ measurements: data || [] });
    } catch (e) {
      console.error('Error fetching measurements:', e);
    }
  },

  addMeasurement: async (m) => {
    try {
      const { data, error } = await supabase
        .from('measurements')
        .insert([m] as any)
        .select()
        .single();
      if (error) throw error;
      if (data) set((s) => ({ measurements: [data, ...s.measurements] }));
    } catch (e) {
      console.error('Error adding measurement:', e);
      throw e;
    }
  },

  deleteMeasurement: async (id) => {
    try {
      const { error } = await supabase.from('measurements').delete().eq('id', id);
      if (error) throw error;
      set((s) => ({ measurements: s.measurements.filter((m) => m.id !== id) }));
    } catch (e) {
      console.error('Error deleting measurement:', e);
    }
  },
}));
