/**
 * Swiper configuration utilities
 * Provides pre-configured Swiper options matching the original template
 * 
 * Requirements: 2.1
 */

import type { SwiperOptions } from 'swiper/types';

/**
 * Hero slider configuration
 * Matches the template's custom-swiper-1.js configuration
 * Used for the main hero section with fade effect
 */
export const heroSwiperConfig: SwiperOptions = {
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  loop: true,
  spaceBetween: 30,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
};

/**
 * Gallery slider configuration
 * For image galleries with multiple visible slides
 */
export const gallerySwiperConfig: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
};

/**
 * Testimonial slider configuration
 * For testimonial carousels with centered slides
 */
export const testimonialSwiperConfig: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 30,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 3,
      centeredSlides: true,
    },
  },
};

/**
 * Room/Partner carousel configuration
 * For showcasing rooms or partners in a carousel
 */
export const roomCarouselConfig: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 25,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 4,
    },
  },
};

/**
 * Single slide configuration
 * For simple single-slide carousels with dots
 */
export const singleSlideConfig: SwiperOptions = {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
};

/**
 * Partner logos carousel configuration
 * For displaying partner/sponsor logos
 */
export const logoCarouselConfig: SwiperOptions = {
  slidesPerView: 3,
  spaceBetween: 40,
  loop: true,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  breakpoints: {
    640: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 6,
    },
  },
};

/**
 * Helper function to merge custom options with base config
 * @param baseConfig - Base Swiper configuration
 * @param customOptions - Custom options to merge
 */
export function mergeConfig(
  baseConfig: SwiperOptions,
  customOptions: Partial<SwiperOptions>
): SwiperOptions {
  return {
    ...baseConfig,
    ...customOptions,
    // Deep merge for nested objects
    autoplay: customOptions.autoplay === false 
      ? false 
      : {
          ...(typeof baseConfig.autoplay === 'object' ? baseConfig.autoplay : {}),
          ...(typeof customOptions.autoplay === 'object' ? customOptions.autoplay : {}),
        },
    navigation: {
      ...(typeof baseConfig.navigation === 'object' ? baseConfig.navigation : {}),
      ...(typeof customOptions.navigation === 'object' ? customOptions.navigation : {}),
    },
    pagination: {
      ...(typeof baseConfig.pagination === 'object' ? baseConfig.pagination : {}),
      ...(typeof customOptions.pagination === 'object' ? customOptions.pagination : {}),
    },
    breakpoints: {
      ...baseConfig.breakpoints,
      ...customOptions.breakpoints,
    },
  };
}

/**
 * CSS modules required for Swiper
 * Import these in your component
 */
export const swiperModules = {
  navigation: 'swiper/modules',
  pagination: 'swiper/modules',
  autoplay: 'swiper/modules',
  effectFade: 'swiper/modules',
};
