/**
 * Database schema constants and enums
 */

// Checklist item status options
export enum ChecklistStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

// Difficulty levels for checklist items
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

// Common visa types for international students
export enum VisaType {
  F1 = 'F-1',
  J1 = 'J-1',
  M1 = 'M-1',
}

// Forum post categories
export enum ForumCategory {
  VISA = 'visa',
  HOUSING = 'housing',
  ACADEMICS = 'academics',
  SOCIAL = 'social',
  FINANCE = 'finance',
  HEALTH = 'health',
  CULTURAL = 'cultural',
  WORK = 'work',
  GENERAL = 'general',
}

// Forum vote types
export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

// Achievement categories
export enum AchievementCategory {
  PRE_ARRIVAL = 'pre-arrival',
  POST_ARRIVAL = 'post-arrival',
  COMMUNITY = 'community',
  ACADEMIC = 'academic',
}

// FAQ categories
export enum FAQCategory {
  VISA = 'visa',
  HOUSING = 'housing',
  ACADEMICS = 'academics',
  FINANCE = 'finance',
  HEALTH = 'health',
  CULTURAL = 'cultural',
  WORK = 'work',
  GENERAL = 'general',
}

// Sorting options
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
