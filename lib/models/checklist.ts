import {
  supabase,
  ChecklistCategoryRow,
  ChecklistItemRow,
  UserChecklistProgressRow,
} from '../supabase/client';

/**
 * Checklist model for interacting with checklist-related tables
 */
export class ChecklistModel {
  /**
   * Get all checklist categories
   */
  static async getCategories(): Promise<ChecklistCategoryRow[] | null> {
    try {
      const { data, error } = await supabase
        .from('checklist_categories')
        .select()
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting checklist categories:', error);
      return null;
    }
  }

  /**
   * Get items for a specific category
   */
  static async getItemsByCategory(categoryId: string): Promise<ChecklistItemRow[] | null> {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .select()
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting checklist items by category:', error);
      return null;
    }
  }

  /**
   * Get all checklist items with optional visa type filtering
   */
  static async getAllItems(visaType?: string): Promise<ChecklistItemRow[] | null> {
    try {
      let query = supabase
        .from('checklist_items')
        .select()
        .order('display_order', { ascending: true });

      // If visa type is provided, filter items
      if (visaType) {
        query = query.or(`visa_specific.eq.false,visa_types.cs.{"${visaType}"}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting checklist items:', error);
      return null;
    }
  }

  /**
   * Get user's progress for all checklist items
   */
  static async getUserProgress(userId: string): Promise<UserChecklistProgressRow[] | null> {
    try {
      const { data, error } = await supabase
        .from('user_checklist_progress')
        .select()
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user checklist progress:', error);
      return null;
    }
  }

  /**
   * Update user's progress on a checklist item
   */
  static async updateProgress(
    userId: string,
    checklistItemId: string,
    status: 'not_started' | 'in_progress' | 'completed' | 'skipped',
    notes?: string
  ): Promise<UserChecklistProgressRow | null> {
    try {
      // Check if record already exists
      const { data: existingRecord } = await supabase
        .from('user_checklist_progress')
        .select()
        .eq('user_id', userId)
        .eq('checklist_item_id', checklistItemId)
        .maybeSingle();

      const updateData: any = {
        user_id: userId,
        checklist_item_id: checklistItemId,
        status,
      };

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      // Set completed_at timestamp if status is completed
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      let result;

      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from('user_checklist_progress')
          .update(updateData)
          .eq('id', existingRecord.id)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('user_checklist_progress')
          .insert(updateData)
          .select()
          .single();
      }

      const { data, error } = result;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating checklist progress:', error);
      return null;
    }
  }

  /**
   * Get checklist items with user progress information
   */
  static async getItemsWithProgress(userId: string, visaType?: string): Promise<any[] | null> {
    try {
      // Get all items
      const items = await this.getAllItems(visaType);
      if (!items) return null;

      // Get user progress
      const progress = await this.getUserProgress(userId);
      if (!progress) return null;

      // Create a map of progress by checklist item ID
      const progressMap = new Map<string, UserChecklistProgressRow>();
      progress.forEach(p => progressMap.set(p.checklist_item_id, p));

      // Merge items with progress
      return items.map(item => ({
        ...item,
        progress: progressMap.get(item.id) || {
          status: 'not_started',
          notes: null,
          completed_at: null,
        },
      }));
    } catch (error) {
      console.error('Error getting checklist items with progress:', error);
      return null;
    }
  }
}
