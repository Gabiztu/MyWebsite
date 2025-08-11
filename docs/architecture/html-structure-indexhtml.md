# HTML Structure (`index.html`)
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
