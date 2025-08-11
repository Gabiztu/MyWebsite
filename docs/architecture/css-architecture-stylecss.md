# CSS Architecture (`style.css`)
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
