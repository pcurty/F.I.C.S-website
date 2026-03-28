/* ============================================================
  F.I.C.S. INGÉNIERIE — Script principal
  Modules :
    1. Horloge temps réel (barre de diagnostic)
    2. Révélation au scroll (Intersection Observer)
    3. Compteurs animés (section stats)
    4. Gestion du formulaire de contact
    5. Navigation active au scroll
============================================================ */

/* ── 1. HORLOGE TEMPS RÉEL ── */
function updateClock() {
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  const s   = String(now.getSeconds()).padStart(2, '0');
  const el  = document.getElementById('clock');
  if (el) el.textContent = `${h}:${m}:${s}`;
}

updateClock();
setInterval(updateClock, 1000);

/* ── 2. RÉVÉLATION AU SCROLL ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 3. COMPTEURS ANIMÉS ── */

/**
 * Anime un compteur de 0 jusqu'à `target` en `duration` ms.
 * @param {HTMLElement} container - L'élément .stat-item parent
 * @param {number}      target    - Valeur finale
 * @param {string}      suffix    - Suffixe affiché (%, h, x, /7…)
 */
function animateCounter(container, target, suffix) {
  const duration = 1800;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing : ease-out cubique
    const eased    = 1 - Math.pow(1 - progress, 3);

    container.querySelector('.stat-number').innerHTML =
      Math.round(eased * target) + '<span>' + suffix + '</span>';

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl   = entry.target;
        const target  = parseInt(numEl.dataset.target, 10);
        const suffixEl = numEl.querySelector('span');
        const suffix  = suffixEl ? suffixEl.textContent : '';

        if (!isNaN(target)) {
          animateCounter(numEl.parentElement, target, suffix);
        }

        statObserver.unobserve(numEl);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));

/* ── 4. FORMULAIRE DE CONTACT ── */

/**
 * Gère la soumission du formulaire :
 * - Affiche un retour visuel de succès
 * - Réinitialise le bouton après 4 secondes
 * @param {Event} e - Événement submit
 */
function handleSubmit(e) {
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');

  // État : succès
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        width="14" height="14">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Demande envoyée — Merci !
  `;
  btn.style.background = '#1a5c35';
  btn.style.color      = '#00FF88';

  // Réinitialisation après 4s
  setTimeout(() => {
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          width="14" height="14">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Envoyer la demande d'audit
    `;
    btn.style.background = 'var(--orange)';
    btn.style.color      = 'var(--carbon)';
  }, 4000);
}

/* ── 5. NAVIGATION ACTIVE AU SCROLL ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener(
  'scroll',
  () => {
    let current = '';

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.style.color =
        link.getAttribute('href') === '#' + current
          ? 'var(--orange)'
          : '';
    });
  },
  { passive: true }
);
