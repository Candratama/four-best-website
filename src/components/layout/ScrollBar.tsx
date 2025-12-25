"use client";

import { useEffect, useState } from "react";

export default function ScrollBar() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const scrollTrigger = 100;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);

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

  // Don't render dynamic content until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className="scrollbar-v show-on-scroll hide"
        style={{ height: "0px" }}
      />
    );
  }

  return (
    <div
      className={`scrollbar-v show-on-scroll ${isVisible ? "show" : "hide"} ${
        isDark ? "dark" : ""
      }`}
      style={{ height: `${scrollProgress}px` }}
    />
  );
}
