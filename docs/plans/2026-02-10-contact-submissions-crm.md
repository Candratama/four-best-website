# Contact Submissions CRM Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build full-featured CRM admin panel to manage contact form submissions with tracking, statistics, and follow-up management.

**Architecture:** Database-first approach - save submissions to SQLite, then send emails via Brevo. Admin panel with table view, statistics cards, and detail modal for managing each submission.

**Tech Stack:** Next.js 15 App Router, TypeScript, Cloudflare D1 (SQLite), shadcn/ui components, Server Actions

---

## Task 1: Database Migration

**Files:**
- Create: `migrations/0011_create_contact_submissions.sql`

**Step 1: Create migration file**

```sql
-- Create contact submissions table
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
  due_date TEXT,

  -- Outcome tracking
  is_responded INTEGER DEFAULT 0,
  closed_reason TEXT,

  -- Email delivery tracking
  email_sent INTEGER DEFAULT 0,
  email_error TEXT,

  -- Metadata
  source TEXT DEFAULT 'website',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_phone ON contact_submissions(phone);
```

**Step 2: Apply migration to local database**

Run: `wrangler d1 execute four-best-db --local --file=./migrations/0011_create_contact_submissions.sql`
Expected: "Executed 0011_create_contact_submissions.sql successfully"

**Step 3: Verify table creation**

Run: `wrangler d1 execute four-best-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name='contact_submissions';"`
Expected: Shows contact_submissions table

**Step 4: Commit**

```bash
git add migrations/0011_create_contact_submissions.sql
git commit -m "db: create contact_submissions table with indexes"
```

---

## Task 2: Database Functions in lib/db.ts

**Files:**
- Modify: `src/lib/db.ts` (add at end of file, before exports)

**Step 1: Add TypeScript interface**

```typescript
// Add after existing interfaces
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: 'new' | 'in_progress' | 'closed';
  notes: string | null;
  due_date: string | null;
  is_responded: number;
  closed_reason: string | null;
  email_sent: number;
  email_error: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface SubmissionFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SubmissionStats {
  thisWeek: number;
  overdue: number;
  newCount: number;
  responseRate: number;
}
```

**Step 2: Add getSubmissions function**

```typescript
export async function getSubmissions(
  filters?: SubmissionFilters
): Promise<ContactSubmission[]> {
  const db = await getDB();
  let query = "SELECT * FROM contact_submissions WHERE 1=1";
  const params: string[] = [];

  if (filters?.status && filters.status !== 'all') {
    query += " AND status = ?";
    params.push(filters.status);
  }

  if (filters?.search) {
    query += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters?.dateFrom) {
    query += " AND created_at >= ?";
    params.push(filters.dateFrom);
  }

  if (filters?.dateTo) {
    query += " AND created_at <= ?";
    params.push(filters.dateTo);
  }

  query += " ORDER BY created_at DESC LIMIT 1000";

  const stmt = db.prepare(query);
  const result = await stmt.bind(...params).all<ContactSubmission>();
  return result.results;
}
```

**Step 3: Add getSubmissionById function**

```typescript
export async function getSubmissionById(
  id: number
): Promise<ContactSubmission | null> {
  const db = await getDB();
  return await db
    .prepare("SELECT * FROM contact_submissions WHERE id = ?")
    .bind(id)
    .first<ContactSubmission>();
}
```

**Step 4: Add createSubmission function**

```typescript
export async function createSubmission(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_date?: string;
  preferred_time?: string;
  source?: string;
}): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(`
      INSERT INTO contact_submissions
      (name, email, phone, message, preferred_date, preferred_time, source, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `)
    .bind(
      data.name,
      data.email,
      data.phone,
      data.message,
      data.preferred_date || null,
      data.preferred_time || null,
      data.source || 'website'
    )
    .run();

  return result.meta.last_row_id as number;
}
```

**Step 5: Add updateSubmission function**

```typescript
export async function updateSubmission(
  id: number,
  data: {
    status?: string;
    notes?: string;
    due_date?: string;
    closed_reason?: string;
    is_responded?: number;
    email_sent?: number;
    email_error?: string;
  }
): Promise<void> {
  const db = await getDB();
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.status !== undefined) {
    updates.push("status = ?");
    params.push(data.status);
    // Auto-set is_responded when status changes from 'new'
    if (data.status !== 'new' && data.is_responded === undefined) {
      updates.push("is_responded = 1");
    }
  }

  if (data.notes !== undefined) {
    updates.push("notes = ?");
    params.push(data.notes);
  }

  if (data.due_date !== undefined) {
    updates.push("due_date = ?");
    params.push(data.due_date || null);
  }

  if (data.closed_reason !== undefined) {
    updates.push("closed_reason = ?");
    params.push(data.closed_reason || null);
  }

  if (data.is_responded !== undefined) {
    updates.push("is_responded = ?");
    params.push(data.is_responded);
  }

  if (data.email_sent !== undefined) {
    updates.push("email_sent = ?");
    params.push(data.email_sent);
  }

  if (data.email_error !== undefined) {
    updates.push("email_error = ?");
    params.push(data.email_error || null);
  }

  updates.push("updated_at = datetime('now')");
  params.push(id);

  await db
    .prepare(`UPDATE contact_submissions SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();
}
```

**Step 6: Add getSubmissionStats function**

```typescript
export async function getSubmissionStats(): Promise<SubmissionStats> {
  const db = await getDB();

  // This week count
  const thisWeekResult = await db
    .prepare(`
      SELECT COUNT(*) as count
      FROM contact_submissions
      WHERE created_at >= date('now', '-7 days')
    `)
    .first<{ count: number }>();

  // Overdue count
  const overdueResult = await db
    .prepare(`
      SELECT COUNT(*) as count
      FROM contact_submissions
      WHERE due_date IS NOT NULL
        AND due_date < date('now')
        AND status != 'closed'
    `)
    .first<{ count: number }>();

  // New count
  const newResult = await db
    .prepare(`SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'`)
    .first<{ count: number }>();

  // Response rate
  const totalResult = await db
    .prepare(`SELECT COUNT(*) as count FROM contact_submissions`)
    .first<{ count: number }>();

  const respondedResult = await db
    .prepare(`SELECT COUNT(*) as count FROM contact_submissions WHERE is_responded = 1`)
    .first<{ count: number }>();

  const responseRate =
    (totalResult?.count ?? 0) > 0
      ? Math.round(((respondedResult?.count ?? 0) / (totalResult?.count ?? 1)) * 100)
      : 0;

  return {
    thisWeek: thisWeekResult?.count ?? 0,
    overdue: overdueResult?.count ?? 0,
    newCount: newResult?.count ?? 0,
    responseRate,
  };
}
```

**Step 7: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add database functions for contact submissions"
```

---

## Task 3: Update Contact Form Actions

**Files:**
- Modify: `src/app/contact/actions.ts`

**Step 1: Import new database function**

```typescript
// Add to imports at top
import { createSubmission, updateSubmission } from "@/lib/db";
```

**Step 2: Modify submitContactForm to save to database**

Replace the existing `submitContactForm` function with:

```typescript
export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormResult> {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      return {
        success: false,
        message: "Mohon lengkapi semua field yang wajib diisi.",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: "Format email tidak valid." };
    }

    // STEP 1: Save to database FIRST
    const submissionId = await createSubmission({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      preferred_date: data.date,
      preferred_time: data.time,
      source: "website",
    });

    const payload: ContactFormPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      message: data.message,
    };

    // STEP 2: Send emails via Brevo
    const [adminResult, contactResult, confirmationResult] =
      await Promise.all([
        sendAdminNotification(payload),
        addToContactList(payload),
        sendVisitorConfirmation(payload),
      ]);

    // Log results for debugging
    console.log("Brevo results:", {
      adminNotification: adminResult,
      contactList: contactResult,
      visitorConfirmation: confirmationResult,
    });

    // STEP 3: Update email status in database
    await updateSubmission(submissionId, {
      email_sent: adminResult.success ? 1 : 0,
      email_error: adminResult.success ? null : adminResult.error || "Unknown error",
    });

    // Return success even if email fails (data is saved)
    if (!adminResult.success) {
      console.error("Failed to send admin notification:", adminResult.error);
      return {
        success: true,
        message:
          "Terima kasih! Data Anda telah tersimpan. Kami akan menghubungi Anda segera via WhatsApp.",
      };
    }

    return {
      success: true,
      message:
        "Terima kasih! Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
```

**Step 3: Test form submission saves to database**

Run dev server: `npm run dev`
Submit a test form at http://localhost:3000/contact
Expected: Form submits successfully

**Step 4: Verify database entry**

Run: `wrangler d1 execute four-best-db --local --command="SELECT * FROM contact_submissions ORDER BY id DESC LIMIT 1;"`
Expected: Shows the test submission with email_sent = 1

**Step 5: Commit**

```bash
git add src/app/contact/actions.ts
git commit -m "feat: save contact submissions to database before sending emails"
```

---

## Task 4: Admin Submissions Page - Server Actions

**Files:**
- Create: `src/app/admin/(dashboard)/submissions/actions.ts`

**Step 1: Create actions file with getSubmissions wrapper**

```typescript
"use server";

import {
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  getSubmissionStats,
  type SubmissionFilters,
} from "@/lib/db";
import { sendAdminNotification, type ContactFormPayload } from "@/lib/brevo";
import { revalidatePath } from "next/cache";

export async function fetchSubmissions(filters?: SubmissionFilters) {
  return await getSubmissions(filters);
}

export async function fetchSubmissionById(id: number) {
  return await getSubmissionById(id);
}

export async function fetchSubmissionStats() {
  return await getSubmissionStats();
}

export async function updateSubmissionAction(
  id: number,
  data: {
    status?: string;
    notes?: string;
    due_date?: string;
    closed_reason?: string;
  }
) {
  await updateSubmission(id, data);
  revalidatePath("/admin/submissions");
  return { success: true };
}

export async function resendEmailAction(id: number) {
  const submission = await getSubmissionById(id);
  if (!submission) {
    return { success: false, error: "Submission not found" };
  }

  const payload: ContactFormPayload = {
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    date: submission.preferred_date || "",
    time: submission.preferred_time || "",
    message: submission.message,
  };

  const result = await sendAdminNotification(payload);

  await updateSubmission(id, {
    email_sent: result.success ? 1 : 0,
    email_error: result.success ? null : result.error || "Unknown error",
  });

  revalidatePath("/admin/submissions");
  return result;
}

export async function exportSubmissionsCSV(filters?: SubmissionFilters) {
  const submissions = await getSubmissions(filters);

  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Message",
    "Preferred Date",
    "Preferred Time",
    "Status",
    "Due Date",
    "Notes",
    "Closed Reason",
    "Email Sent",
    "Source",
    "Created At",
  ];

  const rows = submissions.map((s) => [
    s.id,
    s.name,
    s.email,
    s.phone,
    s.message.replace(/"/g, '""'), // Escape quotes
    s.preferred_date || "",
    s.preferred_time || "",
    s.status,
    s.due_date || "",
    (s.notes || "").replace(/"/g, '""'),
    s.closed_reason || "",
    s.email_sent ? "Yes" : "No",
    s.source,
    s.created_at,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
}
```

**Step 2: Commit**

```bash
git add src/app/admin/\(dashboard\)/submissions/actions.ts
git commit -m "feat: add server actions for submissions management"
```

---

## Task 5: Statistics Cards Component

**Files:**
- Create: `src/components/admin/SubmissionStats.tsx`

**Step 1: Create statistics component**

```typescript
import { type SubmissionStats } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface SubmissionStatsProps {
  stats: SubmissionStats;
}

export default function SubmissionStatsCards({ stats }: SubmissionStatsProps) {
  const cards = [
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: Mail,
      description: "New submissions",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      description: "Need follow-up",
      alert: stats.overdue > 0,
    },
    {
      title: "New",
      value: stats.newCount,
      icon: Clock,
      description: "Awaiting response",
    },
    {
      title: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: TrendingUp,
      description: "Overall performance",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon
              className={`h-4 w-4 ${card.alert ? "text-red-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${card.alert ? "text-red-500" : ""}`}
            >
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/admin/SubmissionStats.tsx
git commit -m "feat: add submission statistics cards component"
```

---

## Task 6: Submissions Table Component

**Files:**
- Create: `src/components/admin/SubmissionsTable.tsx`

**Step 1: Create table component**

```typescript
"use client";

import { useState } from "react";
import { type ContactSubmission } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Eye, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface SubmissionsTableProps {
  submissions: ContactSubmission[];
  onViewDetails: (submission: ContactSubmission) => void;
}

export default function SubmissionsTable({
  submissions,
  onViewDetails,
}: SubmissionsTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      new: "default",
      in_progress: "secondary",
      closed: "outline",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getDueIndicator = (
    dueDate: string | null,
    status: string
  ) => {
    if (!dueDate || status === "closed") return null;

    const due = new Date(dueDate);
    const now = new Date();
    const isOverdue = due < now;

    return isOverdue ? (
      <AlertCircle className="h-4 w-4 text-red-500" />
    ) : (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    );
  };

  const getEmailStatusIcon = (emailSent: number) => {
    return emailSent === 1 ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Due</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {submission.status === "new" && !submission.is_responded && (
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{submission.phone}</div>
                    <div className="text-muted-foreground text-xs">
                      {submission.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(submission.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell className="text-center">
                  {getDueIndicator(submission.due_date, submission.status)}
                </TableCell>
                <TableCell className="text-center">
                  {getEmailStatusIcon(submission.email_sent)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(submission)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

**Step 2: Install date-fns**

Run: `npm install date-fns`
Expected: Package installed successfully

**Step 3: Commit**

```bash
git add src/components/admin/SubmissionsTable.tsx package.json package-lock.json
git commit -m "feat: add submissions table component with status indicators"
```

---

## Task 7: Submission Detail Modal Component

**Files:**
- Create: `src/components/admin/SubmissionDetailModal.tsx`

**Step 1: Create modal component (part 1 - structure)**

```typescript
"use client";

import { useState } from "react";
import { type ContactSubmission } from "@/lib/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Copy, Mail, Phone, MessageSquare, AlertCircle } from "lucide-react";
import { updateSubmissionAction, resendEmailAction } from "@/app/admin/(dashboard)/submissions/actions";
import { toast } from "sonner";

interface SubmissionDetailModalProps {
  submission: ContactSubmission | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function SubmissionDetailModal({
  submission,
  open,
  onClose,
  onUpdate,
}: SubmissionDetailModalProps) {
  const [status, setStatus] = useState(submission?.status || "new");
  const [notes, setNotes] = useState(submission?.notes || "");
  const [dueDate, setDueDate] = useState(submission?.due_date || "");
  const [closedReason, setClosedReason] = useState(submission?.closed_reason || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (!submission) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleWhatsApp = () => {
    const phone = submission.phone.replace(/[\s\-\+]/g, "");
    const message = `Halo ${submission.name.split(" ")[0]}, terima kasih telah menghubungi 4Best Property!`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const result = await resendEmailAction(submission.id);
      if (result.success) {
        toast.success("Email resent successfully");
        onUpdate();
      } else {
        toast.error(`Failed to resend email: ${result.error}`);
      }
    } catch (error) {
      toast.error("Error resending email");
    } finally {
      setIsResending(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSubmissionAction(submission.id, {
        status,
        notes,
        due_date: dueDate || null,
        closed_reason: status === "closed" ? closedReason : null,
      });
      toast.success("Submission updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update submission");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{submission.name}</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Submitted{" "}
            {new Date(submission.created_at).toLocaleDateString("id-ID", {
              dateStyle: "long",
            })}
          </div>
        </DialogHeader>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Contact Information</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{submission.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(submission.email, "Email")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{submission.phone}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(submission.phone, "Phone")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="default" size="sm" onClick={handleWhatsApp}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {submission.preferred_date && (
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm font-medium">Preferred Visit</div>
                <div className="text-sm text-muted-foreground">
                  {submission.preferred_date} at {submission.preferred_time}
                </div>
              </div>
            )}

            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm font-medium mb-2">Message</div>
              <div className="text-sm whitespace-pre-wrap">
                {submission.message}
              </div>
            </div>

            {submission.email_sent === 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-700">
                    Email not sent
                  </div>
                  {submission.email_error && (
                    <div className="text-xs text-red-600">
                      {submission.email_error}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendEmail}
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* CRM Management Section */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold">Status Management</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Follow-up Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                rows={4}
              />
            </div>

            {status === "closed" && (
              <div className="space-y-2">
                <Label>Outcome</Label>
                <RadioGroup value={closedReason} onValueChange={setClosedReason}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="won" id="won" />
                    <Label htmlFor="won" className="font-normal">
                      Won
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lost" id="lost" />
                    <Label htmlFor="lost" className="font-normal">
                      Lost
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_interested" id="not_interested" />
                    <Label htmlFor="not_interested" className="font-normal">
                      Not Interested
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Install sonner for toast notifications**

Run: `npm install sonner`
Expected: Package installed

**Step 3: Commit**

```bash
git add src/components/admin/SubmissionDetailModal.tsx package.json package-lock.json
git commit -m "feat: add submission detail modal with CRM management"
```

---

## Task 8: Main Submissions Page

**Files:**
- Create: `src/app/admin/(dashboard)/submissions/page.tsx`

**Step 1: Create main page**

```typescript
import { Suspense } from "react";
import {
  fetchSubmissions,
  fetchSubmissionStats,
} from "./actions";
import SubmissionsPageClient from "./SubmissionsPageClient";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = {
    status: typeof params.status === "string" ? params.status : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    dateFrom: typeof params.dateFrom === "string" ? params.dateFrom : undefined,
    dateTo: typeof params.dateTo === "string" ? params.dateTo : undefined,
  };

  const [submissions, stats] = await Promise.all([
    fetchSubmissions(filters),
    fetchSubmissionStats(),
  ]);

  return (
    <Suspense fallback={<Skeleton className="h-screen" />}>
      <SubmissionsPageClient
        initialSubmissions={submissions}
        initialStats={stats}
        initialFilters={filters}
      />
    </Suspense>
  );
}
```

**Step 2: Create client component**

Create: `src/app/admin/(dashboard)/submissions/SubmissionsPageClient.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type ContactSubmission, type SubmissionStats } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search } from "lucide-react";
import SubmissionStatsCards from "@/components/admin/SubmissionStats";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import SubmissionDetailModal from "@/components/admin/SubmissionDetailModal";
import { exportSubmissionsCSV } from "./actions";
import { toast } from "sonner";

interface SubmissionsPageClientProps {
  initialSubmissions: ContactSubmission[];
  initialStats: SubmissionStats;
  initialFilters: {
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default function SubmissionsPageClient({
  initialSubmissions,
  initialStats,
  initialFilters,
}: SubmissionsPageClientProps) {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "all");
  const [isExporting, setIsExporting] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    router.push(`/admin/submissions?${params.toString()}`);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await exportSubmissionsCSV(initialFilters);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Export successful");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground">
          Manage and track customer inquiries
        </p>
      </div>

      {/* Statistics */}
      <SubmissionStatsCards stats={initialStats} />

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExport} disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>

      {/* Table */}
      <SubmissionsTable
        submissions={initialSubmissions}
        onViewDetails={setSelectedSubmission}
      />

      {/* Detail Modal */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        open={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
```

**Step 3: Add Toaster to admin layout**

Modify: `src/app/admin/(dashboard)/layout.tsx`

Add import:
```typescript
import { Toaster } from "sonner";
```

Add before closing `</SidebarProvider>`:
```typescript
<Toaster />
```

**Step 4: Commit**

```bash
git add src/app/admin/\(dashboard\)/submissions/
git add src/app/admin/\(dashboard\)/layout.tsx
git commit -m "feat: add main submissions page with filters and export"
```

---

## Task 9: Add to Admin Sidebar

**Files:**
- Modify: `src/components/admin/AdminSidebar.tsx`

**Step 1: Add Mail icon import**

```typescript
// Add to imports
import { Mail } from "lucide-react";
```

**Step 2: Add Submissions to navGroups**

In the `navGroups` array, add after Dashboard in Overview section:

```typescript
{
  title: "Overview",
  items: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      label: "Submissions",
      icon: Mail,
      href: "/admin/submissions",
    },
  ],
},
```

**Step 3: Test navigation**

Run dev: `npm run dev`
Navigate to: http://localhost:3000/admin
Expected: See "Submissions" in sidebar

**Step 4: Commit**

```bash
git add src/components/admin/AdminSidebar.tsx
git commit -m "feat: add submissions link to admin sidebar"
```

---

## Task 10: Apply Migration to Remote Database

**Files:**
- None (remote database operation)

**Step 1: Apply migration to production database**

Run: `wrangler d1 execute four-best-db --remote --file=./migrations/0011_create_contact_submissions.sql`
Expected: "Executed successfully"

**Step 2: Verify remote table**

Run: `wrangler d1 execute four-best-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name='contact_submissions';"`
Expected: Shows contact_submissions table

**Step 3: Test full flow in production**

Deploy: `npm run deploy`
Test: Submit form and check admin panel
Expected: Submission appears in admin panel

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: apply database migrations to production"
```

---

## Testing Checklist

**Database:**
- [ ] Migration runs successfully
- [ ] Indexes created
- [ ] Can insert test data
- [ ] Can query with filters

**Contact Form:**
- [ ] Form submits successfully
- [ ] Data saved to database
- [ ] Email sent via Brevo
- [ ] Email status tracked

**Admin Panel:**
- [ ] Statistics display correctly
- [ ] Table shows submissions
- [ ] Filters work (search, status)
- [ ] Detail modal opens
- [ ] Can update status/notes/due date
- [ ] WhatsApp link works
- [ ] Email resend works
- [ ] Export CSV works
- [ ] Visual indicators correct (new dot, overdue, email status)

**Edge Cases:**
- [ ] Empty state shows when no submissions
- [ ] Search with no results
- [ ] Email failure tracked correctly
- [ ] Closed status shows outcome options
- [ ] Due date validation

---

## Deployment

**Step 1: Build locally**
```bash
npm run build
```

**Step 2: Deploy to Cloudflare**
```bash
npm run deploy
```

**Step 3: Verify production**
- Submit test form
- Check admin panel
- Verify email delivery
- Test all CRM features
