export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StaffRole = "admin" | "editor";

export type EquipeCargo = "diretor" | "jornalista";

export type SocialPlatform = "instagram" | "facebook" | "youtube" | "tiktok" | "other";

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          user_id: string;
          role: StaffRole;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role?: StaffRole;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: StaffRole;
          created_at?: string;
        };
        Relationships: [];
      };
      podcasts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          content: string | null;
          cover_image_path: string | null;
          youtube_video_id: string | null;
          is_published: boolean;
          is_featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string | null;
          content?: string | null;
          cover_image_path?: string | null;
          youtube_video_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string | null;
          content?: string | null;
          cover_image_path?: string | null;
          youtube_video_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      noticias: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          content: string | null;
          cover_image_path: string | null;
          is_published: boolean;
          is_featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string | null;
          content?: string | null;
          cover_image_path?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string | null;
          content?: string | null;
          cover_image_path?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      equipe: {
        Row: {
          id: string;
          cargo: EquipeCargo;
          nome: string;
          descricao: string | null;
          instagram_url: string | null;
          foto_path: string | null;
          ordem: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cargo: EquipeCargo;
          nome: string;
          descricao?: string | null;
          instagram_url?: string | null;
          foto_path?: string | null;
          ordem?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cargo?: EquipeCargo;
          nome?: string;
          descricao?: string | null;
          instagram_url?: string | null;
          foto_path?: string | null;
          ordem?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: SocialPlatform;
          label: string | null;
          url: string;
          icon_path: string | null;
          ordem: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: SocialPlatform;
          label?: string | null;
          url: string;
          icon_path?: string | null;
          ordem?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: SocialPlatform;
          label?: string | null;
          url?: string;
          icon_path?: string | null;
          ordem?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      staff_role: StaffRole;
      equipe_cargo: EquipeCargo;
      social_platform: SocialPlatform;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
