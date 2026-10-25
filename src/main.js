import './styles.css';
import { gsap } from 'gsap';
import { cars } from './cars.js';
import { initMotion, refreshMotion } from './motion.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const carDialog = $('#car-dialog'), menu = $('#menu'), menuButton = $('#menu-toggle'), grid = $('#cars-grid');
let activeCar = cars[0], currentBrand = 'all', visibleCount = 6, galleryIndex = 0;
let previousHash = '', dialogTrigger, isClosingCar = false, menuTimeline;
const escapeHTML = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const displayName = car => car.name.replace(/^(BMW |Mercedes-Benz |Porsche )/, '');

function cardMarkup(car) {
  return `<article class="car-card" data-car="${car.id}" data-brand="${car.brandKey}"><button class="car-photo" data-open-car="${car.id}" aria-label="Подробнее о ${escapeHTML(car.name)}"><img src="${car.image}" alt="${escapeHTML(car.name)}, вид спереди" width="1024" height="512" loading="lazy"/><span class="photo-color" aria-hidden="true" style="background-image:url('${car.image}')"></span><span class="car-tag">${escapeHTML(car.specs['Кузов'].toUpperCase())}</span><span class="photo-label" aria-hidden="true">ПОЗНАКОМИМСЯ ↗</span><span class="photo-cursor" aria-hidden="true">↗</span></button><div class="car-meta"><div><span class="tiny">${escapeHTML(car.brand)}</span><h3><button data-open-car="${car.id}">${escapeHTML(displayName(car))} <span aria-hidden="true">↗</span></button></h3><p>${escapeHTML(car.specs['Двигатель'])} · ${escapeHTML(car.specs['Привод'])}</p></div><span class="car-price">${escapeHTML(car.price)}<small>ДЕМО-СТОИМОСТЬ</small></span></div></article>`;
}
const pagination = document.createElement('div');
pagination.className = 'collection-pagination';
pagination.innerHTML = '<span class="catalog-count" role="status" aria-live="polite"></span><button class="load-more">ПОКАЗАТЬ ЕЩЁ <span aria-hidden="true">↗</span></button>';
grid.after(pagination);
$('.filter[data-brand="all"] span').textContent = '24';

function attachPhotoPointers() {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || reduced.matches) return;
  $$('.car-photo', grid).forEach(photo => {
    const cursor = $('.photo-cursor', photo);
    photo.addEventListener('pointermove', event => {
      const bounds = photo.getBoundingClientRect(), x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      photo.style.setProperty('--mx', `${x / bounds.width * 100}%`);
      photo.style.setProperty('--my', `${y / bounds.height * 100}%`);
      gsap.to(cursor, { x, y, opacity: 1, scale: 1, duration: .3, ease: 'power3.out', overwrite: true });
    });
    photo.addEventListener('pointerleave', () => gsap.to(cursor, { opacity: 0, scale: .4, duration: .25, overwrite: true }));
  });
}
function renderCars(animate = false) {
  const filtered = cars.filter(car => currentBrand === 'all' || car.brandKey === currentBrand);
  const shown = filtered.slice(0, visibleCount);
  grid.innerHTML = shown.map(cardMarkup).join('');
  $('.catalog-count').textContent = `${shown.length} из ${filtered.length} автомобилей`;
  $('.load-more').hidden = shown.length >= filtered.length;
  if (animate && !reduced.matches) gsap.fromTo($$('.car-card', grid), { y: 22, opacity: .3 }, { y: 0, opacity: 1, duration: .6, stagger: .035, ease: 'power3.out', clearProps: 'transform,opacity' });
  attachPhotoPointers(); refreshMotion();
}
$$('.filter').forEach(button => button.addEventListener('click', () => {
  currentBrand = button.dataset.brand; visibleCount = currentBrand === 'all' ? 6 : 8;
  $$('.filter').forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
  renderCars(true);
}));
$('.load-more').addEventListener('click', () => { const firstNew = visibleCount; visibleCount += 6; renderCars(true); $$('.car-card', grid)[firstNew]?.querySelector('button')?.focus({ preventScroll: true }); });

const controls = document.createElement('div');
controls.className = 'gallery-controls';
controls.innerHTML = '<button id="gallery-prev" aria-label="Предыдущая фотография">←</button><div class="gallery-dots" role="group" aria-label="Ракурс автомобиля"></div><button id="gallery-next" aria-label="Следующая фотография">→</button>';
$('.dialog-media').append(controls);
function showAngle(index) {
  galleryIndex = (index + activeCar.images.length) % activeCar.images.length;
  $('#dialog-image').src = activeCar.images[galleryIndex];
  $('#dialog-image').alt = `${activeCar.name}: ${['вид спереди','вид сбоку','вид сзади'][galleryIndex]}`;
  $$('.gallery-dots button').forEach((dot,i) => { dot.classList.toggle('active', i === galleryIndex); dot.setAttribute('aria-pressed', String(i === galleryIndex)); });
}
function fillCar(car) {
  activeCar = car;
  $('#dialog-brand').textContent = car.brand; $('#dialog-title').textContent = displayName(car);
  $('#dialog-description').textContent = car.description; $('#dialog-price').textContent = car.price;
  $('#dialog-specs').innerHTML = Object.entries(car.specs).map(([label,value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('');
  $('.gallery-dots').innerHTML = car.images.map((_,i) => `<button data-angle="${i}" aria-label="${['Вид спереди','Вид сбоку','Вид сзади'][i]}" aria-pressed="${i === 0}">${String(i+1).padStart(2,'0')}</button>`).join('');
  showAngle(0); carDialog.scrollTop = 0; history.replaceState(null,'',`#car/${car.id}`);
}
function openCar(id, trigger) {
  const car = cars.find(item => item.id === id); if (!car) return;
  if (!carDialog.open) {
    dialogTrigger = trigger || document.activeElement; previousHash = location.hash.startsWith('#car/') ? '#collection' : location.hash;
    carDialog.showModal(); document.body.style.overflow = 'hidden';
    if (!reduced.matches) gsap.fromTo(carDialog,{ y:55, opacity:0, scale:.96 },{ y:0, opacity:1, scale:1, duration:.65, ease:'power3.out', clearProps:'transform,opacity' });
  }
  fillCar(car);
}
function closeCar(then) {
  if (!carDialog.open || isClosingCar) return; isClosingCar = true;
  const finish = () => {
    carDialog.close(); gsap.set(carDialog,{ clearProps:'transform,opacity' }); document.body.style.overflow = '';
    history.replaceState(null,'',`${location.pathname}${location.search}${previousHash}`); isClosingCar = false;
    if (then) then(); else if (dialogTrigger?.isConnected) dialogTrigger.focus({ preventScroll:true });
  };
  if (reduced.matches) finish(); else gsap.to(carDialog,{ y:25, opacity:0, duration:.25, ease:'power2.in', onComplete:finish, overwrite:true });
}
document.addEventListener('click', event => {
  const opener = event.target.closest('[data-open-car]'); if (opener) openCar(opener.dataset.openCar, opener);
  const angle = event.target.closest('[data-angle]'); if (angle) showAngle(Number(angle.dataset.angle));
});
$('.dialog-close').addEventListener('click', () => closeCar());
carDialog.addEventListener('cancel', event => { event.preventDefault(); closeCar(); });
carDialog.addEventListener('click', event => { if (event.target !== carDialog) return; const b = carDialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) closeCar(); });
$('#gallery-prev').addEventListener('click', () => showAngle(galleryIndex-1));
$('#gallery-next').addEventListener('click', () => showAngle(galleryIndex+1));
carDialog.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); showAngle(galleryIndex+(event.key === 'ArrowRight' ? 1 : -1)); } });
let touchStartX = 0;
$('.dialog-media').addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; },{ passive:true });
$('.dialog-media').addEventListener('touchend', e => { const d = e.changedTouches[0].clientX-touchStartX; if (Math.abs(d)>45) showAngle(galleryIndex+(d<0?1:-1)); },{ passive:true });
function adjacentCar(direction) { const set = cars.filter(car => car.brandKey === activeCar.brandKey), i = set.findIndex(car => car.id === activeCar.id); fillCar(set[(i+direction+set.length)%set.length]); }
$('#car-prev').addEventListener('click', () => adjacentCar(-1)); $('#car-next').addEventListener('click', () => adjacentCar(1));
function updateContact(car) {
  $('#selected-note').textContent = car ? `Ваш выбор: ${car.name}. Обсудим детали?` : 'Ваш следующий автомобиль начинается с одного письма.';
  $('#pass-model').textContent = car ? car.name.toUpperCase() : 'ВАШ СЛЕДУЮЩИЙ АВТОМОБИЛЬ';
  const passImage = $('.delivery-pass>img');
  passImage.src = car ? car.image : '/media/porsche-cutout.png';
  passImage.alt = car ? `${car.name} на пропуске доставки` : 'Porsche Cayenne на пропуске доставки';
  passImage.classList.toggle('has-selection', Boolean(car));
  const subject = car ? `Хочу обсудить ${car.name}` : 'Мой следующий автомобиль';
  const body = car ? `Здравствуйте! Меня интересует ${car.name}. Хочу обсудить подбор, комплектацию и доставку.\n\nМой бюджет:\nГород доставки:\nПожелания:` : 'Здравствуйте! Хочу обсудить подбор автомобиля из Китая.\n\nЖелаемая модель:\nМой бюджет:\nГород доставки:';
  $('#contact-email').href = `mailto:hello@verde-auto.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
$('#choose-car').addEventListener('click', event => {
  event.preventDefault(); updateContact(activeCar); try { sessionStorage.setItem('verde-selected-car',activeCar.id); } catch { /* Optional storage. */ }
  closeCar(() => { location.hash='contact'; $('#contact-email').focus({ preventScroll:true }); $('#contact').scrollIntoView({ behavior:reduced.matches?'instant':'smooth' }); });
});
$('#copy-email').addEventListener('click', async () => { try { await navigator.clipboard.writeText('hello@verde-auto.example'); $('#copy-status').textContent='Email скопирован'; } catch { $('#copy-status').textContent='Скопируйте адрес: hello@verde-auto.example'; } });

function closeMenu(target) {
  if (!menu.open) return;
  const finish = () => { menu.close(); document.body.style.overflow=''; menuButton.setAttribute('aria-expanded','false'); if (target) { location.hash=target; $(target)?.scrollIntoView({ behavior:reduced.matches?'instant':'smooth' }); } menuButton.focus({ preventScroll:true }); };
  if (reduced.matches || !menuTimeline) finish(); else menuTimeline.eventCallback('onReverseComplete',finish).reverse();
}
function openMenu() {
  if (menu.open) return; menu.showModal(); document.body.style.overflow='hidden'; menuButton.setAttribute('aria-expanded','true');
  const links = $$('.menu-links a'); links.forEach(link => link.classList.toggle('active',link.hash===location.hash || (!location.hash && link.hash==='#home')));
  if (!reduced.matches) {
    menuTimeline?.kill();
    menuTimeline=gsap.timeline().fromTo(menu,{clipPath:'inset(0% 0% 100% 0% round 0 0 30% 30%)'},{clipPath:'inset(0% 0% 0% 0% round 0 0 0% 0%)',duration:.75,ease:'power4.inOut'})
      .fromTo(links,{y:65,opacity:0,rotate:3},{y:0,opacity:1,rotate:0,duration:.65,stagger:.055,ease:'power3.out'},.24)
      .fromTo($$('.menu-gallery>*'),{y:55,opacity:0},{y:0,opacity:1,duration:.6,stagger:.07,ease:'power3.out'},.3);
  }
}
menuButton.addEventListener('click',openMenu); $('.menu-close').addEventListener('click',()=>closeMenu());
menu.addEventListener('cancel',event=>{event.preventDefault();closeMenu();});
$$('a[href^="#"]',menu).forEach(link=>link.addEventListener('click',event=>{event.preventDefault();closeMenu(link.hash);}));

const video=$('#arrival'), pause=$('#video-pause'); let heroRevealed=false,revealFallback;
function revealHero(){if(heroRevealed)return;heroRevealed=true;clearTimeout(revealFallback);if(reduced.matches)return;gsap.fromTo($$('.hero-copy>*'),{y:35,opacity:0},{y:0,opacity:1,duration:1.15,stagger:.13,ease:'power3.out',clearProps:'transform,opacity'});}
if(!reduced.matches){gsap.set($$('.hero-copy>*'),{opacity:0});video.play().catch(revealHero);video.addEventListener('timeupdate',()=>{if(video.currentTime>=1.35)revealHero();});revealFallback=setTimeout(revealHero,3500);}else{heroRevealed=true;video.pause();}
video.addEventListener('error',revealHero);
function syncVideoButton(){pause.textContent=video.paused||video.ended?'▷':'Ⅱ';pause.setAttribute('aria-label',video.paused||video.ended?'Воспроизвести видео':'Пауза видео');}
video.addEventListener('play',syncVideoButton);video.addEventListener('pause',syncVideoButton);video.addEventListener('ended',syncVideoButton);
pause.addEventListener('click',()=>{if(reduced.matches)return;if(video.paused||video.ended){if(video.ended)video.currentTime=0;video.play().catch(revealHero);}else video.pause();});
$('#video-replay').addEventListener('click',()=>{if(reduced.matches)return;video.currentTime=0;video.play().catch(revealHero);});
new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)video.pause();},{threshold:.05}).observe(video);
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
reduced.addEventListener('change',()=>{if(reduced.matches){video.pause();revealHero();gsap.set($$('.hero-copy>*'),{clearProps:'transform,opacity'});}});
try{updateContact(cars.find(car=>car.id===sessionStorage.getItem('verde-selected-car'))||null);}catch{updateContact(null);}
$('#year').textContent='2026';
window.ScrollCraft?.mount(document);
initMotion();renderCars();
if(location.hash.startsWith('#car/'))openCar(location.hash.slice(5));
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#car/'))openCar(location.hash.slice(5));});
document.fonts.ready.then(refreshMotion);
