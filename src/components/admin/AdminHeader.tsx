"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { User } from "lucide-react";

// Dynamically import UserMenu to avoid hydration mismatch with Radix UI
const UserMenu = dynamic(() => import("./UserMenu"), {
  ssr: false,
  loading: () => (
    <Button variant="ghost" size="sm" className="flex items-center gap-2">
      <User className="h-4 w-4" />
      <span>Loading...</span>
    </Button>
  ),
});

interface AdminHeaderProps {
  user: {
    name: string | null;
    username: string;
  };
  breadcrumbs?: { label: string; href?: string }[];
}

export default function AdminHeader({ user, breadcrumbs = [] }: AdminHeaderProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-between gap-2 border-b bg-background px-4"
      style={{ height: "64px", minHeight: "64px" }}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <BreadcrumbLink href={crumb.href || "#"}>
                        {crumb.label}
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <UserMenu user={user} />
    </div>
  );
}
