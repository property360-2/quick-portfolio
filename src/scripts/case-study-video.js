(function initCaseStudyInteractions() {
  const scrollBtn = document.getElementById('btn-scroll-video');
  const videoSec  = document.getElementById('video-section');
  if (scrollBtn && videoSec) {
    scrollBtn.addEventListener('click', () => {
      videoSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  const wrapper = document.getElementById('video-wrapper');
  const video   = document.getElementById('case-study-video');
  const overlay = document.getElementById('play-overlay');

  if (!video || !overlay || !wrapper) return;

  function hideOverlay() {
    if (overlay) overlay.style.display = 'none';
  }

  wrapper.addEventListener('click', (e) => {
    const target = e.target;
    if (target === video) return;

    video.play().catch(() => {});
    hideOverlay();
  });

  video.addEventListener('play', hideOverlay);
})();
