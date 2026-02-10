"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface NavigationItem {
  id: number;
  label: string;
  href: string;
  display_order: number;
}

interface HeaderProps {
  navigationItems?: NavigationItem[];
  logo?: string;
}

export default function Header({ 
  navigationItems = [
    { id: 1, label: "Beranda", href: "/", display_order: 1 },
    { id: 2, label: "Partner", href: "/partners", display_order: 2 },
    { id: 3, label: "Tentang", href: "/about", display_order: 3 },
    { id: 4, label: "Kontak", href: "/contact", display_order: 4 },
  ],
  logo = "https://cdn.4best.id/branding/logo.svg"
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmaller, setIsSmaller] = useState(false);
  const pathname = usePathname();

  // Check if a menu item is active
  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(href);
    },
    [pathname],
  );

  // Handle scroll behavior for "smaller" class
  useEffect(() => {
    const handleScroll = () => {
      setIsSmaller(window.scrollY > 50);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => {
      const newState = !prev;
      if (newState) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
      return newState;
    });
  }, []);

  // Close mobile menu when clicking a link
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  // Don't render header on admin pages (must be after all hooks)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Simple header class - mobile detection via CSS media queries
  const headerClass = `transparent logo-center header-mobile ${isSmaller ? "smaller" : ""} ${mobileMenuOpen ? "menu-open" : ""}`;

  return (
    <>
      {/* Full screen overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
        aria-hidden="true"
      />
      <header className={headerClass}>
        <div
          className={`navbar-container ${isSmaller ? "navbar-scrolled" : ""} ${mobileMenuOpen ? "mobile-menu-open" : ""}`}
        >
          <div className="container-fluid px-lg-5 px-8">
            <div className="row">
              <div className="col-lg-12">
                <div className="de-flex">
                  {/* Left Navigation */}
                  <div className="col-start">
                    <ul id="mainmenu">
                      {navigationItems.map((item) => (
                        <li key={item.id}>
                          <Link
                            className={`menu-item ${isActive(item.href) ? "active" : ""}`}
                            href={item.href}
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Center Logo */}
                  <div className="col-center">
                    <Link href="/" onClick={closeMobileMenu}>
                      <Image
                        src={logo}
                        alt="4best Logo"
                        width={150}
                        height={50}
                        priority
                        className="logo-white"
                      />
                    </Link>
                  </div>

                  {/* Right Side - CTA and Menu Button */}
                  <div className="col-end">
                    <div className="menu_side_area">
                      <Link
                        href="/contact"
                        className="btn-main btn-line fx-slide sm-hide"
                        data-hover="Hubungi Kami"
                        onClick={closeMobileMenu}
                      >
                        <span>Hubungi Kami</span>
                      </Link>
                      <span
                        id="menu-btn"
                        className={mobileMenuOpen ? "menu-open" : ""}
                        onClick={toggleMobileMenu}
                        role="button"
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileMenuOpen}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
