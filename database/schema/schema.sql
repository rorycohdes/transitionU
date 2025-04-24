-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  institution TEXT,
  major TEXT,
  visa_type TEXT,
  home_country TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (Row Level Security) on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Checklist Categories Table
CREATE TABLE IF NOT EXISTS checklist_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Checklist Items Table
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES checklist_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_time TEXT,
  difficulty TEXT,
  display_order INT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT TRUE,
  visa_specific BOOLEAN NOT NULL DEFAULT FALSE,
  visa_types TEXT[], -- Array of visa types this item applies to
  resources JSONB, -- Links and additional resources
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Checklist Progress Table
CREATE TABLE IF NOT EXISTS user_checklist_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed, skipped
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, checklist_item_id)
);

-- Enable RLS on user_checklist_progress
ALTER TABLE user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT, -- Reference to an icon in the app
  category TEXT NOT NULL, -- e.g., pre-arrival, post-arrival, community
  points INT NOT NULL DEFAULT 0,
  requirements JSONB NOT NULL, -- Conditions to earn the achievement
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Setup Guides Categories Table
CREATE TABLE IF NOT EXISTS setup_guide_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Setup Guides Table
CREATE TABLE IF NOT EXISTS setup_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES setup_guide_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  institution_specific BOOLEAN NOT NULL DEFAULT FALSE,
  institutions TEXT[], -- Array of institution names this guide applies to
  major_specific BOOLEAN NOT NULL DEFAULT FALSE,
  majors TEXT[], -- Array of majors this guide applies to
  display_order INT NOT NULL,
  resources JSONB, -- Links and additional resources
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQ Items Table
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., visa, housing, academics
  keywords TEXT[], -- For search functionality
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., visa, housing, academics
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on forum_posts
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Forum Post Votes Table
CREATE TABLE IF NOT EXISTS forum_post_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL, -- upvote or downvote
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS on forum_post_votes
ALTER TABLE forum_post_votes ENABLE ROW LEVEL SECURITY;

-- Forum Replies Table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE, -- For nested replies
  content TEXT NOT NULL,
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on forum_replies
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Forum Reply Votes Table
CREATE TABLE IF NOT EXISTS forum_reply_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL, -- upvote or downvote
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(reply_id, user_id)
);

-- Enable RLS on forum_reply_votes
ALTER TABLE forum_reply_votes ENABLE ROW LEVEL SECURITY;

-- Direct Messages Table
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on direct_messages
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Conversations Table (to group DMs)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversation Participants Table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Enable RLS on conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_user_checklist_progress_user_id ON user_checklist_progress(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX idx_forum_replies_user_id ON forum_replies(user_id);
CREATE INDEX idx_direct_messages_sender_id ON direct_messages(sender_id);
CREATE INDEX idx_direct_messages_recipient_id ON direct_messages(recipient_id);
CREATE INDEX idx_direct_messages_created_at ON direct_messages(created_at);
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);

-- Add Row Level Security Policies
-- Users can only view their own profiles or basic info about others
CREATE POLICY users_select_policy ON users 
  FOR SELECT USING (auth.uid() = auth_id OR TRUE);  -- Everyone can see basic user info

CREATE POLICY users_update_policy ON users 
  FOR UPDATE USING (auth.uid() = auth_id);  -- Users can only update their own profiles

-- Users can only view their own checklist progress
CREATE POLICY user_checklist_progress_select_policy ON user_checklist_progress 
  FOR SELECT USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

CREATE POLICY user_checklist_progress_insert_policy ON user_checklist_progress 
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

CREATE POLICY user_checklist_progress_update_policy ON user_checklist_progress 
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

-- Users can only view their own achievements
CREATE POLICY user_achievements_select_policy ON user_achievements 
  FOR SELECT USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

-- Forum post policies
CREATE POLICY forum_posts_select_policy ON forum_posts 
  FOR SELECT USING (TRUE);  -- Everyone can view forum posts

CREATE POLICY forum_posts_insert_policy ON forum_posts 
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

CREATE POLICY forum_posts_update_policy ON forum_posts 
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

-- Forum reply policies
CREATE POLICY forum_replies_select_policy ON forum_replies 
  FOR SELECT USING (TRUE);  -- Everyone can view forum replies

CREATE POLICY forum_replies_insert_policy ON forum_replies 
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

CREATE POLICY forum_replies_update_policy ON forum_replies 
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
  );

-- Direct message policies
CREATE POLICY direct_messages_select_policy ON direct_messages 
  FOR SELECT USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = sender_id) OR
    auth.uid() = (SELECT auth_id FROM users WHERE id = recipient_id)
  );

CREATE POLICY direct_messages_insert_policy ON direct_messages 
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_id FROM users WHERE id = sender_id)
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER update_users_modtime
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_checklist_categories_modtime
  BEFORE UPDATE ON checklist_categories
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_checklist_items_modtime
  BEFORE UPDATE ON checklist_items
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_user_checklist_progress_modtime
  BEFORE UPDATE ON user_checklist_progress
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_achievements_modtime
  BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_setup_guide_categories_modtime
  BEFORE UPDATE ON setup_guide_categories
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_setup_guides_modtime
  BEFORE UPDATE ON setup_guides
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_faq_items_modtime
  BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_forum_posts_modtime
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_forum_replies_modtime
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_conversations_modtime
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column(); 