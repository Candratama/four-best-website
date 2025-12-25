"use client";

import { useState, useEffect, useCallback } from "react";

export interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const handlePrevious = useCallback(() => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrevious, handleNext]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl z-10"
        onClick={onClose}
      >
        ×
      </button>

      <button
        className="absolute left-4 text-white text-4xl z-10"
        onClick={(e) => {
          e.stopPropagation();
          handlePrevious();
        }}
      >
        ‹
      </button>

      <div
        className="max-w-4xl max-h-screen p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt=""
          className="max-w-full max-h-screen object-contain"
        />
      </div>

      <button
        className="absolute right-4 text-white text-4xl z-10"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
      >
        ›
      </button>
    </div>
  );
}
