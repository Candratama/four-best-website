-- Add is_director flag to team_members table
ALTER TABLE team_members ADD COLUMN is_director INTEGER NOT NULL DEFAULT 0;
