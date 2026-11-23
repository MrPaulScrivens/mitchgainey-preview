// Preview-only version switcher. Remove before launch.
(() => {
  const V = [
    ['current', 'Current'],
    ['v1-editorial', '1 · Editorial'],
    ['v2-soft-ground', '2 · Soft Ground'],
    ['v3-clear-practice', '3 · Clear Practice'],
    ['v4-nocturne', '4 · Nocturne'],
  ];
  const parts = location.pathname.split('/').filter(Boolean);
  const here = parts.findIndex(p => V.some(v => v[0] === p));
  if (here < 0) return;
  const cur = parts[here];
  const base = '/' + parts.slice(0, here).join('/') + (here ? '/' : '');
  const idx = V.findIndex(v => v[0] === cur);
  const go = i => { location.href = base + V[(i + V.length) % V.length][0] + '/'; };

  const css = `
  #mg-sw{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:4px;padding:5px;background:rgba(20,22,18,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:999px;box-shadow:0 12px 32px -10px rgba(0,0,0,.5);font:500 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#eee;letter-spacing:normal;text-transform:none;text-align:left;mix-blend-mode:normal;max-width:calc(100vw - 20px);overflow-x:auto;scrollbar-width:none}
  #mg-sw::-webkit-scrollbar{display:none}
  #mg-sw a,#mg-sw button{all:unset;font:inherit;letter-spacing:normal;text-transform:none;cursor:pointer;padding:9px 14px;border-radius:999px;white-space:nowrap;color:#cfcfc8;transition:background .2s,color .2s}
  #mg-sw a:hover,#mg-sw button:hover{background:rgba(255,255,255,.1);color:#fff}
  #mg-sw a[aria-current=page]{background:#ebe4d6;color:#151812}
  #mg-sw .arr{padding:9px 11px;color:#999}
  #mg-sw a:focus-visible,#mg-sw button:focus-visible{outline:2px solid #c9a66b;outline-offset:1px}
  #mg-sw.min a:not(.home){display:none}
  @media(max-width:700px){#mg-sw a:not([aria-current]){display:none}#mg-sw a.home{display:inline-block}}
  @media print{#mg-sw{display:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const bar = document.createElement('div'); bar.setAttribute('role', 'navigation');
  bar.id = 'mg-sw'; bar.setAttribute('aria-label', 'Design versions');
  const prev = document.createElement('button'); prev.className = 'arr'; prev.textContent = '←'; prev.title = 'Previous (←)'; prev.onclick = () => go(idx - 1);
  const next = document.createElement('button'); next.className = 'arr'; next.textContent = '→'; next.title = 'Next (→)'; next.onclick = () => go(idx + 1);
  const home = document.createElement('a'); home.className = 'home'; home.href = base; home.textContent = '⌂'; home.title = 'All versions';
  bar.append(home, prev);
  V.forEach(([slug, label], i) => {
    const a = document.createElement('a'); a.href = base + slug + '/'; a.textContent = label;
    if (i === idx) a.setAttribute('aria-current', 'page');
    bar.appendChild(a);
  });
  bar.appendChild(next);
  document.body.appendChild(bar);

  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select,[contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowLeft') go(idx - 1);
    if (e.key === 'ArrowRight') go(idx + 1);
  });
})();
