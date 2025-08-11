# Epic 1: Immersive Experience Overhaul

**Epic Goal**: To refactor and enhance the existing portfolio by integrating an immersive boot sequence, polishing all UI elements, implementing an impressive project showcase experience, and creating a new "About Us" page, transforming it into a high-impact validation tool.

---

## **Story 1.1: Core Codebase Refactor**
*As a developer, I want to refactor the single-file portfolio into separate HTML, CSS, and JavaScript files, so that the codebase is maintainable, scalable, and ready for new feature integration.*
*   **AC**:
    1.  The project is organized into three files: `index.html`, `style.css`, and `script.js`.
    2.  `index.html` contains the necessary structural elements for both the boot screen and the main portfolio, using the new, approved copywriting from the "Main Page Copy" section.
    3.  The main portfolio is visually and functionally identical to the original `style2.html` after the refactor (aside from copy changes).

---

## **Story 1.2: Boot Sequence Implementation**
*As a user, I want to see an immersive boot-up sequence when I first load the page, so that I am immediately drawn into a unique, high-tech experience.*
*   **AC**:
    1.  On page load, the boot sequence from `porto4.html` is displayed.
    2.  The text typing animation is noticeably faster than the original example.
    3.  The main portfolio content is not visible during the boot sequence.

---

## **Story 1.3: TV-Style Transition**
*As a user, I want a "CRT TV turn-on" animation to transition from the boot screen to the main portfolio, so that the experience feels cohesive and impressive.*
*   **AC**:
    1.  Upon completion of the boot sequence, a transition effect mimicking a CRT monitor powering on is displayed.
    2.  The effect smoothly hides the boot screen and reveals the main portfolio view.
    3.  The transition is brief (1-2 seconds) and visually engaging.

---

## **Story 1.4: Matrix Background Polish**
*As a developer, I want to enhance the Matrix background effect, so that it looks more sophisticated and unique.*
*   **AC**:
    1.  The character set used in the animation is replaced with non-alphanumeric, "alien-like" symbols.
    2.  The animation includes variations in character falling speed and glow intensity.
    3.  The animation is performant and does not cause significant browser slowdown.

---

## **Story 1.5: UI Element Polish**
*As a user, I want the project cards to have a more polished, high-tech look, so that the interface feels premium and satisfying to interact with.*
*   **AC**:
    1.  The project cards in the grid have enhanced hover and click effects, consistent with the UI/UX spec.

---

## **Story 1.6: Interactive Terminal & Nav Bar Update**
*As a user, I want to interact with the terminal by typing commands, so that the experience feels more authentic and immersive.*
*   **AC**:
    1.  On initial load, the terminal displays the approved **"Terminal Initial Display Content"**.
    2.  After the initial text, a command prompt styled like the provided image (`guest@portfolio:~$`) is displayed with a blinking cursor.
    3.  The user can type into the input field.
    4.  Pressing Enter with any text in the input field will display a new line with the error `command not found: [the typed command]`, styled in red.
    5.  The top nav bar is updated as specified (work removed, about/contact link, switch rename).
    6.  Clicking the "switch" button successfully outputs theme-change messages to the terminal display, followed by a new, empty command prompt.

---

## **Story 1.7: Interactive Project Showcase**
*As a user, I want to click on a project and see a dynamic modal with a video preview, so that I can quickly and impressively grasp the nature of the work.*
*   **AC**:
    1.  Clicking a project card triggers a loading bar animation.
    2.  When the loading bar finishes, a modal window opens with an engaging animation.
    3.  Inside the modal, a short video of the project auto-plays in a loop.
    4.  The modal contains a clearly visible button/link to "View Live Project".
    5.  Closing the modal is smooth and returns the user to the project grid.

---

## **Story 1.8: Create Dedicated "About Us" Page**
*As a user, I want to view a dedicated "About Us" page, so that I can get a comprehensive understanding of the collective's expertise.*
*   **AC**:
    1.  A new `about.html` file is created.
    2.  The page uses the same visual theme (background, fonts) as the main page.
    3.  The page contains the final, approved "About Us" Page Content.
    4.  There is a clear way to navigate back to the main portfolio page.

---

## **Story 1.9: Implement 'Back to Contact' Button**
*As a user on the "About Us" page, I want a button to take me back to the contact information on the main page, so I can easily take the next step without navigating manually.*
*   **AC**:
    1.  A button with the text "Contact Us" is present at the bottom of the `about.html` page.
    2.  The button's styling is consistent with the polished, high-tech theme.
    3.  Clicking the button navigates the user to `index.html#contact`.
