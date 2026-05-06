-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist to allow clean schema updates
DROP TABLE IF EXISTS public.measurements CASCADE;
DROP TABLE IF EXISTS public.progress_photos CASCADE;
DROP TABLE IF EXISTS public.set_logs CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.routine_exercises CASCADE;
DROP TABLE IF EXISTS public.routines CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Exercises Table
CREATE TABLE public.exercises (
  id TEXT PRIMARY KEY, -- Using TEXT for compatibility with SQLite IDs (e.g. 'e101')
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Gym or Calistenia
  muscle_group TEXT NOT NULL,
  description TEXT,
  equipment TEXT,
  difficulty TEXT,
  video_url TEXT,
  local_video_path TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Routines Table
CREATE TABLE public.routines (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT, -- Match SQLite 'category'
  difficulty TEXT,
  estimated_minutes INTEGER, -- Match SQLite 'estimated_minutes'
  equipment TEXT,
  tags TEXT,
  description TEXT,
  share_code TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Routine Exercises Table
CREATE TABLE public.routine_exercises (
  id TEXT PRIMARY KEY,
  routine_id TEXT REFERENCES public.routines(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '10', -- Match SQLite 'reps' (TEXT)
  weight TEXT,
  rest_seconds INTEGER DEFAULT 60,
  position INTEGER NOT NULL,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sessions Table
CREATE TABLE public.sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  routine_id TEXT REFERENCES public.routines(id) ON DELETE SET NULL,
  routine_name TEXT NOT NULL,
  started_at INTEGER NOT NULL, -- Match SQLite (unix timestamp)
  completed_at INTEGER,
  duration_seconds INTEGER,
  total_volume_kg NUMERIC DEFAULT 0,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set Logs Table
CREATE TABLE public.set_logs (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  routine_exercise_id TEXT,
  exercise_id TEXT,
  exercise_name TEXT,
  set_number INTEGER NOT NULL,
  reps_done INTEGER NOT NULL DEFAULT 0,
  weight_kg NUMERIC DEFAULT 0,
  completed_at INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Progress Photos Table
CREATE TABLE public.progress_photos (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  local_path TEXT,
  notes TEXT,
  is_reference BOOLEAN DEFAULT false,
  taken_at INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Measurements Table
CREATE TABLE public.measurements (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC,
  waist_cm NUMERIC,
  chest_cm NUMERIC,
  bicep_cm NUMERIC,
  thigh_cm NUMERIC,
  notes TEXT,
  recorded_at INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profile." ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Exercises policy" ON public.exercises FOR ALL USING (is_default = true OR user_id = auth.uid());
CREATE POLICY "Routines policy" ON public.routines FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Routine exercises policy" ON public.routine_exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM public.routines WHERE routines.id = routine_exercises.routine_id AND routines.user_id = auth.uid())
);
CREATE POLICY "Sessions policy" ON public.sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Set logs policy" ON public.set_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.sessions WHERE sessions.id = set_logs.session_id AND sessions.user_id = auth.uid())
);
CREATE POLICY "Progress photos policy" ON public.progress_photos FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Measurements policy" ON public.measurements FOR ALL USING (user_id = auth.uid());

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON public.routines FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Fix for exercise types if needed
UPDATE exercises SET type = 'gym' 
WHERE is_default = true 
AND muscle_group IN (
  'Pecho','Espalda','Hombros','Bíceps',
  'Tríceps','Cuádriceps','Isquiotibiales',
  'Glúteos','Pantorrillas','Abdominales'
)
AND equipment NOT IN (
  'Sin equipamiento','Barra de dominadas',
  'Paralelas','Anillas'
);
