const SUPABASE_URL = 'https://slcksfqbsbcmvqupbhox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY2tzZnFic2JjbXZxdXBiaG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTk1NTksImV4cCI6MjA4ODI3NTU1OX0.Uv3yUk7s1ASmvwra0bYjZDLXTB8LRDNU9qeDfuuyk4I';
const SITE_DOMAIN = 'carreleur-mirande32.fr';

function initReviews() {
  const container = document.getElementById('avis-widget');
  if (!container) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      loadReviews(container);
    }
  }, { rootMargin: '200px' });
  observer.observe(container);
}

async function loadReviews(container) {
  try {
    const res = await fetch(SUPABASE_URL + '/functions/v1/site-google-reviews?domain=' + SITE_DOMAIN, {
      headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (!data.reviews?.length) return;
    renderReviews(container, data);
  } catch {}
}

function escHtml(s) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(s));
  return d.innerHTML;
}

function renderReviews(container, data) {
  const rating = data.rating || '5.0';
  const count = data.total || data.reviews.length;
  const ratingNum = Math.max(0, Math.min(5, Math.round(parseFloat(rating))));
  const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);

  let html = '<div class="avis-header"><span class="avis-stars" style="color:#F59E0B">' + stars + '</span> <strong>' + escHtml(String(rating)) + '</strong>/5 — ' + escHtml(String(count)) + ' avis Google</div>';
  html += '<div class="avis-carousel"><div class="avis-track">';
  for (const r of data.reviews.slice(0, 6)) {
    html += '<div class="avis-card"><p class="avis-text">"' + escHtml((r.comment || 'Excellent service !').substring(0, 200)) + '"</p><p class="avis-author">— ' + escHtml(r.reviewer_name || 'Client') + '</p></div>';
  }
  html += '</div></div>';
  container.innerHTML = html;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initReviews);
else initReviews();
