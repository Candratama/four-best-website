"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  HelpCircle,
  ChevronRight,
  Building2,
  Palette,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  children?: { label: string; href: string }[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Ringkasan",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
      },
      {
        label: "Pesan Masuk",
        icon: Mail,
        href: "/admin/submissions",
      },
    ],
  },
  {
    title: "Manajemen Konten",
    items: [
      {
        label: "Partner",
        icon: Users,
        href: "/admin/partners",
      },
      {
        label: "Perumahan",
        icon: Package,
        href: "/admin/products",
      },
      {
        label: "Konten",
        icon: FileText,
        href: "/admin/content",
        children: [
          { label: "Beranda", href: "/admin/content/beranda" },
          { label: "Partner", href: "/admin/content/partner" },
          { label: "Tentang", href: "/admin/content/tentang" },
          { label: "Kontak", href: "/admin/content/kontak" },
          { label: "Bagian CTA", href: "/admin/content/cta" },
        ],
      },
    ],
  },
  {
    title: "Pengaturan",
    items: [
      {
        label: "Pengaturan Situs",
        icon: Palette,
        href: "/admin/settings/site",
      },
      {
        label: "Info Perusahaan",
        icon: Building2,
        href: "/admin/settings/company",
      },
    ],
  },
];

const footerItems: NavItem[] = [
  { label: "Pusat Bantuan", icon: HelpCircle, href: "/admin/help" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <Sidebar className="border-r">
      <div className="h-16 flex items-center justify-center px-4 border-b shrink-0">
        <Link href="/admin" className="flex items-center">
          <Image
            src="https://cdn.4best.id/branding/logo.svg"
            alt="4best Admin"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) =>
                  item.children ? (
                    <SidebarMenuItem key={item.label}>
                      <Collapsible
                        defaultOpen={isActive(item.href)}
                        className="group/collapsible w-full"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.label}
                            isActive={isActive(item.href)}
                          >
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === child.href}
                                >
                                  <Link href={child.href}>{child.label}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={isActive(item.href)}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {footerItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
