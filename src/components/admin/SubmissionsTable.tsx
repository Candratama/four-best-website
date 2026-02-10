"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { id as idLocale } from "date-fns/locale";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import type { ContactSubmission } from "@/lib/db";

interface SubmissionsTableProps {
  submissions: ContactSubmission[];
  onViewDetails: (submission: ContactSubmission) => void;
  onExport: () => void;
}

const JAKARTA_TZ = "Asia/Jakarta";

export default function SubmissionsTable({
  submissions,
  onViewDetails,
  onExport,
}: SubmissionsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.phone.includes(search);

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ContactSubmission["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>;
      case "in_progress":
        return <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-200">In Progress</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDueDateIndicator = (dueDate: string | null, status: string) => {
    if (!dueDate || status === "closed") return null;

    const today = new Date().toISOString().split("T")[0];
    const isOverdue = dueDate < today;

    if (isOverdue) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">Overdue</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-xs">{dueDate}</span>
      </div>
    );
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[\s\-\+]/g, "");
    const message = encodeURIComponent(`Halo ${name}, terima kasih telah menghubungi Four Best Property.`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onExport} variant="outline">
          Export to CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-center font-semibold px-6 py-4">Name</TableHead>
              <TableHead className="font-semibold px-6 py-4">Contact</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Submitted</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Status</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Due Date</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Email</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/30">
                  {/* Name */}
                  <TableCell className="font-medium text-center px-6 py-4">{submission.name}</TableCell>

                  {/* Contact */}
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{submission.email}</span>
                      <a
                        href={getWhatsAppLink(submission.phone, submission.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                      >
                        {submission.phone}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>

                  {/* Submitted */}
                  <TableCell className="text-sm text-muted-foreground text-center px-6 py-4">
                    {formatDistanceToNow(toZonedTime(new Date(submission.created_at), JAKARTA_TZ), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center px-6 py-4">{getStatusBadge(submission.status)}</TableCell>

                  {/* Due Date */}
                  <TableCell className="text-center px-6 py-4">
                    {getDueDateIndicator(submission.due_date, submission.status)}
                  </TableCell>

                  {/* Email Status */}
                  <TableCell className="text-center px-6 py-4">
                    {submission.email_sent ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Sent
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        Failed
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(submission)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </div>
    </div>
  );
}
