'use strict';

/* --- Navbar scroll effect --- */
const navbar = document.getElementById('navbar');
const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 32);
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* --- Mobile menu --- */
const navToggle  = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

const closeMobileMenu = () => {
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
};

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

/* --- Scroll reveal --- */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* --- Contact form validation --- */
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('cf-submit');
const successEl = document.getElementById('cf-success');

const fields = {
  firstname: {
    el: document.getElementById('cf-firstname'),
    err: document.getElementById('cf-firstname-error'),
    validate: v => v.trim().length >= 1
  },
  lastname: {
    el: document.getElementById('cf-lastname'),
    err: document.getElementById('cf-lastname-error'),
    validate: v => v.trim().length >= 1
  },
  email: {
    el: document.getElementById('cf-email'),
    err: document.getElementById('cf-email-error'),
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
  },
  message: {
    el: document.getElementById('cf-message'),
    err: document.getElementById('cf-message-error'),
    validate: v => v.trim().length >= 10
  }
};

const validateField = key => {
  const { el, err, validate } = fields[key];
  const ok = validate(el.value);
  el.classList.toggle('error', !ok);
  err.classList.toggle('visible', !ok);
  return ok;
};

Object.keys(fields).forEach(key => {
  fields[key].el.addEventListener('blur', () => validateField(key));
  fields[key].el.addEventListener('input', () => {
    if (fields[key].el.classList.contains('error')) validateField(key);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const allValid = Object.keys(fields).map(validateField).every(Boolean);
  if (!allValid) return;

  submitBtn.classList.add('btn--loading');
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.classList.remove('btn--loading');
    submitBtn.disabled = false;
    form.reset();
    Object.keys(fields).forEach(key => {
      fields[key].el.classList.remove('error');
      fields[key].err.classList.remove('visible');
    });
    successEl.classList.add('visible');
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => successEl.classList.remove('visible'), 6000);
  }, 1400);
});
