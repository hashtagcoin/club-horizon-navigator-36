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
      app_settings: {
        Row: {
          id: number
          key: string
          value: string
        }
        Insert: {
          id?: number
          key: string
          value: string
        }
        Update: {
          id?: number
          key?: string
          value?: string
        }
        Relationships: []
      }
      club_cards: {
        Row: {
          address: string | null
          area: string | null
          friday_hours: string | null
          id: number
          latitude: number | null
          location: string | null
          longitude: number | null
          monday_hours: string | null
          name: string | null
          phone: string | null
          place_id: string | null
          price_level: string | null
          rating: number | null
          saturday_hours: string | null
          sunday_hours: string | null
          thursday_hours: string | null
          traffic: string | null
          tuesday_hours: string | null
          venue_type: string | null
          website: string | null
          wednesday_hours: string | null
        }
        Insert: {
          address?: string | null
          area?: string | null
          friday_hours?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monday_hours?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string | null
          price_level?: string | null
          rating?: number | null
          saturday_hours?: string | null
          sunday_hours?: string | null
          thursday_hours?: string | null
          traffic?: string | null
          tuesday_hours?: string | null
          venue_type?: string | null
          website?: string | null
          wednesday_hours?: string | null
        }
        Update: {
          address?: string | null
          area?: string | null
          friday_hours?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monday_hours?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string | null
          price_level?: string | null
          rating?: number | null
          saturday_hours?: string | null
          sunday_hours?: string | null
          thursday_hours?: string | null
          traffic?: string | null
          tuesday_hours?: string | null
          venue_type?: string | null
          website?: string | null
          wednesday_hours?: string | null
        }
        Relationships: []
      }
      club_cards_duplicate: {
        Row: {
          address: string | null
          area: string | null
          friday_hours: string | null
          id: number
          latitude: number | null
          location: string | null
          longitude: number | null
          monday_hours: string | null
          name: string | null
          phone: string | null
          place_id: string | null
          price_level: string | null
          rating: number | null
          saturday_hours: string | null
          sunday_hours: string | null
          thursday_hours: string | null
          traffic: string | null
          tuesday_hours: string | null
          venue_type: string | null
          website: string | null
          wednesday_hours: string | null
        }
        Insert: {
          address?: string | null
          area?: string | null
          friday_hours?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monday_hours?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string | null
          price_level?: string | null
          rating?: number | null
          saturday_hours?: string | null
          sunday_hours?: string | null
          thursday_hours?: string | null
          traffic?: string | null
          tuesday_hours?: string | null
          venue_type?: string | null
          website?: string | null
          wednesday_hours?: string | null
        }
        Update: {
          address?: string | null
          area?: string | null
          friday_hours?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monday_hours?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string | null
          price_level?: string | null
          rating?: number | null
          saturday_hours?: string | null
          sunday_hours?: string | null
          thursday_hours?: string | null
          traffic?: string | null
          tuesday_hours?: string | null
          venue_type?: string | null
          website?: string | null
          wednesday_hours?: string | null
        }
        Relationships: []
      }
      Clublist_Australia: {
        Row: {
          address: string | null
          city: string | null
          friday_hours: string | null
          friday_hours_close: string | null
          friday_hours_open: string | null
          latitude: number | null
          longitude: number | null
          monday_hours: string | null
          monday_hours_close: string | null
          monday_hours_open: string | null
          music_Fri: string | null
          music_Mon: string | null
          music_Sat: string | null
          music_Sun: string | null
          music_Thurs: string | null
          music_Tues: string | null
          music_type: string | null
          music_Wed: string | null
          name: string | null
          phone: string | null
          place_id: string
          price_level: string | null
          rating: number | null
          saturday_hours: string | null
          saturday_hours_close: string | null
          saturday_hours_open: string | null
          sunday_hours: string | null
          sunday_hours_close: string | null
          sunday_hours_open: string | null
          thursday_hours: string | null
          thursday_hours_close: string | null
          thursday_hours_open: string | null
          tuesday_hours: string | null
          tuesday_hours_close: string | null
          tuesday_hours_open: string | null
          venue_type_Detail: string | null
          venue_type_simple: string | null
          website: string | null
          wednesday_hours: string | null
          wednesday_hours_close: string | null
          wednesday_hours_open: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          friday_hours?: string | null
          friday_hours_close?: string | null
          friday_hours_open?: string | null
          latitude?: number | null
          longitude?: number | null
          monday_hours?: string | null
          monday_hours_close?: string | null
          monday_hours_open?: string | null
          music_Fri?: string | null
          music_Mon?: string | null
          music_Sat?: string | null
          music_Sun?: string | null
          music_Thurs?: string | null
          music_Tues?: string | null
          music_type?: string | null
          music_Wed?: string | null
          name?: string | null
          phone?: string | null
          place_id: string
          price_level?: string | null
          rating?: number | null
          saturday_hours?: string | null
          saturday_hours_close?: string | null
          saturday_hours_open?: string | null
          sunday_hours?: string | null
          sunday_hours_close?: string | null
          sunday_hours_open?: string | null
          thursday_hours?: string | null
          thursday_hours_close?: string | null
          thursday_hours_open?: string | null
          tuesday_hours?: string | null
          tuesday_hours_close?: string | null
          tuesday_hours_open?: string | null
          venue_type_Detail?: string | null
          venue_type_simple?: string | null
          website?: string | null
          wednesday_hours?: string | null
          wednesday_hours_close?: string | null
          wednesday_hours_open?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          friday_hours?: string | null
          friday_hours_close?: string | null
          friday_hours_open?: string | null
          latitude?: number | null
          longitude?: number | null
          monday_hours?: string | null
          monday_hours_close?: string | null
          monday_hours_open?: string | null
          music_Fri?: string | null
          music_Mon?: string | null
          music_Sat?: string | null
          music_Sun?: string | null
          music_Thurs?: string | null
          music_Tues?: string | null
          music_type?: string | null
          music_Wed?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string
          price_level?: string | null
          rating?: number | null
          saturday_hours?: string | null
          saturday_hours_close?: string | null
          saturday_hours_open?: string | null
          sunday_hours?: string | null
          sunday_hours_close?: string | null
          sunday_hours_open?: string | null
          thursday_hours?: string | null
          thursday_hours_close?: string | null
          thursday_hours_open?: string | null
          tuesday_hours?: string | null
          tuesday_hours_close?: string | null
          tuesday_hours_open?: string | null
          venue_type_Detail?: string | null
          venue_type_simple?: string | null
          website?: string | null
          wednesday_hours?: string | null
          wednesday_hours_close?: string | null
          wednesday_hours_open?: string | null
        }
        Relationships: []
      }
      Clublist_Australia_old: {
        Row: {
          address: string | null
          area: string | null
          Country: string | null
          friday_hours_close: string | null
          friday_hours_open: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          monday_hours_close: string | null
          monday_hours_open: string | null
          name: string | null
          phone: string | null
          place_id: string
          rating: number | null
          saturday_hours_close: string | null
          saturday_hours_open: string | null
          State: string | null
          sunday_hours_close: string | null
          sunday_hours_open: string | null
          thursday_hours_close: string | null
          thursday_hours_open: string | null
          traffic: Database["public"]["Enums"]["traffic_level"] | null
          tuesday_hours_close: string | null
          tuesday_hours_open: string | null
          venue_type: string | null
          website: string | null
          wednesday_hours_close: string | null
          wednesday_hours_open: string | null
        }
        Insert: {
          address?: string | null
          area?: string | null
          Country?: string | null
          friday_hours_close?: string | null
          friday_hours_open?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monday_hours_close?: string | null
          monday_hours_open?: string | null
          name?: string | null
          phone?: string | null
          place_id: string
          rating?: number | null
          saturday_hours_close?: string | null
          saturday_hours_open?: string | null
          State?: string | null
          sunday_hours_close?: string | null
          sunday_hours_open?: string | null
          thursday_hours_close?: string | null
          thursday_hours_open?: string | null
          traffic?: Database["public"]["Enums"]["traffic_level"] | null
          tuesday_hours_close?: string | null
          tuesday_hours_open?: string | null
          venue_type?: string | null
          website?: string | null
          wednesday_hours_close?: string | null
          wednesday_hours_open?: string | null
        }
        Update: {
          address?: string | null
          area?: string | null
          Country?: string | null
          friday_hours_close?: string | null
          friday_hours_open?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          monday_hours_close?: string | null
          monday_hours_open?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string
          rating?: number | null
          saturday_hours_close?: string | null
          saturday_hours_open?: string | null
          State?: string | null
          sunday_hours_close?: string | null
          sunday_hours_open?: string | null
          thursday_hours_close?: string | null
          thursday_hours_open?: string | null
          traffic?: Database["public"]["Enums"]["traffic_level"] | null
          tuesday_hours_close?: string | null
          tuesday_hours_open?: string | null
          venue_type?: string | null
          website?: string | null
          wednesday_hours_close?: string | null
          wednesday_hours_open?: string | null
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_chat_members: {
        Row: {
          chat_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chat_members_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chats: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          group_chat_id: string | null
          id: string
          media_type: string | null
          media_url: string | null
          recipient_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          group_chat_id?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          recipient_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          group_chat_id?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          recipient_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_chat_id_fkey"
            columns: ["group_chat_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          favorite_club: string | null
          id: string
          last_seen: string | null
          loged_in: boolean | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          favorite_club?: string | null
          id?: string
          last_seen?: string | null
          loged_in?: boolean | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          favorite_club?: string | null
          id?: string
          last_seen?: string | null
          loged_in?: boolean | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_added_venues: {
        Row: {
          address: string
          created_at: string | null
          created_by: string | null
          friday_genre: string | null
          friday_hours_close: string | null
          friday_hours_open: string | null
          id: number
          latitude: number | null
          longitude: number | null
          monday_genre: string | null
          monday_hours_close: string | null
          monday_hours_open: string | null
          name: string
          saturday_genre: string | null
          saturday_hours_close: string | null
          saturday_hours_open: string | null
          sunday_genre: string | null
          sunday_hours_close: string | null
          sunday_hours_open: string | null
          thursday_genre: string | null
          thursday_hours_close: string | null
          thursday_hours_open: string | null
          tuesday_genre: string | null
          tuesday_hours_close: string | null
          tuesday_hours_open: string | null
          wednesday_genre: string | null
          wednesday_hours_close: string | null
          wednesday_hours_open: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          created_by?: string | null
          friday_genre?: string | null
          friday_hours_close?: string | null
          friday_hours_open?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          monday_genre?: string | null
          monday_hours_close?: string | null
          monday_hours_open?: string | null
          name: string
          saturday_genre?: string | null
          saturday_hours_close?: string | null
          saturday_hours_open?: string | null
          sunday_genre?: string | null
          sunday_hours_close?: string | null
          sunday_hours_open?: string | null
          thursday_genre?: string | null
          thursday_hours_close?: string | null
          thursday_hours_open?: string | null
          tuesday_genre?: string | null
          tuesday_hours_close?: string | null
          tuesday_hours_open?: string | null
          wednesday_genre?: string | null
          wednesday_hours_close?: string | null
          wednesday_hours_open?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          created_by?: string | null
          friday_genre?: string | null
          friday_hours_close?: string | null
          friday_hours_open?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          monday_genre?: string | null
          monday_hours_close?: string | null
          monday_hours_open?: string | null
          name?: string
          saturday_genre?: string | null
          saturday_hours_close?: string | null
          saturday_hours_open?: string | null
          sunday_genre?: string | null
          sunday_hours_close?: string | null
          sunday_hours_open?: string | null
          thursday_genre?: string | null
          thursday_hours_close?: string | null
          thursday_hours_open?: string | null
          tuesday_genre?: string | null
          tuesday_hours_close?: string | null
          tuesday_hours_open?: string | null
          wednesday_genre?: string | null
          wednesday_hours_close?: string | null
          wednesday_hours_open?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          presence_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          presence_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          presence_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_club_name_exists: {
        Args: {
          club_name: string
        }
        Returns: boolean
      }
      get_unique_cities: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
        }[]
      }
      random_traffic: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["traffic_level"]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
      music_genre: "EDM" | "Rock n Roll" | "House" | "Afrobeats" | "RnB"
      traffic_level: "Low" | "Medium" | "High"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
