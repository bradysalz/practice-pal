export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      artists: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string | null
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          created_by: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          created_by: string
          filepath: string | null
          goal_tempo: number | null
          id: string
          name: string | null
          section_id: string | null
          sort_position: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          filepath?: string | null
          goal_tempo?: number | null
          id: string
          name?: string | null
          section_id?: string | null
          sort_position?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          filepath?: string | null
          goal_tempo?: number | null
          id?: string
          name?: string | null
          section_id?: string | null
          sort_position?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "section_progress_history"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "exercises_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "section_stats_view"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "exercises_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "section_with_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          book_id: string
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          book_id?: string
          created_at?: string
          created_by: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "book_progress_history"
            referencedColumns: ["book_id"]
          },
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "book_stats_view"
            referencedColumns: ["book_id"]
          },
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "book_with_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_items: {
        Row: {
          created_at: string
          created_by: string
          exercise_id: string | null
          id: string
          notes: string | null
          position: number | null
          session_id: string
          song_id: string | null
          tempo: number | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          exercise_id?: string | null
          id: string
          notes?: string | null
          position?: number | null
          session_id: string
          song_id?: string | null
          tempo?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          exercise_id?: string | null
          id?: string
          notes?: string | null
          position?: number | null
          session_id?: string
          song_id?: string | null
          tempo?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_items_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions_with_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_items_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          created_by: string
          duration: number | null
          id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          duration?: number | null
          id: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          duration?: number | null
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      setlist_items: {
        Row: {
          created_at: string
          created_by: string
          exercise_id: string | null
          id: string
          position: number
          setlist_id: string
          song_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          exercise_id?: string | null
          id: string
          position: number
          setlist_id?: string
          song_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          exercise_id?: string | null
          id?: string
          position?: number
          setlist_id?: string
          song_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "setlist_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist_items_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist_items_setlist_id_fkey"
            columns: ["setlist_id"]
            isOneToOne: false
            referencedRelation: "setlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist_items_setlist_id_fkey"
            columns: ["setlist_id"]
            isOneToOne: false
            referencedRelation: "setlists_with_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist_items_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      setlists: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "setlists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          artist_id: string | null
          created_at: string
          created_by: string
          goal_tempo: number | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          created_at?: string
          created_by: string
          goal_tempo?: number | null
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          created_at?: string
          created_by?: string
          goal_tempo?: number | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "songs_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      book_progress_history: {
        Row: {
          at_goal: number | null
          book_id: string | null
          date: string | null
          percent_at_goal: number | null
          percent_played: number | null
          played: number | null
          total: number | null
        }
        Relationships: []
      }
      book_stats_view: {
        Row: {
          book_id: string | null
          goal_reached_exercises: number | null
          played_exercises: number | null
          total_exercises: number | null
        }
        Relationships: []
      }
      book_with_counts: {
        Row: {
          author: string | null
          created_at: string | null
          created_by: string | null
          exercise_count: number | null
          id: string | null
          name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "books_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      section_progress_history: {
        Row: {
          at_goal: number | null
          date: string | null
          percent_at_goal: number | null
          percent_played: number | null
          played: number | null
          section_id: string | null
          total: number | null
        }
        Relationships: []
      }
      section_stats_view: {
        Row: {
          goal_reached_exercises: number | null
          played_exercises: number | null
          section_id: string | null
          total_exercises: number | null
        }
        Relationships: []
      }
      section_with_counts: {
        Row: {
          book_id: string | null
          created_at: string | null
          created_by: string | null
          exercise_count: number | null
          id: string | null
          name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "book_progress_history"
            referencedColumns: ["book_id"]
          },
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "book_stats_view"
            referencedColumns: ["book_id"]
          },
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "book_with_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions_with_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          duration: number | null
          exercise_count: number | null
          id: string | null
          song_count: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      setlists_with_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          exercise_count: number | null
          id: string | null
          name: string | null
          song_count: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setlists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      insert_full_book: {
        Args: { book_name: string; book_author: string; sections: Json }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
