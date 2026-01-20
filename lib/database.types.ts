export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          github_url: string | null
          linkedin_url: string | null
          visibility: 'public' | 'friends_only' | 'private'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          visibility?: 'public' | 'friends_only' | 'private'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          visibility?: 'public' | 'friends_only' | 'private'
          created_at?: string
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          slug: string
          title: string | null
          bio: string | null
          skills: Json
          theme: 'light' | 'dark' | 'sepia'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          title?: string | null
          bio?: string | null
          skills?: Json
          theme?: 'light' | 'dark' | 'sepia'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          title?: string | null
          bio?: string | null
          skills?: Json
          theme?: 'light' | 'dark' | 'sepia'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string | null
          portfolio_id: string
          name: string
          description: string | null
          url: string | null
          image_url: string | null
          project_type: 'main' | 'toy'
          tech_stack: Json
          display_order: number
          long_description: string | null
          challenges: string | null
          solutions: string | null
          troubleshooting: string | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          portfolio_id: string
          name: string
          description?: string | null
          url?: string | null
          image_url?: string | null
          project_type?: 'main' | 'toy'
          tech_stack?: Json
          display_order?: number
          long_description?: string | null
          challenges?: string | null
          solutions?: string | null
          troubleshooting?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          portfolio_id?: string
          name?: string
          description?: string | null
          url?: string | null
          image_url?: string | null
          project_type?: 'main' | 'toy'
          tech_stack?: Json
          display_order?: number
          long_description?: string | null
          challenges?: string | null
          solutions?: string | null
          troubleshooting?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_projects: {
        Row: {
          id: string
          portfolio_id: string
          project_id: string
          display_type: 'main' | 'toy'
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          project_id: string
          display_type?: 'main' | 'toy'
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          project_id?: string
          display_type?: 'main' | 'toy'
          display_order?: number
          created_at?: string
        }
      }
      work_experiences: {
        Row: {
          id: string
          portfolio_id: string
          company_name: string
          role: string
          start_date: string
          end_date: string | null
          is_current: boolean
          description: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          company_name: string
          role: string
          start_date: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          company_name?: string
          role?: string
          start_date?: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      educations: {
        Row: {
          id: string
          portfolio_id: string
          school_name: string
          degree: string | null
          major: string | null
          start_date: string
          end_date: string | null
          is_current: boolean
          status: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          school_name: string
          degree?: string | null
          major?: string | null
          start_date: string
          end_date?: string | null
          is_current?: boolean
          status?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          school_name?: string
          degree?: string | null
          major?: string | null
          start_date?: string
          end_date?: string | null
          is_current?: boolean
          status?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      awards: {
        Row: {
          id: string
          portfolio_id: string
          title: string
          issuer: string | null
          date: string
          description: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          title: string
          issuer?: string | null
          date: string
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          title?: string
          issuer?: string | null
          date?: string
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          portfolio_id: string
          name: string
          issuer: string | null
          date: string
          credential_url: string | null
          file_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          name: string
          issuer?: string | null
          date: string
          credential_url?: string | null
          file_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          name?: string
          issuer?: string | null
          date?: string
          credential_url?: string | null
          file_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      language_certs: {
        Row: {
          id: string
          portfolio_id: string
          language: string
          test_name: string
          score: string | null
          date: string
          file_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          language: string
          test_name: string
          score?: string | null
          date: string
          file_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          language?: string
          test_name?: string
          score?: string | null
          date?: string
          file_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          receiver_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          receiver_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          receiver_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      update_resume_items: {
        Args: {
          p_portfolio_id: string
          p_table_name: string
          p_items: Json
        }
        Returns: undefined
      }
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Commonly used types
export type Profile = Tables<'profiles'>
export type Portfolio = Tables<'portfolios'>
export type Project = Tables<'projects'>
export type WorkExperience = Tables<'work_experiences'>
export type Education = Tables<'educations'>
export type Award = Tables<'awards'>
export type Certification = Tables<'certifications'>
export type LanguageCert = Tables<'language_certs'>
export type Friendship = Tables<'friendships'>
