"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import AdminSidebar to avoid hydration mismatch with Radix UI Collapsible
const AdminSidebar = dynamic(() => import("./AdminSidebar"), {
  ssr: false,
  loading: () => (
    <div className="w-64 border-r bg-sidebar h-screen shrink-0">
      <div className="h-16 flex items-center justify-center px-4 border-b">
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="p-4 space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-24 mt-4" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  ),
});

export default function AdminSidebarClient() {
  return <AdminSidebar />;
}
