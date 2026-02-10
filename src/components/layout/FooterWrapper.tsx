"use client";

import { usePathname } from "next/navigation";

interface FooterWrapperProps {
  children: React.ReactNode;
}

export default function FooterWrapper({ children }: FooterWrapperProps) {
  const pathname = usePathname();

  // Don't render footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <>{children}</>;
}
