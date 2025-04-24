import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../database/types/database.types';
import Constants from 'expo-constants';

// Get the Supabase URL and anon key from environment variables or constants
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for working with Supabase

// Get a typed table reference
export const getTable = <T extends keyof Database['public']['Tables']>(tableName: T) =>
  supabase.from(tableName);

// Type for auth user
export type SupabaseUser = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];

// Export types for convenient use
export type Tables = Database['public']['Tables'];
export type UserRow = Tables['users']['Row'];
export type ChecklistCategoryRow = Tables['checklist_categories']['Row'];
export type ChecklistItemRow = Tables['checklist_items']['Row'];
export type UserChecklistProgressRow = Tables['user_checklist_progress']['Row'];
export type AchievementRow = Tables['achievements']['Row'];
export type UserAchievementRow = Tables['user_achievements']['Row'];
export type SetupGuideCategoryRow = Tables['setup_guide_categories']['Row'];
export type SetupGuideRow = Tables['setup_guides']['Row'];
export type FAQItemRow = Tables['faq_items']['Row'];
export type ForumPostRow = Tables['forum_posts']['Row'];
export type ForumReplyRow = Tables['forum_replies']['Row'];
export type ConversationRow = Tables['conversations']['Row'];
export type DirectMessageRow = Tables['direct_messages']['Row'];
