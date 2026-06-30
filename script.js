document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME MANAGER (Light/Dark Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  
  // Set initial theme based on localStorage (defaults to light mode for optimal design balance)
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    if (themeToggleIcon) themeToggleIcon.textContent = 'light_mode';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    if (themeToggleIcon) themeToggleIcon.textContent = 'dark_mode';
  }


  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
        if (themeToggleIcon) themeToggleIcon.textContent = 'dark_mode';
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
        if (themeToggleIcon) themeToggleIcon.textContent = 'light_mode';
      }
    });
  }

  // ==========================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('translate-x-0');
      if (isOpen) {
        // Close menu
        mobileNavDrawer.classList.remove('translate-x-0');
        mobileNavDrawer.classList.add('translate-x-full');
        if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
      } else {
        // Open menu
        mobileNavDrawer.classList.remove('translate-x-full');
        mobileNavDrawer.classList.add('translate-x-0');
        if (mobileMenuIcon) mobileMenuIcon.textContent = 'close';
      }
    });

    // Close drawer when any mobile nav link is clicked
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('translate-x-0');
        mobileNavDrawer.classList.add('translate-x-full');
        if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
      });
    });
  }

  // ==========================================
  // 3. INTERACTIVE MODALS
  // ==========================================
  const videoModal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('modal-video-player');
  const reelCarousel = document.querySelector('.reel-showcase');
  const reelCards = Array.from(document.querySelectorAll('.reel-card'));
  const closeVideoBtn = document.getElementById('close-video-btn');

  const caseStudyModal = document.getElementById('case-study-modal');
  const openCaseStudyBtns = document.querySelectorAll('.open-case-study');
  const closeCaseStudyBtn = document.getElementById('close-case-study-btn');

  // Inline reel carousel handling
  if (reelCarousel && reelCards.length) {
    let activeReelIndex = Number(reelCarousel.dataset.activeIndex || 0);

    const getPlayableUrl = (url) => {
      const baseUrl = url || 'https://www.youtube.com/embed/d1K2MIsCjYQ';
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}autoplay=1&mute=1&playsinline=1&rel=0`;
    };

    const stopInlineReels = () => {
      reelCards.forEach((card) => {
        card.classList.remove('is-playing');
        const player = card.querySelector('.reel-inline-player');
        if (player) player.remove();
      });
    };

    const playActiveReel = () => {
      const activeCard = reelCards[activeReelIndex];
      const media = activeCard ? activeCard.querySelector('.reel-media') : null;
      if (!activeCard || !media || activeCard.classList.contains('is-playing')) return;

      const iframe = document.createElement('iframe');
      iframe.className = 'reel-inline-player';
      iframe.src = getPlayableUrl(activeCard.dataset.videoSrc);
      iframe.title = activeCard.getAttribute('aria-label') || 'Selected reel';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      media.appendChild(iframe);
      activeCard.classList.add('is-playing');
    };

    const renderReelCarousel = (shouldPlay = false) => {
      const total = reelCards.length;
      const previousIndex = (activeReelIndex - 1 + total) % total;
      const nextIndex = (activeReelIndex + 1) % total;

      stopInlineReels();
      reelCarousel.dataset.activeIndex = String(activeReelIndex);

      reelCards.forEach((card, index) => {
        card.classList.remove('is-active', 'is-side', 'is-prev', 'is-next', 'is-visible', 'is-hidden');
        card.setAttribute('aria-pressed', index === activeReelIndex ? 'true' : 'false');

        if (index === activeReelIndex) {
          card.classList.add('is-active', 'is-visible');
          card.style.order = '2';
          card.tabIndex = 0;
        } else if (index === previousIndex) {
          card.classList.add('is-side', 'is-prev', 'is-visible');
          card.style.order = '1';
          card.tabIndex = 0;
        } else if (index === nextIndex) {
          card.classList.add('is-side', 'is-next', 'is-visible');
          card.style.order = '3';
          card.tabIndex = 0;
        } else {
          card.classList.add('is-hidden');
          card.style.order = '4';
          card.tabIndex = -1;
        }
      });

      if (shouldPlay) playActiveReel();
    };

    const selectReel = (index) => {
      if (index === activeReelIndex) {
        playActiveReel();
        return;
      }

      activeReelIndex = index;
      renderReelCarousel(true);
    };

    reelCards.forEach((card, index) => {
      card.dataset.reelIndex = String(index);
      card.addEventListener('click', () => selectReel(index));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectReel(index);
        }
      });
    });

    renderReelCarousel(false);
  }

  if (closeVideoBtn && videoModal && videoPlayer) {
    closeVideoBtn.addEventListener('click', () => {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
      // Reset iframe source to stop video playback
      videoPlayer.src = '';
    });
  }

  // Case Study modal handling
  if (caseStudyModal) {
    openCaseStudyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        caseStudyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeCaseStudyBtn) {
      closeCaseStudyBtn.addEventListener('click', () => {
        caseStudyModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  // Generic overlay click to close active modals
  window.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
      if (videoPlayer) videoPlayer.src = '';
    }
    if (e.target === caseStudyModal) {
      caseStudyModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ==========================================
  // 4. SCROLL INTERSECTION OBSERVER
  // ==========================================
  // Scroll reveal effects
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve to keep element visible once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollElements.forEach(el => revealObserver.observe(el));

  // Why Choose Me cards: reveal each card only when it enters the viewport.
  const whyChooseSection = document.querySelector('#why-choose-me');
  if (whyChooseSection) {
    const whyChooseCards = Array.from(whyChooseSection.querySelectorAll('article'));
    const reduceWhyMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    whyChooseSection.classList.add('js-why-ready');

    if ('IntersectionObserver' in window && !reduceWhyMotion) {
      const whyChooseObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-why-visible');
            whyChooseObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.22,
        rootMargin: '0px 0px -6% 0px'
      });

      whyChooseCards.forEach((card) => whyChooseObserver.observe(card));
    } else {
      whyChooseCards.forEach((card) => card.classList.add('is-why-visible'));
    }
  }

  // Active state links in Navbar
  const sections = document.querySelectorAll('section[id], footer');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const navActiveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('text-orange-600', 'dark:text-orange-500', 'border-b-2', 'border-orange-600', 'font-extrabold');
          link.classList.add('text-slate-600', 'dark:text-slate-400');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-orange-600', 'dark:text-orange-500', 'border-b-2', 'border-orange-600', 'font-extrabold');
            link.classList.remove('text-slate-600', 'dark:text-slate-400');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => navActiveObserver.observe(sec));

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 5. AUDIT REQUEST FORM ENGINE
  // ==========================================
  const auditForms = document.querySelectorAll('form');
  const successModal = document.getElementById('success-modal');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  auditForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve inputs within this specific form
      const urlInput = form.querySelector('input[type="url"]');
      const emailInput = form.querySelector('input[type="email"]');
      
      let isValid = true;

      // Reset errors if any
      if (urlInput) urlInput.classList.remove('border-red-500');
      if (emailInput) emailInput.classList.remove('border-red-500');

      // Simple URL validation
      if (urlInput && !urlInput.value.trim()) {
        urlInput.classList.add('border-red-500');
        isValid = false;
      }

      // Simple Email validation
      if (emailInput && (!emailInput.value.trim() || !emailInput.value.includes('@'))) {
        emailInput.classList.add('border-red-500');
        isValid = false;
      }

      if (isValid) {
        // Simulate sending request
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
          Analyzing Site...
        `;

        setTimeout(() => {
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          // Clear inputs
          if (urlInput) urlInput.value = '';
          if (emailInput) emailInput.value = '';

          // Show success modal
          if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        }, 1500);
      }
    });
  });

  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // ==========================================
  // 6. 3D SEO NETWORK VISUAL
  // ==========================================
  // 6. 3D SEO NETWORK VISUAL
  // ==========================================
  const initSeoNetwork = () => {
    const canvas = document.getElementById('seo-network-canvas');
    if (!canvas) return;

    const viewport = canvas.parentElement;
    const context = canvas.getContext('2d');
    if (!context || !viewport) return;

    const nodes = [
      { x: -1.8, y: -0.9, z: 0.2, label: 'Tech' },
      { x: -1.2, y: 0.95, z: -0.8, label: 'GBP' },
      { x: -0.2, y: -1.45, z: 1.1, label: 'UX' },
      { x: 0.2, y: 1.4, z: 0.9, label: 'Content' },
      { x: 1.25, y: -0.85, z: -0.7, label: 'Links' },
      { x: 1.75, y: 0.55, z: 0.35, label: 'ROI' },
      { x: -0.65, y: 0.1, z: -1.35, label: 'Schema' },
      { x: 0.95, y: 0.05, z: 1.45, label: 'Local' }
    ];

    const links = [[0, 2], [0, 6], [1, 3], [1, 6], [2, 7], [3, 5], [4, 5], [4, 7], [5, 7], [3, 7]];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let angle = 0;

    const resize = () => {
      const rect = viewport.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const project = (point) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x * cos - point.z * sin;
      const z = point.x * sin + point.z * cos;
      const y = point.y + Math.sin(angle * 0.75 + point.x) * 0.08;
      const depth = 3.2 / (3.2 + z);
      const radius = Math.min(width, height) * 0.28;

      return {
        x: width / 2 + x * radius * depth,
        y: height / 2 + y * radius * depth,
        depth,
        alpha: Math.max(0.28, Math.min(1, depth)),
        label: point.label
      };
    };

    const drawRing = (scale, rotation, alpha) => {
      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(rotation);
      context.scale(1, 0.36 * scale);
      context.beginPath();
      context.arc(0, 0, Math.min(width, height) * 0.31, 0, Math.PI * 2);
      context.strokeStyle = `rgba(249, 104, 2, ${alpha})`;
      context.lineWidth = 1.2;
      context.stroke();
      context.restore();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(2, 6, 23, 0.08)';
      context.fillRect(0, 0, width, height);

      drawRing(1, angle * 0.6, 0.28);
      drawRing(0.85, -angle * 0.45, 0.18);
      drawRing(1.18, Math.PI / 2 + angle * 0.3, 0.14);

      const projected = nodes.map(project);

      links.forEach(([start, end]) => {
        const a = projected[start];
        const b = projected[end];
        const alpha = Math.min(a.alpha, b.alpha) * 0.42;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(255, 182, 148, ${alpha})`;
        context.lineWidth = 1.25;
        context.stroke();
      });

      projected
        .slice()
        .sort((a, b) => a.depth - b.depth)
        .forEach((node, index) => {
          const pulse = 1 + Math.sin(angle * 3 + index) * 0.16;
          const nodeRadius = 5.5 * node.depth * pulse;

          context.beginPath();
          context.arc(node.x, node.y, nodeRadius + 8, 0, Math.PI * 2);
          context.fillStyle = `rgba(249, 104, 2, ${0.08 * node.alpha})`;
          context.fill();

          context.beginPath();
          context.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
          context.fillStyle = index % 3 === 0 ? `rgba(56, 189, 248, ${node.alpha})` : `rgba(249, 104, 2, ${node.alpha})`;
          context.fill();

          if (node.depth > 0.88) {
            context.font = '700 11px Inter, Arial, sans-serif';
            context.fillStyle = `rgba(255, 255, 255, ${0.68 * node.alpha})`;
            context.fillText(node.label, node.x + 12, node.y + 4);
          }
        });

      angle += 0.006;
      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else draw();
    });
  };

  const initServiceOdyssey = () => {
    const stage = document.querySelector('[data-service-stage]');
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll('[data-depth-card]'));
    if (!cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    stage.classList.add('js-services-ready');

    if ('IntersectionObserver' in window && !reducedMotion) {
      const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-service-visible');
            serviceObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
      });

      cards.forEach((card) => serviceObserver.observe(card));
    } else {
      cards.forEach((card) => card.classList.add('is-service-visible'));
    }

    if (!canHover || reducedMotion) return;

    cards.forEach((card) => {
      const shell = card.querySelector('.service-card-shell');
      if (!shell) return;

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 8;
        const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 6;
        card.style.setProperty('--magnet-x', x.toFixed(2));
        card.style.setProperty('--magnet-y', y.toFixed(2));
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--magnet-x', '0');
        card.style.setProperty('--magnet-y', '0');
      });
    });
  };
  const initStickyGrowthStory = () => {
    const section = document.querySelector('.story-sticky');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.lead-growth-step'));
    const counter = section.querySelector('.lead-growth-kicker > span');
    if (!cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.classList.add('js-story-ready');

    if ('IntersectionObserver' in window && !reducedMotion) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-story-visible');
        });
      }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
      });

      cards.forEach((card) => cardObserver.observe(card));
    } else {
      cards.forEach((card) => card.classList.add('is-story-visible'));
    }

    let frameRequested = false;

    const updateActiveCard = () => {
      frameRequested = false;
      const targetY = window.innerHeight * 0.48;
      let activeIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - targetY);

        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });

      cards.forEach((card, index) => {
        card.classList.toggle('is-story-active', index === activeIndex);
      });

      if (counter) counter.textContent = String(activeIndex + 1).padStart(2, '0');
    };

    const requestActiveUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(updateActiveCard);
    };

    updateActiveCard();
    window.addEventListener('scroll', requestActiveUpdate, { passive: true });
    window.addEventListener('resize', requestActiveUpdate);
  };

  const initGuidedGrowthStory = () => {
    const section = document.querySelector('.story-guided');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.lead-growth-step'));
    if (!cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.classList.add('js-guided-ready');

    if (!('IntersectionObserver' in window) || reducedMotion) {
      section.classList.add('is-guided-started');
      cards.forEach((card) => card.classList.add('is-guided-visible'));
      return;
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        section.classList.add('is-guided-started');
        sectionObserver.disconnect();
      });
    }, {
      threshold: 0.08
    });

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-guided-visible');
        cardObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });

    sectionObserver.observe(section);
    cards.forEach((card) => cardObserver.observe(card));
  };

  const initBentoGrowthStory = () => {
    const section = document.querySelector('.story-bento');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.lead-growth-step'));
    if (!cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    section.classList.add('js-bento-ready');

    if (!('IntersectionObserver' in window) || reducedMotion) {
      section.classList.add('is-bento-started');
      cards.forEach((card) => card.classList.add('is-bento-visible'));
    } else {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          section.classList.add('is-bento-started');
          sectionObserver.disconnect();
        });
      }, {
        threshold: 0.08
      });

      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-bento-visible');
          cardObserver.unobserve(entry.target);
        });
      }, {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
      });

      sectionObserver.observe(section);
      cards.forEach((card) => cardObserver.observe(card));
    }

    if (!canHover || reducedMotion) return;

    cards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
        const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
        card.style.setProperty('--bento-glow-x', `${x.toFixed(1)}%`);
        card.style.setProperty('--bento-glow-y', `${y.toFixed(1)}%`);
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--bento-glow-x');
        card.style.removeProperty('--bento-glow-y');
      });
    });
  };

  const initIndustryBento = () => {
    const section = document.querySelector('.industry-bento-section');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('[data-industry-card]'));
    if (!cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    section.classList.add('js-industry-ready');

    cards.forEach((card, index) => {
      card.style.setProperty('--industry-delay', `${(index % 6) * 55}ms`);
    });

    if (!('IntersectionObserver' in window) || reducedMotion) {
      cards.forEach((card) => card.classList.add('is-industry-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-industry-visible');
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
      });

      cards.forEach((card) => observer.observe(card));
    }

    if (!canHover || reducedMotion) return;

    cards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
        const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
        card.style.setProperty('--industry-glow-x', `${x.toFixed(1)}%`);
        card.style.setProperty('--industry-glow-y', `${y.toFixed(1)}%`);
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--industry-glow-x');
        card.style.removeProperty('--industry-glow-y');
      });
    });
  };

  const initFocusedFlywheel = () => {
    const section = document.querySelector('.flywheel-focus');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.seo-flywheel-node'));
    const stepLabel = section.querySelector('.seo-flywheel-core small');
    if (!cards.length) return;

    section.classList.add('js-focus-ready');
    let activeIndex = -1;
    let frameRequested = false;

    const updateFocus = () => {
      frameRequested = false;
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1);
      const sequenceProgress = Math.min(progress / 0.9, 1);
      const nextIndex = Math.round(sequenceProgress * (cards.length - 1));

      if (nextIndex === activeIndex) return;
      activeIndex = nextIndex;

      cards.forEach((card, index) => {
        card.classList.toggle('is-focus-active', index === activeIndex);
        card.classList.toggle('is-focus-previous', index === activeIndex - 1);
        card.classList.toggle('is-focus-next', index === activeIndex + 1);
      });


      if (stepLabel) {
        stepLabel.textContent = `Step ${String(activeIndex + 1).padStart(2, '0')} of ${String(cards.length).padStart(2, '0')}`;
      }
    };

    const requestFocusUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(updateFocus);
    };

    updateFocus();
    window.addEventListener('scroll', requestFocusUpdate, { passive: true });
    window.addEventListener('resize', requestFocusUpdate);
  };

  const initFaqAccordion = () => {
    const items = Array.from(document.querySelectorAll('.faq-item'));
    if (!items.length) return;

    items.forEach((item) => {
      const button = item.querySelector('.faq-question');
      if (!button) return;

      button.addEventListener('click', () => {
        const shouldOpen = !item.classList.contains('is-open');

        items.forEach((otherItem) => {
          otherItem.classList.remove('is-open');
          const otherButton = otherItem.querySelector('.faq-question');
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        });

        if (shouldOpen) {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  const initSuccessCarousel = () => {
    const track = document.querySelector('[data-success-track]');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.success-story-card'));
    const previousButton = document.querySelector('[data-success-prev]');
    const nextButton = document.querySelector('[data-success-next]');
    const currentLabel = document.querySelector('[data-success-current]');
    if (!cards.length) return;

    let activeIndex = 0;
    let scrollFrame = 0;
    let isDragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const updateActiveCard = () => {
      scrollFrame = 0;
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      activeIndex = closestIndex;
      if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
      if (previousButton) previousButton.disabled = activeIndex === 0;
      if (nextButton) nextButton.disabled = activeIndex === cards.length - 1;
    };

    const requestActiveUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateActiveCard);
    };

    const scrollToCard = (index) => {
      const targetIndex = Math.min(Math.max(index, 0), cards.length - 1);
      const card = cards[targetIndex];
      const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({ left, behavior: 'smooth' });
    };

    previousButton?.addEventListener('click', () => scrollToCard(activeIndex - 1));
    nextButton?.addEventListener('click', () => scrollToCard(activeIndex + 1));

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToCard(activeIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToCard(activeIndex + 1);
      }
    });

    track.addEventListener('scroll', requestActiveUpdate, { passive: true });

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch' || event.target.closest('button, a')) return;
      isDragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      const movement = event.clientX - dragStartX;
      if (Math.abs(movement) > 4) dragMoved = true;
      track.scrollLeft = dragStartScroll - movement;
    });

    const stopDragging = (event) => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    };

    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('click', (event) => {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    }, true);

    updateActiveCard();
    window.addEventListener('resize', requestActiveUpdate);
  };

  initSuccessCarousel();
  initFaqAccordion();
  initFocusedFlywheel();
  initIndustryBento();
  initBentoGrowthStory();
  initGuidedGrowthStory();
  initStickyGrowthStory();
  initServiceOdyssey();
  initSeoNetwork();});
