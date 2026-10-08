---
name: motion-dev
description: >-
  Build smooth, high-performance web animations and interactive 3D website experiences
  using Motion (motion.dev, formerly Framer Motion), 3D CSS transforms, and WebGL / Three.js
  / React Three Fiber. Use when creating UI animations, micro-interactions, scroll-driven
  storytelling, 3D card tilt effects, particle systems, or 3D scene choreographies.
---

# Motion.dev & 3D Web Development Skill

This skill guides you through implementing state-of-the-art animations, physics-based interactions, and immersive 3D website experiences using **Motion** (`motion.dev` / `framer-motion`) and modern 3D web technologies (CSS 3D, Three.js, React Three Fiber).

---

## 1. Quick Reference: Motion Ecosystem

Motion is the modern successor to Framer Motion, supporting both React and framework-agnostic JavaScript/TypeScript via the Web Animations API (WAAPI) and hardware-accelerated transforms.

### Imports
```typescript
// React component syntax (motion.dev & framer-motion)
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
// or from "motion/react"
import { motion, AnimatePresence } from "motion/react";

// Vanilla JS / micro-library syntax (motion)
import { animate, scroll, inView, timeline, stagger } from "motion";
```

---

## 2. Core Animation Principles for High-End Web Design

1. **Hardware Acceleration Only**: Always animate `transform` (`x`, `y`, `z`, `scale`, `rotateX`, `rotateY`, `rotateZ`) and `opacity`. Avoid animating `width`, `height`, `top`, or `margin` to prevent layout thrashing and maintain 60–120 FPS.
2. **Spring Physics over Linear Durations**: Natural motion uses spring physics with stiffness and damping:
   ```typescript
   transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
   ```
3. **Accessibility**: Always respect user motion preferences:
   ```typescript
   import { useReducedMotion } from "framer-motion";
   const shouldReduceMotion = useReducedMotion();
   ```

---

## 3. 3D Web Techniques with CSS & Motion

You can achieve cinematic 3D effects purely with CSS 3D transforms without the heavy bundle size of WebGL when doing card tilts, floating perspective layers, and isometric showcase grids.

### A. Perspective & 3D Preserve Context
Always set `perspective` on the parent container and `transformStyle: "preserve-3d"` on the animated element:

```tsx
<div style={{ perspective: 1000 }} className="relative">
  <motion.div
    style={{ transformStyle: "preserve-3d" }}
    whileHover={{ rotateX: 10, rotateY: -15, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
  >
    {/* Foreground content with Z-elevation */}
    <div style={{ transform: "translateZ(40px)" }}>
      <h3>Floating 3D Content</h3>
    </div>
  </motion.div>
</div>
```

### B. Interactive 3D Cursor-Tracking Tilt Card
```tsx
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function TiltCard3D({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full flex items-center justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-3xl bg-white border border-stone-200 p-8 shadow-2xl transition-shadow"
      >
        <div style={{ transform: "translateZ(60px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
```

---

## 4. Scroll-Driven 3D Storytelling

Using `useScroll` with `useTransform` to tie element rotation, scale, and depth to user scroll position:

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Scroll3DShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [-200, 0, 100]);

  return (
    <div ref={containerRef} style={{ perspective: 1500 }} className="min-h-screen py-32 flex items-center justify-center">
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          z,
          transformStyle: "preserve-3d",
        }}
        className="w-full max-w-4xl rounded-3xl bg-stone-900 text-white p-12 shadow-2xl"
      >
        <h2>3D Viewport Scroll Progression</h2>
      </motion.div>
    </div>
  );
}
```

---

## 5. Three.js / React Three Fiber (R3F) Integration

When building full 3D interactive web experiences (models, GLTF loaders, particles, shaders):

1. **Stack**:
   - `three`: Core WebGL 3D engine
   - `@react-three/fiber`: React wrapper for Three.js declarative scene graphs
   - `@react-three/drei`: Useful helpers (OrbitControls, Float, Canvas, Environment, Text3D)

2. **Connecting Motion to R3F**:
   - Use `useFrame` for continuous render loops.
   - Use `framer-motion-3d` or tie standard Motion values to Three.js mesh transforms via springs:
   ```tsx
   import { Canvas, useFrame } from "@react-three/fiber";
   import { Float, OrbitControls } from "@react-three/drei";
   import { useRef } from "react";
   import * as THREE from "three";

   function FloatingGarmentModel() {
     const meshRef = useRef<THREE.Mesh>(null);

     useFrame((state, delta) => {
       if (meshRef.current) {
         meshRef.current.rotation.y += delta * 0.5;
       }
     });

     return (
       <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
         <mesh ref={meshRef}>
           <boxGeometry args={[2, 3, 0.5]} />
           <meshStandardMaterial color="#B4533C" roughness={0.3} metalness={0.2} />
         </mesh>
       </Float>
     );
   }

   export function Scene3D() {
     return (
       <div className="h-[500px] w-full">
         <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
           <ambientLight intensity={0.7} />
           <directionalLight position={[5, 5, 5]} intensity={1.2} />
           <FloatingGarmentModel />
           <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
         </Canvas>
       </div>
     );
   }
   ```

---

## 6. Procedural Best Practices

- **Avoid GPU bottlenecks**: Keep canvas pixel ratios capped:
  ```tsx
  <Canvas dpr={[1, 2]}> ... </Canvas>
  ```
- **Shared Layout Morphing**: Use `<motion.div layout layoutId="selected-item">` for seamless shared-element modal transitions.
- **Micro-interactions**: Use `whileHover={{ scale: 1.03 }}` and `whileTap={{ scale: 0.97 }}` on interactive cards and buttons.

For deep documentation, review [3d-web-techniques.md](./references/3d-web-techniques.md) and [motion-api-cheatsheet.md](./references/motion-api-cheatsheet.md).
