# Admin Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-featured admin panel for managing 4best website content with authentication, CRUD operations, and image uploads.

**Architecture:** Next.js 15 App Router with server actions for mutations, session-based auth using cookies, shadcnblocks for UI components, Cloudflare D1 for database, and R2 for file storage.

**Tech Stack:** Next.js 15, React 19, shadcn/ui + shadcnblocks, React Hook Form + Zod, bcryptjs, Cloudflare D1/R2

---

## Phase 1: Foundation (Auth + Layout + Dashboard)

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install auth and form dependencies**

Run:
```bash
npm install bcryptjs zod react-hook-form @hookform/resolvers
npm install -D @types/bcryptjs
```

**Step 2: Verify installation**

Run: `npm ls bcryptjs zod react-hook-form`
Expected: All packages listed without errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add auth and form dependencies"
```

---

### Task 2: Create Auth Library

**Files:**
- Create: `src/lib/auth.ts`

**Step 1: Create auth utilities**

```typescript
import bcrypt from "bcryptjs";
import { getDB } from "./cloudflare";

// Types
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  name: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

export interface SessionUser {
  id: number;
  username: string;
  name: string | null;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session utilities
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(userId: number): Promise<string> {
  const db = await getDB();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db
    .prepare(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
    )
    .bind(sessionId, userId, expiresAt.toISOString())
    .run();

  return sessionId;
}

export async function validateSession(
  sessionId: string
): Promise<SessionUser | null> {
  const db = await getDB();

  const session = await db
    .prepare(
      `SELECT s.*, u.username, u.name, u.is_active
       FROM sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now') AND u.is_active = 1`
    )
    .bind(sessionId)
    .first<Session & { username: string; name: string | null; is_active: number }>();

  if (!session) return null;

  return {
    id: session.user_id,
    username: session.username,
    name: session.name,
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

// User utilities
export async function getUserByUsername(
  username: string
): Promise<AdminUser | null> {
  const db = await getDB();
  return db
    .prepare("SELECT * FROM admin_users WHERE username = ? AND is_active = 1")
    .bind(username)
    .first<AdminUser>();
}

export async function createAdminUser(
  username: string,
  password: string,
  name?: string
): Promise<number> {
  const db = await getDB();
  const passwordHash = await hashPassword(password);

  const result = await db
    .prepare(
      "INSERT INTO admin_users (username, password_hash, name) VALUES (?, ?, ?)"
    )
    .bind(username, passwordHash, name || null)
    .run();

  return result.meta.last_row_id as number;
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}
```

**Step 2: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: add auth library with session management"
```

---

### Task 3: Create Auth Middleware

**Files:**
- Create: `src/middleware.ts`

**Step 1: Create middleware for admin route protection**

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionId = request.cookies.get("admin_session")?.value;

    if (!sessionId) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add middleware for admin route protection"
```

---

### Task 4: Create Login API Route

**Files:**
- Create: `src/app/api/admin/login/route.ts`

**Step 1: Create login endpoint**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername, verifyPassword, createSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const sessionId = await createSession(user.id);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/admin/login/route.ts
git commit -m "feat: add login API endpoint"
```

---

### Task 5: Create Logout API Route

**Files:**
- Create: `src/app/api/admin/logout/route.ts`

**Step 1: Create logout endpoint**

```typescript
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    cookieStore.delete("admin_session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/admin/logout/route.ts
git commit -m "feat: add logout API endpoint"
```

---

### Task 6: Create Login Page

**Files:**
- Create: `src/app/admin/login/page.tsx`

**Step 1: Create login page component**

```tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">4best Admin</CardTitle>
          <CardDescription>Sign in to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/login/page.tsx
git commit -m "feat: add admin login page"
```

---

### Task 7: Seed Default Admin User

**Files:**
- Create: `migrations/0009_seed_admin_user.sql`

**Step 1: Create migration for default admin user**

```sql
-- Migration: Seed default admin user
-- Password: admin123 (change immediately after first login)
-- Hash generated with bcrypt, 12 rounds

INSERT OR IGNORE INTO admin_users (id, username, password_hash, name, is_active)
VALUES (
    1,
    'admin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYWWQRAOyO2i',
    'Administrator',
    1
);
```

**Step 2: Apply migration locally**

Run:
```bash
npx wrangler d1 migrations apply four-best-db --local
```

**Step 3: Apply migration to remote**

Run:
```bash
npx wrangler d1 migrations apply four-best-db --remote
```

**Step 4: Commit**

```bash
git add migrations/0009_seed_admin_user.sql
git commit -m "feat: add default admin user migration"
```

---

### Task 8: Create Admin Layout with Sidebar

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminHeader.tsx`

**Step 1: Create AdminSidebar component**

```tsx
// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Image,
  Layers,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Partners",
    href: "/admin/partners",
    icon: <Users className="h-5 w-5" />,
    children: [
      { label: "All Partners", href: "/admin/partners" },
      { label: "Add New", href: "/admin/partners/new" },
    ],
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Add New", href: "/admin/products/new" },
    ],
  },
  {
    label: "Content",
    href: "/admin/content",
    icon: <FileText className="h-5 w-5" />,
    children: [
      { label: "Hero Slides", href: "/admin/content/hero-slides" },
      { label: "Page Sections", href: "/admin/content/page-sections" },
      { label: "CTA Section", href: "/admin/content/cta" },
    ],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        {collapsed ? (
          <span className="text-xl font-bold">4B</span>
        ) : (
          <span className="text-xl font-bold">4best Admin</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors",
                    isActive(item.href) && "bg-gray-800"
                  )}
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openMenus.includes(item.label) && "rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>
                {!collapsed && openMenus.includes(item.label) && (
                  <div className="bg-gray-800/50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block pl-12 pr-4 py-2 hover:bg-gray-800 transition-colors",
                          pathname === child.href && "bg-gray-700 text-blue-400"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 hover:bg-gray-800 transition-colors",
                  isActive(item.href) && "bg-gray-800 text-blue-400"
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-gray-800 hover:bg-gray-800 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  );
}
```

**Step 2: Commit sidebar**

```bash
git add src/components/admin/AdminSidebar.tsx
git commit -m "feat: add admin sidebar component"
```

**Step 3: Create AdminHeader component**

```tsx
// src/components/admin/AdminHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name: string | null;
    username: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div>
        {/* Breadcrumb will be added here */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{user.name || user.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
```

**Step 4: Commit header**

```bash
git add src/components/admin/AdminHeader.tsx
git commit -m "feat: add admin header component"
```

**Step 5: Create admin layout**

```tsx
// src/app/admin/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

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
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Step 6: Commit layout**

```bash
git add src/app/admin/layout.tsx
git commit -m "feat: add admin layout with sidebar and header"
```

---

### Task 9: Create Dashboard Page

**Files:**
- Create: `src/app/admin/page.tsx`

**Step 1: Create dashboard page**

```tsx
// src/app/admin/page.tsx
import { getPartners, getProducts } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Building, Home } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const partners = await getPartners({ activeOnly: true });
  const products = await getProducts({ activeOnly: true });

  const commercialCount = products.filter((p) => p.category === "commercial").length;
  const subsidiCount = products.filter((p) => p.category === "subsidi").length;

  const stats = [
    {
      title: "Total Partners",
      value: partners.length,
      icon: Users,
      href: "/admin/partners",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Commercial",
      value: commercialCount,
      icon: Building,
      href: "/admin/products?category=commercial",
    },
    {
      title: "Subsidi",
      value: subsidiCount,
      icon: Home,
      href: "/admin/products?category=subsidi",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {partners.slice(0, 5).map((partner) => (
                <Link
                  key={partner.id}
                  href={`/admin/partners/${partner.id}`}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="font-medium">{partner.name}</span>
                  <span className="text-sm text-gray-500">
                    {partner.is_active ? "Active" : "Inactive"}
                  </span>
                </Link>
              ))}
              {partners.length === 0 && (
                <p className="text-gray-500 text-sm">No partners yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </span>
                </Link>
              ))}
              {products.length === 0 && (
                <p className="text-gray-500 text-sm">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link
            href="/admin/partners/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Partner
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/content/hero-slides"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Edit Hero
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add admin dashboard page"
```

---

## Phase 1 Complete Checkpoint

At this point, Phase 1 (Foundation) is complete. Verify by:

1. Run `npm run dev`
2. Visit `http://localhost:3000/admin` - should redirect to login
3. Login with `admin` / `admin123`
4. Should see dashboard with stats and sidebar

---

## Phase 2: Partners & Products CRUD

### Task 10: Create Partners List Page

**Files:**
- Create: `src/app/admin/partners/page.tsx`

**Step 1: Create partners list page**

```tsx
// src/app/admin/partners/page.tsx
import Link from "next/link";
import { getPartners } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PartnersListPage() {
  const partners = await getPartners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partners</h1>
        <Link href="/admin/partners/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell className="text-gray-500">{partner.slug}</TableCell>
                <TableCell>
                  {partner.is_featured ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <Star className="h-4 w-4 text-gray-300" />
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={partner.is_active ? "default" : "secondary"}>
                    {partner.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{partner.display_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/partners/${partner.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {partners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No partners found. Create your first partner.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/partners/page.tsx
git commit -m "feat: add partners list page"
```

---

### Task 11: Create Partner Form Page

**Files:**
- Create: `src/app/admin/partners/new/page.tsx`
- Create: `src/app/admin/partners/[id]/page.tsx`
- Create: `src/components/admin/PartnerForm.tsx`

**Step 1: Create PartnerForm component**

```tsx
// src/components/admin/PartnerForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Partner } from "@/lib/db";

interface PartnerFormProps {
  partner?: Partner;
  mode: "create" | "edit";
}

export default function PartnerForm({ partner, mode }: PartnerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: partner?.name || "",
    slug: partner?.slug || "",
    short_description: partner?.short_description || "",
    full_profile: partner?.full_profile || "",
    logo: partner?.logo || "",
    hero_image: partner?.hero_image || "",
    contact_phone: partner?.contact_phone || "",
    contact_email: partner?.contact_email || "",
    is_featured: partner?.is_featured === 1,
    is_active: partner?.is_active === 1 || mode === "create",
    display_order: partner?.display_order || 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: mode === "create" ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url = mode === "create" 
        ? "/api/admin/partners" 
        : `/api/admin/partners/${partner?.id}`;
      
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          is_featured: formData.is_featured ? 1 : 0,
          is_active: formData.is_active ? 1 : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save partner");
      }

      router.push("/admin/partners");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      short_description: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_profile">Full Profile</Label>
                <Textarea
                  id="full_profile"
                  value={formData.full_profile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      full_profile: e.target.value,
                    }))
                  }
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contact_phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contact_email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, logo: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_image">Hero Image URL</Label>
                <Input
                  id="hero_image"
                  value={formData.hero_image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hero_image: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_featured: checked }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Partner"
            ) : (
              "Update Partner"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
```

**Step 2: Commit form component**

```bash
git add src/components/admin/PartnerForm.tsx
git commit -m "feat: add partner form component"
```

**Step 3: Create new partner page**

```tsx
// src/app/admin/partners/new/page.tsx
import PartnerForm from "@/components/admin/PartnerForm";

export default function NewPartnerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Partner</h1>
      <PartnerForm mode="create" />
    </div>
  );
}
```

**Step 4: Create edit partner page**

```tsx
// src/app/admin/partners/[id]/page.tsx
import { notFound } from "next/navigation";
import { getPartnerById } from "@/lib/db";
import PartnerForm from "@/components/admin/PartnerForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPartnerPage({ params }: Props) {
  const { id } = await params;
  const partner = await getPartnerById(parseInt(id));

  if (!partner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Partner: {partner.name}</h1>
      <PartnerForm partner={partner} mode="edit" />
    </div>
  );
}
```

**Step 5: Commit pages**

```bash
git add src/app/admin/partners/new/page.tsx src/app/admin/partners/[id]/page.tsx
git commit -m "feat: add partner create and edit pages"
```

---

### Task 12: Create Partners API Routes

**Files:**
- Create: `src/app/api/admin/partners/route.ts`
- Create: `src/app/api/admin/partners/[id]/route.ts`

**Step 1: Create partners list/create API**

```typescript
// src/app/api/admin/partners/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPartners, createPartner } from "@/lib/db";

export async function GET() {
  try {
    const partners = await getPartners();
    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, slug, short_description, full_profile, logo, hero_image,
            contact_phone, contact_email, is_featured, is_active, display_order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const id = await createPartner({
      name,
      slug,
      short_description: short_description || null,
      full_profile: full_profile || null,
      logo: logo || null,
      hero_image: hero_image || null,
      contact_phone: contact_phone || null,
      contact_email: contact_email || null,
      is_featured: is_featured || 0,
      is_active: is_active ?? 1,
      display_order: display_order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}
```

**Step 2: Create partner detail API**

```typescript
// src/app/api/admin/partners/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPartnerById, updatePartner, deletePartner } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const partner = await getPartnerById(parseInt(id));

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const partner = await getPartnerById(parseInt(id));
    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    await updatePartner(parseInt(id), body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await deletePartner(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    );
  }
}
```

**Step 3: Commit API routes**

```bash
git add src/app/api/admin/partners/route.ts src/app/api/admin/partners/[id]/route.ts
git commit -m "feat: add partners CRUD API routes"
```

---

### Task 13: Create Products List Page

**Files:**
- Create: `src/app/admin/products/page.tsx`

**Step 1: Create products list page**

```tsx
// src/app/admin/products/page.tsx
import Link from "next/link";
import { getProducts, getPartners } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsListPage() {
  const products = await getProducts();
  const partners = await getPartners();

  const partnerMap = new Map(partners.map((p) => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{partnerMap.get(product.partner_id) || "-"}</TableCell>
                <TableCell>
                  <Badge variant={product.category === "commercial" ? "default" : "secondary"}>
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? "default" : "outline"}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{product.display_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No products found. Create your first product.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/products/page.tsx
git commit -m "feat: add products list page"
```

---

### Task 14: Create Product Form and Pages

**Files:**
- Create: `src/components/admin/ProductForm.tsx`
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/page.tsx`

**Step 1: Create ProductForm component**

```tsx
// src/components/admin/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Product, Partner } from "@/lib/db";

interface ProductFormProps {
  product?: Product;
  partners: Partner[];
  mode: "create" | "edit";
}

export default function ProductForm({ product, partners, mode }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    partner_id: product?.partner_id || 0,
    name: product?.name || "",
    slug: product?.slug || "",
    category: product?.category || "commercial",
    location: product?.location || "",
    description: product?.description || "",
    main_image: product?.main_image || "",
    is_active: product?.is_active === 1 || mode === "create",
    display_order: product?.display_order || 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url = mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${product?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          is_active: formData.is_active ? 1 : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partner_id">Partner *</Label>
                <Select
                  value={formData.partner_id.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, partner_id: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id.toString()}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name,
                        slug: mode === "create" ? generateSlug(name) : prev.slug,
                      }));
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: value as "commercial" | "subsidi",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="subsidi">Subsidi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, location: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="main_image">Main Image URL</Label>
                <Input
                  id="main_image"
                  value={formData.main_image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, main_image: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Product"
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
```

**Step 2: Commit form**

```bash
git add src/components/admin/ProductForm.tsx
git commit -m "feat: add product form component"
```

**Step 3: Create new/edit pages**

```tsx
// src/app/admin/products/new/page.tsx
import { getPartners } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const partners = await getPartners({ activeOnly: true });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Product</h1>
      <ProductForm partners={partners} mode="create" />
    </div>
  );
}
```

```tsx
// src/app/admin/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProductById, getPartners } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(parseInt(id));
  const partners = await getPartners({ activeOnly: true });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product: {product.name}</h1>
      <ProductForm product={product} partners={partners} mode="edit" />
    </div>
  );
}
```

**Step 4: Commit pages**

```bash
git add src/app/admin/products/new/page.tsx src/app/admin/products/[id]/page.tsx
git commit -m "feat: add product create and edit pages"
```

---

### Task 15: Create Products API Routes

**Files:**
- Create: `src/app/api/admin/products/route.ts`
- Create: `src/app/api/admin/products/[id]/route.ts`

**Step 1: Create products API (similar structure to partners)**

```typescript
// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partner_id, name, slug, category, location, description,
            main_image, is_active, display_order } = body;

    if (!partner_id || !name || !slug || !category) {
      return NextResponse.json(
        { error: "Partner, name, slug, and category are required" },
        { status: 400 }
      );
    }

    const id = await createProduct({
      partner_id,
      name,
      slug,
      category,
      location: location || null,
      description: description || null,
      main_image: main_image || null,
      is_active: is_active ?? 1,
      display_order: display_order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
```

```typescript
// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const product = await getProductById(parseInt(id));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await getProductById(parseInt(id));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await updateProduct(parseInt(id), body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await deleteProduct(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/admin/products/route.ts src/app/api/admin/products/[id]/route.ts
git commit -m "feat: add products CRUD API routes"
```

---

## Phase 2 Complete Checkpoint

At this point, Phase 2 (Partners & Products) is complete. Verify by:

1. Run `npm run dev`
2. Login to admin panel
3. Create, edit, and view partners
4. Create, edit, and view products
5. Verify data persists in database

---

## Summary

This implementation plan covers:

- **Phase 1 (Tasks 1-9)**: Auth system, admin layout, dashboard
- **Phase 2 (Tasks 10-15)**: Partners & Products CRUD

**Remaining phases (to be planned separately):**
- **Phase 3**: Content Management (Hero Slides, Page Sections, CTA)
- **Phase 4**: Settings (Site, Company, Navigation, Social)

---

**Plan complete and saved to `docs/plans/2026-01-30-admin-panel-implementation.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
