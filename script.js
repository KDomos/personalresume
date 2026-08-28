/* ==========================================================
   KIBET EMMA — PORTFOLIO SCRIPT
   Vanilla JS, no dependencies. Organized by feature so any
   block below can be edited or removed independently.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close menu after tapping a link (mobile)
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll-spy: highlight nav link for section in view ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => spyObserver.observe(section));
  }

  /* ---------- Animated stat counters (About section) ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach(el => statObserver.observe(el));
  } else {
    // fallback: just show final numbers
    statNumbers.forEach(el => { el.textContent = el.dataset.count; });
  }

  /* ---------- Portfolio "Load more" / "Show less" ---------- */
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const projectGrid = document.getElementById('projectGrid');

  if (loadMoreBtn && projectGrid) {
    const cards = Array.from(projectGrid.querySelectorAll('.project-card'));
    const initialVisibleCount = 4;

    // Keep the first 4 cards visible, and any later ones hidden by default.
    cards.forEach((card, index) => {
      if (index >= initialVisibleCount) {
        card.classList.add('is-hidden');
      }
    });

    // If there are no extra cards beyond the initial set, hide the button.
    if (cards.length <= initialVisibleCount) {
      loadMoreBtn.style.display = 'none';
    }

    loadMoreBtn.addEventListener('click', () => {
      const hiddenCards = projectGrid.querySelectorAll('.project-card.is-hidden');

      if (hiddenCards.length > 0) {
        hiddenCards.forEach(card => card.classList.remove('is-hidden'));
        loadMoreBtn.textContent = 'Show less work';
      } else {
        cards.forEach((card, index) => {
          if (index >= initialVisibleCount) {
            card.classList.add('is-hidden');
          }
        });
        loadMoreBtn.textContent = 'Load more work';
      }
    });
  }

  /* ---------- Testimonial carousel ---------- */
  const testimonials = [
    {
      quote: "Kibet didn't just fix our systems — he overhauled how we manage our digital workflows entirely. His IT support and document processing have kept our community operations running without a hitch.",
      author: "Local Administrator — Amudat District"
    },
    {
      quote: "Kibet didn't just design a campaign flyer — he captured the exact voice and energy we needed to connect with the community. His graphics and digital media support were critical to our outreach.",
      author: "Hon. Aboot Florence Katikati — Political Candidate"
    },
    {
      quote: "Kibet didn't just file forms — he brought order to a chaotic biometric enrollment process. His field verification and data entry skills set the standard for our district reporting.",
      author: "Field Supervisor — NIRA Uganda"
    },
    {
      quote: "Kibet doesn't just do repairs — he is the digital backbone for our local businesses. From OS setups to mobile money services, he’s the technician everyone trusts in Karamoja.",
      author: "Client — Domos Digital & Prints"
    }
  ];

  const quoteEl = document.getElementById('testimonialQuote');
  const authorEl = document.getElementById('testimonialAuthor');
  const avatarBtns = document.querySelectorAll('.testimonial-avatar');

  avatarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index, 10);
      const item = testimonials[index];
      if (!item || !quoteEl || !authorEl) return;

      quoteEl.textContent = `"${item.quote}"`;
      authorEl.textContent = item.author;

      avatarBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  /* ---------- Contact form (client-side only, no backend wired up) ---------- */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const fields = [
        { input: nameInput, errorId: 'nameError', message: 'Enter your name.' },
        { input: emailInput, errorId: 'emailError', message: 'Enter an email or phone number.' },
        { input: messageInput, errorId: 'messageError', message: 'Tell me a little about the project.' }
      ];

      let isValid = true;

      fields.forEach(({ input, errorId, message }) => {
        const errorEl = document.getElementById(errorId);
        const row = input.closest('.form-row');
        const filled = input.value.trim().length > 0;

        row.classList.toggle('has-error', !filled);
        errorEl.textContent = filled ? '' : message;
        if (!filled) isValid = false;
      });

      if (!isValid) {
        statusEl.textContent = '';
        return;
      }

      // No backend is wired up yet — this simulates a send.
      // Replace this block with a fetch() call to your form endpoint.
      statusEl.textContent = `Thanks — your message is on its way. I'll reply within one business day.`;
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
