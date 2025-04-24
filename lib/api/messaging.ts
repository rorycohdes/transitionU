import { supabase, ConversationRow, DirectMessageRow } from '../supabase/client';

/**
 * API service for messaging system
 */
export class MessagingService {
  /**
   * Get user's conversations
   */
  static async getUserConversations(userId: string): Promise<any[] | null> {
    try {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(
          `
          id,
          conversation_id,
          created_at,
          conversations:conversation_id (
            id,
            created_at,
            updated_at
          )
        `
        )
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return null;
    }
  }

  /**
   * Get conversation participants
   */
  static async getConversationParticipants(conversationId: string): Promise<any[] | null> {
    try {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(
          `
          id,
          user_id,
          created_at,
          users:user_id (
            id,
            first_name,
            last_name,
            email,
            avatar_url
          )
        `
        )
        .eq('conversation_id', conversationId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting conversation participants:', error);
      return null;
    }
  }

  /**
   * Create a new conversation
   */
  static async createConversation(participantIds: string[]): Promise<ConversationRow | null> {
    try {
      // Create the conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add participants
      const participants = participantIds.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
      }));

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  /**
   * Get messages for a conversation
   */
  static async getConversationMessages(
    conversationId: string,
    limit = 50,
    offset = 0
  ): Promise<DirectMessageRow[] | null> {
    try {
      // This is a simplified implementation that assumes direct messages
      // are associated with conversations. You might need to adjust based on your schema.
      const { data, error } = await supabase
        .from('direct_messages')
        .select()
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      return null;
    }
  }

  /**
   * Send a message
   */
  static async sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    conversationId?: string
  ): Promise<DirectMessageRow | null> {
    try {
      // If conversation ID is not provided, we'll handle it as a direct message
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: senderId,
          recipient_id: recipientId,
          conversation_id: conversationId,
          content,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  /**
   * Mark a message as read
   */
  static async markMessageAsRead(messageId: string): Promise<DirectMessageRow | null> {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .update({ read: true })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return null;
    }
  }

  /**
   * Get unread message count for a user
   */
  static async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('direct_messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
  }

  /**
   * Find or create a conversation between two users
   */
  static async findOrCreateConversation(
    user1Id: string,
    user2Id: string
  ): Promise<ConversationRow | null> {
    try {
      // First check if there's an existing conversation between the two users
      const { data: user1Conversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user1Id);

      if (!user1Conversations || user1Conversations.length === 0) {
        // No conversations for user1, create a new one
        return this.createConversation([user1Id, user2Id]);
      }

      // Check if user2 is part of any of user1's conversations
      const conversationIds = user1Conversations.map(c => c.conversation_id);

      const { data: sharedConversation } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user2Id)
        .in('conversation_id', conversationIds)
        .maybeSingle();

      if (sharedConversation) {
        // Found a shared conversation
        const { data: conversation } = await supabase
          .from('conversations')
          .select()
          .eq('id', sharedConversation.conversation_id)
          .single();

        return conversation;
      } else {
        // No shared conversation, create a new one
        return this.createConversation([user1Id, user2Id]);
      }
    } catch (error) {
      console.error('Error finding or creating conversation:', error);
      return null;
    }
  }
}
