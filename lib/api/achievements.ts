import { supabase, AchievementRow, UserAchievementRow } from '../supabase/client';
import { AchievementCategory } from '../models/constants';

/**
 * API service for achievements
 */
export class AchievementsService {
  /**
   * Get all achievements
   */
  static async getAchievements(category?: AchievementCategory): Promise<AchievementRow[] | null> {
    try {
      let query = supabase.from('achievements').select();

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('points', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting achievements:', error);
      return null;
    }
  }

  /**
   * Get a specific achievement by ID
   */
  static async getAchievementById(achievementId: string): Promise<AchievementRow | null> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select()
        .eq('id', achievementId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting achievement:', error);
      return null;
    }
  }

  /**
   * Get achievements earned by a user
   */
  static async getUserAchievements(userId: string): Promise<UserAchievementRow[] | null> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select()
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return null;
    }
  }

  /**
   * Get detailed user achievements with achievement details
   */
  static async getUserAchievementsWithDetails(userId: string): Promise<any[] | null> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(
          `
          id,
          user_id,
          achievement_id,
          earned_at,
          created_at,
          achievements:achievement_id (
            id,
            title,
            description,
            icon_name,
            category,
            points,
            requirements
          )
        `
        )
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user achievements with details:', error);
      return null;
    }
  }

  /**
   * Award an achievement to a user
   */
  static async awardAchievement(
    userId: string,
    achievementId: string
  ): Promise<UserAchievementRow | null> {
    try {
      // Check if user already has this achievement
      const { data: existingAchievement } = await supabase
        .from('user_achievements')
        .select()
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)
        .maybeSingle();

      if (existingAchievement) {
        return existingAchievement; // User already has this achievement
      }

      // Award the achievement
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          earned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return null;
    }
  }

  /**
   * Check achievement requirements and award if met
   * This is a simplified version; actual implementation would depend on your requirements format
   */
  static async checkAndAwardAchievement(
    userId: string,
    achievementId: string,
    context: any
  ): Promise<boolean> {
    try {
      // Get the achievement
      const achievement = await this.getAchievementById(achievementId);
      if (!achievement) return false;

      // This is a placeholder for your achievement requirements checking logic
      // You would implement logic based on the requirements field in the achievement
      // and the context provided
      const requirementsMet = this.checkRequirements(achievement.requirements, context);

      if (requirementsMet) {
        await this.awardAchievement(userId, achievementId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking and awarding achievement:', error);
      return false;
    }
  }

  /**
   * Helper method to check if achievement requirements are met
   * This is a placeholder for your actual requirements checking logic
   */
  private static checkRequirements(requirements: any, context: any): boolean {
    // Implement your requirements checking logic here
    // This would depend on the structure of your requirements field
    // and what achievements are based on in your app

    // Example implementation (very simplified):
    // requirements might be something like { type: 'checklist_items_completed', count: 5 }
    // context might be { checklist_items_completed: 7 }
    if (requirements.type && context[requirements.type] !== undefined) {
      return context[requirements.type] >= (requirements.count || 0);
    }

    return false;
  }
}
