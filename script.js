/* Final merged JS: original welcome preserved + excellent works page
   - welcome animations (unchanged)
   - reveal futuristic UI after Explore (particles, typed, nav)
   - polished works grid with fullscreen modal + keyboard nav
   - GSAP enhancements if available
*/

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- ORIGINAL WELCOME ---------- */
  const welcome = document.getElementById('welcome');
  const btnExplore = document.getElementById('btnExplore');
  const leftDeck = document.querySelectorAll('.left-deck .card-img');
  const rightDeck = document.querySelectorAll('.right-deck .card-img');

  function scatterCards(deck, direction = 1) {
    deck.forEach(card => {
      const r = (Math.random() * 20 - 10) * direction;
      const x = (Math.random() * 20 - 10) * direction;
      const y = (Math.random() * 10 - 5);
      card.style.setProperty('--r', `${r}deg`);
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  }
  scatterCards(leftDeck, -1);
  scatterCards(rightDeck, 1);

  [leftDeck, rightDeck].forEach(deck => {
    deck.forEach(card => {
      card.addEventListener('mouseenter', () => {
        deck.forEach(c => {
          c.style.setProperty('--r', '0deg');
          c.style.setProperty('--x', '0px');
          c.style.setProperty('--y', '0px');
        });
      });
      card.addEventListener('mouseleave', () => {
        scatterCards(deck, deck === leftDeck ? -1 : 1);
      });
    });
  });

  welcome.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    leftDeck.forEach(card => {
      card.style.transform = `rotate(${card.style.getPropertyValue('--r') || 0}) translateY(${card.style.getPropertyValue('--y') || 0}) translateX(${card.style.getPropertyValue('--x') || 0}) rotateY(${x/10}deg) rotateX(${-y/10}deg)`;
    });
    rightDeck.forEach(card => {
      card.style.transform = `rotate(${card.style.getPropertyValue('--r') || 0}) translateY(${card.style.getPropertyValue('--y') || 0}) translateX(${card.style.getPropertyValue('--x') || 0}) rotateY(${-x/10}deg) rotateX(${y/10}deg)`;
    });
  });

  /* ---------- FUTURISTIC UI PREP ---------- */
  const navFloat = document.querySelector('.nav-float');
  const intro = document.getElementById('intro');
  const skills = document.getElementById('skills');
  const works = document.getElementById('works');
  const footer = document.querySelector('.site-footer');
  const contactModal = document.getElementById('contactModal');

  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext && canvas.getContext('2d') ? canvas.getContext('2d') : null;
  let particlesStarted = false;

  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasTyped = typeof window.Typed !== 'undefined';

  function revealFuturistic() {
    // show nav and sections
    navFloat.classList.remove('hidden');
    intro.classList.remove('hidden');
    skills.classList.remove('hidden');
    works.classList.remove('hidden');
    footer.classList.remove('hidden');
    experience.classList.remove('hidden');
    projects.classList.remove('hidden');
    publications.classList.remove('hidden');
    achievements.classList.remove('hidden');

    // start particles
    if (!particlesStarted && ctx) startParticles();
    // typed
    if (hasTyped && document.getElementById('typed')) {
      new Typed('#typed', {
        strings: [
          'Designing the Future — Where Creativity Meets Intelligence.',
          'UI / UX • AI Prototypes • Interactive Web Apps',
          'I build product experiences with code & design.'
        ],
        typeSpeed: 45,
        backSpeed: 24,
        backDelay: 1600,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }

    // small GSAP entrance
    if (hasGSAP) {
      gsap.registerPlugin(window.ScrollTrigger);
      gsap.from('.hi', { y: 28, opacity: 0, duration: 0.8 });
      gsap.from('.skill-card', { y: 18, opacity: 0, stagger: 0.08, duration: 0.7, scrollTrigger: { trigger: '#skills', start: 'top 85%' }});
      gsap.from('.work', { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, scrollTrigger: { trigger: '#works', start: 'top 85%' }});
    }

    initSkillRadials();
    initWorksGrid();
    initContact();
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  // Explore button: keep fade + slide from original, then reveal futuristic UI
  btnExplore.addEventListener('click', () => {
    welcome.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    welcome.style.opacity = '0';
    welcome.style.transform = 'translateY(-50px)';
    setTimeout(() => {
      welcome.style.display = 'none';
      revealFuturistic();
      // scroll to intro smoothly
      intro.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  });

  /* ---------- PARTICLES (network) ---------- */
  function startParticles() {
    if (!ctx) return;
    canvas.style.display = 'block';
    resizeCanvas();
    const nodes = [];
    const NODE_COUNT = Math.max(28, Math.floor((canvas.width * canvas.height) / 90000));

    function rand(min, max){ return Math.random() * (max - min) + min; }

    class Node {
      constructor(){
        this.x = rand(0, canvas.width);
        this.y = rand(0, canvas.height);
        this.vx = rand(-0.35, 0.35);
        this.vy = rand(-0.35, 0.35);
        this.r = rand(1.6, 3.2);
      }
      update(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,224,255,0.12)';
        ctx.fill();
      }
    }

    function initNodes(){
      nodes.length = 0;
      for(let i=0;i<NODE_COUNT;i++) nodes.push(new Node());
    }
    initNodes();

    function connectNodes(){
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x; const dy = a.y - b.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if(d < 160){
            ctx.beginPath();
            ctx.strokeStyle = `rgba(111,91,255,${0.08 * (1 - d/160)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    function tick(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const n of nodes){ n.update(); n.draw(); }
      connectNodes();
      requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener('resize', () => { resizeCanvas(); initNodes(); });
    particlesStarted = true;
  }

  function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }

  /* ---------- SKILL RADIALS ---------- */
  function initSkillRadials(){
    document.querySelectorAll('.radial').forEach(svg => {
      const percent = Number(svg.dataset.skill || 60);
      const circle = svg.querySelector('.fg');
      const radius = 48;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;
      if (hasGSAP) {
        gsap.to(circle, { strokeDashoffset: circumference * (1 - (percent/100)), duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: svg, start: 'top 85%' }});
      } else {
        circle.style.strokeDashoffset = circumference * (1 - (percent/100));
      }
    });
  }

  /* ---------- WORKS GRID + Modal ---------- */
  function initWorksGrid(){
    const cats = document.querySelectorAll('.cat');
    const works = document.querySelectorAll('.work');

    // Filtering
    cats.forEach(btn => {
      btn.addEventListener('click', () => {
        cats.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        works.forEach(w => {
          const matches = (cat === 'all') || (w.dataset.cat === cat);
          w.style.opacity = matches ? '1' : '0.12';
          w.style.pointerEvents = matches ? 'auto' : 'none';
        });
      });
    });

    // Modal creation
    function openProjectModal(index){
      const items = Array.from(document.querySelectorAll('.work'));
      const item = items[index];
      if(!item) return;
      const img = item.querySelector('img').src;
      const title = item.querySelector('.work-title') ? item.querySelector('.work-title').textContent : item.getAttribute('aria-label') || 'Project';
      const desc = item.querySelector('.work-meta p') ? item.querySelector('.work-meta p').textContent : '';
      const tags = item.querySelector('.work-tags') ? item.querySelector('.work-tags').textContent : '';
      const overlay = document.createElement('div');
      overlay.className = 'overlay-full';
      overlay.innerHTML = `
        <div class="overlay-inner">
          <button class="overlay-close" aria-label="Close">✕</button>
          <div class="overlay-media"><img src="${img}" alt="${title}"></div>
          <div class="overlay-info">
            <h3>${title}</h3>
            <div class="tags"><span class="work-tags">${tags}</span></div>
            <p class="muted">${desc}</p>
            <div class="tech"><strong>Tech / Tools:</strong> HTML, CSS, JS, Python (example)</div>
            <div class="overlay-actions">
              <a class="btn btn-primary" href="#" target="_blank" rel="noopener">View Live</a>
              <button class="btn btn-ghost overlay-prev">Prev</button>
              <button class="btn btn-ghost overlay-next">Next</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      const closeBtn = overlay.querySelector('.overlay-close');
      const prevBtn = overlay.querySelector('.overlay-prev');
      const nextBtn = overlay.querySelector('.overlay-next');

      // animate in
      if (hasGSAP) gsap.from(overlay.querySelector('.overlay-inner'), { y: 36, opacity: 0, duration: 0.45 });

      // handlers
      function close() { if (hasGSAP) { gsap.to(overlay.querySelector('.overlay-inner'), { y: -20, opacity: 0, duration: 0.25, onComplete: () => overlay.remove() }); } else overlay.remove(); document.removeEventListener('keydown', keynav); }
      function keynav(e){
        if(e.key === 'Escape') close();
        if(e.key === 'ArrowLeft') prev();
        if(e.key === 'ArrowRight') next();
      }
      function prev(){ const i = (index - 1 + items.length) % items.length; overlay.remove(); openProjectModal(i); }
      function next(){ const i = (index + 1) % items.length; overlay.remove(); openProjectModal(i); }

      closeBtn.onclick = close;
      prevBtn.onclick = prev;
      nextBtn.onclick = next;
      overlay.addEventListener('click', (ev) => { if(ev.target === overlay) close(); });
      document.addEventListener('keydown', keynav);
    }

    // click to open modal
    document.querySelectorAll('.work').forEach((w, idx) => {
      w.addEventListener('click', () => openProjectModal(idx));
      w.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') openProjectModal(idx); });
    });
  }

  /* ---------- CONTACT ---------- */
  function initContact(){
    const contactBtn = document.getElementById('contactBtnNav') || document.getElementById('contactBtn');
    const closeModal = document.getElementById('closeModal');
    const modalCancel = document.getElementById('modalCancel');

    if(contactBtn){
      contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.remove('hidden');
        if (hasGSAP) gsap.from('.modal-panel', { y: 20, opacity: 0, duration: 0.35 });
      });
    }
    if(closeModal) closeModal.addEventListener('click', () => contactModal.classList.add('hidden'));
    if(modalCancel) modalCancel.addEventListener('click', () => contactModal.classList.add('hidden'));

    const form = document.getElementById('contactForm');
    if(form){
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.target);
        const name = encodeURIComponent(fd.get('name') || '');
        const email = encodeURIComponent(fd.get('email') || '');
        const msg = encodeURIComponent(fd.get('message') || '');
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${decodeURIComponent(msg)}`);
        window.location.href = `mailto:bunnykristipatidhanu123@gmail.com?subject=${subject}&body=${body}`;
      });
    }
  }

  /* ---------- Cursor sparkle ---------- */
  const sparkle = document.createElement('div');
  sparkle.className = 'cursor-spark';
  document.body.appendChild(sparkle);
  document.addEventListener('mousemove', e => {
    sparkle.style.left = (e.clientX - 6) + 'px';
    sparkle.style.top = (e.clientY - 6) + 'px';
  });

  /* ---------- Smooth anchor scroll for nav links ---------- */
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('[data-scroll]');
    if (a) {
      ev.preventDefault();
      const href = a.getAttribute('href');
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});




const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll(".progress");

      bars.forEach(bar => {
        bar.style.width = bar.getAttribute("data-width");
      });
    }
  });
}, { threshold: 0.3 });

observer.observe(document.querySelector("#skills"));




const expObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".timeline-content").forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }, i * 200);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".experience-section").forEach(section => {
  section.querySelectorAll(".timeline-content").forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
  });

  expObserver.observe(section);
});




 document.addEventListener("DOMContentLoaded", () => {

  // ================= CONTACT MODAL =================
  const contactModal = document.getElementById("contactModal");
  const openBtn = document.getElementById("openModal");
  const closeContactBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("modalCancel");

  // Open modal
  openBtn.addEventListener("click", () => {
    contactModal.classList.remove("hidden");
  });

  // Close modal (X button)
  closeContactBtn.addEventListener("click", () => {
    contactModal.classList.add("hidden");
  });

  // Close modal (Cancel button)
  cancelBtn.addEventListener("click", () => {
    contactModal.classList.add("hidden");
  });

  // Close when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      contactModal.classList.add("hidden");
    }
  });


  // ================= IMAGE MODAL =================
  const imgModal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const closeImgBtn = document.querySelector(".close");

  const images = document.querySelectorAll(".slide img");

  // Open image modal
  images.forEach(img => {
    img.addEventListener("click", () => {
      imgModal.style.display = "block";
      modalImg.src = img.src;
    });
  });

  // Close image modal
  closeImgBtn.addEventListener("click", () => {
    imgModal.style.display = "none";
  });

  // Close when clicking outside image
  imgModal.addEventListener("click", (e) => {
    if (e.target === imgModal) {
      imgModal.style.display = "none";
    }
  });

});


const cards = document.querySelectorAll(".testimonial-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
  });


  
