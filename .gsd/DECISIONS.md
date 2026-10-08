# DECISIONS.md — Architecture & Design Decisions

### ADR-001: 3D Experience Architecture
- **Decision**: Use CSS 3D transforms (`perspective`, `rotateX`, `rotateY`, `translateZ`) and Framer Motion spring physics for floating and tilt cards instead of heavyweight WebGL meshes.
- **Rationale**: Keeps bundle size low (<200KB vs 15MB+ Three.js models), runs at 60fps on mobile devices and integrated GPUs, satisfies the prompt directive "Beautiful and fast is better. Do NOT render dozens of complex 3D models simultaneously."

### ADR-002: Navigation & Route Hierarchy
- **Decision**: Update navigation links to include `/style-profile` alongside `/travel`, `/occasions`, `/recommendations`, `/wardrobe`, `/profile`, `/settings`.
- **Rationale**: Explicit requirement in prompt: "Style Profile" as a core menu item with "YOUR STYLE DNA" visual chart.

### ADR-003: Travel Planner Architecture
- **Decision**: Provide structured multi-day itinerary generator with deterministic day-wise outfit plans and Smart Packing metrics (Pack count, Reuse analysis, Skip advice, Missing item recommendation).
- **Rationale**: Core USP emphasized in the prompt: "Prioritize the Travel Planner because it is the primary USP."
