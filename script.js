// Category nav: smooth scroll + active state
const pills = document.querySelectorAll('.cat-pill');
const sections = document.querySelectorAll('section.category');
const nav = document.getElementById('catNav');

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    const target = document.getElementById(pill.dataset.target);
    const navHeight = nav.getBoundingClientRect().height;
    const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

const setActive = (id) => {
  pills.forEach(p => p.classList.toggle('active', p.dataset.target === id));
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { rootMargin: '-120px 0px -70% 0px', threshold: 0 });

sections.forEach(s => observer.observe(s));

// Search / filter
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.card');
const emptyState = document.getElementById('emptyState');

const normalize = (str) => str.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

searchInput.addEventListener('input', () => {
  const q = normalize(searchInput.value.trim());
  let visibleCount = 0;

  sections.forEach(section => {
    let sectionHasVisible = false;
    section.querySelectorAll('.card').forEach(card => {
      const haystack = normalize(card.dataset.name);
      const match = q === '' || haystack.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) { sectionHasVisible = true; visibleCount++; }
    });
    section.style.display = sectionHasVisible ? '' : 'none';
  });

  emptyState.style.display = (visibleCount === 0) ? '' : 'none';
  nav.style.display = q === '' ? '' : 'none';
});

// Dish detail modal
const modalOverlay = document.getElementById('modalOverlay');
const modalImg = document.getElementById('modalImg');
const modalDishes = document.getElementById('modalDishes');
const modalServing = document.getElementById('modalServing');
const modalPrice = document.getElementById('modalPrice');
const modalClose = document.getElementById('modalClose');

let lastFocusedCard = null;

const openModal = (card) => {
  const img = card.querySelector('.card-img img');
  const names = card.querySelectorAll('.card-name');
  const descs = card.querySelectorAll('.card-desc');
  const serving = card.querySelector('.serving-tag');
  const price = card.querySelector('.price');

  modalImg.src = img.src;
  modalImg.alt = img.alt;

  modalDishes.innerHTML = '';
  names.forEach((nameEl, i) => {
    const block = document.createElement('div');
    block.className = 'modal-dish';

    const title = document.createElement('div');
    title.className = 'modal-dish-name' + (nameEl.classList.contains('secondary') ? ' secondary' : '');
    title.textContent = nameEl.textContent;

    const desc = document.createElement('div');
    desc.className = 'modal-dish-desc';
    desc.textContent = descs[i] ? descs[i].textContent : '';

    block.appendChild(title);
    block.appendChild(desc);
    modalDishes.appendChild(block);
  });

  modalServing.textContent = serving ? serving.textContent : '';
  modalPrice.textContent = price ? price.textContent : '';

  lastFocusedCard = card;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
};

const closeModal = () => {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocusedCard) lastFocusedCard.focus({ preventScroll: true });
};

cards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('click', () => openModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});
