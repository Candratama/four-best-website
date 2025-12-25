"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const scrollTrigger = 100;

    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // Show/hide based on scroll position
      if (scrollTop > scrollTrigger) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if we're in a dark section
      const darkSections = document.querySelectorAll(".section-dark");
      const windowHeight = window.innerHeight;
      const scrollPosition = scrollTop + windowHeight / 2;

      let inDarkSection = false;
      darkSections.forEach((section) => {
        const element = section as HTMLElement;
        const elementTop = element.offsetTop;
        const elementBottom = element.offsetHeight + elementTop;

        if (scrollPosition > elementTop && scrollPosition < elementBottom) {
          inDarkSection = true;
        }
      });

      setIsDark(inDarkSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="float-text show-on-scroll hide">
        <span>
          <a href="#">Scroll to top</a>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`float-text show-on-scroll ${isVisible ? "show" : "hide"} ${
        isDark ? "dark" : ""
      }`}
    >
      <span>
        <a href="#" onClick={scrollToTop}>
          Scroll to top
        </a>
      </span>
    </div>
  );
}
