export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          first_name: string;
          last_name: string;
          institution: string | null;
          major: string | null;
          visa_type: string | null;
          home_country: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          email: string;
          first_name: string;
          last_name: string;
          institution?: string | null;
          major?: string | null;
          visa_type?: string | null;
          home_country?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          institution?: string | null;
          major?: string | null;
          visa_type?: string | null;
          home_country?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      checklist_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          display_order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      checklist_items: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          estimated_time: string | null;
          difficulty: string | null;
          display_order: number;
          required: boolean;
          visa_specific: boolean;
          visa_types: string[] | null;
          resources: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          estimated_time?: string | null;
          difficulty?: string | null;
          display_order: number;
          required?: boolean;
          visa_specific?: boolean;
          visa_types?: string[] | null;
          resources?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          estimated_time?: string | null;
          difficulty?: string | null;
          display_order?: number;
          required?: boolean;
          visa_specific?: boolean;
          visa_types?: string[] | null;
          resources?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_checklist_progress: {
        Row: {
          id: string;
          user_id: string;
          checklist_item_id: string;
          status: string;
          notes: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          checklist_item_id: string;
          status?: string;
          notes?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          checklist_item_id?: string;
          status?: string;
          notes?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon_name: string | null;
          category: string;
          points: number;
          requirements: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon_name?: string | null;
          category: string;
          points?: number;
          requirements: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon_name?: string | null;
          category?: string;
          points?: number;
          requirements?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
          created_at?: string;
        };
      };
      setup_guide_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_name: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon_name?: string | null;
          display_order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon_name?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      setup_guides: {
        Row: {
          id: string;
          category_id: string;
          title: string;
          content: string;
          institution_specific: boolean;
          institutions: string[] | null;
          major_specific: boolean;
          majors: string[] | null;
          display_order: number;
          resources: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          title: string;
          content: string;
          institution_specific?: boolean;
          institutions?: string[] | null;
          major_specific?: boolean;
          majors?: string[] | null;
          display_order: number;
          resources?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          title?: string;
          content?: string;
          institution_specific?: boolean;
          institutions?: string[] | null;
          major_specific?: boolean;
          majors?: string[] | null;
          display_order?: number;
          resources?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          keywords: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category: string;
          keywords?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string;
          keywords?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          content: string;
          category: string;
          anonymous: boolean;
          upvotes: number;
          downvotes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          content: string;
          category: string;
          anonymous?: boolean;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          content?: string;
          category?: string;
          anonymous?: boolean;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_post_votes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          vote_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          vote_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          vote_type?: string;
          created_at?: string;
        };
      };
      forum_replies: {
        Row: {
          id: string;
          post_id: string;
          user_id: string | null;
          parent_reply_id: string | null;
          content: string;
          anonymous: boolean;
          upvotes: number;
          downvotes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id?: string | null;
          parent_reply_id?: string | null;
          content: string;
          anonymous?: boolean;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string | null;
          parent_reply_id?: string | null;
          content?: string;
          anonymous?: boolean;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_reply_votes: {
        Row: {
          id: string;
          reply_id: string;
          user_id: string;
          vote_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reply_id: string;
          user_id: string;
          vote_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          reply_id?: string;
          user_id?: string;
          vote_type?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      direct_messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
