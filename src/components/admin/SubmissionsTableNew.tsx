"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { id as idLocale } from "date-fns/locale";
import { Eye, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableColumnHeader, useDataTable } from "@/components/data-table5";
import type { ContactSubmission } from "@/lib/db";
import { useState } from "react";

const JAKARTA_TZ = "Asia/Jakarta";

interface SubmissionsTableProps {
  submissions: ContactSubmission[];
  onViewDetails: (submission: ContactSubmission) => void;
  onExport: () => void;
}

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
      <div className="flex items-center justify-center gap-1 text-red-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-xs">Overdue</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 text-green-600">
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

export const columns = (onViewDetails: (submission: ContactSubmission) => void): ColumnDef<ContactSubmission>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("name")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: () => <div>Contact</div>,
    cell: ({ row }) => {
      const submission = row.original;
      return (
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
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Submitted" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground text-center">
        {formatDistanceToNow(toZonedTime(new Date(row.getValue("created_at")), JAKARTA_TZ), {
          addSuffix: true,
          locale: idLocale,
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Status" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{getStatusBadge(row.getValue("status"))}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "due_date",
    header: () => <div className="text-center">Due Date</div>,
    cell: ({ row }) => {
      const submission = row.original;
      return (
        <div className="text-center">
          {getDueDateIndicator(submission.due_date, submission.status)}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email_sent",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("email_sent") ? (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Sent
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Failed
          </Badge>
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row.original)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

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

  const { table } = useDataTable({
    data: filteredSubmissions,
    columns: columns(onViewDetails),
    getRowId: (row) => row.id.toString(),
    initialSorting: [{ id: "created_at", desc: true }],
  });

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
      <div className="relative h-[600px] w-full overflow-hidden">
        <ScrollArea className="h-full w-full">
          <table className="w-full min-w-[800px] table-fixed caption-bottom border-separate border-spacing-0 text-sm [&_tr:not(:last-child)_td]:border-b">
            <TableHeader className="sticky top-0 z-20 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="relative h-12 border-y border-border bg-muted/50 px-4 text-left text-sm font-medium select-none first:rounded-l-lg first:border-l first:pl-5 last:rounded-r-lg last:border-r last:pr-5"
                      >
                        {header.isPlaceholder
                          ? null
                          : header.column.columnDef.header
                          ? typeof header.column.columnDef.header === "function"
                            ? header.column.columnDef.header(header.getContext())
                            : header.column.columnDef.header
                          : null}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-0 hover:bg-accent/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-3 py-2 text-xs first:pl-3 last:pr-3 sm:px-4 sm:py-3 sm:text-sm sm:first:pl-5 sm:last:pr-5"
                      >
                        {cell.column.columnDef.cell
                          ? typeof cell.column.columnDef.cell === "function"
                            ? cell.column.columnDef.cell(cell.getContext())
                            : cell.column.columnDef.cell
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 px-4 text-center text-sm text-muted-foreground"
                  >
                    No submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </div>
    </div>
  );
}
