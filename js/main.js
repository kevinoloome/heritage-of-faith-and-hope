document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
  }

  // Mobile dropdown expand (tap to open on small screens)
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        link.parentElement.classList.toggle('is-open');
      }
    });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Mark active nav link based on current page
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) { a.classList.add('is-active'); }
  });

  // Hero carousel
  var carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-dot'));
    var prevBtn = carousel.querySelector('.carousel-arrow--prev');
    var nextBtn = carousel.querySelector('.carousel-arrow--next');
    var current = 0;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timer = null;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function startAutoplay() {
      if (reduced) return;
      stopAutoplay();
      timer = setInterval(next, 6000);
    }
    function stopAutoplay() { if (timer) clearInterval(timer); }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    goTo(0);
    startAutoplay();
  }

  // Animated counters
  var counters = document.querySelectorAll('.counter-value[data-target]');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterIO.observe(el); });
    } else {
      counters.forEach(function (el) { animateCounter(el); });
    }
  }
});
