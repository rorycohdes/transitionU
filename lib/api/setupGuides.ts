import { supabase, SetupGuideCategoryRow, SetupGuideRow } from '../supabase/client';

/**
 * API service for setup guides
 */
export class SetupGuidesService {
  /**
   * Get all setup guide categories
   */
  static async getCategories(): Promise<SetupGuideCategoryRow[] | null> {
    try {
      const { data, error } = await supabase
        .from('setup_guide_categories')
        .select()
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting setup guide categories:', error);
      return null;
    }
  }

  /**
   * Get a specific setup guide category by ID
   */
  static async getCategoryById(categoryId: string): Promise<SetupGuideCategoryRow | null> {
    try {
      const { data, error } = await supabase
        .from('setup_guide_categories')
        .select()
        .eq('id', categoryId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting setup guide category:', error);
      return null;
    }
  }

  /**
   * Get setup guides by category
   */
  static async getGuidesByCategory(categoryId: string): Promise<SetupGuideRow[] | null> {
    try {
      const { data, error } = await supabase
        .from('setup_guides')
        .select()
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting setup guides by category:', error);
      return null;
    }
  }

  /**
   * Get a specific setup guide by ID
   */
  static async getGuideById(guideId: string): Promise<SetupGuideRow | null> {
    try {
      const { data, error } = await supabase
        .from('setup_guides')
        .select()
        .eq('id', guideId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting setup guide:', error);
      return null;
    }
  }

  /**
   * Get personalized setup guides for a user based on their institution and major
   */
  static async getPersonalizedGuides(
    institution?: string,
    major?: string
  ): Promise<SetupGuideRow[] | null> {
    try {
      let query = supabase.from('setup_guides').select();

      // Handle institution-specific guides
      if (institution) {
        query = query.or(`institution_specific.eq.false,institutions.cs.{"${institution}"}`);
      } else {
        query = query.eq('institution_specific', false);
      }

      // Handle major-specific guides
      if (major) {
        query = query.or(`major_specific.eq.false,majors.cs.{"${major}"}`);
      } else {
        query = query.eq('major_specific', false);
      }

      const { data, error } = await query.order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting personalized setup guides:', error);
      return null;
    }
  }
}
