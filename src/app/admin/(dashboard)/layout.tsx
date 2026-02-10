import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebarClient from "@/components/admin/AdminSidebarClient";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) {
    redirect("/admin/login");
  }

  const user = await validateSession(sessionId);

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <AdminSidebarClient />
      <SidebarInset className="flex flex-col">
        <AdminHeader user={user} />
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
