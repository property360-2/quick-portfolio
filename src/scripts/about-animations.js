import { animate } from 'animejs';

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("about-image-container");
  const outerRing = document.querySelector(".about-ring-outer");
  const innerRing = document.querySelector(".about-ring-inner");
  const orbitDot = document.querySelector(".about-orbit-dot");

  if (container && outerRing && innerRing && orbitDot) {
    animate(outerRing, {
      rotateZ: 360,
      duration: 20000,
      ease: 'linear',
      loop: true,
      transformOrigin: '100px 100px'
    });

    animate(innerRing, {
      rotateZ: -360,
      duration: 15000,
      ease: 'linear',
      loop: true,
      transformOrigin: '100px 100px'
    });

    animate(orbitDot, {
      rotateZ: 360,
      duration: 5000,
      ease: 'linear',
      loop: true,
      transformOrigin: '100px 100px'
    });

    window.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      animate('#about-interactive-ring', {
        translateX: deltaX * 0.05,
        translateY: deltaY * 0.05,
        duration: 300,
        ease: 'easeOutSine'
      });
    });

    container.addEventListener("click", () => {
      animate(outerRing, {
        scale: [1, 1.1, 1],
        duration: 400,
        ease: 'easeInOutSine'
      });
    });
  }
});
