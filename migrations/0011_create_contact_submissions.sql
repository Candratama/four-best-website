-- Create contact_submissions table for CRM functionality
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Visit Details
  preferred_date TEXT,
  preferred_time TEXT,

  -- CRM Fields
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'in_progress', 'closed')),
  notes TEXT,
  due_date TEXT,  -- ISO format date string for follow-up

  -- Outcome tracking
  is_responded INTEGER DEFAULT 0,  -- for response rate calculation
  closed_reason TEXT,  -- won/lost/not_interested (optional, only when closed)

  -- Email delivery tracking
  email_sent INTEGER DEFAULT 0,  -- 0 = failed, 1 = success
  email_error TEXT,              -- error message if failed

  -- Metadata
  source TEXT DEFAULT 'website',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON contact_submissions(email);
