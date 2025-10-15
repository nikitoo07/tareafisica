gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
// ANIMACIONES SOLO SI NO HAY MOVIMIENTO REDUCIDO
// ==========================================
if (!prefersReduced) {
  
  // === ANIMACIÓN DEL FONDO CÓSMICO ===
  gsap.to(".cosmic-bg", {
    backgroundPosition: "100% 100%",
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // === ANIMACIÓN DE ESTRELLAS ===
  gsap.to(".stars", {
    backgroundPosition: "10000px 10000px",
    duration: 300,
    repeat: -1,
    ease: "none"
  });

  // ==========================================
  // ANIMACIÓN DEL TÍTULO PRINCIPAL
  // ==========================================
  const mainTitle = document.querySelector('.main-title');
  if (mainTitle) {
    const titleChars = splitLetters(mainTitle);
    
    // Animación de entrada con efecto 3D
    gsap.fromTo(titleChars,
      {
        y: 100,
        rotationX: -90,
        rotationZ: gsap.utils.random(-15, 15),
        opacity: 0,
        scale: 0.7,
        transformOrigin: "50% 50%",
        filter: "blur(10px)"
      },
      {
        y: 0,
        rotationX: 0,
        rotationZ: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: {
          each: 0.03,
          from: "random"
        },
        ease: 'elastic.out(1, 0.6)',
        scrollTrigger: {
          trigger: mainTitle,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Pulso de brillo continuo
    gsap.to(mainTitle, {
      textShadow: "0 0 40px rgba(154,230,180,1), 0 0 60px rgba(67,223,121,0.8), 0 0 80px rgba(154,230,180,0.4)",
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Animación del resplandor
    gsap.fromTo(".title-glow",
      { scale: 0.8, opacity: 0 },
      { scale: 1.2, opacity: 0.6, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
  }

  // ==========================================
  // ANIMACIÓN DEL TEXTO INTRODUCTORIO
  // ==========================================
  const introText = document.querySelector('.intro-text');
  if (introText) {
    gsap.fromTo(introText,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
        rotationX: -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.4,
        delay: 1,
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
  if (scrollIndicator) {
    gsap.from(scrollIndicator, {
      opacity: 0,
      y: -20,
      duration: 1,
      delay: 2,
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
    if (sectionNumber) {
      gsap.fromTo(sectionNumber,
        {
          scale: 0.5,
          opacity: 0,
          rotation: -180
        },
        {
          scale: 1,
          opacity: 0.08,
          rotation: 0,
          duration: 1.5,
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
          y: 80,
          opacity: 0,
          rotationY: 180,
          scale: 0.5,
          filter: "blur(10px)"
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.025,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Efecto de brillo en h2
      gsap.to(h2, {
        textShadow: "0 0 30px rgba(154,230,180,1), 0 0 45px rgba(67,223,121,0.8)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // === ANIMACIÓN DE LAS TARJETAS ===
    if (cards.length) {
      cards.forEach((card, cardIndex) => {
        // Entrada dramática
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
            rotationX: -45,
            scale: 0.8,
            filter: "blur(8px)"
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            delay: cardIndex * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Animación flotante continua
        gsap.to(card, {
          y: -10,
          duration: 2 + (cardIndex * 0.3),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: cardIndex * 0.2
        });

        // Animación del icono
        const icon = card.querySelector('.card-icon');
        if (icon) {
          gsap.fromTo(icon,
            {
              scale: 0,
              rotation: -180,
              opacity: 0
            },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.8,
              delay: cardIndex * 0.15 + 0.3,
              ease: "elastic.out(1, 0.5)",
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // Rotación suave continua del icono
          gsap.to(icon, {
            rotation: 5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }

        // Efecto de brillo en hover
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(154,230,180,0.4), inset 0 0 30px rgba(154,230,180,0.1)",
            borderColor: "rgba(154,230,180,0.8)",
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
      });
    }

    // === EFECTO PARALLAX EN LA SECCIÓN ===
    gsap.to(section, {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  });

  // ==========================================
  // ANIMACIONES ESPECIALES DE HIGHLIGHTS
  // ==========================================
  gsap.utils.toArray('.highlight').forEach((highlight) => {
    gsap.to(highlight, {
      textShadow: "0 0 15px rgba(79,209,197,0.8), 0 0 25px rgba(79,209,197,0.5)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });}