gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768;
const isLowPower = isMobile || navigator.hardwareConcurrency <= 4;

// ==========================================
// FUNCIÓN PARA DIVIDIR TEXTO EN CARACTERES
// ==========================================
function splitLetters(el) {
  if (!el) return [];
  if (el.dataset.split === 'true') return el.querySelectorAll('.char');
  
  const text = el.textContent;
  el.dataset.original = text;
  el.innerHTML = '';
  
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = text[i];
    span.style.setProperty('--i', String(i));
    el.appendChild(span);
  }
  
  el.dataset.split = 'true';
  return el.querySelectorAll('.char');
}

// ==========================================
// CONFIGURACIÓN DE ANIMACIONES SEGÚN DISPOSITIVO
// ==========================================
const animConfig = {
  duration: isMobile ? 0.8 : 1.2,
  stagger: isMobile ? 0.02 : 0.03,
  ease: isMobile ? 'power2.out' : 'elastic.out(1, 0.6)'
};

// ==========================================
// ANIMACIONES SOLO SI NO HAY MOVIMIENTO REDUCIDO
// ==========================================
if (!prefersReduced) {
  
  // === ANIMACIÓN DEL FONDO CÓSMICO (Solo desktop) ===
  if (!isMobile) {
    gsap.to(".cosmic-bg", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  // === ANIMACIÓN DE ESTRELLAS (Reducida en móvil) ===
  gsap.to(".stars", {
    backgroundPosition: isMobile ? "5000px 5000px" : "10000px 10000px",
    duration: isMobile ? 150 : 300,
    repeat: -1,
    ease: "none"
  });

  // ==========================================
  // ANIMACIÓN DEL TÍTULO PRINCIPAL
  // ==========================================
  const mainTitle = document.querySelector('.main-title');
  if (mainTitle) {
    const titleChars = splitLetters(mainTitle);
    
    // Animación de entrada optimizada
    gsap.fromTo(titleChars,
      {
        y: isMobile ? 50 : 100,
        rotationX: isMobile ? -45 : -90,
        rotationZ: isMobile ? 0 : gsap.utils.random(-15, 15),
        opacity: 0,
        scale: 0.7,
        transformOrigin: "50% 50%",
        filter: isMobile ? "blur(5px)" : "blur(10px)"
      },
      {
        y: 0,
        rotationX: 0,
        rotationZ: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: animConfig.duration,
        stagger: {
          each: animConfig.stagger,
          from: isMobile ? "start" : "random"
        },
        ease: animConfig.ease,
        scrollTrigger: {
          trigger: mainTitle,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Pulso de brillo (reducido en móvil)
    if (!isLowPower) {
      gsap.to(mainTitle, {
        textShadow: isMobile 
          ? "0 0 25px rgba(154,230,180,0.9), 0 0 40px rgba(67,223,121,0.6)"
          : "0 0 40px rgba(154,230,180,1), 0 0 60px rgba(67,223,121,0.8), 0 0 80px rgba(154,230,180,0.4)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Animación del resplandor (solo desktop)
    if (!isMobile) {
      gsap.fromTo(".title-glow",
        { scale: 0.8, opacity: 0 },
        { scale: 1.2, opacity: 0.5, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" }
      );
    }
  }

  // ==========================================
  // ANIMACIÓN DEL TEXTO INTRODUCTORIO
  // ==========================================
  const introText = document.querySelector('.intro-text');
  if (introText) {
    gsap.fromTo(introText,
      {
        opacity: 0,
        y: isMobile ? 30 : 50,
        scale: 0.95,
        rotationX: isMobile ? 0 : -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: isMobile ? 1 : 1.4,
        delay: isMobile ? 0.5 : 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: introText,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // ==========================================
  // ANIMACIÓN DEL INDICADOR DE SCROLL
  // ==========================================
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator && !isMobile) {
    gsap.from(scrollIndicator, {
      opacity: 0,
      y: -20,
      duration: 1,
      delay: 1.5,
      ease: "power2.out"
    });
  }

  // ==========================================
  // ANIMACIONES DE CADA SECCIÓN
  // ==========================================
  gsap.utils.toArray(".fullscreen").forEach((section, index) => {
    if (index === 0) return; // Saltar la primera sección (hero)

    const sectionNumber = section.querySelector(".section-number");
    const h2 = section.querySelector(".section-title");
    const cards = section.querySelectorAll(".info-card");

    // === ANIMACIÓN DEL NÚMERO DE SECCIÓN ===
    if (sectionNumber && !isMobile) {
      gsap.fromTo(sectionNumber,
        {
          scale: 0.5,
          opacity: 0,
          rotation: -90
        },
        {
          scale: 1,
          opacity: 0.08,
          rotation: 0,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // === ANIMACIÓN DEL TÍTULO DE SECCIÓN ===
    if (h2) {
      const h2Chars = splitLetters(h2);
      
      gsap.fromTo(h2Chars,
        {
          y: isMobile ? 40 : 80,
          opacity: 0,
          rotationY: isMobile ? 0 : 180,
          scale: 0.5,
          filter: isMobile ? "blur(3px)" : "blur(10px)"
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: isMobile ? 0.8 : 1,
          stagger: 0.02,
          ease: isMobile ? "power2.out" : "back.out(1.4)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Efecto de brillo en h2 (reducido en móvil)
      if (!isLowPower) {
        gsap.to(h2, {
          textShadow: isMobile
            ? "0 0 20px rgba(154,230,180,0.9), 0 0 30px rgba(67,223,121,0.6)"
            : "0 0 30px rgba(154,230,180,1), 0 0 45px rgba(67,223,121,0.8)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }

    // === ANIMACIÓN DE LAS TARJETAS ===
    if (cards.length) {
      cards.forEach((card, cardIndex) => {
        // Entrada optimizada
        gsap.fromTo(card,
          {
            opacity: 0,
            y: isMobile ? 50 : 100,
            rotationX: isMobile ? 0 : -45,
            scale: 0.9,
            filter: isMobile ? "blur(3px)" : "blur(8px)"
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: isMobile ? 0.6 : 1,
            delay: cardIndex * (isMobile ? 0.1 : 0.15),
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Animación flotante (solo desktop)
        if (!isMobile && !isLowPower) {
          gsap.to(card, {
            y: -8,
            duration: 2 + (cardIndex * 0.3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: cardIndex * 0.2
          });
        }

        // Animación del icono
        const icon = card.querySelector('.card-icon');
        if (icon) {
          gsap.fromTo(icon,
            {
              scale: 0,
              rotation: isMobile ? 0 : -180,
              opacity: 0
            },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.6,
              delay: cardIndex * (isMobile ? 0.1 : 0.15) + 0.2,
              ease: isMobile ? "back.out(1.5)" : "elastic.out(1, 0.5)",
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // Rotación suave del icono (solo desktop)
          if (!isMobile && !isLowPower) {
            gsap.to(icon, {
              rotation: 5,
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        }

        // Efecto de brillo en hover (solo desktop)
        if (!isMobile) {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 50px rgba(154,230,180,0.3), inset 0 0 25px rgba(154,230,180,0.08)",
              borderColor: "rgba(154,230,180,0.7)",
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              boxShadow: "0 0 0 rgba(0,0,0,0)",
              borderColor: "rgba(154,230,180,0.2)",
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      });
    }

    // === EFECTO PARALLAX (solo desktop) ===
    if (!isMobile) {
      gsap.to(section, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }
  });

  // ==========================================
  // ANIMACIONES DE HIGHLIGHTS (reducido en móvil)
  // ==========================================
  if (!isLowPower) {
    gsap.utils.toArray('.highlight').forEach((highlight) => {
      gsap.to(highlight, {
        textShadow: isMobile
          ? "0 0 10px rgba(79,209,197,0.7)"
          : "0 0 15px rgba(79,209,197,0.8), 0 0 25px rgba(79,209,197,0.5)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }
}

// ==========================================
// OPTIMIZACIÓN: Pausar animaciones fuera de vista
// ==========================================
if (!prefersReduced && !isMobile) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
}

// ==========================================
// MANEJO DE RESIZE RESPONSIVO
// ==========================================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// ==========================================
// LAZY LOADING DE ANIMACIONES PESADAS
// ==========================================
if ('IntersectionObserver' in window && !isMobile) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.info-card').forEach(card => {
    observer.observe(card);
  });
}

// ==========================================
// PERFORMANCE: Reducir animaciones en batería baja
// ==========================================
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    if (battery.level < 0.2 && !battery.charging) {
      gsap.globalTimeline.timeScale(0.5);
    } else {
      gsap.globalTimeline.timeScale(1);
    }
  });
}