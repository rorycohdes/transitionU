import { supabase } from '../supabase/client';
import { ForumCategory, VoteType, SortOrder } from './constants';

export interface ForumPostWithStats {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  created_at: string;
  updated_at: string;
  user_id: string;
  author_name?: string;
  author_avatar?: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  user_vote?: string;
}

export interface ForumCommentWithAuthor {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  post_id: string;
  user_id: string;
  author_name?: string;
  author_avatar?: string;
  parent_comment_id?: string;
}

export class ForumModel {
  /**
   * Create a new forum post
   */
  static async createPost(userId: string, title: string, content: string, category: ForumCategory) {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: userId,
          title,
          content,
          category,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating forum post:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception creating forum post:', error);
      return null;
    }
  }

  /**
   * Get forum posts with vote counts and comment counts
   */
  static async getPosts({
    category = null,
    userId = null,
    sortBy = 'created_at',
    sortOrder = SortOrder.DESC,
    limit = 20,
    offset = 0,
  }: {
    category?: ForumCategory | null;
    userId?: string | null;
    sortBy?: string;
    sortOrder?: SortOrder;
    limit?: number;
    offset?: number;
  }) {
    try {
      // Start with a base query
      let query = supabase.from('forum_posts_with_stats').select('*');

      // Apply filters if provided
      if (category) {
        query = query.eq('category', category);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === SortOrder.ASC });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching forum posts:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching forum posts:', error);
      return null;
    }
  }

  /**
   * Get a single forum post with all details
   */
  static async getPost(postId: string, userId?: string) {
    try {
      const { data, error } = await supabase
        .from('forum_posts_with_stats')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching forum post:', error);
        return null;
      }

      // If a userId is provided, get the user's vote for this post
      if (userId) {
        const { data: voteData, error: voteError } = await supabase
          .from('forum_votes')
          .select('vote_type')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .single();

        if (!voteError && voteData) {
          data.user_vote = voteData.vote_type;
        }
      }

      return data;
    } catch (error) {
      console.error('Exception fetching forum post:', error);
      return null;
    }
  }

  /**
   * Vote on a forum post
   */
  static async votePost(postId: string, userId: string, voteType: VoteType) {
    try {
      // First, check if the user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('forum_votes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows found
        console.error('Error checking existing vote:', checkError);
        return false;
      }

      // If the user is voting the same way they already voted, remove their vote
      if (existingVote && existingVote.vote_type === voteType) {
        const { error: deleteError } = await supabase
          .from('forum_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Error removing vote:', deleteError);
          return false;
        }
        return true;
      }

      // If the user already voted but is changing their vote, or if they haven't voted yet
      const { error } = await supabase.from('forum_votes').upsert(
        {
          post_id: postId,
          user_id: userId,
          vote_type: voteType,
        },
        { onConflict: 'post_id,user_id' }
      );

      if (error) {
        console.error('Error voting on post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception voting on post:', error);
      return false;
    }
  }

  /**
   * Create a comment on a post or reply to another comment
   */
  static async createComment(
    postId: string,
    userId: string,
    content: string,
    parentCommentId?: string
  ) {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
          parent_comment_id: parentCommentId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception creating comment:', error);
      return null;
    }
  }

  /**
   * Get comments for a post, including nested replies
   */
  static async getComments(postId: string) {
    try {
      const { data, error } = await supabase
        .from('forum_comments_with_authors')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching comments:', error);
      return null;
    }
  }

  /**
   * Delete a forum post
   */
  static async deletePost(postId: string, userId: string) {
    try {
      // First verify the user owns this post
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (postError) {
        console.error('Error verifying post ownership:', postError);
        return false;
      }

      if (postData.user_id !== userId) {
        console.error('User does not own this post');
        return false;
      }

      // Delete the post
      const { error } = await supabase.from('forum_posts').delete().eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting post:', error);
      return false;
    }
  }

  /**
   * Delete a comment
   */
  static async deleteComment(commentId: string, userId: string) {
    try {
      // First verify the user owns this comment
      const { data: commentData, error: commentError } = await supabase
        .from('forum_comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

      if (commentError) {
        console.error('Error verifying comment ownership:', commentError);
        return false;
      }

      if (commentData.user_id !== userId) {
        console.error('User does not own this comment');
        return false;
      }

      // Delete the comment
      const { error } = await supabase.from('forum_comments').delete().eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting comment:', error);
      return false;
    }
  }

  /**
   * Search forum posts by title or content
   */
  static async searchPosts(query: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('forum_posts_with_stats')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        console.error('Error searching forum posts:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception searching forum posts:', error);
      return null;
    }
  }
}
