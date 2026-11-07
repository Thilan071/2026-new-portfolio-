import { createGitGraph } from './js/bg.js';
import { initHero } from './js/hero.js';
import './js/rocket-layer.js';

const canvas = document.getElementById('bg');
const graph = canvas ? createGitGraph(canvas) : null;

initHero();

document.getElementById('year').textContent = String(new Date().getFullYear());

const themeBtn = document.getElementById('theme');
themeBtn?.addEventListener('click', () => {
  const root = document.documentElement;
  const dark = matchMedia('(prefers-color-scheme: dark)').matches;
  const cur = root.dataset.theme || (dark ? 'dark' : 'light');
  root.dataset.theme = cur === 'dark' ? 'light' : 'dark';
  graph?.redraw();
});

const menuBtn = document.querySelector('.nav__menu');
const mobileNav = document.querySelector('.mobile-nav');

menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  mobileNav.hidden = open;
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  });
});

document.querySelectorAll('.nav__links a, .nav__brand, .cta a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.36)}s`;
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

const recsRoot = document.querySelector('[data-recs]');
if (recsRoot) {
  const slides = [...recsRoot.querySelectorAll('[data-rec-slide]')];
  const dotsWrap = recsRoot.querySelector('[data-rec-dots]');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `recs__dot${i === 0 ? ' is-active' : ''}`;
    dot.setAttribute('aria-label', `Show recommendation ${i + 1}`);
    dot.addEventListener('click', () => showRec(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll('.recs__dot')];

  function showRec(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
      dots[i].classList.toggle('is-active', active);
    });
  }

  recsRoot.querySelector('[data-rec-prev]')?.addEventListener('click', () => showRec(index - 1));
  recsRoot.querySelector('[data-rec-next]')?.addEventListener('click', () => showRec(index + 1));
}

const galleries = {
  kandy: [
    { src: '/projects/kandy-erp-1.png', alt: 'Module ERP owner dashboard' },
    { src: '/projects/kandy-erp-2.png', alt: 'Registered clubs multi-tenant admin' },
    { src: '/projects/kandy-erp-3.png', alt: 'Membership members directory' },
    { src: '/projects/kandy-erp-4.png', alt: 'Booking calendar for rooms halls and boardrooms' },
    { src: '/projects/kandy-erp-5.png', alt: 'Register member form' },
    { src: '/projects/kandy-erp-6.png', alt: 'Inventory gate pass management' },
  ],
  maletaxi: [
    { src: '/projects/maletaxi-1.png', alt: 'Malé Taxi Line app screens' },
    { src: '/projects/maletaxi-2.png', alt: 'Malé Taxi Line booking screen' },
  ],
  agroconnect: [
    { src: '/projects/agroconnect.png', alt: 'AgroConnect for Farmers app' },
    { src: '/projects/agroconnect-2.jpg', alt: 'AgroConnect farming context' },
  ],
  transport: [
    { src: '/projects/transport.png', alt: 'Public Transport Tracker app' },
    { src: '/projects/transport-2.jpg', alt: 'Public transport context' },
  ],
  'penalty-app': [
    { src: '/projects/penalty-app.jpg', alt: 'Penalty payment app login' },
    { src: '/projects/penalty-app-2.jpg', alt: 'Penalty payment person details' },
  ],
  'penalty-site': [
    { src: '/projects/penalty-site.png', alt: 'Penalty payment website' },
    { src: '/projects/penalty-site-2.png', alt: 'Penalty payment website details' },
  ],
  heritage: [
    { src: '/projects/heritage.png', alt: 'Heritage Tourism App screen' },
    { src: '/projects/heritage-2.jpg', alt: 'Heritage tourism context' },
  ],
};

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCount = document.getElementById('lightbox-count');
const prevBtn = document.querySelector('.lightbox__nav--prev');
const nextBtn = document.querySelector('.lightbox__nav--next');

let activeImages = [];
let activeIndex = 0;

function renderLightbox() {
  const item = activeImages[activeIndex];
  if (!item) return;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCount.textContent = `${activeIndex + 1} / ${activeImages.length}`;
  prevBtn.disabled = activeImages.length < 2;
  nextBtn.disabled = activeImages.length < 2;
}

function openGallery(key, title) {
  activeImages = galleries[key] || [];
  if (!activeImages.length) return;
  activeIndex = 0;
  lightboxTitle.textContent = title || 'Gallery';
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  renderLightbox();
}

function closeGallery() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lightboxImage.removeAttribute('src');
}

function stepGallery(delta) {
  if (activeImages.length < 2) return;
  activeIndex = (activeIndex + delta + activeImages.length) % activeImages.length;
  renderLightbox();
}

document.querySelectorAll('.gallery-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    openGallery(btn.dataset.gallery, btn.dataset.title);
  });
});

lightbox?.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeGallery);
});

prevBtn?.addEventListener('click', () => stepGallery(-1));
nextBtn?.addEventListener('click', () => stepGallery(1));

document.addEventListener('keydown', (event) => {
  if (lightbox?.hidden) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') stepGallery(-1);
  if (event.key === 'ArrowRight') stepGallery(1);
});

const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = 'Sending…';
  status.classList.remove('is-error');

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      throw new Error(json.error || 'Something went wrong.');
    }
    status.textContent = json.message || 'Message sent.';
    form.reset();
  } catch (err) {
    status.textContent = err.message || 'Could not send right now.';
    status.classList.add('is-error');
  }
});
