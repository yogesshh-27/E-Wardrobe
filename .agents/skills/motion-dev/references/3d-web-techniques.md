# 3D Web Techniques & Architecture Reference

## 1. CSS 3D vs. WebGL (Three.js / React Three Fiber)

When to choose which technology:

| Criteria | CSS 3D Transforms with Motion | WebGL / Three.js (R3F) |
| :--- | :--- | :--- |
| **Use Case** | UI cards, perspective sliders, hero tilt, parallax cards | Complex 3D geometries, GLTF 3D models, shaders, particle systems |
| **Bundle Size** | ~0 KB (native browser CSS + motion) | ~150–400 KB (three + @react-three/fiber) |
| **DOM Integration** | Native HTML, SEO friendly, accessibility intact | Canvas render tree, requires custom HTML overlays (`<Html>`) |
| **Performance** | Excellent for < 20 interactive cards | Excellent for complex lighting, millions of vertices, 3D meshes |

---

## 2. Essential CSS 3D Properties

To construct 3D depth in the DOM:
- **`perspective: <length>`**: Defines how close or far the 3D plane appears to the viewer. Typical values: `800px` to `1500px`. Lower values create extreme fish-eye perspective; higher values create subtle isometric depth.
- **`perspective-origin`**: Coordinates for the vanishing point. Default is `50% 50%` (center).
- **`transform-style: preserve-3d`**: Critical! Without this on parent elements, children will be flattened back to a 2D plane.
- **`translateZ(<length>)`**: Shifts children forward or backward in 3D space, creating genuine multi-layer depth separation.

---

## 3. Cursor Tracking Mathematics

Calculating normalized cursor offsets for natural tilt:
```typescript
const rect = container.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

// Normalized from -0.5 to +0.5
const xRatio = mouseX / rect.width - 0.5;
const yRatio = mouseY / rect.height - 0.5;

// Invert Y for rotateX (moving mouse up tilts top towards viewer)
const rotateX = -yRatio * maxAngle;
const rotateY = xRatio * maxAngle;
```

---

## 4. React Three Fiber Architecture Checklist

1. **Canvas Setup**:
   ```tsx
   <Canvas
     camera={{ position: [0, 0, 5], fov: 50 }}
     gl={{ antialias: true, alpha: true }}
     dpr={[1, 2]} // Cap DPR to prevent mobile battery drain
   >
     <ambientLight intensity={0.6} />
     <directionalLight position={[10, 10, 5]} intensity={1.5} />
     {/* 3D Scene Components */}
   </Canvas>
   ```
2. **GLTF Model Loading with Drei**:
   ```tsx
   import { useGLTF } from "@react-three/drei";

   function GarmentModel({ url }: { url: string }) {
     const { scene } = useGLTF(url);
     return <primitive object={scene} scale={1.5} />;
   }
   ```
3. **Suspense Boundaries**: Always wrap R3F models in `<Suspense fallback={<Loader />}>`.
