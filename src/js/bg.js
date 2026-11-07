export function createGitGraph(canvas) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let W = 0;
  let H = 0;
  let lanes = [];
  let raf = 0;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  function css(v) {
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  }

  function bgFill() {
    return css('--bg');
  }

  function size() {
    W = innerWidth;
    H = innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(4, Math.round(H / 130));
    lanes = Array.from({ length: n }, (_, i) => {
      const y = ((i + 0.5) * H) / n;
      const dots = [];
      for (let x = Math.random() * 120; x < W + 240; x += 90 + Math.random() * 110) {
        dots.push(x);
      }
      return { y, dots, speed: 0.12 + Math.random() * 0.22 };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const line = css('--line');
    const acc = css('--accent');
    ctx.lineWidth = 1.5;

    lanes.forEach((L, li) => {
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(0, L.y);
      ctx.lineTo(W, L.y);
      ctx.stroke();

      const nxt = lanes[li + 1];
      L.dots.forEach((x, di) => {
        if (nxt && di % 3 === li % 3) {
          ctx.beginPath();
          ctx.moveTo(x, L.y);
          ctx.bezierCurveTo(x + 70, L.y, x + 20, nxt.y, x + 90, nxt.y);
          ctx.stroke();
        }
      });

      L.dots.forEach((x, di) => {
        ctx.beginPath();
        ctx.arc(x, L.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = di % 5 === 0 ? acc : bgFill();
        ctx.fill();
        ctx.strokeStyle = di % 5 === 0 ? acc : line;
        ctx.stroke();
      });

      if (!reduce) {
        L.dots = L.dots.map((x) => x - L.speed);
        if (L.dots[0] < -120) L.dots.shift();
        const last = L.dots[L.dots.length - 1];
        if (last < W + 100) L.dots.push(last + 90 + Math.random() * 110);
      }
    });

    if (!reduce) raf = requestAnimationFrame(draw);
  }

  size();
  draw();

  const onResize = () => {
    size();
    if (reduce) draw();
  };
  addEventListener('resize', onResize);

  return {
    redraw() {
      if (reduce) draw();
    },
    destroy() {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
    },
  };
}
