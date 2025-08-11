# Animation & Transition Strategy
The "Smooth & High-Tech with a Pinch of Glitch" principle will be implemented as follows:

*   **TV Turn-on Effect**: A CSS keyframe animation on a pseudo-element (`::before`) that uses `transform: scaleY()` to expand the line, combined with a very short, secondary glitch animation.
*   **Loading Bar**: A `<div>` whose width is animated via a CSS transition. The "glitch" effect upon completion will be a rapid, jittery keyframe animation applied for a fraction of a second.
*   **Modal Transitions**: The smooth scaling and fading will be handled by CSS transitions on the `transform` and `opacity` properties. The initial "pixelation" glitch will be a fast CSS keyframe animation that applies a `filter: blur()` or a `clip-path` for a few frames before the main transition begins.

This architecture provides a clear separation of concerns, ensures high performance by leaning on native browser technologies (CSS animations), and creates a maintainable codebase that is ready for implementation.
