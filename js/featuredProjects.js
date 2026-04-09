(function () {
  function initFeaturedProjects() {
    const carousel = document.querySelector('.project-carousel');
    const track = document.querySelector('.project-track');
    if (!carousel || !track) return;

    const originalCards = Array.from(track.querySelectorAll('.project-card'));
    const prevBtn = carousel.querySelector('[data-action="prev"]');
    const nextBtn = carousel.querySelector('[data-action="next"]');
    if (!originalCards.length) return;

    const cloneCount = originalCards.length;

    const prependFragment = document.createDocumentFragment();
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.clone = 'true';
      prependFragment.appendChild(clone);
    });

    const appendFragment = document.createDocumentFragment();
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.clone = 'true';
      appendFragment.appendChild(clone);
    });

    track.prepend(prependFragment);
    track.append(appendFragment);

    const allCards = Array.from(track.querySelectorAll('.project-card'));
    let currentRealIndex = 0;

    function getRealIndex(card) {
      const realIndex = Number(card.dataset.realIndex);
      return Number.isNaN(realIndex) ? 0 : realIndex;
    }

    allCards.forEach((card, index) => {
      card.dataset.realIndex = String(index % originalCards.length);
    });

    function setFocus() {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;

      let focusedCard = allCards[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      allCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          focusedCard = card;
        }
      });

      currentRealIndex = getRealIndex(focusedCard);

      allCards.forEach((card) => {
        card.classList.toggle('is-focused', card === focusedCard);
      });
    }

    function centerCardInTrack(card, behavior = 'smooth') {
      const targetLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({ left: targetLeft, behavior });
    }

    function scrollToRealIndex(realIndex, behavior = 'smooth') {
      const normalizedIndex = (realIndex + originalCards.length) % originalCards.length;
      currentRealIndex = normalizedIndex;

      const target = allCards.find((card, index) => {
        const idx = getRealIndex(card);
        const inMiddleSet = index >= cloneCount && index < cloneCount + originalCards.length;
        return idx === normalizedIndex && inMiddleSet;
      });

      if (!target) return;

      centerCardInTrack(target, behavior);

      allCards.forEach((card) => {
        card.classList.toggle('is-focused', card === target);
      });
    }

    function moveToCenterSet() {
      const middleCard = allCards[cloneCount + currentRealIndex];
      if (!middleCard) return;
      centerCardInTrack(middleCard, 'auto');
    }

    function handleWrapReset() {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      const leftThreshold = 4;
      const rightThreshold = maxScrollLeft - 4;

      if (track.scrollLeft <= leftThreshold || track.scrollLeft >= rightThreshold) {
        moveToCenterSet();
      }
    }

    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      setFocus();
      scrollTimer = setTimeout(() => {
        setFocus();
        handleWrapReset();
      }, 80);
    });

    prevBtn?.addEventListener('click', () => {
      scrollToRealIndex(currentRealIndex - 1);
    });

    nextBtn?.addEventListener('click', () => {
      scrollToRealIndex(currentRealIndex + 1);
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToRealIndex(currentRealIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToRealIndex(currentRealIndex + 1);
      }
    });

    let isDragging = false;
    let pointerActive = false;
    let activePointerId = null;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('a, button')) return;

      pointerActive = true;
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartScrollLeft = track.scrollLeft;
    });

    track.addEventListener('pointermove', (event) => {
      if (!pointerActive || event.pointerId !== activePointerId) return;

      const delta = event.clientX - dragStartX;
      if (!isDragging && Math.abs(delta) > 6) {
        isDragging = true;
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
      }

      if (!isDragging) return;

      event.preventDefault();
      track.scrollLeft = dragStartScrollLeft - delta;
    });

    function endDrag(event) {
      if (!pointerActive || event.pointerId !== activePointerId) return;

      if (isDragging) {
        track.classList.remove('is-dragging');
        if (track.hasPointerCapture(event.pointerId)) {
          track.releasePointerCapture(event.pointerId);
        }
        setFocus();
        handleWrapReset();
      }
      isDragging = false;
      pointerActive = false;
      activePointerId = null;
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    requestAnimationFrame(() => {
      scrollToRealIndex(0, 'auto');
      setFocus();
    });

    window.addEventListener('resize', () => {
      moveToCenterSet();
      setFocus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeaturedProjects);
  } else {
    initFeaturedProjects();
  }
})();
