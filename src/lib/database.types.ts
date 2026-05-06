export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          user_id: string | null
          name: string
          type: 'gym' | 'calisthenics'
          muscle_group: string
          description: string | null
          equipment: string | null
          difficulty: string | null
          video_url: string | null
          is_default: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          type: 'gym' | 'calisthenics'
          muscle_group: string
          description?: string | null
          equipment?: string | null
          difficulty?: string | null
          video_url?: string | null
          is_default?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          type?: 'gym' | 'calisthenics'
          muscle_group?: string
          description?: string | null
          equipment?: string | null
          difficulty?: string | null
          video_url?: string | null
          is_default?: boolean | null
          created_at?: string
        }
      }
      routines: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string | null
          difficulty: string | null
          estimated_duration: number | null
          equipment: string | null
          is_default: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type?: string | null
          difficulty?: string | null
          estimated_duration?: number | null
          equipment?: string | null
          is_default?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string | null
          difficulty?: string | null
          estimated_duration?: number | null
          equipment?: string | null
          is_default?: boolean | null
          created_at?: string
        }
      }
      routine_exercises: {
        Row: {
          id: string
          routine_id: string
          exercise_id: string
          sets: number
          reps: number
          weight: number | null
          rest_seconds: number | null
          position: number
        }
        Insert: {
          id?: string
          routine_id: string
          exercise_id: string
          sets?: number
          reps?: number
          weight?: number | null
          rest_seconds?: number | null
          position: number
        }
        Update: {
          id?: string
          routine_id?: string
          exercise_id?: string
          sets?: number
          reps?: number
          weight?: number | null
          rest_seconds?: number | null
          position?: number
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          routine_id: string | null
          started_at: string
          completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          routine_id?: string | null
          started_at?: string
          completed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          routine_id?: string | null
          started_at?: string
          completed_at?: string | null
          notes?: string | null
        }
      }
      progress_photos: {
        Row: {
          id: string
          user_id: string
          photo_url: string
          taken_at: string
          is_reference: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          photo_url: string
          taken_at?: string
          is_reference?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          photo_url?: string
          taken_at?: string
          is_reference?: boolean | null
        }
      }
      measurements: {
        Row: {
          id: string
          user_id: string
          weight: number | null
          waist: number | null
          bicep: number | null
          chest: number | null
          thigh: number | null
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight?: number | null
          waist?: number | null
          bicep?: number | null
          chest?: number | null
          thigh?: number | null
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number | null
          waist?: number | null
          bicep?: number | null
          chest?: number | null
          thigh?: number | null
          recorded_at?: string
        }
      }
    }
  }
}
