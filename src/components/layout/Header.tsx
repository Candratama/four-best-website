"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmaller, setIsSmaller] = useState(false);
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

  // Handle scroll behavior for "smaller" class
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Prevent hydration mismatch by not rendering dynamic classes until mounted
  const headerClass = mounted
    ? `transparent logo-center ${isSmaller ? "smaller" : ""} ${
        mobileMenuOpen ? "menu-open" : ""
      }`
    : "transparent logo-center";

  return (
    <header className={headerClass}>
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
                    src="/images/logo.webp"
                    alt="4best Logo"
                    width={150}
                    height={50}
                    priority
                  />
                </Link>
              </div>

              {/* Right Side - CTA and Menu Button */}
              <div className="col-end">
                <div className="menu_side_area">
                  <Link
                    href="/contact"
                    className="btn-main btn-line bg-blur fx-slide sm-hide"
                    data-hover="Schedule a Visit"
                    onClick={closeMobileMenu}
                  >
                    <span>Schedule a Visit</span>
                  </Link>
                  <span
                    id="menu-btn"
                    className={mobileMenuOpen ? "menu-open" : ""}
                    onClick={toggleMobileMenu}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
