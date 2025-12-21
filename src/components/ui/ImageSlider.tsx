'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Slide {
  image: string;
  alt?: string;
}

interface ImageSliderProps {
  slides: Slide[];
  className?: string;
  autoplay?: boolean;
  effect?: 'slide' | 'fade';
  overlay?: boolean;
  height?: string;
}

export default function ImageSlider({
  slides,
  className = '',
  autoplay = true,
  effect = 'fade',
  overlay = true,
  height = 'h-screen',
}: ImageSliderProps) {
  return (
    <div className={`relative ${height} ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
        effect={effect}
        loop
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.alt || `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {overlay && (
                <div className="absolute inset-0 bg-black/40" />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
