# JavaScript Architecture: A Modular Design
`script.js` will serve as the entry point and orchestrator, but the logic will be organized into distinct, self-contained modules. This is a "vanilla JS" modular pattern, where each "module" is an object with its own state and methods, initialized by a main controller.

## `AppController` (The Orchestrator)
*   **Responsibility**: Manages the overall application state and initializes all other modules.
*   **State**: `currentState` (e.g., 'BOOTING', 'MAIN_VIEW', 'MODAL_OPEN').
*   **Methods**:
    *   `init()`: Called on DOMContentLoaded. Sets up all modules.
    *   `startBootSequence()`: Kicks off the boot process.
    *   `transitionToMainView()`: Manages the TV turn-on effect and switches the visibility of the `#boot-screen` and `#main-portfolio` containers.

## `BootSequence` Module
*   **Responsibility**: Handles the animated typing of the boot-up text.
*   **Methods**:
    *   `run()`: Starts the typing animation. Returns a Promise that resolves when the sequence is complete.
    *   **Internal**: Uses `async/await` and `setTimeout` to control the typing speed.

## `MatrixBackground` Module
*   **Responsibility**: Renders and animates the Matrix-style background on an HTML `<canvas>` element.
*   **Methods**:
    *   `start()`: Begins the `requestAnimationFrame` loop.
    *   `stop()`: Cancels the animation frame.
    *   `updateTheme()`: Called by the `ThemeSwitcher` to change the color of the glyphs.

## `Terminal` Module
*   **Responsibility**: Manages all interactivity for the terminal display.
*   **DOM Elements**: Binds to `#terminal-output`, `#terminal-input`, etc.
*   **Methods**:
    *   `init()`: Sets up the initial display text and attaches the `keydown` event listener for the input.
    *   `log(message, className)`: A public method that allows any other module to print a line to the terminal output. Used by the `ThemeSwitcher`.
    *   **Internal**: An `handleCommand(command)` method that processes user input, logs the `command not found` error, and resets the prompt.

## `Portfolio` Module
*   **Responsibility**: Manages all interactions for the main portfolio content, primarily the project grid and modals.
*   **Methods**:
    *   `init()`: Attaches click listeners to all project cards.
    *   `showProjectModal(projectId)`: Manages the full sequence for displaying a project:
        1.  Creates and displays the loading bar.
        2.  After a delay, triggers the glitch effect on the loading bar.
        3.  Removes the loading bar.
        4.  Creates the modal HTML, injects it into the `#modal-container`, and plays the opening animation.

## `ThemeSwitcher` Module
*   **Responsibility**: Manages the logic for the "switch" button in the navigation.
*   **State**: `currentThemeIndex`, `themes` (array: ['neon', 'matrix', 'amber']).
*   **Methods**:
    *   `init()`: Attaches a click listener to the `#themeToggle` button (renamed to "switch").
    *   `cycleTheme()`:
        1.  Calculates the next theme in the array.
        2.  Sets the `data-theme` attribute on the `<html>` element.
        3.  Calls `Terminal.log()` to print the "theme set to..." message.
        4.  Calls `MatrixBackground.updateTheme()` to ensure the canvas effect changes color.
