const SUPABASE_URL = 'https://slcksfqbsbcmvqupbhox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY2tzZnFic2JjbXZxdXBiaG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTk1NTksImV4cCI6MjA4ODI3NTU1OX0.Uv3yUk7s1ASmvwra0bYjZDLXTB8LRDNU9qeDfuuyk4I';
const SITE_DOMAIN = 'carreleur-mirande32.fr';
const SITE_NAME = 'ABC Entreprise TEST';
const PARTNER_EMAIL = 'contact@carreleur-mirande32.fr';

document.querySelectorAll('form[data-contact-form]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const honeypot = fd.get('website');
    if (honeypot) return;

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours...'; }

    try {
      await fetch(SUPABASE_URL + '/functions/v1/site-form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY },
        body: JSON.stringify({
          site_domain: SITE_DOMAIN, partner_name: SITE_NAME, partner_email: PARTNER_EMAIL,
          visitor_name: fd.get('nom') || '', visitor_phone: fd.get('telephone') || '',
          visitor_email: fd.get('email') || '', visitor_city: fd.get('ville') || '',
          service_type: fd.get('prestation') || '', message: fd.get('message') || '',
          page_url: window.location.href, honeypot: ''
        })
      });
    } catch {}

    const success = form.querySelector('.form-success');
    if (success) { form.style.display = 'none'; success.style.display = 'block'; }
    else { form.innerHTML = '<p style="text-align:center;color:#22c55e;font-weight:600;padding:2rem;">Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous 24h.</p>'; }
  });
});
