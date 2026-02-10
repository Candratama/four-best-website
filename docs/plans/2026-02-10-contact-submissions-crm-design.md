# Contact Submissions CRM - Design Document

**Date:** 2026-02-10
**Status:** Approved
**Type:** New Feature

## Overview

Admin panel untuk menampilkan dan mengelola contact form submissions dengan fitur CRM-style untuk tracking follow-ups, managing leads, dan monitoring team performance.

## Goals

- Simpan semua contact submissions ke database lokal untuk kontrol penuh
- Tetap gunakan Brevo untuk email delivery
- Provide CRM-style dashboard untuk manage dan track submissions
- Enable team to prioritize and follow-up effectively

## Database Schema

### New Table: `contact_submissions`

```sql
CREATE TABLE contact_submissions (
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
CREATE INDEX idx_submissions_status ON contact_submissions(status);
CREATE INDEX idx_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX idx_submissions_email ON contact_submissions(email);
```

## Status Workflow

**3-Stage Process:**
1. **New** - Baru masuk, belum direspons
2. **In Progress** - Sudah dikontak, sedang follow-up
3. **Closed** - Selesai (won/lost/not_interested)

## Dashboard Features

### Statistics Cards
- Total submissions this week
- Overdue follow-ups count
- New submissions count
- Response rate percentage

### Filters & Search
- Search by name, email, phone
- Filter by status (All/New/In Progress/Closed)
- Filter by date range
- Export to CSV

### Submissions Table
**Columns:**
- Visual indicator (red dot for new/unread)
- Name
- Contact (phone with WhatsApp quick action)
- Submission date (relative time)
- Status badge
- Due date indicator (overdue warning)
- Email delivery status
- Actions (View button)

### Detail View (Modal)

**Contact Information Section:**
- Name
- Email with copy button
- Phone with WhatsApp quick action button
- Preferred visit date/time
- Message content

**CRM Management Section:**
- Status dropdown (new/in_progress/closed)
- Follow-up due date picker
- Notes textarea
- Closed reason (if status = closed)
- Email delivery status with retry button
- Save changes button

**WhatsApp Integration:**
- Quick action button opens WhatsApp web/app
- URL: `https://wa.me/{phone}?text=Halo {name}...`
- Pre-filled greeting message template

## Data Flow

### Form Submission Process

```
1. User submits contact form
   ↓
2. Validate form data (existing validation)
   ↓
3. Save to database (contact_submissions)
   - status: 'new'
   - is_responded: 0
   - source: 'website'
   - email_sent: 0 (initial)
   ↓
4. Send emails via Brevo (parallel)
   - Admin notification
   - Visitor confirmation
   - Add to Brevo contact list
   ↓
5. Update email_sent status in database
   - email_sent: 1 if success, 0 if failed
   - email_error: error message if failed
   ↓
6. Return success to user
```

### Error Handling Strategy

- **Database save fails** → Return error, don't send emails
- **Database succeeds, email fails** → Still success (data saved, admin can follow up manually)
- Email failure tracked in `email_sent` and `email_error` fields
- Admin can manually retry sending email

## File Structure

```
src/app/admin/(dashboard)/submissions/
├── page.tsx                    # Main dashboard
├── actions.ts                  # Server actions
└── [id]/
    └── page.tsx               # Detail view (optional)

src/components/admin/
├── SubmissionsTable.tsx       # Table with filters
├── SubmissionDetailModal.tsx  # Detail modal
└── SubmissionStats.tsx        # Statistics cards

src/lib/db.ts
└── Add submission functions

migrations/
└── XXXX_create_contact_submissions.sql
```

## Server Actions

```typescript
// Get submissions with filters
getSubmissions(filters: {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
})

// Get single submission
getSubmission(id: number)

// Update submission
updateSubmission(id: number, data: {
  status?: string;
  notes?: string;
  due_date?: string;
  closed_reason?: string;
})

// Statistics
getSubmissionStats() {
  thisWeek: number;
  overdue: number;
  newCount: number;
  responseRate: number;
}

// Export
exportSubmissionsCSV(filters)

// Email retry
resendEmail(submissionId: number)
```

## UI/UX Details

### Navigation
- Add "Submissions" link to admin sidebar
- Show badge with unread count
- Icon: ✉️

### Visual Indicators
- 🔴 Red dot = New/unread submission
- ⚠️ Warning icon = Overdue follow-up
- ✓ Green check = Due date okay
- ⚠️ Failed badge = Email not sent

### Performance
- Pagination: 20 items per page
- Server-side filtering
- Indexed queries for search
- Export limited to 1000 rows

### Security
- Admin authentication required (existing middleware)
- No public API exposure
- Rate limiting on form submission

## Edge Cases

1. **Duplicate submissions**: Allowed (same person might inquire about different properties)
2. **Missing data**: Enforced by NOT NULL constraints
3. **Timezone**: Store UTC, display local
4. **Email retry**: Manual retry with attempt tracking
5. **Search**: Indexed for performance
6. **Data retention**: Keep all data (storage cheap)

## Success Metrics

- All contact submissions saved to database
- Email delivery tracked and retryable
- Admin can see submissions within seconds
- Response rate improves with due date reminders
- Export functionality for reporting

## Future Enhancements (Out of Scope)

- Auto-assign submissions to team members
- Email templates for common responses
- SMS notifications
- Integration with calendar for visit scheduling
- Mobile app for on-the-go management
