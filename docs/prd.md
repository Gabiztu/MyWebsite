# Ghostwire • Collective Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

#### Analysis Source
This analysis is based on two user-provided HTML files:
*   **`style2.html`**: The core portfolio design and functionality that will be enhanced.
*   **`porto4.html`**: The source for the new immersive boot sequence.

#### Current Project State
The project is a stylish web portfolio with a retro-hacker theme. It will consist of a primary landing page for the showcase and a dedicated "About Us" page. The goal is to enhance this existing base.

### Change Log
| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| Initial Document | 2025-08-11 | 1.0 | First draft of the PRD | John (PM) |
| Copy & Scope | 2025-08-11 | 1.1 | Updated copy, added About page | John (PM) |
| Final Version | 2025-08-11 | 2.4 | **FINAL LOCKED VERSION. All copy, including full 'Our Work' section, structure, and interactivity are finalized.** | John (PM) |

## Requirements

### Functional
1.  **FR1**: The system shall display an animated, text-based boot sequence on page load.
2.  **FR2**: Upon completion, the system shall transition to the main portfolio view using a "CRT TV turn-on" style animation.
3.  **FR3**: The main portfolio view shall feature a polished, "Matrix-style" animated background.
4.  **FR4**: Clicking on a project card shall trigger a loading bar animation.
5.  **FR5**: After the loading bar completes, a modal window shall appear and auto-play a short video showcasing the selected project.
6.  **FR6**: The project modal shall contain a link to view the full, live project demo.
7.  **FR7**: The terminal shall display initial boot-up lines and an "About Me" manifest, followed by an interactive command prompt.
8.  **FR8**: The hero section shall not contain any primary call-to-action buttons.
9.  **FR9**: The top nav bar shall include an "about" button linking to a new "About Us" page and a "contact" button that scrolls to the contact section.
10. **FR10**: A 'Contact Us' button at the bottom of the "About Us" page shall link back to the 'Contact' section of the main page.
11. **FR11**: Any command entered by the user into the terminal shall return a "command not found" error.

### Non-Functional
1.  **NFR1**: The boot sequence typing animation shall be faster than the example provided.
2.  **NFR2**: The Matrix background animation shall use non-standard, "alien-like" characters.
3.  **NFR3**: All interactive UI elements shall have a polished, high-tech visual style.
4.  **NFR4**: All animations must be smooth and performant on modern desktop browsers.
5.  **NFR5**: No sound effects or music will be implemented in this version.

### Compatibility Requirements
1.  **CR1**: The portfolio must render and function correctly on the latest versions of desktop Chrome, Firefox, and Safari.
2.  **CR2**: The layout and experience are optimized for desktop viewing.

## Core Copywriting & Messaging

### **Main Page Copy**
*   **Top Bar Brand**: `>_ Ghostwire // Collective.`
*   **Hero Headline (Glitch Text)**: `ACCESS GRANTED. INTELLIGENCE DEPLOYED. SYSTEMS ARCHITECTED.`
*   **Hero Sub-Headlines (Typed Text, cycled)**:
    *   `Discord Bots`
    *   `Telegram Utilities`
    *   `Workflow Automation`
    *   `AI Agents`
    *   `Real-Money Games`
    *   `Custom Solutions`
*   **Terminal Initial Display Content**:
    ```
    Booting uplink...
    Loaded modules: ui, net, fs, viz, stealth ✔

    We architect and build complete digital systems. Our expertise spans from complex backend infrastructure and AI-driven automation to the immersive, performance-first frontends that bring them to life. We solve hard problems with elegant, robust solutions.
    ```

### **"About Us" Page Content**

#### **About Ghostwire • Collective**
In the digital ether, some challenges require a different kind of operator. Ghostwire Collective is a decentralized team of senior developers who solve complex problems with elegant, robust code.

#### **Our Expertise**
With over 20+ years of combined experience, our members have architected and deployed solutions across diverse and demanding industries - from the rigorous security of fintech to the high-stakes environment of real-money gaming platforms. This breadth of experience allows us to approach your challenge with a perspective that standard development teams simply cannot match.

#### **Our Method**
We operate without the overhead and bureaucracy of a traditional agency. You communicate directly with the engineers building your solution. This direct line ensures unparalleled efficiency, transparency, and a final product that is precisely aligned with your vision. We believe that off-the-shelf solutions rarely fit perfectly. Our process is built around deep collaboration to understand your unique operational needs.

#### **Our Work**
Our work is focused on tangible results. We build the infrastructure and tools that power modern online communities and businesses.

**Discord & Telegram Integration**
We develop custom bots and utilities for community management, advanced moderation, and member-focused services. This includes creating token-gated access systems using technologies like Collab.Land or Guild.xyz, building member verification flows, integrating payment gateways for e-commerce platforms like Whop, and developing custom server analytics dashboards.

**AI & Workflow Automation**
We build and deploy custom AI agents and intelligent automations that solve real problems. We create high-volume data scraping and processing pipelines, generate automated financial reports, and implement AI-powered content moderation. We are experienced in leveraging APIs from OpenAI, Anthropic, Google Vertex AI, and DeepSeek for building lead generation bots that integrate with CRM systems, creating automated social media management tools, and developing agents for data analysis.

**High-Stakes Gaming & Competitions**
We architect and deploy provably fair platforms for games and competitions involving real-money prizes. Our work includes secure crypto wallet integration (MetaMask, Phantom), on-chain verifiable randomness for blockchain-based games, and robust anti-cheat mechanisms. We build custom tournament management systems, player-to-player item trading economies, and automated prize distribution protocols.

**Quantitative Trading Systems**
We develop high-frequency, low-latency trading bots for both crypto and traditional markets. This includes creating strategy backtesting frameworks against historical tick data, integrating with exchange APIs (WebSocket/FIX) for real-time order book data, and deploying sophisticated arbitrage and market-making algorithms on platforms like Binance or Bybit.

**Blockchain & Smart Contracts**
We provide end-to-end web3 development. We write, audit, and deploy custom smart contracts on EVM-compatible chains for DeFi protocols (e.g., custom AMMs, staking platforms), NFT marketplaces (ERC-721/1155), and DAOs. We also build the indexing subgraphs and dApp frontends required to interact with them.

**Security Auditing & Tooling**
We conduct comprehensive security audits on existing web applications, smart contracts, and infrastructure. We identify and patch vulnerabilities (e.g., reentrancy, front-running in contracts), perform penetration testing, and can develop custom internal security tooling like cloud security posture management (CSPM) scripts to meet your specific compliance needs.

**Custom Web Platforms**
We build full-stack web applications from the ground up. We specialize in creating Software-as-a-Service (SaaS) products, multi-vendor marketplaces, custom API development for mobile applications, and real-time data dashboards with WebSockets.

**Infrastructure & DevOps**
We provide robust backend and infrastructure services. This includes designing and optimizing database architecture (PostgreSQL, MongoDB), setting up auto-scaling cloud infrastructure on AWS, and implementing CI/CD pipelines for automated testing and releases. We also perform security audits, implement centralized logging and monitoring solutions, and configure load balancers for high-traffic applications.

#### **Core Competencies**

**Languages:**
Rust, Go, Python, JavaScript/TypeScript, C/C++, Solidity, Java, C#

**Frameworks & Runtimes:**
Node.js, React, Next.js, Django, Flask, Gin, Actix-Web, Tauri, Ethers.js, Web3.py, Spring Boot, .NET

**Databases & Caching:**
PostgreSQL, MongoDB, Redis, MySQL, SQLite, DynamoDB, Pinecone, ClickHouse

**AI / ML:**
OpenAI API, Anthropic API, Google Vertex AI, DeepSeek API, LangChain, PyTorch, TensorFlow, Vector Databases, Hugging Face, Model Fine-tuning

**Infrastructure & DevOps:**
AWS, Google Cloud Platform, Azure, Docker, Kubernetes, Terraform, Ansible, CI/CD (GitHub Actions), Nginx

**Blockchain:**
Ethereum (EVM), Solana, Cosmos SDK, Aptos, Sui, Smart Contract Auditing, Oracles (Chainlink), The Graph, Hardhat, Foundry

**Security:**
Penetration Testing, Application Security (AppSec), Vulnerability Analysis, Reverse Engineering, Static/Dynamic Analysis

**Protocols & APIs:**
REST, GraphQL, gRPC, WebSockets, FIX Protocol

## Epic 1: Immersive Experience Overhaul

**Epic Goal**: To refactor and enhance the existing portfolio by integrating an immersive boot sequence, polishing all UI elements, implementing an impressive project showcase experience, and creating a new "About Us" page, transforming it into a high-impact validation tool.

---

### **Story 1.1: Core Codebase Refactor**
*As a developer, I want to refactor the single-file portfolio into separate HTML, CSS, and JavaScript files, so that the codebase is maintainable, scalable, and ready for new feature integration.*
*   **AC**:
    1.  The project is organized into three files: `index.html`, `style.css`, and `script.js`.
    2.  `index.html` contains the necessary structural elements for both the boot screen and the main portfolio, using the new, approved copywriting from the "Main Page Copy" section.
    3.  The main portfolio is visually and functionally identical to the original `style2.html` after the refactor (aside from copy changes).

---

### **Story 1.2: Boot Sequence Implementation**
*As a user, I want to see an immersive boot-up sequence when I first load the page, so that I am immediately drawn into a unique, high-tech experience.*
*   **AC**:
    1.  On page load, the boot sequence from `porto4.html` is displayed.
    2.  The text typing animation is noticeably faster than the original example.
    3.  The main portfolio content is not visible during the boot sequence.

---

### **Story 1.3: TV-Style Transition**
*As a user, I want a "CRT TV turn-on" animation to transition from the boot screen to the main portfolio, so that the experience feels cohesive and impressive.*
*   **AC**:
    1.  Upon completion of the boot sequence, a transition effect mimicking a CRT monitor powering on is displayed.
    2.  The effect smoothly hides the boot screen and reveals the main portfolio view.
    3.  The transition is brief (1-2 seconds) and visually engaging.

---

### **Story 1.4: Matrix Background Polish**
*As a developer, I want to enhance the Matrix background effect, so that it looks more sophisticated and unique.*
*   **AC**:
    1.  The character set used in the animation is replaced with non-alphanumeric, "alien-like" symbols.
    2.  The animation includes variations in character falling speed and glow intensity.
    3.  The animation is performant and does not cause significant browser slowdown.

---

### **Story 1.5: UI Element Polish**
*As a user, I want the project cards to have a more polished, high-tech look, so that the interface feels premium and satisfying to interact with.*
*   **AC**:
    1.  The project cards in the grid have enhanced hover and click effects, consistent with the UI/UX spec.

---

### **Story 1.6: Interactive Terminal & Nav Bar Update**
*As a user, I want to interact with the terminal by typing commands, so that the experience feels more authentic and immersive.*
*   **AC**:
    1.  On initial load, the terminal displays the approved **"Terminal Initial Display Content"**.
    2.  After the initial text, a command prompt styled like the provided image (`guest@portfolio:~$`) is displayed with a blinking cursor.
    3.  The user can type into the input field.
    4.  Pressing Enter with any text in the input field will display a new line with the error `command not found: [the typed command]`, styled in red.
    5.  The top nav bar is updated as specified (work removed, about/contact link, switch rename).
    6.  Clicking the "switch" button successfully outputs theme-change messages to the terminal display, followed by a new, empty command prompt.

---

### **Story 1.7: Interactive Project Showcase**
*As a user, I want to click on a project and see a dynamic modal with a video preview, so that I can quickly and impressively grasp the nature of the work.*
*   **AC**:
    1.  Clicking a project card triggers a loading bar animation.
    2.  When the loading bar finishes, a modal window opens with an engaging animation.
    3.  Inside the modal, a short video of the project auto-plays in a loop.
    4.  The modal contains a clearly visible button/link to "View Live Project".
    5.  Closing the modal is smooth and returns the user to the project grid.

---

### **Story 1.8: Create Dedicated "About Us" Page**
*As a user, I want to view a dedicated "About Us" page, so that I can get a comprehensive understanding of the collective's expertise.*
*   **AC**:
    1.  A new `about.html` file is created.
    2.  The page uses the same visual theme (background, fonts) as the main page.
    3.  The page contains the final, approved "About Us" Page Content.
    4.  There is a clear way to navigate back to the main portfolio page.

---

### **Story 1.9: Implement 'Back to Contact' Button**
*As a user on the "About Us" page, I want a button to take me back to the contact information on the main page, so I can easily take the next step without navigating manually.*
*   **AC**:
    1.  A button with the text "Contact Us" is present at the bottom of the `about.html` page.
    2.  The button's styling is consistent with the polished, high-tech theme.
    3.  Clicking the button navigates the user to `index.html#contact`.
