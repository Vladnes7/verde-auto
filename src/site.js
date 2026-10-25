import './site.css';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {cars,brands} from './catalog.js';
gsap.registerPlugin(ScrollTrigger);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 600px)');
const header=$('.site-header'),menu=$('#site-menu'),menuButton=$('.menu-button');
let menuTimeline,menuClosing=false,toastTimer;

function toast(message){const el=$('.toast');el.textContent=message;clearTimeout(toastTimer);gsap.to(el,{opacity:1,y:0,duration:reduce.matches?0:.3,overwrite:true});toastTimer=setTimeout(()=>gsap.to(el,{opacity:0,y:20,duration:.3}),4000);}
function setHeader(){header.classList.toggle('is-scrolled',scrollY>55);header.classList.toggle('over-dark',Boolean($('#main>section:first-child[data-header-tone="light"]'))&&scrollY<55);}
addEventListener('scroll',setHeader,{passive:true});setHeader();
function releaseMenu(restoreFocus=false){menuTimeline?.kill();gsap.killTweensOf(menu);menuClosing=false;if(menu.open)menu.close();document.body.style.overflow='';menuButton.setAttribute('aria-expanded','false');gsap.set(menu,{clearProps:'clipPath'});if(restoreFocus)menuButton.focus({preventScroll:true});}
function navigate(href){releaseMenu();location.assign(href);}
function closeMenu(){if(!menu.open||menuClosing)return;menuClosing=true;menuTimeline?.kill();if(reduce.matches){releaseMenu(true);return;}gsap.to(menu,{clipPath:'inset(0 0 100% 0)',duration:.24,ease:'power2.inOut',onComplete:()=>releaseMenu(true)});}
menuButton.addEventListener('click',()=>{menu.showModal();document.body.style.overflow='hidden';menuButton.setAttribute('aria-expanded','true');if(!reduce.matches){menuTimeline?.kill();menuTimeline=gsap.timeline().fromTo(menu,{clipPath:'inset(0 0 100% 0 round 0 0 30% 30%)'},{clipPath:'inset(0 0 0% 0 round 0 0 0 0)',duration:.75,ease:'power4.inOut'}).fromTo($$('.menu-grid a'),{y:55,opacity:0,rotate:3},{y:0,opacity:1,rotate:0,duration:.6,stagger:.045,ease:'power3.out'},.25).fromTo('.menu-preview',{y:60,opacity:0,rotate:-12},{y:0,opacity:1,rotate:-5,duration:.8,ease:'power3.out'},.25);}});
$('.menu-close').addEventListener('click',()=>closeMenu());menu.addEventListener('cancel',event=>{event.preventDefault();closeMenu();});
document.addEventListener('click',event=>{
 const placeholder=event.target.closest('[data-placeholder]');if(placeholder){toast(placeholder.dataset.placeholder);return;}
 const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
 const target=new URL(link.href,location.href);if(target.origin!==location.origin||target.protocol!=='http:'&&target.protocol!=='https:'||target.hash&&target.pathname===location.pathname)return;
 if(target.pathname===location.pathname&&target.search===location.search&&!target.hash){event.preventDefault();if(menu.open)closeMenu();return;}
 // Let the browser navigate immediately; cross-document transitions never gate the link.
 if(menu.open)releaseMenu();
});
addEventListener('pageshow',event=>{releaseMenu();setHeader();if(event.persisted){gsap.set($$('.vehicle-card'),{clearProps:'opacity,transform'});ScrollTrigger.refresh();}});
addEventListener('pageswap',()=>releaseMenu());
$$('[data-copy-email]').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('hello@verde-auto.example');toast('Email скопирован');}catch{toast('hello@verde-auto.example');}}));

const video=$('.arrival-video');
if(video){let shown=false;const show=()=>{if(shown)return;shown=true;if(reduce.matches)return;gsap.fromTo($$('.hero-copy>*'),{y:40,opacity:0},{y:0,opacity:1,duration:1.1,stagger:.12,ease:'power3.out',clearProps:'transform,opacity'});};if(!reduce.matches){gsap.set($$('.hero-copy>*'),{opacity:0});video.play().catch(show);video.addEventListener('timeupdate',()=>{if(video.currentTime>.9)show();if(video.currentTime>=4.95)video.pause();});setTimeout(show,2800);}else video.pause();video.addEventListener('error',show);new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)video.pause();},{threshold:.05}).observe(video);document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});reduce.addEventListener('change',()=>{if(reduce.matches){video.pause();gsap.set($$('.hero-copy>*'),{clearProps:'transform,opacity'});}});}

window.ScrollCraft?.mount(document);
const motion=gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)',()=>{
 $$('[data-reveal]').forEach(el=>gsap.fromTo(el,{y:45,opacity:.15},{y:0,opacity:1,duration:.95,ease:'power3.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 91%',once:true}}));
 $$('.living-seam path').forEach(path=>gsap.to(path,{attr:{d:'M0 110V85C240 55 350 100 620 80S1080 55 1440 85V110Z'},ease:'none',scrollTrigger:{trigger:path.closest('.living-seam').parentElement,start:'top 95%',end:'top 45%',scrub:.8}}));
 if(video){gsap.to(video,{yPercent:12,scale:1.06,ease:'none',scrollTrigger:{trigger:'.cinematic-hero',start:'top top',end:'bottom top',scrub:.8}});gsap.to('.hero-copy',{y:-65,ease:'none',scrollTrigger:{trigger:'.cinematic-hero',start:'top top',end:'bottom top',scrub:.8}});}
 if($('.intro-grid')){gsap.from('.intro-grid h2',{y:65,rotate:-2,ease:'none',scrollTrigger:{trigger:'.intro-grid',start:'top 95%',end:'top 40%',scrub:.7}});gsap.from('.intro-text',{y:60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.intro-text',start:'top 87%',once:true}});}
 if($('.brand-grid'))gsap.fromTo('.brand-tile',{y:70,opacity:.15},{y:0,opacity:1,duration:.8,stagger:.075,ease:'power3.out',clearProps:'transform,opacity',scrollTrigger:{trigger:'.brand-grid',start:'top 88%',once:true}});
 $$('.brand-script').forEach(el=>gsap.fromTo(el,{xPercent:10},{xPercent:-10,ease:'none',scrollTrigger:{trigger:el.closest('.brand-band'),start:'top bottom',end:'bottom top',scrub:1}}));
 // Catalogue content stays fully readable, even if a reveal is interrupted by filtering or history.
 $$('.vehicle-grid').forEach(grid=>ScrollTrigger.create({trigger:grid,start:'top 92%',once:true,onEnter:()=>{const cards=$$('.vehicle-card:not([hidden])',grid);gsap.fromTo(cards,{y:25},{y:0,duration:.55,stagger:{each:.025,amount:.18},ease:'power3.out',clearProps:'transform'});}}));
 $$('.company-photo>img,.full-photo>img,.showroom-story>img').forEach(img=>gsap.fromTo(img,{scale:1.12},{scale:1,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'center 45%',scrub:.8}}));
 $$('.journal-card').forEach((el,i)=>gsap.fromTo(el,{y:45},{y:0,duration:.8,delay:(i%3)*.08,scrollTrigger:{trigger:el,start:'top 90%',once:true},clearProps:'transform'}));
 if($('.fan-deck'))gsap.fromTo('.fan-deck',{y:65},{y:0,ease:'none',scrollTrigger:{trigger:'.fan-deck',start:'top bottom',end:'top 30%',scrub:.8}});
 gsap.fromTo('.footer-giant',{y:55},{y:0,ease:'none',scrollTrigger:{trigger:'.footer-giant',start:'top bottom',end:'bottom bottom',scrub:1}});
});

const route=$('.map-route');
if(route){const length=route.getTotalLength(),traveller=$('.map-traveller'),status=$('[data-route-status]'),steps=$$('.route-stages span');const texts=['Проверка и выкуп в Китае','Перевозка и оформление','Доставка и выдача в вашем городе'];let chosen;try{chosen=cars.find(c=>c.id===sessionStorage.getItem('verde-chosen'));}catch{}
 if(chosen){$('.route-selection>img').src=chosen.image;$('.route-selection>img').alt=chosen.name;$('[data-route-car]').textContent=chosen.name;}
 function update(progress){const p=Math.max(0,Math.min(1,progress)),point=route.getPointAtLength(length*p);route.style.strokeDasharray=length;route.style.strokeDashoffset=length*(1-p);traveller.setAttribute('transform',`translate(${point.x},${point.y})`);const phase=Math.min(2,Math.floor(p*3));status.textContent=texts[phase];steps.forEach((el,i)=>el.classList.toggle('active',i===phase));}
 motion.add('(min-width: 601px) and (prefers-reduced-motion: no-preference)',()=>{update(0);ScrollTrigger.create({trigger:'.route-section',start:'top top',end:'bottom bottom',onUpdate:self=>update(self.progress)});});
 motion.add('(max-width: 600px) and (prefers-reduced-motion: no-preference)',()=>{update(0);ScrollTrigger.create({trigger:'.route-section',start:'top 65%',end:'bottom 75%',onUpdate:self=>update(self.progress)});});
 if(reduce.matches)update(1);
}

const featuredButtons=$$('[data-featured-brand]');featuredButtons.forEach(button=>button.addEventListener('click',()=>{featuredButtons.forEach(b=>b.classList.toggle('active',b===button));$$('.home-vehicles .vehicle-card').forEach(card=>card.hidden=button.dataset.featuredBrand!=='all'&&card.dataset.brand!==button.dataset.featuredBrand);const cards=$$('.home-vehicles .vehicle-card');gsap.killTweensOf(cards);gsap.set(cards,{clearProps:'opacity,transform'});if(!reduce.matches)gsap.fromTo(cards.filter(c=>!c.hidden),{y:18},{y:0,duration:.4,clearProps:'transform'});ScrollTrigger.refresh();}));

const catalog=$('[data-catalog]');
if(catalog){const cards=$$('.vehicle-card',catalog),params=new URLSearchParams(location.search),brandPage=location.pathname.startsWith('/brands/');let brand=params.get('brand')||(brandPage?location.pathname.split('/')[2]:'all'),energy=params.get('energy')||'all',search=params.get('q')||'',shown=12;$('#car-search').value=search;
 function filter(animate=false){const list=cards.filter(card=>(brand==='all'||card.dataset.brand===brand)&&(energy==='all'||card.dataset.energy===energy)&&card.dataset.search.includes(search.toLowerCase().trim()));gsap.killTweensOf(cards);gsap.set(cards,{clearProps:"opacity,transform"});cards.forEach(c=>c.hidden=true);list.slice(0,shown).forEach(c=>c.hidden=false);$$('[data-brand-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.brandFilter===brand);b.setAttribute('aria-pressed',String(b.dataset.brandFilter===brand));});$$('[data-energy-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.energyFilter===energy);b.setAttribute('aria-pressed',String(b.dataset.energyFilter===energy));});$('.catalog-result').textContent=`Показано ${Math.min(list.length,shown)} из ${list.length} автомобилей`;$('.catalog-empty').hidden=list.length>0;$('[data-catalog-more]').hidden=shown>=list.length;if(animate&&!reduce.matches){gsap.killTweensOf(cards);gsap.fromTo(list.slice(0,shown),{y:18},{y:0,duration:.4,stagger:{each:.02,amount:.15},clearProps:'transform,opacity'});}const query=new URLSearchParams();if(brand!=='all'&&!brandPage)query.set('brand',brand);if(energy!=='all')query.set('energy',energy);if(search)query.set('q',search);history.replaceState(null,'',`${location.pathname}${query.size?'?'+query:''}`);requestAnimationFrame(()=>ScrollTrigger.refresh());}
 $$('[data-brand-filter]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.brandFilter;if(brandPage&&next!==brand){navigate(next==='all'?'/catalog/':`/brands/${next}/`);return;}brand=next;shown=12;filter(true);}));
 $$('[data-energy-filter]').forEach(button=>button.addEventListener('click',()=>{energy=button.dataset.energyFilter;shown=12;filter(true);}));
 $('#car-search').addEventListener('input',event=>{search=event.target.value;shown=12;filter();});
 $('[data-reset-filters]').addEventListener('click',()=>{brand=brandPage?location.pathname.split('/')[2]:'all';energy='all';search='';shown=12;$('#car-search').value='';filter(true);});
 $('[data-catalog-more]').addEventListener('click',()=>{shown+=12;filter(true);});filter();
}

const modelHero=$('.model-hero');
if(modelHero){const images=JSON.parse(modelHero.dataset.gallery),car=cars.find(c=>c.id===modelHero.dataset.carId),current=$('.model-photo-current'),next=$('.model-photo-next');let index=0,busy=false,pending=null;
 async function changePhoto(wanted){wanted=(wanted+images.length)%images.length;if(busy){pending=wanted;return;}if(wanted===index)return;busy=true;next.src=images[wanted];try{await next.decode();}catch{toast('Не удалось открыть фото. Попробуйте ещё раз.');busy=false;return;}
  const finish=()=>{current.src=images[wanted];current.alt=`${car.name}, ${['передний ракурс','профиль','задний ракурс'][wanted]}`;gsap.set(current,{clearProps:'transform,opacity'});gsap.set(next,{opacity:0,clipPath:'inset(0 100% 0 0)',clearProps:'transform'});index=wanted;busy=false;$$('[data-photo]').forEach(b=>{const active=Number(b.dataset.photo)===index;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$('.gallery-count').textContent=`Фото ${index+1} из 3`;if(pending!==null){const p=pending;pending=null;if(p!==index)changePhoto(p);}};
  if(reduce.matches){finish();return;}gsap.set(next,{opacity:1,scale:1.08,clipPath:'inset(0 100% 0 0)'});gsap.timeline({onComplete:finish}).to(next,{clipPath:'inset(0 0% 0 0)',scale:1,duration:.85,ease:'power3.inOut'},0).to(current,{xPercent:-3,opacity:.6,duration:.85,ease:'power3.inOut'},0);
 }
 $$('[data-photo]').forEach(button=>button.addEventListener('click',()=>changePhoto(Number(button.dataset.photo))));$('[data-next-photo]').addEventListener('click',()=>changePhoto((pending??index)+1));
 modelHero.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();changePhoto((pending??index)+(event.key==='ArrowRight'?1:-1));}});
 let touchX=0;modelHero.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});modelHero.addEventListener('touchend',e=>{const distance=e.changedTouches[0].clientX-touchX;if(Math.abs(distance)>55)changePhoto(index+(distance<0?1:-1));},{passive:true});
 $$(`a[href*="model=${car.id}"]`).forEach(link=>link.addEventListener('click',()=>{try{sessionStorage.setItem('verde-chosen',car.id);}catch{}}));
}

const form=$('#inquiry-form');let draft='';
if(form){const query=new URLSearchParams(location.search).get('model');let saved;try{saved=JSON.parse(sessionStorage.getItem('verde-inquiry')||'null');}catch{}if(saved){for(const[key,value]of Object.entries(saved)){const field=form.elements.namedItem(key);if(field&&field.type!=='checkbox')field.value=value;}}if(query&&cars.some(c=>c.id===query)){form.elements.model.value=query;try{sessionStorage.setItem('verde-chosen',query);}catch{}}
 form.addEventListener('submit',event=>{event.preventDefault();const values=Object.fromEntries(new FormData(form)),status=$('.form-status',form);$$('[aria-invalid]',form).forEach(el=>el.removeAttribute('aria-invalid'));const missing=!String(values.name||'').trim()?'name':!String(values.contact||'').trim()?'contact':!values.consent?'consent':null;if(missing){const input=form.elements.namedItem(missing);input.setAttribute('aria-invalid','true');input.focus();status.textContent=missing==='name'?'Укажите, как к вам обращаться.':missing==='contact'?'Укажите телефон, email или Telegram.':'Подтвердите сохранение черновика на этом устройстве.';return;}
  const selected=cars.find(c=>c.id===values.model);draft=`Запрос в VERDE AUTO\n\nИмя: ${values.name}\nКонтакт: ${values.contact}\nАвтомобиль: ${selected?.name||'Пока выбираю'}\nБюджет: ${values.budget||'Не указан'}\nГород: ${values.city||'Не указан'}\nПожелания: ${values.message||'Не указаны'}`;let stored=true;try{sessionStorage.setItem('verde-inquiry',JSON.stringify(values));if(selected)sessionStorage.setItem('verde-chosen',selected.id);}catch{stored=false;}status.textContent=stored?'Черновик подготовлен и сохранён в этой сессии. Ничего не отправлено.':'Черновик подготовлен. Браузер не разрешил сохранить его, но текст можно скопировать.';$('.draft-result',form).hidden=false;$('[data-mail-draft]').href=`mailto:hello@verde-auto.example?subject=${encodeURIComponent(selected?`Подбор ${selected.name}`:'Подбор автомобиля')}&body=${encodeURIComponent(draft)}`;ScrollTrigger.refresh();
 });$('[data-copy-draft]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(draft);toast('Текст запроса скопирован');}catch{toast('Копирование недоступно. Откройте черновик в почте.');}});
}
document.fonts.ready.then(()=>ScrollTrigger.refresh());

// Preserve native details/summary semantics and animate from the current height,
// so a second click can reverse the disclosure without jumping or hiding an answer.
$$('.faq-list details').forEach(item=>{
 const summary=$('summary',item),answer=$('div',item);
 let intendedOpen=item.open,animation=null;
 const finish=()=>{
  animation=null;item.open=intendedOpen;item.classList.remove('is-closing');
  gsap.set(item,{clearProps:'height,overflow'});ScrollTrigger.refresh();
 };
 summary.addEventListener('click',event=>{
  event.preventDefault();const from=item.getBoundingClientRect().height;
  intendedOpen=!intendedOpen;animation?.kill();
  if(reduce.matches){finish();return;}
  item.open=true;item.classList.toggle('is-closing',!intendedOpen);
  const style=getComputedStyle(item),borders=parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
  const to=summary.getBoundingClientRect().height+(intendedOpen?answer.getBoundingClientRect().height:0)+borders;
  gsap.set(item,{height:from,overflow:'hidden'});
  animation=gsap.to(item,{height:to,duration:.2,ease:'power3.out',onComplete:finish});
 });
 item.addEventListener('toggle',()=>{if(!animation)intendedOpen=item.open;});
 reduce.addEventListener('change',()=>{if(reduce.matches&&animation){animation.kill();finish();}});
});
