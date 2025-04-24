# TransitionU Database Entity-Relationship Diagram

## Core Entities

### Users

- PK: id (UUID)
- auth_id (UUID) - References Supabase Auth
- email (TEXT)
- first_name (TEXT)
- last_name (TEXT)
- institution (TEXT)
- major (TEXT)
- visa_type (TEXT)
- home_country (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

## Checklist System

### Checklist Categories

- PK: id (UUID)
- name (TEXT)
- description (TEXT)
- display_order (INT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### Checklist Items

- PK: id (UUID)
- FK: category_id (UUID) → Checklist Categories.id
- title (TEXT)
- description (TEXT)
- estimated_time (TEXT)
- difficulty (TEXT)
- display_order (INT)
- required (BOOLEAN)
- visa_specific (BOOLEAN)
- visa_types (TEXT[])
- resources (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### User Checklist Progress

- PK: id (UUID)
- FK: user_id (UUID) → Users.id
- FK: checklist_item_id (UUID) → Checklist Items.id
- status (TEXT) - not_started, in_progress, completed, skipped
- notes (TEXT)
- completed_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

## Achievement System

### Achievements

- PK: id (UUID)
- title (TEXT)
- description (TEXT)
- icon_name (TEXT)
- category (TEXT)
- points (INT)
- requirements (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### User Achievements

- PK: id (UUID)
- FK: user_id (UUID) → Users.id
- FK: achievement_id (UUID) → Achievements.id
- earned_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)

## Setup Guides

### Setup Guide Categories

- PK: id (UUID)
- name (TEXT)
- description (TEXT)
- icon_name (TEXT)
- display_order (INT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### Setup Guides

- PK: id (UUID)
- FK: category_id (UUID) → Setup Guide Categories.id
- title (TEXT)
- content (TEXT)
- institution_specific (BOOLEAN)
- institutions (TEXT[])
- major_specific (BOOLEAN)
- majors (TEXT[])
- display_order (INT)
- resources (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

## FAQ System

### FAQ Items

- PK: id (UUID)
- question (TEXT)
- answer (TEXT)
- category (TEXT)
- keywords (TEXT[])
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

## Forum System

### Forum Posts

- PK: id (UUID)
- FK: user_id (UUID) → Users.id
- title (TEXT)
- content (TEXT)
- category (TEXT)
- anonymous (BOOLEAN)
- upvotes (INT)
- downvotes (INT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### Forum Post Votes

- PK: id (UUID)
- FK: post_id (UUID) → Forum Posts.id
- FK: user_id (UUID) → Users.id
- vote_type (TEXT)
- created_at (TIMESTAMPTZ)

### Forum Replies

- PK: id (UUID)
- FK: post_id (UUID) → Forum Posts.id
- FK: user_id (UUID) → Users.id
- FK: parent_reply_id (UUID) → Forum Replies.id
- content (TEXT)
- anonymous (BOOLEAN)
- upvotes (INT)
- downvotes (INT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### Forum Reply Votes

- PK: id (UUID)
- FK: reply_id (UUID) → Forum Replies.id
- FK: user_id (UUID) → Users.id
- vote_type (TEXT)
- created_at (TIMESTAMPTZ)

## Messaging System

### Conversations

- PK: id (UUID)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### Conversation Participants

- PK: id (UUID)
- FK: conversation_id (UUID) → Conversations.id
- FK: user_id (UUID) → Users.id
- created_at (TIMESTAMPTZ)

### Direct Messages

- PK: id (UUID)
- FK: sender_id (UUID) → Users.id
- FK: recipient_id (UUID) → Users.id
- content (TEXT)
- read (BOOLEAN)
- created_at (TIMESTAMPTZ)

## Relationships

1. A User can have many User Checklist Progress records (1:N)
2. A User can have many User Achievements (1:N)
3. A User can create many Forum Posts (1:N)
4. A User can create many Forum Replies (1:N)
5. A User can vote on many Forum Posts and Replies (1:N)
6. A User can participate in many Conversations (N:M through Conversation Participants)
7. A User can send and receive many Direct Messages (1:N)
8. A Checklist Category can have many Checklist Items (1:N)
9. A Checklist Item can have many User Checklist Progress records (1:N)
10. An Achievement can be earned by many Users (1:N through User Achievements)
11. A Setup Guide Category can have many Setup Guides (1:N)
12. A Forum Post can have many Forum Replies (1:N)
13. A Forum Reply can have many nested Forum Replies (1:N)
14. A Conversation can have many Conversation Participants (1:N)
15. A Conversation can have many Direct Messages (1:N)
