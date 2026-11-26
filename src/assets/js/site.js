// Mitch Gainey: site behaviour. No dependencies.
(() => {
  const doc = document.documentElement;
  doc.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const burger = document.querySelector('.burger');
  if (burger) {
    const toggle = open => {
      doc.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', () => toggle(!doc.classList.contains('menu-open')));
    document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => toggle(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  // Trainings dropdown: click support for touch / keyboard
  document.querySelectorAll('.dd > button').forEach(btn => {
    const dd = btn.parentElement;
    btn.addEventListener('click', () => {
      const open = !dd.classList.contains('open');
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
  });

  // Reveal on scroll
  const rv = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(el => el.classList.add('on'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(el => io.observe(el));
  }

  // Breathing orb (home): 4s in, 4s out
  const orbit = document.getElementById('orbit');
  if (orbit) {
    const t = orbit.querySelector('span');
    let inhale = false;
    const step = () => { inhale = !inhale; orbit.classList.toggle('in', inhale); t.textContent = inhale ? 'breathe out' : 'breathe in'; };
    setTimeout(step, 300);
    if (!reduce) setInterval(step, 4000);
  }

  // Rotating testimonials (home)
  const vq = document.getElementById('vq');
  if (vq) {
    const Q = JSON.parse(vq.dataset.quotes);
    const dots = document.getElementById('qdots');
    let qi = 0, timer;
    const show = i => {
      qi = i; vq.style.opacity = 0;
      setTimeout(() => { vq.innerHTML = `<blockquote>${Q[i][0]}</blockquote><cite>${Q[i][1]}</cite>`; vq.style.opacity = 1; }, 400);
      [...dots.children].forEach((d, j) => d.setAttribute('aria-current', j === i));
    };
    Q.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      b.onclick = () => { show(i); clearInterval(timer); };
      dots.appendChild(b);
    });
    dots.children[0].setAttribute('aria-current', true);
    vq.style.transition = 'opacity .4s';
    if (!reduce) timer = setInterval(() => show((qi + 1) % Q.length), 8000);
  }

  // Contact form → /api/contact (Cloudflare Pages Function). Falls back to email.
  const form = document.getElementById('contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'form-status'; btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = 'Thank you. Your message has been sent and Mitch will be in touch soon.';
        status.className = 'form-status ok';
      } catch {
        status.innerHTML = 'Sorry, the form could not be sent just now. Please email <a href="mailto:Mitch@becomeproject.com.au">Mitch@becomeproject.com.au</a> instead.';
        status.className = 'form-status err';
      } finally { btn.disabled = false; btn.textContent = 'Send message'; }
    });
  }
})();
