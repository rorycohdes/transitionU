import { supabase, FAQItemRow } from '../supabase/client';
import { FAQCategory } from '../models/constants';

/**
 * API service for FAQ items
 */
export class FAQService {
  /**
   * Get all FAQ items
   */
  static async getAllFAQs(): Promise<FAQItemRow[] | null> {
    try {
      const { data, error } = await supabase.from('faq_items').select().order('category');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting all FAQs:', error);
      return null;
    }
  }

  /**
   * Get FAQ items by category
   */
  static async getFAQsByCategory(category: FAQCategory): Promise<FAQItemRow[] | null> {
    try {
      const { data, error } = await supabase.from('faq_items').select().eq('category', category);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting FAQs by category:', error);
      return null;
    }
  }

  /**
   * Get a specific FAQ item by ID
   */
  static async getFAQById(id: string): Promise<FAQItemRow | null> {
    try {
      const { data, error } = await supabase.from('faq_items').select().eq('id', id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting FAQ by ID:', error);
      return null;
    }
  }

  /**
   * Search FAQ items by query
   * This searches both questions and answers, as well as matching keywords
   */
  static async searchFAQs(query: string): Promise<FAQItemRow[] | null> {
    try {
      // Convert query to lowercase for case-insensitive search
      const searchQuery = query.toLowerCase();

      const { data, error } = await supabase.from('faq_items').select().or(`
          question.ilike.%${searchQuery}%,
          answer.ilike.%${searchQuery}%
        `);

      if (error) throw error;

      // Also check keywords (Supabase doesn't support array containment search well)
      // So we'll filter the results manually
      const filteredData = data.filter(faq => {
        if (!faq.keywords) return false;
        return faq.keywords.some(
          (keyword: string) =>
            keyword.toLowerCase().includes(searchQuery) ||
            searchQuery.includes(keyword.toLowerCase())
        );
      });

      // Combine results, removing duplicates
      const allResults = [
        ...new Map([...data, ...filteredData].map(item => [item.id, item])).values(),
      ];

      return allResults;
    } catch (error) {
      console.error('Error searching FAQs:', error);
      return null;
    }
  }

  /**
   * Get FAQ items grouped by category
   * Returns an object with categories as keys and arrays of FAQs as values
   */
  static async getFAQsGroupedByCategory(): Promise<Record<string, FAQItemRow[]> | null> {
    try {
      const faqs = await this.getAllFAQs();
      if (!faqs) return null;

      const groupedFAQs: Record<string, FAQItemRow[]> = {};

      // Group FAQs by category
      faqs.forEach(faq => {
        if (!groupedFAQs[faq.category]) {
          groupedFAQs[faq.category] = [];
        }
        groupedFAQs[faq.category].push(faq);
      });

      return groupedFAQs;
    } catch (error) {
      console.error('Error getting FAQs grouped by category:', error);
      return null;
    }
  }
}
