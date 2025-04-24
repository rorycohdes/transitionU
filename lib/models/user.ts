import { supabase, UserRow } from '../supabase/client';

/**
 * User model for interacting with the users table
 */
export class UserModel {
  /**
   * Create a new user in the database
   */
  static async create(
    authId: string,
    email: string,
    firstName: string,
    lastName: string,
    options?: {
      institution?: string;
      major?: string;
      visaType?: string;
      homeCountry?: string;
      avatarUrl?: string;
    }
  ): Promise<UserRow | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          auth_id: authId,
          email,
          first_name: firstName,
          last_name: lastName,
          institution: options?.institution,
          major: options?.major,
          visa_type: options?.visaType,
          home_country: options?.homeCountry,
          avatar_url: options?.avatarUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  /**
   * Get user by auth ID
   */
  static async getByAuthId(authId: string): Promise<UserRow | null> {
    try {
      const { data, error } = await supabase.from('users').select().eq('auth_id', authId).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user by auth ID:', error);
      return null;
    }
  }

  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<UserRow | null> {
    try {
      const { data, error } = await supabase.from('users').select().eq('id', id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async update(
    id: string,
    updates: {
      firstName?: string;
      lastName?: string;
      institution?: string;
      major?: string;
      visaType?: string;
      homeCountry?: string;
      avatarUrl?: string;
    }
  ): Promise<UserRow | null> {
    // Create an updates object with the correct field names
    const dbUpdates: { [key: string]: any } = {};
    if (updates.firstName) dbUpdates.first_name = updates.firstName;
    if (updates.lastName) dbUpdates.last_name = updates.lastName;
    if (updates.institution !== undefined) dbUpdates.institution = updates.institution;
    if (updates.major !== undefined) dbUpdates.major = updates.major;
    if (updates.visaType !== undefined) dbUpdates.visa_type = updates.visaType;
    if (updates.homeCountry !== undefined) dbUpdates.home_country = updates.homeCountry;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;

    try {
      const { data, error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}
