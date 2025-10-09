const slides = document.querySelectorAll('.slide');

let animTL = null;
const gallery = document.querySelector('.gallery');
const buttons = document.querySelectorAll('.controls button');
const progressBar = document.querySelector('.progress-bar');
const announcer = document.getElementById('slide-announcer');

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoTimer = null;
let progressTween = null;
let progressGlow = null;
let autoDelay = prefersReduced ? 0 : 10000;

function splitLetters(el){
  if(!el) return [];
  if(el.dataset.split === 'true') return el.querySelectorAll('.char');
  const text = el.textContent;
  el.dataset.original = text;
  el.innerHTML = '';
  for(let i = 0; i < text.length; i++){
    const ch = text[i];
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    span.style.setProperty('--i', String(i));
    el.appendChild(span);
  }
  el.dataset.split = 'true';
  return el.querySelectorAll('.char');
}
function restoreLetters(el){
  if(!el) return;
  if(el.dataset.split !== 'true') return;
  el.textContent = el.dataset.original || '';
  delete el.dataset.split;
  delete el.dataset.original;
}

function center(el, opts = {}) {
  if(!el || !gallery) return;
  const target = (el.offsetLeft + (el.offsetWidth / 2)) - (gallery.clientWidth / 2);
  const duration = typeof opts.duration === 'number' ? opts.duration : 0.8;
  
  const max = gallery.scrollWidth - gallery.clientWidth;
  const desired = Math.max(0, Math.min(max, target));
  
  gsap.to(gallery, { scrollLeft: desired, duration, ease: 'elastic.out(1, 0.75)' });
}

function animateSlide(slide){
  if(!slide) return;
  if(prefersReduced) return; 

  if(animTL) animTL.kill();

  const title = slide.querySelector('h2');
  const para = slide.querySelector('p');
  const items = slide.querySelectorAll('ul li');
  const logo = slide.querySelector('.corner-logo');

  animTL = gsap.timeline();
  if(title){
    const tChars = splitLetters(title);
    if(tChars.length){
      animTL.fromTo(tChars, {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 0.45, stagger: 0.02, ease: "power2.out"});
    } else {
      animTL.fromTo(title, {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 0.5, ease: "power2.out"});
    }
  }

  if(para){
    const pChars = splitLetters(para);
    if(pChars.length){
      animTL.fromTo(pChars, {y: 18, opacity: 0}, {y: 0, opacity: 1, duration: 0.45, stagger: 0.01, ease: "power2.out"}, "-=0.30");
    } else {
      animTL.fromTo(para,  {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.45, ease: "power2.out"}, "-=0.25");
    }
  }

  if(items.length){
    animTL.fromTo(items, {y: 12, opacity: 0}, {y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out"}, "-=0.25");
  }
  if(logo){
    animTL.fromTo(logo, {scale: 0.85, opacity: 0}, {scale: 1, opacity: 0.95, duration: 0.45, ease: "back.out(1.2)"}, "-=0.35");
  }
}

if(!prefersReduced){
 
  gsap.fromTo("h1,h2", {textShadow: "0 0 6px rgba(67,223,121,0.6)"}, {textShadow: "0 0 26px rgba(154,230,180,0.95)", duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut"});

  gsap.to(".stars", {y: 18, opacity: 0.55, duration: 40, repeat: -1, yoyo: true, ease: "sine.inOut"});

  gsap.from(buttons, {y: 8, opacity: 0, scale: 0.96, stagger: 0.06, duration: 0.6, ease: "back.out(1.1)"});

  document.querySelectorAll('.corner-logo').forEach(logo => {
    gsap.to(logo, {y: -6, rotation: 2, duration: 6.0, repeat: -1, yoyo: true, ease: "sine.inOut"});
  });
}


function showSlide(index, options = {}) {
  const instant = !!options.instant;
  const prevSlide = document.querySelector('.slide.active');
  const nextSlide = slides[index];

  if(prevSlide === nextSlide){
  
    if(nextSlide) nextSlide.focus({preventScroll:true});
    highlightActiveButton(index);
    announceSlide(index);
   
    animateSlide(nextSlide);
    animateProgress(index);
   
    center(nextSlide);
    return;
  }
  
  if(prefersReduced || !prevSlide || instant){
    slides.forEach((s,i)=>{
      s.classList.toggle('active', i===index);
      s.setAttribute('aria-hidden', i===index ? 'false' : 'true');
      if(i===index) s.focus({preventScroll:true});
    });
    
    slides.forEach((s,i)=>{
      if(i!==index){
        restoreLetters(s.querySelector('h2'));
        restoreLetters(s.querySelector('p'));
      }
    });
    
    animateSlide(nextSlide);
    highlightActiveButton(index);
    announceSlide(index);
    animateProgress(index);
  
    center(nextSlide, { duration: instant ? 0.15 : 0.45 });
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      
      slides.forEach((s,i)=>{
        s.classList.toggle('active', i===index);
        s.setAttribute('aria-hidden', i===index ? 'false' : 'true');
      });
      
      slides.forEach((s,i)=>{
        if(i!==index){
          restoreLetters(s.querySelector('h2'));
          restoreLetters(s.querySelector('p'));
        }
      });
      if(nextSlide) nextSlide.focus({preventScroll:true});
      animateSlide(nextSlide);
      highlightActiveButton(index);
      announceSlide(index);
      animateProgress(index);
     
      center(nextSlide);
    }
  });

  tl.to(prevSlide, {autoAlpha: 0, y: -18, scale: 0.995, duration: 0.33, ease: "power2.in"})
    .set(prevSlide, {clearProps: "all"}); 

  tl.set(nextSlide, {autoAlpha: 1, y: 18, scale: 0.998})
    .to(nextSlide, {autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "power2.out"});
}

let current = 0;
showSlide(current);


function startAuto(){
  if(prefersReduced || autoDelay === 0 || autoTimer) return;
  stopAuto();
  progressBar.style.width = '0%';
  progressTween = gsap.to(progressBar, {width: '100%', duration: autoDelay/1000, ease: 'linear'});

  progressGlow = gsap.to(progressBar, {boxShadow: '0 0 30px rgba(154,230,180,0.6)', duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut'});
  autoTimer = setInterval(()=>{
    current = (current + 1) % slides.length;
    showSlide(current);
    gsap.set(progressBar, {width: '0%'});
    if(progressTween) progressTween.kill();
    if(progressGlow) progressGlow.kill();
    progressTween = gsap.to(progressBar, {width: '100%', duration: autoDelay/1000, ease: 'linear'});
    progressGlow = gsap.to(progressBar, {boxShadow: '0 0 30px rgba(154,230,180,0.6)', duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut'});
  }, autoDelay);
}

function stopAuto(){
  if(autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  if(progressTween) { progressTween.kill(); progressTween = null; }
  if(progressGlow) { progressGlow.kill(); progressGlow = null; }
  if(progressBar) gsap.set(progressBar, {width: '0%', boxShadow: '0 0 6px rgba(154,230,180,0.06)'}); // restablecer
}

function animateProgress(index){
  if(prefersReduced || autoDelay === 0) return;
  if(progressTween) progressTween.kill();
  if(progressGlow) progressGlow.kill();
  gsap.set(progressBar, {width: '0%'});
  progressTween = gsap.to(progressBar, {width: '100%', duration: autoDelay/1000, ease: 'linear'});
  progressGlow = gsap.to(progressBar, {boxShadow: '0 0 30px rgba(154,230,180,0.6)', duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut'});
}


buttons.forEach((btn, idx) => {
  btn.setAttribute('data-index', idx);
  btn.setAttribute('aria-selected', idx === current ? 'true' : 'false');

  btn.addEventListener('mouseenter', () => {
    
    if(btn._hoverTween) { btn._hoverTween.kill(); btn._hoverTween = null; }

    btn._hoverTween = gsap.to(btn, {scale: 1.06, boxShadow: '0 12px 40px rgba(154,230,180,0.26)', textShadow: '0 0 12px rgba(154,230,180,0.5)', duration: 0.45, repeat: -1, yoyo: true, ease: 'sine.inOut'});
  });
  btn.addEventListener('mouseleave', () => {
    if(btn._hoverTween) { btn._hoverTween.kill(); btn._hoverTween = null; }
    gsap.to(btn, {scale: 1, boxShadow: 'none', textShadow: 'none', duration: 0.22, ease: 'power2.out'});
  });

  btn.addEventListener('mousedown', () => {
    
    if(btn._hoverTween) { btn._hoverTween.pause(); }
    gsap.to(btn, {scale: 0.96, duration: 0.08, ease: 'power2.inOut'});
  });
  btn.addEventListener('mouseup', () => {
    if(btn._hoverTween) { btn._hoverTween.resume(); }
    gsap.to(btn, {scale: 1.06, duration: 0.12, ease: 'power2.out'});
    setTimeout(()=> {
      if(btn.matches(':hover')) {
     
        if(!btn._hoverTween) {
          btn._hoverTween = gsap.to(btn, {scale: 1.06, boxShadow: '0 12px 40px rgba(154,230,180,0.26)', textShadow: '0 0 12px rgba(154,230,180,0.5)', duration: 0.45, repeat: -1, yoyo: true, ease: 'sine.inOut'});
        }
      } else {
        gsap.to(btn, {scale: 1, duration: 0.12});
      }
    }, 120);
  });

  btn.addEventListener('click', (e) => {
    const idx = Number(btn.getAttribute('data-index'));
    current = idx;
   
    showSlide(current, { instant: true });
    
    gsap.fromTo(btn, {boxShadow: '0 0 0 rgba(154,230,180,0)'}, {boxShadow: '0 0 36px rgba(154,230,180,0.44)', duration: 0.36, yoyo: true, repeat: 1, ease: 'power2.out'});
    
    stopAuto();
    
    setTimeout(()=> startAuto(), 3000);
  });
});

function highlightActiveButton(index){
  buttons.forEach((b,i)=>{
    const selected = i === index;
    b.setAttribute('aria-selected', selected ? 'true' : 'false');
    if(selected){
      gsap.to(b, {backgroundColor: '#2d3748', scale: 1.06, duration: 0.22, ease: 'power2.out'});
    } else {
      gsap.to(b, {backgroundColor: '#1a202c', scale: 1, duration: 0.22, ease: 'power2.out'});
    }
  });
}

function announceSlide(index){
  const slide = slides[index];
  if(!announcer || !slide) return;
  const title = slide.querySelector('h2')?.textContent || '';
  const para = slide.querySelector('p')?.textContent || '';
  announcer.textContent = `${title}. ${para}`;
}

gallery.addEventListener('mouseenter', () => {
  stopAuto();
});
gallery.addEventListener('mouseleave', () => {

  setTimeout(()=> startAuto(), 500);
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowRight'){
    stopAuto();
    current = (current + 1) % slides.length;
    showSlide(current);
    setTimeout(()=> startAuto(), 3000);
  } else if(e.key === 'ArrowLeft'){
    stopAuto();
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
    setTimeout(()=> startAuto(), 3000);
  } else if(e.key === ' ' || e.key === 'Spacebar'){
    e.preventDefault();
    if(autoTimer) stopAuto();
    else startAuto();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  

  document.querySelectorAll('h1,h2').forEach(el => el.classList.add('neon'));
 
  const mainTitle = document.querySelector('h1');
  if (mainTitle) {
   
    splitLetters(mainTitle);
    
    const titleChars = mainTitle.querySelectorAll('.char');

    if (prefersReduced) {
    
      gsap.set(titleChars, {y: 0, opacity: 1, scale: 1, rotationX: 0});
    } else {
 
      const tlTitle = gsap.timeline({defaults: {duration: 0.9, ease: 'back.out(1.6)'}});

      tlTitle.fromTo(titleChars,
        {y: 90, rotationX: -60, opacity: 0, scale: 0.82, transformOrigin: '50% 50%'},
        {y: 0, rotationX: 0, opacity: 1, scale: 1, stagger: 0.03},
        0
      );

      tlTitle.to(mainTitle, {textShadow: '0 0 36px rgba(154,230,180,0.98)', duration: 1.1, ease: 'sine.inOut'}, '-=0.4');

      tlTitle.to(titleChars, {rotation: 2, yoyo: true, repeat: 1, duration: 0.8, stagger: 0.02, ease: 'sine.inOut'}, '+=0.12');

      tlTitle.fromTo('.container', {y: 8, opacity: 0.98}, {y: 0, opacity: 1, duration: 0.9, ease: 'power2.out'}, 0.05);
    }
  }

  startAuto();
});