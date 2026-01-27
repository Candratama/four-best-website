"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Mobile breakpoint matching the template CSS (max-width: 992px)
const MOBILE_BREAKPOINT = 992;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmaller, setIsSmaller] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Check if a menu item is active (only after mounted to prevent hydration mismatch)
  const isActive = (href: string) => {
    if (!mounted) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Handle scroll behavior for "smaller" class and viewport resize for mobile detection
  useEffect(() => {
    // Set mounted flag to prevent hydration mismatch
    setMounted(true);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setIsSmaller(true);
      } else {
        setIsSmaller(false);
      }
    };

    const handleResize = () => {
      const newIsMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(newIsMobile);
      // Close mobile menu when resizing to desktop
      if (!newIsMobile) {
        setMobileMenuOpen(false);
        document.body.style.overflow = "";
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    // Lock body scroll when menu is open (matching template behavior)
    if (newState) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  };

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  // Build header class with mobile state
  const headerClass = mounted
    ? `transparent logo-center ${isSmaller ? "smaller" : ""} ${
        isMobile ? "header-mobile" : ""
      } ${mobileMenuOpen ? "menu-open" : ""}`
    : "transparent logo-center";

  // Header style - no dynamic height needed, CSS handles fullscreen
  const headerStyle = { height: "auto" };

  return (
    <>
      {/* Full screen overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: '#162d50',
            zIndex: 9998,
          }}
        />
      )}
      <header className={headerClass} style={headerStyle}>
        <div className={`navbar-container transition-all duration-500 ${isSmaller ? "navbar-scrolled" : ""} ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
          <div className="container-fluid px-lg-5 px-3">
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
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`menu-item ${
                            isActive("/partners") ? "active" : ""
                          }`}
                          href="/partners"
                          onClick={closeMobileMenu}
                        >
                          Partners
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`menu-item ${
                            isActive("/about") ? "active" : ""
                          }`}
                          href="/about"
                          onClick={closeMobileMenu}
                        >
                          About
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`menu-item ${
                            isActive("/contact") ? "active" : ""
                          }`}
                          href="/contact"
                          onClick={closeMobileMenu}
                        >
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Center Logo */}
                  <div className="col-center">
                    <Link href="/" onClick={closeMobileMenu}>
                      <Image
                        src="/logo.svg"
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
                        data-hover="Schedule a Visit"
                        onClick={closeMobileMenu}
                      >
                        <span>Schedule a Visit</span>
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
