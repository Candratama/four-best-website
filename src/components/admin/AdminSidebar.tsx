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
