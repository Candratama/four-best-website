# Micro Animation Design - Four Best Website

**Date:** 2026-01-29
**Status:** Draft
**Author:** Brainstorming Session

---

## Overview

### Tujuan
Menambahkan micro animation komprehensif untuk:
1. **Polish & Delight** - Website terasa lebih premium dan engaging
2. **Guide Attention** - Membantu user fokus ke elemen penting
3. **Feedback** - Respons visual saat interaksi
4. **Branding** - Identitas visual yang memorable

### Keputusan Teknis

| Aspek | Keputusan |
|-------|-----------|
| **Library** | Framer Motion (konsolidasi, hapus WOW.js) |
| **Personality** | Subtle & Professional |
| **Timing Range** | 150-500ms |
| **Easing** | Smooth, minimal bounce |

---

## Animation Configuration

### Timing Constants
```typescript
// src/lib/animation-config.ts
export const timing = {
  instant: 150,    // micro feedback (click, toggle)
  fast: 250,       // hover states
  normal: 350,     // reveals, transitions
  slow: 500,       // page transitions
}
```

### Easing Presets
```typescript
export const easing = {
  smooth: [0.4, 0, 0.2, 1],      // standard - most animations
  decelerate: [0, 0, 0.2, 1],    // entering elements
  accelerate: [0.4, 0, 1, 1],    // exiting elements
}
```

---

## Category 1: Scroll Reveal Animations

### Existing (Keep & Enhance)
- `useWow` hook di `src/hooks/useWow.ts`
- 7 animasi dasar: fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn, zoomIn, fadeIn

### New Features

#### 1.1 Stagger Animation untuk List/Grid
```typescript
// Penggunaan
<motion.div variants={staggerContainer(0.1)}>
  {items.map((item, i) => (
    <motion.div key={item.id} variants={fadeInUp}>
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

**Komponen yang akan di-update:**
- `ProductGrid` - stagger untuk product cards
- `PartnerLogos` - stagger untuk logo grid
- `TeamSection` - stagger untuk team members
- `Stats` - number counting + reveal

#### 1.2 Contextual Reveal Directions
- Items di kiri viewport → fadeInLeft
- Items di kanan viewport → fadeInRight
- Alternating pattern untuk visual interest

---

## Category 2: Hover & Interactive States

### 2.1 AnimatedButton
**File:** `src/components/ui/AnimatedButton.tsx`

```typescript
// Effects
whileHover: { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }
whileTap: { scale: 0.98 }
transition: { duration: 0.25 }
```

**Variants:**
- `primary` - main CTA buttons
- `secondary` - outline buttons
- `ghost` - text-only buttons

### 2.2 AnimatedCard
**File:** `src/components/ui/AnimatedCard.tsx`

```typescript
// Effects
whileHover: { y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }
transition: { duration: 0.25 }

// Optional: image zoom
<motion.img whileHover={{ scale: 1.05 }} />
```

### 2.3 AnimatedLink
**File:** `src/components/ui/AnimatedLink.tsx`

```typescript
// Underline animation
// Pseudo-element width: 0% → 100% on hover
// Direction: left to right
```

### 2.4 Icon Hover States
- Social icons: rotate subtle (15deg)
- Action icons: scale 1.1
- Color transition: 250ms smooth

---

## Category 3: Page Transitions

### 3.1 PageTransition Wrapper
**File:** `src/components/ui/PageTransition.tsx`

```typescript
// Enter animation
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: easing.decelerate }

// Exit animation
exit: { opacity: 0 }
transition: { duration: 0.2, ease: easing.accelerate }
```

**Integration:** Wrap di `src/app/layout.tsx`

### 3.2 AnimatedSkeleton
**File:** `src/components/ui/AnimatedSkeleton.tsx`

```typescript
// Variants
variant: "card" | "text" | "image" | "avatar"

// Shimmer effect
background: linear-gradient moving animation
```

---

## Category 4: Feedback Animations

### 4.1 Form Feedback
**File:** `src/components/ui/AnimatedFeedback.tsx`

```typescript
// Success
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
// Green checkmark icon dengan subtle bounce

// Error
animate: { x: [-4, 4, -4, 0] } // shake
// Red icon
```

### 4.2 Toast Notifications
**File:** `src/components/ui/Toast.tsx`

```typescript
// Enter
initial: { opacity: 0, x: 100 }
animate: { opacity: 1, x: 0 }
transition: { duration: 0.3 }

// Exit
exit: { opacity: 0, x: 100 }
transition: { duration: 0.2 }

// Features
- Auto-dismiss dengan progress bar
- Position: bottom-right
- Types: success, error, warning, info
```

### 4.3 Loading States

**LoadingDots:**
```typescript
// 3 dots dengan stagger bounce
// Interval: 0.15s between dots
```

**Button Loading:**
```typescript
// Disable state + opacity 0.7
// Spinner replace/beside text
```

### 4.4 Input Validation
**File:** `src/components/ui/AnimatedInput.tsx`

```typescript
// Error state
border: red + shake subtle
error message: fade in

// Success state
border: green + checkmark fade in

// Focus state
border color transition: 250ms
```

---

## Category 5: Attention Grabbers

### 5.1 CTA Button Pulse
```typescript
// Subtle box-shadow pulse
animate: {
  boxShadow: [
    "0 0 0 0 rgba(primary, 0.4)",
    "0 0 0 8px rgba(primary, 0)",
  ]
}
transition: { duration: 1.5, repeat: Infinity, repeatDelay: 3 }

// Stop on hover (user sudah notice)
```

### 5.2 AnimatedCounter
**File:** `src/components/ui/AnimatedCounter.tsx`

```typescript
interface Props {
  from?: number;      // default: 0
  to: number;
  suffix?: string;    // e.g., "+", "%"
  duration?: number;  // default: 2
}

// Trigger saat masuk viewport
// Easing: decelerate (cepat di awal, pelan di akhir)
```

### 5.3 FloatingBadge
**File:** `src/components/ui/FloatingBadge.tsx`

```typescript
// Subtle float animation
animate: { y: [-3, 3, -3] }
transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }

// Variants
variant: "new" | "promo" | "sale"
```

### 5.4 AnimatedIcon
**File:** `src/components/ui/AnimatedIcon.tsx`

```typescript
// Animation types
animation: "nudge" | "ring" | "bounce" | "pulse"

// nudge: x movement untuk arrows
// ring: rotate untuk phone/bell icons
// bounce: y movement
// pulse: scale
```

---

## Migration Plan

### Phase 1: Setup & Config
1. Create `src/lib/animation-config.ts`
2. Create `src/lib/motion-components.ts` (pre-configured motion components)
3. Extend `src/lib/animations.ts` dengan stagger utilities

### Phase 2: Remove WOW.js
1. Update `src/app/not-found.tsx` - ganti WOW.js dengan useWow
2. Update `src/app/partners/[slug]/PartnerDetailsClient.tsx` - ganti WOW.js dengan useWow
3. Remove `wowjs` dari dependencies
4. Remove `src/types/wowjs.d.ts`

### Phase 3: Core Components
1. Create `AnimatedButton`
2. Create `AnimatedCard`
3. Create `AnimatedLink`
4. Create `PageTransition`

### Phase 4: Feedback Components
1. Create `Toast` system
2. Create `AnimatedInput`
3. Create `AnimatedFeedback`
4. Create `LoadingDots`

### Phase 5: Attention Components
1. Create `AnimatedCounter`
2. Create `FloatingBadge`
3. Create `AnimatedIcon`
4. Add pulse variant to `AnimatedButton`

### Phase 6: Integration
1. Update existing buttons dengan `AnimatedButton`
2. Update existing cards dengan `AnimatedCard`
3. Add `PageTransition` ke `layout.tsx`
4. Update Stats section dengan `AnimatedCounter`

---

## File Structure

```
src/
├── lib/
│   ├── animations.ts          # EXTEND - add stagger utilities
│   ├── animation-config.ts    # NEW - timing/easing constants
│   └── motion-components.ts   # NEW - pre-configured components
│
├── hooks/
│   ├── useWow.ts              # KEEP - scroll reveal
│   ├── useHover.ts            # NEW - hover state logic
│   └── usePageTransition.ts   # NEW - page transition logic
│
└── components/ui/
    ├── AnimatedButton.tsx     # NEW
    ├── AnimatedCard.tsx       # NEW
    ├── AnimatedLink.tsx       # NEW
    ├── AnimatedInput.tsx      # NEW
    ├── AnimatedCounter.tsx    # NEW
    ├── AnimatedIcon.tsx       # NEW
    ├── AnimatedFeedback.tsx   # NEW
    ├── FloatingBadge.tsx      # NEW
    ├── PageTransition.tsx     # NEW
    ├── Toast.tsx              # NEW
    ├── LoadingDots.tsx        # NEW
    └── AnimatedSkeleton.tsx   # NEW
```

---

## Performance Considerations

1. **Reduce Motion Support**
   - Respect `prefers-reduced-motion` media query
   - Disable/simplify animations for users who prefer reduced motion

2. **GPU Acceleration**
   - Use `transform` and `opacity` for animations (GPU-accelerated)
   - Avoid animating `width`, `height`, `top`, `left`

3. **Lazy Loading**
   - Only initialize animations when component mounts
   - Use `useInView` untuk trigger animations saat visible

4. **Bundle Size**
   - Framer Motion tree-shakeable
   - Only import what's needed

---

## Success Metrics

- [ ] All WOW.js references removed
- [ ] Consistent animation timing across site
- [ ] No layout shift dari animations
- [ ] Smooth 60fps animations
- [ ] Reduced motion support implemented
- [ ] All interactive elements have hover feedback
