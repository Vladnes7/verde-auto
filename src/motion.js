import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function refreshMotion(){requestAnimationFrame(()=>ScrollTrigger.refresh());}
export function initMotion(){
  const mm=gsap.matchMedia(),header=document.querySelector('.header');
  ScrollTrigger.create({start:50,onUpdate:()=>header.classList.toggle('scrolled',scrollY>50)});
  for(const id of ['journey','contact'])ScrollTrigger.create({trigger:`#${id}`,start:'top 70px',end:'bottom 70px',onToggle:self=>header.classList.toggle('on-dark',self.isActive)});
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.to('.hero-video',{yPercent:10,scale:1.08,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.8}});
    gsap.to('.hero-copy',{y:-60,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}});
    gsap.fromTo('.intro-title',{y:60,opacity:.2},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.intro-title',start:'top 95%',end:'top 42%',scrub:.5}});
    const underline=document.querySelector('.lime-word path'),l=underline.getTotalLength();
    gsap.fromTo(underline,{strokeDasharray:l,strokeDashoffset:l},{strokeDashoffset:0,scrollTrigger:{trigger:'.intro-title',start:'top 55%',end:'bottom 45%',scrub:.5}});
    gsap.fromTo('.contact-car',{y:70,rotate:-5},{y:0,rotate:0,ease:'none',scrollTrigger:{trigger:'.contact-panel',start:'top 85%',end:'top 10%',scrub:.8}});
    gsap.fromTo('.contact h2',{y:45},{y:0,ease:'none',scrollTrigger:{trigger:'.contact-panel',start:'top 95%',end:'top 25%',scrub:.7}});
    gsap.to('.details-heading',{y:-20,ease:'none',scrollTrigger:{trigger:'.details',start:'top bottom',end:'bottom top',scrub:.8}});
    const mobile=innerWidth<=700;
    gsap.timeline({scrollTrigger:{trigger:'.photo-fan',start:'top 95%',end:'center 45%',scrub:.7}})
      .fromTo('.fan-one',{x:0,xPercent:-55,rotation:-3},{xPercent:mobile?-90:-110,rotation:-20,ease:'none'},0)
      .fromTo('.fan-two',{x:0,xPercent:-50,rotation:1,y:40},{xPercent:-50,rotation:0,y:0,ease:'none'},0)
      .fromTo('.fan-three',{x:0,xPercent:-45,rotation:3},{xPercent:mobile?-10:10,rotation:20,ease:'none'},0);
  });
  const route=document.querySelector('.route-line'),length=route.getTotalLength();
  mm.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)',()=>{
    const steps=[...document.querySelectorAll('.journey-step')];
    gsap.fromTo(route,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.journey',start:'top top',end:'bottom bottom',scrub:.5,onUpdate:self=>{const active=Math.min(2,Math.floor(self.progress*3));steps.forEach((step,i)=>step.classList.toggle('active',i===active));}}});
    gsap.fromTo('.delivery-pass',{xPercent:-50,yPercent:-35,y:0,x:-170,rotate:-18},{x:130,rotate:8,ease:'none',scrollTrigger:{trigger:'.journey',start:'top top',end:'bottom bottom',scrub:.8}});
  });
  mm.add('(max-width: 700px) and (prefers-reduced-motion: no-preference)',()=>{
    gsap.fromTo(route,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.journey',start:'top 70%',end:'center 25%',scrub:.5}});
    gsap.fromTo('.delivery-pass',{y:30,rotate:-15},{y:0,rotate:-5,ease:'none',scrollTrigger:{trigger:'.journey',start:'top 75%',end:'center 50%',scrub:.8}});
  });
}
