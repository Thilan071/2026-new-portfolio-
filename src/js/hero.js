const ME = {
  name: 'Thilan Theekshana',
  role: 'Full-stack developer',
  stack: ['Flutter', 'React', 'Next.js', 'Firebase'],
};

export function initHero() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  const nameEl = $('name');
  if (nameEl) {
    [...ME.name].forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = `${0.05 * i + 0.2}s`;
      nameEl.appendChild(s);
    });
    nameEl.setAttribute('aria-label', ME.name);
  }

  const stackStr = ME.stack.map((x) => `"${x}"`).join(', ');
  const SRC = [
    ['k', 'const '],
    ['v', 'dev'],
    ['', '  = {\n'],
    ['', '  '],
    ['p', 'name'],
    ['', ': '],
    ['s', `"${ME.name}"`],
    ['', ',\n'],
    ['', '  '],
    ['p', 'role'],
    ['', ': '],
    ['s', `"${ME.role}"`],
    ['', ',\n'],
    ['', '  '],
    ['p', 'stack'],
    ['', ': ['],
    ['s', stackStr],
    ['', '],\n'],
    ['', '  '],
    ['p', 'shipping'],
    ['', ': '],
    ['k', 'true'],
    ['', ',\n'],
    ['', '};\n\n'],
    ['v', 'dev'],
    ['', '.'],
    ['p', 'build'],
    ['', '();'],
  ];

  const TERM = [
    ['d', '$ '],
    ['', 'npm run build\n'],
    ['BAR'],
    ['ok', '✓ '],
    ['', '142 modules compiled\n'],
    ['ok', '✓ '],
    ['', '86/86 tests passed\n'],
    ['ok', '✓ '],
    ['', 'deployed in 1.8s'],
  ];

  const code = $('code');
  const term = $('term');
  const caret = $('caret');
  if (!code || !term || !caret) return;

  let run = 0;

  async function typeInto(host, segs, id, speed) {
    for (const seg of segs) {
      if (id !== run) return false;
      const [cls, text] = seg;
      if (cls === 'BAR') {
        if (!(await bar(host, id))) return false;
        continue;
      }
      const span = document.createElement('span');
      if (cls) span.className = cls;
      host.appendChild(span);
      if (reduce) {
        span.textContent = text;
        continue;
      }
      for (const ch of text) {
        if (id !== run) return false;
        span.textContent += ch;
        await sleep(ch === '\n' ? 140 : speed + Math.random() * 40);
      }
    }
    return true;
  }

  async function bar(host, id) {
    const span = document.createElement('span');
    span.className = 's';
    host.appendChild(span);
    const N = 24;
    for (let i = 0; i <= N; i += 1) {
      if (id !== run) return false;
      span.textContent = `[${'█'.repeat(i)}${'░'.repeat(N - i)}] ${Math.round((i / N) * 100)}%\n`;
      await sleep(45);
    }
    return true;
  }

  async function loop() {
    while (true) {
      const id = ++run;
      code.textContent = '';
      term.textContent = '';
      caret.style.display = '';
      await sleep(900);
      if (!(await typeInto(code, SRC, id, 38))) continue;
      await sleep(500);
      if (!(await typeInto(term, TERM, id, 22))) continue;
      caret.style.display = 'none';
      if (reduce) return;
      await sleep(5500);
    }
  }

  loop();
}
