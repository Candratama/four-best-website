"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Copy, ExternalLink, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@/lib/db";
import { updateSubmissionAction, resendEmail } from "@/app/admin/(dashboard)/submissions/actions";

interface SubmissionDetailModalProps {
  submission: ContactSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function SubmissionDetailModal({
  submission,
  open,
  onOpenChange,
  onUpdate,
}: SubmissionDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ContactSubmission["status"]>(submission?.status || "new");
  const [notes, setNotes] = useState(submission?.notes || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    submission?.due_date ? new Date(submission.due_date) : undefined
  );
  const [closedReason, setClosedReason] = useState(submission?.closed_reason || "");
  const [isResending, setIsResending] = useState(false);

  if (!submission) return null;

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSubmissionAction(submission.id, {
        status: status as ContactSubmission["status"],
        notes: notes || null,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
        closed_reason: status === "closed" ? closedReason : null,
        is_responded: status !== "new" ? 1 : 0,
      });

      if (result.success) {
        toast.success("Submission updated successfully");
        onUpdate();
        onOpenChange(false);
      } else {
        toast.error("Failed to update submission");
      }
    });
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const result = await resendEmail(submission.id);
      if (result.success) {
        toast.success("Email sent successfully");
        onUpdate();
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } finally {
      setIsResending(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getWhatsAppLink = () => {
    const cleanPhone = submission.phone.replace(/[\s\-\+]/g, "");
    const message = encodeURIComponent(
      `Halo ${submission.name}, terima kasih telah menghubungi Four Best Property.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Submitted {format(new Date(submission.created_at), "PPpp")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="grid gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="text-lg font-medium">{submission.name}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2">
                  <p className="text-lg">{submission.email}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(submission.email, "Email")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Phone / WhatsApp</Label>
                <div className="flex items-center gap-2">
                  <p className="text-lg">{submission.phone}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(submission.phone, "Phone")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Open WhatsApp
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {submission.preferred_date && (
                <div>
                  <Label className="text-muted-foreground">Preferred Visit</Label>
                  <p className="text-lg">
                    {format(new Date(submission.preferred_date), "PPP")}
                    {submission.preferred_time && ` at ${submission.preferred_time}`}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Message</Label>
                <p className="whitespace-pre-wrap rounded-md border bg-muted p-3">
                  {submission.message}
                </p>
              </div>
            </div>
          </div>

          {/* CRM Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CRM Management</h3>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as ContactSubmission["status"])}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">Follow-up Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={4}
                />
              </div>

              {status === "closed" && (
                <div>
                  <Label htmlFor="closedReason">Closed Reason</Label>
                  <Select value={closedReason} onValueChange={setClosedReason}>
                    <SelectTrigger id="closedReason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Email Delivery Status</Label>
                <div className="flex items-center gap-4">
                  {submission.email_sent ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Email Sent Successfully
                    </Badge>
                  ) : (
                    <>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        Email Failed
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendEmail}
                        disabled={isResending}
                      >
                        {isResending ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="mr-2 h-4 w-4" />
                        )}
                        Retry Sending
                      </Button>
                    </>
                  )}
                </div>
                {submission.email_error && (
                  <p className="mt-2 text-sm text-red-600">{submission.email_error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
