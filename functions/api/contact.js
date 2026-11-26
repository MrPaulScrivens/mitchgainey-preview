// Cloudflare Pages Function: POST /api/contact
// Emails contact-form submissions to Mitch via Resend (https://resend.com).
//
// Set these in Cloudflare Pages → Settings → Variables and Secrets:
//   RESEND_API_KEY  (secret)  Resend API key
//   CONTACT_FROM              e.g. "Mitch Gainey website <website@mitchgainey.com>" (domain verified in Resend)
//   CONTACT_TO                optional, defaults to Mitch@becomeproject.com.au

const MAX = { first_name: 100, last_name: 100, email: 200, phone: 50, topic: 100, message: 5000 };

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (ok, status, msg) => wantsJson
    ? Response.json({ ok, message: msg }, { status })
    : Response.redirect(new URL(ok ? '/contact/?sent=1' : '/contact/?error=1', request.url), 303);

  let form;
  try { form = await request.formData(); } catch { return reply(false, 400, 'Invalid form'); }

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (form.get('website')) return reply(true, 200, 'ok');

  const data = {};
  for (const [k, max] of Object.entries(MAX)) data[k] = String(form.get(k) || '').trim().slice(0, max);
  if (!data.first_name || !data.last_name || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return reply(false, 422, 'Please complete the required fields.');
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM) return reply(false, 503, 'Email is not configured yet.');

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const name = `${data.first_name} ${data.last_name}`;
  const rows = [['Name', name], ['Email', data.email], ['Phone', data.phone || '—'], ['About', data.topic || '—']];
  const html = `<h2 style="font-family:Georgia,serif;font-weight:400">New message from the website</h2>
<table cellpadding="6" style="font-family:sans-serif;font-size:15px">${rows.map(([k, v]) => `<tr><td style="color:#5f665a">${k}</td><td>${esc(v)}</td></tr>`).join('')}</table>
<p style="font-family:sans-serif;font-size:15px;white-space:pre-wrap;border-left:3px solid #c98d6b;padding-left:14px">${esc(data.message)}</p>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${data.message}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO || 'Mitch@becomeproject.com.au'],
      reply_to: data.email,
      subject: `Website enquiry: ${data.topic || 'General'} (${name})`,
      html, text,
    }),
  });
  if (!res.ok) return reply(false, 502, 'Could not send just now.');
  return reply(true, 200, 'Sent');
}

export const onRequest = () => new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
