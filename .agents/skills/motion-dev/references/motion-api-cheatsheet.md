# Motion.dev & Framer Motion API Cheatsheet

## 1. Declarative Props

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20
  }}
  whileHover={{ scale: 1.04, y: -2 }}
  whileTap={{ scale: 0.98 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
/>
```

---

## 2. Shared Element Transitions (`layoutId`)

Creates smooth layout morphing across components:
```tsx
// Grid Card
<motion.div layoutId={`card-${id}`} onClick={() => setSelected(id)}>
  <motion.img layoutId={`img-${id}`} src={image} />
</motion.div>

// Opened Modal
<AnimatePresence>
  {selected && (
    <motion.div layoutId={`card-${selected}`} className="fixed inset-0 ...">
      <motion.img layoutId={`img-${selected}`} src={image} />
    </motion.div>
  )}
</AnimatePresence>
```

---

## 3. Scroll Progress Hooks

```tsx
import { useScroll, useTransform, useSpring } from "framer-motion";

const { scrollYProgress } = useScroll({
  target: elementRef,
  offset: ["start end", "end start"],
});

// Smooth out the scroll input with spring physics
const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

// Map progress [0, 1] to CSS outputs
const rotateZ = useTransform(smoothProgress, [0, 1], [0, 360]);
const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
```

---

## 4. Vanilla Motion.dev Functions

For lightweight scripts or non-React contexts:
```typescript
import { animate, scroll, inView, stagger } from "motion";

// Animate elements
animate(".card", { opacity: [0, 1], transform: ["scale(0.8)", "scale(1)"] }, {
  delay: stagger(0.1),
  easing: [0.17, 0.67, 0.83, 0.67],
});

// Scroll timeline
scroll(
  animate(".progress-bar", { scaleX: [0, 1] }),
  { target: document.querySelector(".content") }
);

// In-view trigger
inView(".reveal", ({ target }) => {
  animate(target, { opacity: 1, transform: "none" }, { duration: 0.6 });
});
```
