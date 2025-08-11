# Ghostwire • Collective Portfolio Architecture

## Introduction
This document outlines the complete technical architecture for the Ghostwire • Collective portfolio enhancement. It serves as the single source of truth for all development work, ensuring the final product aligns with the Product Requirements Document (PRD v2.4) and the UI/UX Specification (v2.0). The architecture is designed to be performant, maintainable, and to faithfully execute the "Smooth & High-Tech with a Pinch of Glitch" design principle.

### Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2025-08-11 | 1.0 | Initial and final version of the architecture. | Winston (Architect) |

## High-Level Architecture
The project will be refactored from a single-file `style2.html` into a multi-file, two-page web application. The core architectural choice is a modular, event-driven vanilla JavaScript front-end. This approach provides maximum performance and avoids unnecessary framework overhead, which is ideal for a high-impact, animation-heavy showcase.

### Core Technologies
*   **HTML5**: For semantic structure.
*   **CSS3**: For all styling, transitions, and keyframe animations.
*   **JavaScript (ES6+)**: For all logic, interactivity, and DOM manipulation. No external libraries are required, ensuring a lightweight and fast application.

## File & Project Structure
The project will be organized into a clean, flat structure to promote simplicity and ease of maintenance.

```
/
├── index.html              # The main portfolio/showcase page
├── about.html              # The dedicated "About Us" page
├── style.css               # Single stylesheet for both pages
├── script.js               # Main JavaScript entry point
└── assets/                 # Folder for project videos, images, etc.
    ├── project-video-1.mp4
    └── ...
```

## HTML Structure (`index.html`)
The main page will be structured to manage the two primary application states: the boot sequence and the main portfolio.

```html
<!DOCTYPE html>
<html lang="en" data-theme="neon">
<head>
    <!-- Meta tags, title, and link to style.css -->
</head>
<body>
    <!-- Container for the boot sequence. Initially visible. -->
    <div id="boot-screen"></div>

    <!-- Container for the main portfolio. Initially hidden. -->
    <div id="main-portfolio" style="display: none;">
        <canvas id="matrix-background"></canvas>
        <div class="fx-overlay"></div>
        <header>
            <!-- Navigation bar -->
        </header>
        <main>
            <!-- Hero, terminal, project grid, contact section -->
        </main>
        <!-- Modal container for project showcase -->
        <div id="modal-container"></div>
    </div>

    <!-- Link to script.js at the end of the body -->
    <script src="script.js"></script>
</body>
</html>
```

## CSS Architecture (`style.css`)
The stylesheet will be organized logically using comments to delineate sections. It will make extensive use of CSS Custom Properties (variables) for theming, making the "switch" functionality clean and efficient.

```css
/* --- Core Variables & Theming --- */
:root { /* Default 'neon' theme variables */ }
[data-theme="matrix"] { /* Matrix theme overrides */ }
[data-theme="amber"] { /* Amber theme overrides */ }

/* --- Global Styles & Typography --- */
body, h1, p { ... }

/* --- Boot Sequence Styles --- */
#boot-screen { ... }

/* --- Main Portfolio Layout --- */
#main-portfolio, header, main { ... }

/* --- Components --- */
/* Nav Bar, Terminal, Project Cards, Modals, etc. */
.terminal { ... }
.card { ... }
.modal { ... }

/* --- Animations & Keyframes --- */
/* Glitch effects, TV turn-on, loading bar, etc. */
@keyframes tv-turn-on { ... }
@keyframes glitch-accent { ... }
```

## JavaScript Architecture: A Modular Design
`script.js` will serve as the entry point and orchestrator, but the logic will be organized into distinct, self-contained modules. This is a "vanilla JS" modular pattern, where each "module" is an object with its own state and methods, initialized by a main controller.

### `AppController` (The Orchestrator)
*   **Responsibility**: Manages the overall application state and initializes all other modules.
*   **State**: `currentState` (e.g., 'BOOTING', 'MAIN_VIEW', 'MODAL_OPEN').
*   **Methods**:
    *   `init()`: Called on DOMContentLoaded. Sets up all modules.
    *   `startBootSequence()`: Kicks off the boot process.
    *   `transitionToMainView()`: Manages the TV turn-on effect and switches the visibility of the `#boot-screen` and `#main-portfolio` containers.

### `BootSequence` Module
*   **Responsibility**: Handles the animated typing of the boot-up text.
*   **Methods**:
    *   `run()`: Starts the typing animation. Returns a Promise that resolves when the sequence is complete.
    *   **Internal**: Uses `async/await` and `setTimeout` to control the typing speed.

### `MatrixBackground` Module
*   **Responsibility**: Renders and animates the Matrix-style background on an HTML `<canvas>` element.
*   **Methods**:
    *   `start()`: Begins the `requestAnimationFrame` loop.
    *   `stop()`: Cancels the animation frame.
    *   `updateTheme()`: Called by the `ThemeSwitcher` to change the color of the glyphs.

### `Terminal` Module
*   **Responsibility**: Manages all interactivity for the terminal display.
*   **DOM Elements**: Binds to `#terminal-output`, `#terminal-input`, etc.
*   **Methods**:
    *   `init()`: Sets up the initial display text and attaches the `keydown` event listener for the input.
    *   `log(message, className)`: A public method that allows any other module to print a line to the terminal output. Used by the `ThemeSwitcher`.
    *   **Internal**: An `handleCommand(command)` method that processes user input, logs the `command not found` error, and resets the prompt.

### `Portfolio` Module
*   **Responsibility**: Manages all interactions for the main portfolio content, primarily the project grid and modals.
*   **Methods**:
    *   `init()`: Attaches click listeners to all project cards.
    *   `showProjectModal(projectId)`: Manages the full sequence for displaying a project:
        1.  Creates and displays the loading bar.
        2.  After a delay, triggers the glitch effect on the loading bar.
        3.  Removes the loading bar.
        4.  Creates the modal HTML, injects it into the `#modal-container`, and plays the opening animation.

### `ThemeSwitcher` Module
*   **Responsibility**: Manages the logic for the "switch" button in the navigation.
*   **State**: `currentThemeIndex`, `themes` (array: ['neon', 'matrix', 'amber']).
*   **Methods**:
    *   `init()`: Attaches a click listener to the `#themeToggle` button (renamed to "switch").
    *   `cycleTheme()`:
        1.  Calculates the next theme in the array.
        2.  Sets the `data-theme` attribute on the `<html>` element.
        3.  Calls `Terminal.log()` to print the "theme set to..." message.
        4.  Calls `MatrixBackground.updateTheme()` to ensure the canvas effect changes color.

## Animation & Transition Strategy
The "Smooth & High-Tech with a Pinch of Glitch" principle will be implemented as follows:

*   **TV Turn-on Effect**: A CSS keyframe animation on a pseudo-element (`::before`) that uses `transform: scaleY()` to expand the line, combined with a very short, secondary glitch animation.
*   **Loading Bar**: A `<div>` whose width is animated via a CSS transition. The "glitch" effect upon completion will be a rapid, jittery keyframe animation applied for a fraction of a second.
*   **Modal Transitions**: The smooth scaling and fading will be handled by CSS transitions on the `transform` and `opacity` properties. The initial "pixelation" glitch will be a fast CSS keyframe animation that applies a `filter: blur()` or a `clip-path` for a few frames before the main transition begins.

This architecture provides a clear separation of concerns, ensures high performance by leaning on native browser technologies (CSS animations), and creates a maintainable codebase that is ready for implementation.
