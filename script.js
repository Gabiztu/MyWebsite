// Module stubs - to be implemented in future stories
class BootSequence {
  constructor() {
    // Exact boot log ported from porto4.html
    this.bootLog = [
      "Initializing BIOS...", 500,
      "Checking system memory........ [OK]", 200,
      "Detecting CPU: QuantumCore v3.7 @ 8.2GHz...", 300,
      "Starting Kernel v6.6.6-kali-amd64...", 500,
      "Welcome, Operator.", 300,
    ];
    this.el = null;
    /* Pause controls – even faster but still readable */
    this.pauseMultiplier = 0.01; // 1 % of original delay
    this.minPause = 5;           // minimum 5 ms between lines
  }

  init() {
    this.el = document.getElementById('boot-screen');
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /* Per-character typing (~10 ms per char) */
  typeLine(line) {
    return new Promise(resolve => {
      let i = 0;
      const timer = setInterval(() => {
        // append next character
        this.el.innerHTML += line[i++] || '';
        if (i >= line.length) {
          clearInterval(timer);
          this.el.innerHTML += '\n';
          resolve();
        }
      }, 2); // ~2 ms cadence (ultra-fast)
    });
  }

  async run() {
    if (!this.el) this.init();
    for (let i = 0; i < this.bootLog.length; i++) {
      const entry = this.bootLog[i];
      if (typeof entry === 'string') {
        await this.typeLine(entry);
      } else {
        const ms = Math.max(this.minPause, Math.round(entry * this.pauseMultiplier));
        if (ms > 0) await this.sleep(ms);
      }
    }
    // Do NOT hide boot-screen or reveal main here (handled in Story 1.3)
  }
}

/* =========================================================================
 * MatrixBackground — encapsulated Matrix "rain" canvas animation
 * Exposes: init()  · start()  · stop()  · updateTheme()
 * The animation colour is derived from CSS custom property --accent on each
 * frame, so updateTheme() is effectively just a restart (cheap).
 * ======================================================================= */
class MatrixBackground {
  constructor () {
    /* DOM / drawing context */
    this.canvas = null;
    this.ctx    = null;

    /* geometry / animation state */
    this.w = 0; this.h = 0;         // canvas size (device pixels)
    this.columns = 0;               // number of glyph columns
    this.drops   = [];              // per-column y+speed
    this.rafId   = 0;               // requestAnimationFrame handle
    /* surge (cinematic boot cascade) state */
    this.surgeStart = 0;            // timestamp when start() called
    this.SURGE_DURATION = 2000;     // 2 s surge window

    /* glyph set – esoteric Unicode */
    this.glyphs =
      'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ' + // Katakana
      '┌┐└┘├┤┬┴┼│─╱╲╳╔╗╚╝' +                       // Box drawing
      '░▒▓█▌▐' +                                    // Block elements
      '◆◇◈◉◎◌' +                                   // Geometric shapes
      '∑∏√∞≡≈∧∨⊕⊗⊙' +                              // Math symbols
      '♠♣♥♦' +                                     // Card suits
      '0123456789';                                // Digits (for rarity)
  }

  /* Grab canvas & bind resize listener */
  init () {
    this.canvas = document.getElementById('matrix-background');
    if (!this.canvas?.getContext) return;
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener('resize', () => {
      if (this.rafId) this._resize();
    });
  }

  /* Public API ---------------------------------------------------------- */
  start () {
    if (!this.canvas || this.rafId) return;
    this.surgeStart = performance.now(); // trigger cinematic surge
    this._resize();
    this._loop();
  }

  stop () {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    // Clear canvas
    this.ctx?.clearRect(0, 0, this.w, this.h);
  }

  /* Theme change hook – restart once so new accent takes effect instantly */
  updateTheme () {
    if (this.rafId) {
      this.stop();
      this.start();
    }
  }

  /* Internal helpers ---------------------------------------------------- */
  _resize () {
    this.w = this.canvas.width  = Math.floor(window.innerWidth  * devicePixelRatio);
    this.h = this.canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
    this.columns = Math.floor(this.w / (14 * devicePixelRatio));
    this.drops = Array.from({ length: this.columns }, () => ({
      y: 0,
      speed: 0.5 + Math.random(),     // 0.5 → 1.5 (base speed)
      /* extra stacked chars for density explosion (2-4 extras → total 3-5) */
      extra: 2 + Math.floor(Math.random()*3)
    }));
    this.ctx.font = `${14 * devicePixelRatio}px ui-monospace, monospace`;
  }

  _loop () {
    /* subtle black overlay for trail */
    this.ctx.fillStyle = 'rgba(5,7,10,0.08)';
    this.ctx.fillRect(0, 0, this.w, this.h);

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim() || '#0f0';
    const now = performance.now();
    const surgeProg = Math.min(1, (now - this.surgeStart) / this.SURGE_DURATION); // 0 → 1

    for (let i = 0; i < this.drops.length; i++) {
      const d = this.drops[i];
      const x = i * 14 * devicePixelRatio;
      const y = d.y * 18 * devicePixelRatio;
      const char = this.glyphs[Math.floor(Math.random() * this.glyphs.length)];

      /* ---- Colour / brightness surge ---- */
      let clr = accent;
      if (surgeProg < 1) {
        // First half of surge is bright white, then fades to accent
        clr = surgeProg < 0.5 ? '#ffffff' : accent;
      } else {
        // normal flicker after surge
        const flicker = Math.random() < 0.03;
        clr = flicker ? '#ffffff' : accent;
      }
      this.ctx.fillStyle = clr;

      /* ---- Density: draw main char + diminishing extras stacked upward ---- */
      const count = 1 + Math.ceil(d.extra * (1 - surgeProg)); // from 3-5 → 1
      for (let n = 0; n < count; n++) {
        this.ctx.fillText(char, x, y - n * 18 * devicePixelRatio);
      }

      /* Reset column off-screen + randomise speed */
      if (y > this.h && Math.random() > 0.975) {
        d.y = 0;
        d.speed = 0.5 + Math.random();
      }
      /* ---- Speed burst: 3x → 1x over surge duration ---- */
      const speedMul = 3 - 2 * surgeProg; // 3 → 1
      d.y += d.speed * speedMul;
    }
    this.rafId = requestAnimationFrame(() => this._loop());
  }
}

class Terminal {
  init() {
    // No-op for now, will be implemented in future stories
  }
}

class Portfolio {
  init() {
    // No-op for now, will be implemented in future stories
  }
}

class ThemeSwitcher {
  init() {
    // No-op for now, will be implemented in future stories
  }
}

// Main application controller
const AppController = {
  modules: {
    bootSequence: new BootSequence(),
    matrixBackground: new MatrixBackground(),
    terminal: new Terminal(),
    portfolio: new Portfolio(),
    themeSwitcher: new ThemeSwitcher()
  },
  /* marks whether initMain has already executed */
  mainInitialised: false,

  init() {
    const bootScreen   = document.getElementById('boot-screen');
    const mainPortfolio = document.getElementById('main-portfolio');

    /* --- Boot sequence handling (Story 1.2) --- */
    if (bootScreen) {
      bootScreen.style.display = 'block';
      // Store promise for later chaining in future stories
      this.bootPromise = this.modules.bootSequence.run();
      // When boot sequence completes, fade out and reveal main
      if (mainPortfolio) {
        this.bootPromise.then(() => {
          this.transitionToMainView();
        });
      }
    }

    // Ensure main content hidden during boot
    if (mainPortfolio) {
      mainPortfolio.style.display = 'none';
    }

    /* --- Initialise modules (bootSequence.init already inside run call) --- */
    Object.values(this.modules).forEach(module => module.init());

    // If no boot screen, initialise main immediately
    if (!bootScreen) {
      this.initMain();
    }
  },
  
  initMain() {
    /* guard so we only run once */
    if (this.mainInitialised) return;
    this.mainInitialised = true;

    /* ===== Globals / State ===== */
    const out = document.getElementById('termOut');
    const input = document.getElementById('cmd');
    const whoEl = document.getElementById('who');
    const cwdEl = document.getElementById('cwd');
    const brand = document.getElementById('brand');
    const motionToggle = document.getElementById('motionToggle');
    const soundToggle = document.getElementById('soundToggle');
    const themeToggle = document.getElementById('themeToggle');
    const palette = document.getElementById('palette');
    const palInput = document.getElementById('palInput');
    const palList = document.getElementById('palList');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.getElementById('modalContent');
    const toast = document.getElementById('toast');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = {
      user: 'guest',
      root: false,
      path: '/home/guest',
      history: [],
      histIndex: -1,
      awaitingPassword: false,
      pendingSudo: null,
      tries: 0,
      sound: false,
      motion: !prefersReduced.matches,
      theme: document.documentElement.getAttribute('data-theme') || 'neon',
      konamiIdx: 0,
    };

    /* ===== Audio (tiny beep) ===== */
    let audioCtx = null;
    function beep(freq=420, dur=0.05, vol=0.03){
      if(!state.sound) return;
      try{
        if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.frequency.value = freq;
        o.type = 'square';
        g.gain.value = vol;
        o.connect(g); g.connect(audioCtx.destination);
        o.start(); o.stop(audioCtx.currentTime + dur);
      }catch(e){}
    }

    /* ===== Typed hero ===== */
    // Updated list per PRD • docs/prd/core-copywriting-messaging.md
    const typedMsgs = [
      'Discord Bots.',
      'Telegram Utilities.',
      'Workflow Automation.',
      'AI Agents.',
      'Real-Money Games.',
      'Custom Solutions.'
    ];
    const typedEl = document.getElementById('typed');
    let ti=0, tj=0, del=false, pause=0;
    function typeLoop(){
      const current = typedMsgs[ti];
      if(!del){
        typedEl.textContent = current.slice(0, tj++) + '▌';
        if(tj > current.length){ del=true; pause=20; }
      }else{
        if(pause>0) pause--;
        else{
          typedEl.textContent = current.slice(0, tj--) + '▌';
          if(tj === 0){ del=false; ti=(ti+1)%typedMsgs.length; }
        }
      }
      setTimeout(typeLoop, del ? 18 : 24);
    }

    /* ===== Filesystem (toy) ===== */
    const FS = {
      '/': {type:'dir', children:['home','projects','about','readme.txt','etc']},
      '/home': {type:'dir', children:['guest']},
      '/home/guest': {type:'dir', children:['notes.txt','resume.txt','contacts.url']},
      '/projects': {type:'dir', children:['hyperviz','fintech-core','realtime-dashboard','ml-playground']},
      '/projects/hyperviz': {type:'dir', children:['case.md','stack.txt','open.url']},
      '/projects/fintech-core': {type:'dir', children:['case.md','stack.txt','open.url']},
      '/projects/realtime-dashboard': {type:'dir', children:['case.md','stack.txt','open.url']},
      '/projects/ml-playground': {type:'dir', children:['case.md','stack.txt','open.url']},
      '/about': {type:'dir', children:['skills.txt','toolchain.txt']},
      '/etc': {type:'dir', children:['motd','hosts','shadow'], hidden:true},
      '/vault': {type:'dir', children:['secrets.txt','keys.gpg','flag.txt'], hidden:true, restricted:true},

      '/readme.txt': {type:'file', content:`Welcome to the uplink.\r\n- Try: help, ls, cd projects, open hyperviz\r\n- Try: scan portfolio.dev\r\n- Hidden: help -a, sudo -s, godmode`},
      '/home/guest/notes.txt': {type:'file', content:`Notes\r\n- Motion-safe by default.\r\n- Command palette on Ctrl/Cmd+K.\r\n- Color themes: neon, matrix, amber.`},
      '/home/guest/resume.txt': {type:'file', content:`Resume\r\nRole: Frontend/Creative Engineer\r\nFocus: WebGL, motion systems, high-performance UX\r\nStack: JS/TS, Three.js, GSAP/Framer, WebAudio, GLSL\r\nImpact: +30–120% conversion lifts across projects`},
      '/home/guest/contacts.url': {type:'file', content:`mailto:your@email.com`},
      '/about/skills.txt': {type:'file', content:`Skills: WebGL, shaders, real-time data viz, design systems, perf budgets`},
      '/about/toolchain.txt': {type:'file', content:`Toolchain: Vite/Next/SvelteKit, r3f, Tailwind/vanilla-extract, Vercel, Resend`},
      '/etc/motd': {type:'file', content:`Authorized access only. All activity logged.`},
      '/etc/hosts': {type:'file', content:`127.0.0.1 localhost\r\n0.0.0.0 distraction.net`},
      '/etc/shadow': {type:'file', content:`guest:*:19876:0:99999:7:::`, restricted:true},

      '/projects/hyperviz/case.md': {type:'file', content:`Hyperviz 3D\r\nProblem: Static analytics bored decision-makers.\r\nSolution: WebGL + shaders + streamed data, 60fps.\r\nImpact: +48% engagement, +19% paid upgrades.`},
      '/projects/hyperviz/stack.txt': {type:'file', content:`Three.js, WebGL2, Instancing, Sockets, Workers`},
      '/projects/hyperviz/open.url': {type:'file', content:`https://example.com/hyperviz`},

      '/projects/fintech-core/case.md': {type:'file', content:`Fintech Core\r\nProblem: Complex payments flows, slow support.\r\nSolution: Audit-grade flows, realtime recon.\r\nImpact: -42% handling time, +23 NPS.`},
      '/projects/fintech-core/stack.txt': {type:'file', content:`React, Statecharts, WebSockets, Post-queue`},
      '/projects/fintech-core/open.url': {type:'file', content:`https://example.com/fintech`},

      '/projects/realtime-dashboard/case.md': {type:'file', content:`Realtime Dashboard\r\nProblem: Laggy monitoring.\r\nSolution: GPU-accelerated charts; backpressure control.\r\nImpact: 0 dropped frames, 99.99% uptime.`},
      '/projects/realtime-dashboard/stack.txt': {type:'file', content:`Canvas2D, OffscreenCanvas, SharedArrayBuffer`},
      '/projects/realtime-dashboard/open.url': {type:'file', content:`https://example.com/realtime`},

      '/projects/ml-playground/case.md': {type:'file', content:`ML Playground\r\nProblem: Models felt opaque.\r\nSolution: Interactive visualizations to teach intuition.\r\nImpact: +63% demo-to-trial.`},
      '/projects/ml-playground/stack.txt': {type:'file', content:`WebGL, WASM, GPU.js`},
      '/projects/ml-playground/open.url': {type:'file', content:`https://example.com/ml`},

      '/vault/secrets.txt': {type:'file', content:`FLAG{clients-love-cinematic-perf}`, restricted:true},
      '/vault/keys.gpg': {type:'file', content:`-----BEGIN PGP MESSAGE----- ***** -----END PGP MESSAGE-----`, restricted:true},
      '/vault/flag.txt': {type:'file', content:`Hire me → your@email.com`, restricted:true},
    };

    /* ===== Utilities ===== */
    function print(line='', cls=''){
      const div = document.createElement('div');
      div.className = 'line' + (cls? ' '+cls:'');
      div.textContent = line;
      out.appendChild(div);
      out.scrollTop = out.scrollHeight;
    }
    function printHTML(html){
      const div = document.createElement('div');
      div.className = 'line';
      div.innerHTML = html;
      out.appendChild(div);
      out.scrollTop = out.scrollHeight;
    }
    function promptStr(){
      return `${state.root?'root':'guest'}@portfolio:${displayPath(state.path)}$`;
    }
    function displayPath(p){
      return p === '/home/guest' ? '~' : p;
    }
    function normalize(path){
      const parts = path.split('/').filter(Boolean);
      const stack = [];
      for(const part of parts){
        if(part === '.') continue;
        if(part === '..') stack.pop();
        else stack.push(part);
      }
      return '/'+stack.join('/');
    }
    function resolve(p){
      if(!p || p.trim()==='') return state.path;
      if(p.startsWith('/')) return normalize(p);
      if(p.startsWith('~')) return normalize('/home/guest'+p.slice(1));
      return normalize(state.path + '/' + p);
    }
    function getNode(p){ return FS[p]; }
    function exists(p){ return !!FS[p]; }
    function isDir(p){ return exists(p) && FS[p].type==='dir'; }
    function isFile(p){ return exists(p) && FS[p].type==='file'; }
    function canAccess(p){
      const n = getNode(p);
      if(!n) return false;
      if(n.restricted && !state.root) return false;
      return true;
    }

    /* ===== Terminal logic ===== */
    function updatePrompt(){
      whoEl.textContent = state.root? 'root' : 'guest';
      cwdEl.textContent = displayPath(state.path);
    }
    function unknown(cmd){ print(`command not found: ${cmd}`, 'err'); beep(160, .07, .04); }
    function ls(args){
      const flags = new Set(args.filter(a=>a.startsWith('-')).join('').split(''));
      const showAll = flags.has('a');
      const target = args.filter(a=>!a.startsWith('-'))[0] || '.';
      const path = resolve(target);
      if(!exists(path)) return print(`ls: cannot access '${target}': No such file or directory`,'err');
      if(isFile(path)) return print(target);
      // directory
      const {children} = FS[path];
      const items = children.filter(name=>{
        const childPath = normalize(path + '/' + name);
        const node = FS[childPath] || FS[childPath] /* fallback */;
        const hidden = node?.hidden || (name.startsWith('.') );
        if(node?.restricted && !state.root) return false;
        if(hidden && !showAll && !state.root) return false;
        return true;
      });
      print(items.map(i=> (isDir(normalize(path+'/'+i)) ? i+'/' : i)).join('  '));
    }
    function cd(args){
      const target = args[0];
      if(!target) return state.path='/home/guest', updatePrompt();
      const path = resolve(target);
      if(!exists(path)) return print(`cd: no such file or directory: ${target}`,'err');
      if(!isDir(path)) return print(`cd: not a directory: ${target}`,'err');
      if(!canAccess(path)) return print(`cd: permission denied: ${target}`,'err');
      state.path = path; updatePrompt();
    }
    function pwd(){ print(state.path); }
    function whoami(){ print(state.root?'root':'guest'); }
    function cat(args){
      if(!args[0]) return print('cat: missing file operand','err');
      const p = resolve(args[0]);
      if(!exists(p)) return print(`cat: ${args[0]}: No such file`,'err');
      if(isDir(p)) return print(`cat: ${args[0]}: Is a directory`,'err');
      if(!canAccess(p)) return print(`cat: ${args[0]}: Permission denied`,'err');
      print(getNode(p).content);
    }
    async function clear(){ out.innerHTML=''; }
    async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
    async function scan(args){
      /* allow dots, colons and hyphens; place the - at the end of the class
         to avoid "Range out of order in character class" errors */
      const target = (args[0]||'localhost').replace(/[^a-zA-Z0-9.:\-]/g,'');
      print(`Scanning ${target} ...`);
      const ports = [22,80,443,8080,3000,5000,5432,6379];
      let open = [];
      for(let i=0;i<ports.length;i++){
        await sleep(120 + Math.random()*120);
        const p = ports[i];
        const openNow = Math.random() > .35;
        if(openNow) open.push(p);
        print(` - port ${p}/${p===22?'ssh':p===80?'http':p===443?'https':'tcp'}: ${openNow?'open':'closed'}`, openNow?'ok':'');
      }
      print(`Scan complete: ${open.length} open ports`);
    }
    async function ping(args){
      const target = args[0]||'127.0.0.1';
      for(let i=0;i<4;i++){
        const t = (Math.random()*30+4).toFixed(2);
        print(`Reply from ${target}: bytes=32 time=${t}ms TTL=58`);
        await sleep(220);
      }
      print(`Ping statistics for ${target}: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`);
    }
    function openCmd(args){
      const name = (args[0]||'').toLowerCase();
      if(!name) return print('open: missing target','err');
      // Project open
      const projPath = `/projects/${name}/open.url`;
      if(exists(projPath) && canAccess(projPath)){
        const url = FS[projPath].content.trim();
        print(`Opening ${name} → ${url}`);
        window.open(url, '_blank');
        return;
      }
      if(name==='contact'){ location.hash = '#contact'; return }
      if(name==='projects' || name==='work'){ location.hash = '#work'; return }
      if(name==='about'){ location.hash = '#about'; return }
      print(`open: cannot open '${name}'`,'err');
    }
    function theme(args){
      const t = (args[0]||'').toLowerCase();
      const allowed = ['neon','matrix','amber'];
      if(!allowed.includes(t)) return print(`theme: available → ${allowed.join(', ')}`);
      document.documentElement.setAttribute('data-theme', t);
      state.theme = t;
      print(`theme set to ${t}`, 'ok');
      // kick matrix color change
      AppController.modules.matrixBackground.updateTheme();
    }
    function resume(){ cat(['~/resume.txt']); }
    function email(){ print('Opening mail...'); window.location.href='mailto:your@email.com'; }
    function projects(){ location.hash = '#work'; print('Jumped to #work'); }
    async function sudo(args){
      const subcmd = args.join(' ').trim();
      if(subcmd==='-s' || subcmd==='su' || subcmd==='--shell'){
        state.pendingSudo = { escalate:true };
        return promptPassword();
      }
      if(!subcmd){ return print('usage: sudo <command>'); }
      if(!state.root){
        state.pendingSudo = {cmd: subcmd};
        return promptPassword();
      }else{
        print(`[sudo] running as root: ${subcmd}`, 'ok');
        runCommand(subcmd);
      }
    }
    function promptPassword(){
      print(`[sudo] password for ${state.user}: ••••••••`);
      state.awaitingPassword = true;
      state.tries++;
    }
    function hireme(){ print('Access granted ✔ — sending hiring intent...','ok'); location.hash = '#contact'; }

    /* Hidden/Easter commands */
    function godmode(){
      state.root = true; updatePrompt();
      showToast('GODMODE engaged.');
      revealVault();
    }
    function backdoor(){ godmode(); }
    function neo(){ theme(['matrix']); print('There is no spoon.','ok'); }
    function revealVault(){
      // add vault to root dir if hidden
      if(!FS['/'].children.includes('vault')){
        FS['/'].children.push('vault');
      }
      print('vault mounted at /vault', 'ok');
    }

    /* ===== Command router ===== */
    const router = {
      help(args){
        if(args[0]==='-a'){
          printHTML(`Commands:\r\n- help, help -a\r\n- ls [-a] [path], cd [path], pwd, whoami\r\n- cat <file>, open <target>, clear\r\n- projects, resume, email\r\n- scan <host>, ping <host>, theme <neon|matrix|amber>\r\n- sudo -s, sudo <cmd> (try: sudo hire-me)\r\n- Hidden: godmode, backdoor, neo, matrix, rain`);
          return;
        }
        printHTML(`Try commands:\r\n- ls, cd projects, cat readme.txt\r\n- open hyperviz, scan portfolio.dev, theme matrix\r\n- sudo -s (enter any pass after 2 tries)`);
      },
      ls, cd, pwd, whoami, cat, open: openCmd, clear, projects, resume, email, scan, ping, theme, sudo,
      'sudo hire-me': hireme,
      godmode, backdoor, neo,
      matrix(){ theme(['matrix']); },
      rain(){ 
        if(!state.motion){ 
          state.motion=true; 
          AppController.modules.matrixBackground.start(); 
          print('rain on','ok'); 
        } else { 
          state.motion=false; 
          AppController.modules.matrixBackground.stop(); 
          print('rain off','warn'); 
        } 
      },
    };

    /* ===== Command execution ===== */
    async function runCommand(raw){
      const line = raw.trim();
      if(!line) return;
      print(`${promptStr()} ${line}`, 'prompt');
      beep(520,.03,.03);
      // direct alias matching
      if(router[line]){ await router[line]([]); return; }
      const [cmd, ...args] = splitArgs(line);
      const fn = router[cmd];
      if(!fn) return unknown(cmd);
      try{
        const r = fn.length>0 ? await fn(args) : await fn(args); // basic await
        return r;
      }catch(e){
        print(`error: ${e.message || e}`, 'err');
      }
    }
    function splitArgs(s){
      // simple split, supports quoted
      /* match "double-quoted", 'single-quoted', or an unquoted non-space (\S) token */
      const re = /"([^"]+)"|'([^']+)'|(\S+)/g;
      const out = [];
      let m; while((m = re.exec(s))){ out.push(m[1]||m[2]||m[3]); }
      return out;
    }

    /* ===== Input / History ===== */
    document.getElementById('terminal').addEventListener('click', ()=> input.focus());
    input.addEventListener('keydown', async (e)=>{
      if(e.key === 'Enter'){
        e.preventDefault();
        const val = input.value;
        input.value='';
        if(state.awaitingPassword){
          // accept on 2nd try or specific pass
          const success = state.tries>1 || val==='letmein' || val==='hunter2';
          if(success){
            state.awaitingPassword=false; state.tries=0;
            state.root = true; state.user='root'; updatePrompt();
            print('Access granted ✔','ok'); beep(760,.05,.04);
            if(state.pendingSudo?.cmd){
              const cmd = state.pendingSudo.cmd;
              state.pendingSudo=null;
              await runCommand(cmd);
            }else if(state.pendingSudo?.escalate){
              revealVault();
              state.pendingSudo=null;
            }
          }else{
            print('Sorry, try again.','err'); beep(140,.08,.05);
          }
          return;
        }
        state.history.unshift(val); state.histIndex=-1;
        await runCommand(val);
      }else if(e.key === 'ArrowUp'){
        e.preventDefault();
        if(state.history.length && state.histIndex < state.history.length -1){
          state.histIndex++; input.value = state.history[state.histIndex];
          setTimeout(()=> input.setSelectionRange(input.value.length, input.value.length), 0);
        }
      }else if(e.key === 'ArrowDown'){
        e.preventDefault();
        if(state.histIndex>0){ state.histIndex--; input.value=state.history[state.histIndex]; }
        else{ state.histIndex=-1; input.value=''; }
      }else if(e.key === 'Tab'){
        e.preventDefault();
        // naive tab completion for commands
        const val = input.value.trim();
        const [cmd, ...rest] = splitArgs(val);
        if(!cmd) return;
        const cmds = Object.keys(router).filter(c=>c.startsWith(cmd));
        if(cmds.length===1){ input.value = cmds[0] + (rest.length? ' '+rest.join(' '):''); }
      }
    });

    /* ===== Palette ===== */
    const actions = [
      {title:'Open: Projects', run:()=>{location.hash='#work'}},
      {title:'Open: About', run:()=>{location.hash='#about'}},
      {title:'Open: Contact', run:()=>{location.hash='#contact'}},
      {title:'Run: sudo hire-me', run:()=>runCommand('sudo hire-me')},
      {title:'Run: scan portfolio.dev', run:()=>runCommand('scan portfolio.dev')},
      {title:'Theme: neon', run:()=>theme(['neon'])},
      {title:'Theme: matrix', run:()=>theme(['matrix'])},
      {title:'Theme: amber', run:()=>theme(['amber'])},
      {title:'Toggle: rain', run:()=>runCommand('rain')},
      {title:'Toggle: sound', run:()=>toggleSound()},
      {title:'Secret: godmode', run:()=>runCommand('godmode')},
    ];
    let palSel = 0;
    function openPalette(){
      palette.setAttribute('aria-hidden','false');
      palInput.value=''; palSel=0; renderPalList(actions);
      palInput.focus();
    }
    function closePalette(){ palette.setAttribute('aria-hidden','true'); }
    function renderPalList(list){
      palList.innerHTML='';
      list.forEach((a,idx)=>{
        const item = document.createElement('div');
        item.className='pal-item';
        item.setAttribute('aria-selected', String(idx===palSel));
        item.innerHTML = `<span>${a.title}</span><span>↩︎</span>`;
        item.addEventListener('click',()=>{ a.run(); closePalette(); });
        palList.appendChild(item);
      });
    }
    palInput.addEventListener('input', ()=>{
      const q = palInput.value.toLowerCase().trim();
      const filtered = actions.filter(a=>a.title.toLowerCase().includes(q));
      palSel=0; renderPalList(filtered);
    });
    palette.addEventListener('keydown', (e)=>{
      const items = Array.from(palList.children);
      if(e.key==='Escape'){ closePalette(); input.focus(); }
      if(e.key==='ArrowDown'){ palSel=Math.min(palSel+1, items.length-1); updateSel(items); e.preventDefault(); }
      if(e.key==='ArrowUp'){ palSel=Math.max(palSel-1, 0); updateSel(items); e.preventDefault(); }
      if(e.key==='Enter'){ const q = palInput.value.toLowerCase().trim();
        const list = actions.filter(a=>a.title.toLowerCase().includes(q));
        if(list[palSel]){ list[palSel].run(); closePalette(); }
      }
    });
    function updateSel(items){ items.forEach((el,i)=>el.setAttribute('aria-selected', String(i===palSel))); }

    /* ===== Konami Code ===== */
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a','Enter'];
    window.addEventListener('keydown', (e)=>{
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openPalette(); return; }
      if(KONAMI[state.konamiIdx]?.toLowerCase() === e.key.toLowerCase()){
        state.konamiIdx++;
        if(state.konamiIdx===KONAMI.length){
          state.konamiIdx=0; godmode(); theme(['amber']); beep(880,.08,.05);
        }
      }else{
        state.konamiIdx = 0;
      }
    });

    /* ===== Toggles ===== */
    function toggleMotion(){
      state.motion = !state.motion;
      motionToggle.textContent = state.motion ? 'motion' : 'motion*';
      if(state.motion) {
        AppController.modules.matrixBackground.start();
      } else {
        AppController.modules.matrixBackground.stop();
      }
    }
    function toggleSound(){
      state.sound = !state.sound;
      soundToggle.textContent = state.sound ? 'sound' : 'sound*';
      if(state.sound) beep(600,.05,.04);
    }
    function toggleTheme(){
      const order = ['neon','matrix','amber'];
      const idx = order.indexOf(state.theme);
      const next = order[(idx+1)%order.length];
      theme([next]);
    }
    motionToggle?.addEventListener('click', (e)=>{ e.preventDefault(); toggleMotion(); });
    soundToggle?.addEventListener('click', (e)=>{ e.preventDefault(); toggleSound(); });
    themeToggle?.addEventListener('click', (e)=>{ e.preventDefault(); toggleTheme(); });

    /* ===== Cards tilt / modal ===== */
    const projectsData = {
      'hyperviz': {
        title:'Hyperviz 3D',
        body:`<p><b>Problem:</b> Static analytics bored decision-makers.</p>
              <p><b>Solution:</b> WebGL + shaders + streamed data (60fps).</p>
              <p><b>Impact:</b> +48% engagement, +19% paid upgrades.</p>
              <p><b>Stack:</b> Three.js, WebGL2, Sockets, Workers</p>`
      },
      'fintech-core': {
        title:'Fintech Core',
        body:`<p><b>Problem:</b> Complex payments flows, slow support.</p>
              <p><b>Solution:</b> Audit-grade UX, realtime reconciliation.</p>
              <p><b>Impact:</b> -42% handling time, +23 NPS.</p>
              <p><b>Stack:</b> React, Statecharts, WebSockets</p>`
      },
      'realtime-dashboard': {
        title:'Realtime Dashboard',
        body:`<p><b>Problem:</b> Laggy monitoring.</p>
              <p><b>Solution:</b> GPU-accelerated charts; backpressure control.</p>
              <p><b>Impact:</b> 0 dropped frames, 99.99% uptime.</p>`
      },
      'ml-playground': {
        title:'ML Playground',
        body:`<p><b>Problem:</b> Models felt opaque.</p>
              <p><b>Solution:</b> Interactive visualizations to teach intuition.</p>
              <p><b>Impact:</b> +63% demo-to-trial.</p>`
      },
    };
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('mousemove', (e)=>{
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y - r.height/2)/r.height)*-8;
        const ry = ((x - r.width/2)/r.width)*8;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        card.querySelector('.shine').style.setProperty('--mx', (x/r.width*100)+'%');
        card.querySelector('.shine').style.setProperty('--my', (y/r.height*100)+'%');
      });
      card.addEventListener('mouseleave', ()=> card.style.transform='rotateX(0) rotateY(0)');
      card.addEventListener('click', ()=>{
        const key = card.getAttribute('data-project');
        const d = projectsData[key];
        if(!d) return;
        modalContent.innerHTML = `<h3>${d.title}</h3>${d.body}<p><a href="#" onclick="window.runCommand('open ${key}'); return false;">Open project ↗</a></p>`;
        modal.setAttribute('aria-hidden','false');
      });
    });
    modalClose.addEventListener('click',()=> modal.setAttribute('aria-hidden','true'));
    modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });

    /* ===== Secret brand click (Alt) ===== */
    brand.addEventListener('click', (e)=>{
      if(e.altKey){ godmode(); }
    });

    /* ===== Toast ===== */
    let toastTimer=null;
    function showToast(msg){
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(()=> toast.classList.remove('show'), 2200);
    }

    /* ===== Init ===== */
    function init(){
      updatePrompt();
      typeLoop();
      if(state.motion) {
        AppController.modules.matrixBackground.start();
      }
      window.addEventListener('resize', ()=>{ 
        // Resize is handled by the MatrixBackground module
      });
      document.addEventListener('keydown', (e)=>{ if(palette.getAttribute('aria-hidden')==='false') return; if(e.key==='/'){ input.focus(); e.preventDefault(); } });
    }
    init();

    /* expose runCommand for modal link */
    window.runCommand = runCommand;

    /* ===== Motion respect ===== */
    if(prefersReduced.matches){
      state.motion=false;
      motionToggle.textContent = 'motion*';
    }

    /* ===== Palette open/close ===== */
    document.addEventListener('keydown', (e)=>{
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){
        e.preventDefault(); openPalette();
      }
    });
    palette.addEventListener('click',(e)=>{ if(e.target===palette) closePalette(); });
  },

  /**
   * Story 1.3 – CRT TV "turn-on" transition animation.
   * Adds the `.transitioning` class to #boot-screen which triggers CSS
   * keyframes. Once the animation ends, the boot screen is removed and the
   * main portfolio is revealed, followed by normal main-initialisation.
   */
  transitionToMainView() {
    const bootScreen    = document.getElementById('boot-screen');
    const mainPortfolio = document.getElementById('main-portfolio');
    if (!bootScreen || !mainPortfolio) {
      // Fallback: nothing to transition, just show main.
      if (mainPortfolio) mainPortfolio.style.display = 'block';
      this.initMain();
      return;
    }

    // Trigger CSS animation
    bootScreen.classList.add('transitioning');
    /* page-wide class so CSS can add filters during reveal */
    document.documentElement.classList.add('tv-revealing');

    /* Show content behind the mask immediately */
    if (mainPortfolio) mainPortfolio.style.display = 'block';

    /* Kick off main initialisation early so animations (typed, matrix) start */
    if (!this.mainInitialised) {
      this.initMain();
    }

    // One-time animation end handler
    let executed = false;
    const onEnd = () => {
      if (executed) return;           // guard: ensure only once
      executed = true;
      bootScreen.removeEventListener('animationend', onEnd);
      document.documentElement.classList.remove('tv-revealing');

      /* ----- Chaos impact flicker : repeat every 10 s, respect reduced-motion & hidden tab ----- */
      const html = document.documentElement;
      // base class stays on html for lifetime
      html.classList.add('impact-flicker-chaos');

      const prefersReduced =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const runChaos = () => {
        html.classList.add('impact-run');
        setTimeout(() => html.classList.remove('impact-run'), 650);
      };

      // fire initial impact right now
      runChaos();

      // schedule repeats every 10 s (if motion allowed)
      if (!prefersReduced) {
        clearInterval(window._impactChaosInterval);
        window._impactChaosInterval = setInterval(() => {
          if (document.hidden) return; // don't flicker when tab not visible
          runChaos();
        }, 10000);
      }

      bootScreen.style.display = 'none';
      /* Ensure main is initialised exactly once */
      if (!this.mainInitialised) {
        this.initMain();
      }
    };
    // Primary listener
    bootScreen.addEventListener('animationend', onEnd, { once: true });
    // Fallback timeout (in case animationend never fires)
    setTimeout(onEnd, 1600); // matches CSS duration + small buffer
  }
};

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AppController.init();
});
