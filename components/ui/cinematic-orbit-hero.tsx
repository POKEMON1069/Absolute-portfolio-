"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const IMG_BASE =
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/stack-spread";

const IMAGES = [
  { src: `${IMG_BASE}/img8.png`, alt: "Plane" },
  { src: `${IMG_BASE}/img2.png`, alt: "Painting" },
  { src: `${IMG_BASE}/img7.png`, alt: "Breaker" },
  { src: `${IMG_BASE}/img3.png`, alt: "Dog" },
  { src: `${IMG_BASE}/img5.png`, alt: "Footballer" },
  { src: `${IMG_BASE}/img6.png`, alt: "Jacket" },
  { src: `${IMG_BASE}/img1.png`, alt: "Meadow" },
  { src: `${IMG_BASE}/img4.png`, alt: "Stripes" },
];

// Dynamically generate a 3D Elliptical Orbit
const generateOrbitCards = () => {
  const radiusX = 42; // Wide X spread (vw)
  const radiusY = 15; // Flattened Y spread for 3D effect (vh)
  const total = IMAGES.length;

  return IMAGES.map((item, i) => {
    // Spread evenly across a circle
    const angle = (i * (Math.PI * 2)) / total;
    
    // Elliptical coordinates
    const x = Math.cos(angle - Math.PI / 2) * radiusX;
    const y = Math.sin(angle - Math.PI / 2) * radiusY;
    
    // Depth perception calculation:
    // Cards at the "bottom" of the ellipse (y > 0) are "closer" -> scale up
    // Cards at the "top" of the ellipse (y < 0) are "farther" -> scale down
    const depthScale = Math.sin(angle - Math.PI / 2); // Ranges from -1 to 1
    const targetScale = 0.8 + (depthScale * 0.25); // Scales between 0.55 and 1.05

    // Z-Index must match depth so front cards overlap back cards perfectly
    const calculatedZIndex = Math.round((depthScale + 1) * 100);

    // Subtle rotation leaning outward from the center
    const rotate = (Math.cos(angle - Math.PI / 2) * 15);

    return {
      item,
      // Stack offsets
      linearOffset: { x: (i - total / 2) * 4, y: (i - total / 2) * 3 },
      linearRotate: (i - total / 2) * 3,
      
      target: { x, y: y + 8, rotate, scale: targetScale, w: 15, h: 22 }, // Added Y offset to move it below text
      targetSm: { 
        x: x * 0.7, 
        y: (y * 1.5) + 10, 
        rotate, 
        scale: targetScale, 
        w: 32, 
        h: 24 
      },
      z: calculatedZIndex,
    };
  });
};

const CARDS = generateOrbitCards();

// Slightly heavier mass for a more cinematic, weighty feel
const SPRING_CONFIG = { stiffness: 40, damping: 25, mass: 1 };
const PROGRESS_SPRING = { stiffness: 60, damping: 30, restDelta: 0.001 };

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled || !active) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, enabled, rawX, rawY]);

  return { x, y };
}

function Card({ card, progress, pointer, isSpreadActive, isMobile }: any) {
  const { item, linearOffset, linearRotate, z } = card;
  const activeTarget = isMobile ? card.targetSm : card.target;
  
  // Parallax is stronger for cards that are "closer" (higher Z index)
  const depthFactor = 0.2 + (z / 200); 

  const translate = useTransform(
    [progress, pointer.x, pointer.y],
    ([p, px, py]: number[]) => {
      const easeP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const tx = linearOffset.x + (activeTarget.x - linearOffset.x) * easeP;
      const ty = linearOffset.y + (activeTarget.y - linearOffset.y) * easeP;

      const dx = tx - px * 5 * depthFactor * p;
      const dy = ty - py * 5 * depthFactor * p;
      return `calc(-50% + ${dx}vw) calc(-50% + ${dy}vh)`;
    }
  );

  const rotate = useTransform(progress, [0, 1], [linearRotate, activeTarget.rotate]);
  const scale = useTransform(progress, [0, 1], [0.6, activeTarget.scale]); // Starts smaller for dramatic pop

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform cursor-pointer"
      style={{
        width: `${activeTarget.w}vw`,
        height: `${activeTarget.h}vh`,
        zIndex: z, // Dynamic z-index for depth perception
        translate,
        rotate,
        scale,
      }}
      whileHover={
        isSpreadActive
          ? { scale: activeTarget.scale * 1.15, zIndex: 999, transition: SPRING_CONFIG }
          : undefined
      }
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl shadow-black/10 ring-1 ring-black/5 dark:shadow-black/40 dark:ring-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 dark:hover:shadow-black/80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5 dark:to-white/10 opacity-70 z-10" />
        <img
          src={item.src}
          alt={item.alt}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>
    </motion.div>
  );
}

export default function CinematicOrbitHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, PROGRESS_SPRING);
  const progress = useTransform(smoothProgress, [0.1, 0.9], [0, 1]);

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setSpread(p > 0.95));

  const pointer = usePointerParallax(spread, !reduce);
  const textScale = useTransform(progress, [0, 1], [0.85, 1]);
  const textOpacity = useTransform(progress, [0.2, 0.8], [0, 1]);

  return (
    <section ref={wrapRef} className="relative w-full h-[350vh] bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        
        <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60 dark:opacity-30 blur-[100px] md:blur-[120px]" style={{ scale: textScale }}>
          <div className="w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] rounded-full bg-rose-300/40 dark:bg-rose-500/20 mix-blend-multiply dark:mix-blend-screen" />
        </motion.div>

        <motion.div className="pointer-events-none z-[5] flex flex-col items-center text-center px-6 mt-[-10vh]" style={{ opacity: textOpacity, scale: textScale }}>
          <h2 className="text-4xl md:text-[6vw] font-medium tracking-tighter">Cinematic Depth.</h2>
          <p className="mt-4 max-w-[50ch] text-sm md:text-[1.2vw] font-light opacity-80 dark:opacity-60">
            Trigonometric scaling creates the illusion of 3D space. Watch the cards cycle foreground to background.
          </p>
        </motion.div>

        <div className="absolute inset-0 z-10">
          {CARDS.map((card, i) => (
            <Card key={i} card={card} progress={progress} pointer={pointer} isSpreadActive={spread} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}
