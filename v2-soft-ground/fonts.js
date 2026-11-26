// Heading-font options for Soft Ground (preview only).
// Each option: CSS family, stylesheet URL, light/regular weights, whether it has a true italic,
// font-size-adjust to keep sizes comparable with Cormorant's small x-height, and tracking.
window.MG_FONTS = [
  { key: 'cormorant', name: 'Cormorant', note: 'Current. Delicate, classical, light.', source: 'Google Fonts',
    family: 'Cormorant, serif', css: 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap',
    light: 300, reg: 400, italic: true, fsa: 'none', ls: '-.01em' },
  { key: 'fraunces', name: 'Fraunces Soft', note: 'Warm, rounded serif. Gentle without being frail.', source: 'Google Fonts',
    family: '"Fraunces", serif', css: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..600,100;1,9..144,300..600,100&display=swap',
    light: 300, reg: 400, italic: true, fsa: '0.42', ls: '-.02em', fvs: '"SOFT" 100' },
  { key: 'newsreader', name: 'Newsreader Display', note: 'Quiet and literary. Reads like a good book.', source: 'Google Fonts',
    family: '"Newsreader", serif', css: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500&display=swap',
    light: 300, reg: 400, italic: true, fsa: '0.42', ls: '-.02em' },
  { key: 'gambetta', name: 'Gambetta', note: 'Contemporary, elegant serif with crisp detail.', source: 'Fontshare (free)',
    family: '"Gambetta", serif', css: 'https://api.fontshare.com/v2/css?f[]=gambetta@300,400,500,300i,400i&display=swap',
    light: 300, reg: 400, italic: true, fsa: '0.42', ls: '-.02em' },
  { key: 'erode', name: 'Erode', note: 'Soft wedge serifs. Organic and approachable.', source: 'Fontshare (free)',
    family: '"Erode", serif', css: 'https://api.fontshare.com/v2/css?f[]=erode@300,400,500,300i,400i&display=swap',
    light: 300, reg: 400, italic: true, fsa: '0.42', ls: '-.02em' },
  { key: 'young', name: 'Young Serif', note: 'Sturdy and friendly, old-style warmth. No italic.', source: 'Google Fonts',
    family: '"Young Serif", serif', css: 'https://fonts.googleapis.com/css2?family=Young+Serif&display=swap',
    light: 400, reg: 400, italic: false, fsa: '0.40', ls: '-.02em' },
  { key: 'hedvig', name: 'Hedvig Letters Serif', note: 'Modern humanist serif, calm and clear. No italic.', source: 'Google Fonts',
    family: '"Hedvig Letters Serif", serif', css: 'https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&display=swap',
    light: 400, reg: 400, italic: false, fsa: '0.40', ls: '-.02em' },
  { key: 'instrument', name: 'Instrument Serif', note: 'Condensed and editorial. More fashion than therapy.', source: 'Google Fonts',
    family: '"Instrument Serif", serif', css: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap',
    light: 400, reg: 400, italic: true, fsa: '0.44', ls: '-.01em' },
  { key: 'bricolage', name: 'Bricolage Grotesque', note: 'A characterful sans. Modern, less traditional therapy feel. No italic.', source: 'Google Fonts',
    family: '"Bricolage Grotesque", sans-serif', css: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..500&display=swap',
    light: 300, reg: 400, italic: false, fsa: '0.40', ls: '-.035em' },
];

// Apply a font to the current document by setting CSS variables.
window.MG_applyFont = function (key) {
  const f = MG_FONTS.find(x => x.key === key) || MG_FONTS[0];
  const r = document.documentElement.style;
  r.setProperty('--display', f.family);
  r.setProperty('--d-light', f.light);
  r.setProperty('--d-reg', f.reg);
  r.setProperty('--d-fsa', f.fsa);
  r.setProperty('--d-ls', f.ls);
  r.setProperty('--d-fvs', f.fvs || 'normal');
  r.setProperty('--d-em', f.italic ? 'italic' : 'normal');
  if (!document.querySelector(`link[data-font="${f.key}"]`)) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = f.css; l.dataset.font = f.key;
    document.head.appendChild(l);
  }
  document.documentElement.dataset.font = f.key;
  return f;
};
