(function () {
  function initFeaturedProjects() {
    const carousel = document.querySelector('.project-carousel');
    const track = document.querySelector('.project-track');
    if (!carousel || !track) return;

    const cards = Array.from(track.querySelectorAll('.project-card'));
    const prevBtn = carousel.querySelector('[data-action="prev"]');
    const nextBtn = carousel.querySelector('[data-action="next"]');
    if (!cards.length) return;

    let currentIndex = 0;

    function updateFocusByCenter() {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      currentIndex = closestIndex;
      cards.forEach((card, index) => {
        card.classList.toggle('is-focused', index === currentIndex);
      });
    }

    function scrollToCard(index) {
      currentIndex = (index + cards.length) % cards.length;
      cards[currentIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });

      cards.forEach((card, i) => {
        card.classList.toggle('is-focused', i === currentIndex);
      });
    }

    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      updateFocusByCenter();
      scrollTimer = setTimeout(updateFocusByCenter, 80);
    });

    prevBtn?.addEventListener('click', () => scrollToCard(currentIndex - 1));
    nextBtn?.addEventListener('click', () => scrollToCard(currentIndex + 1));

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToCard(currentIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToCard(currentIndex + 1);
      }
    });

    requestAnimationFrame(() => {
      cards[0].classList.add('is-focused');
      cards[0].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      updateFocusByCenter();
    });

    window.addEventListener('resize', updateFocusByCenter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeaturedProjects);
  } else {
    initFeaturedProjects();
  }
})();
