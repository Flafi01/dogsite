/* =========================================================
   АТЛАС ПОРОД — интерактив
   ========================================================= */

/* ---- Мобильное меню ---- */
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.getElementById('nav-links');
  if(!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
    links.classList.toggle('open', !open);
  });

  // Закрывать меню после клика по ссылке (на мобильном)
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded','false');
      links.classList.remove('open');
    });
  });
})();

/* ---- Переключатель окрасов (на страницах пород) ----
   Кнопки с data-photo="..." меняют реальное фото,
   либо с data-coat="#hex,#hex2" перекрашивают иллюстрацию.
   Это «сигнатурный» интерактив сайта. */
(function(){
  const swatches = document.querySelectorAll('.swatch');
  const photo    = document.getElementById('coat-photo');
  const dog      = document.querySelector('.coat-preview [class*="dog-"]');
  const nameEl   = document.getElementById('coat-name');
  if(!swatches.length || (!photo && !dog)) return;

  function setCoat(btn){
    // Режим реальных фото
    if(photo && btn.dataset.photo){
      photo.src = btn.dataset.photo;
      photo.alt = 'Аляскинский маламут окраса «' + (btn.dataset.name || '') + '»';
    }
    // Режим перекраски иллюстрации (хаски, бернский)
    if(dog && btn.dataset.coat){
      const [c1, c2] = btn.dataset.coat.split(',');
      dog.style.setProperty('--coat', c1.trim());
      dog.style.setProperty('--coat2', (c2 || c1).trim());
    }
    swatches.forEach(s => s.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    if(nameEl) nameEl.textContent = btn.dataset.name || '';
  }

  swatches.forEach(btn => {
    btn.addEventListener('click', () => setCoat(btn));
  });

  // Активировать первый окрас по умолчанию
  setCoat(swatches[0]);
})();

/* ---- Плавное появление секций при прокрутке ---- */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('[data-reveal]');
  if(!els.length) return;
  // Помечаем документ — только теперь CSS прячет секции до появления
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -10% 0px'});
  els.forEach(el => io.observe(el));
})();

/* ---- Карусель окрасов (страница берна) ---- */
(function(){
  const photo = document.getElementById('carousel-photo');
  const prev  = document.querySelector('.carousel-prev');
  const next  = document.querySelector('.carousel-next');
  const dotsWrap = document.querySelector('.carousel-dots');
  if(!photo || !prev || !next) return;

  const slides = [
    'images/bernese-coat-1.jpg',
    'images/bernese-coat-2.jpg',
    'images/bernese-coat-3.jpg'
  ];
  let i = 0;

  // точки-индикаторы
  const dots = slides.map((_, idx) => {
    const d = document.createElement('span');
    d.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
    dotsWrap && dotsWrap.appendChild(d);
    return d;
  });

  function show(n){
    i = (n + slides.length) % slides.length;
    photo.src = slides[i];
    photo.alt = 'Бернский зенненхунд, фото ' + (i + 1);
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  prev.addEventListener('click', () => show(i - 1));
  next.addEventListener('click', () => show(i + 1));
})();
