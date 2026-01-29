"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
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
                      <li>
                        <Link
                          className={`menu-item ${isActive("/") ? "active" : ""}`}
                          href="/"
                          onClick={closeMobileMenu}
                        >
                          Beranda
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`menu-item ${isActive("/partners") ? "active" : ""}`}
                          href="/partners"
                          onClick={closeMobileMenu}
                        >
                          Partner
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`menu-item ${isActive("/about") ? "active" : ""}`}
                          href="/about"
                          onClick={closeMobileMenu}
                        >
                          Tentang
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`menu-item ${isActive("/contact") ? "active" : ""}`}
                          href="/contact"
                          onClick={closeMobileMenu}
                        >
                          Kontak
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Center Logo */}
                  <div className="col-center">
                    <Link href="/" onClick={closeMobileMenu}>
                      <Image
                        src="https://cdn.4best.id/branding/logo.svg"
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
                        data-hover="Jadwalkan Kunjungan"
                        onClick={closeMobileMenu}
                      >
                        <span>Jadwalkan Kunjungan</span>
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
