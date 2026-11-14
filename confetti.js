// Confetti burst for profile updates.
// Include after your main script: <script src="confetti.js" defer></script>
(function () {
  const COLORS = ['#2874f0', '#36d3a0', '#ffb547', '#ff6b8b', '#9b7bff', '#4a96ff'];

  function launchConfetti(count = 120) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');

    let longest = 0;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece' + (Math.random() < 0.3 ? ' round' : '');
      const size = 6 + Math.random() * 6;
      const dur = 2 + Math.random() * 1.6;
      const delay = Math.random() * 0.5;
      longest = Math.max(longest, dur + delay);

      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.setProperty('--w', size + 'px');
      piece.style.setProperty('--h', size * (0.6 + Math.random() * 0.9) + 'px');
      piece.style.setProperty('--c', COLORS[i % COLORS.length]);
      piece.style.setProperty('--dur', dur + 's');
      piece.style.setProperty('--delay', delay + 's');
      piece.style.setProperty('--drift', (Math.random() - 0.5) * 240 + 'px');
      piece.style.setProperty('--spin', (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720) + 'deg');
      layer.appendChild(piece);
    }

    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), (longest + 0.2) * 1000);
  }

  window.launchConfetti = launchConfetti;

  // Fire automatically whenever an edit dialog form is saved.
  // Clicking a button with value="cancel" won't trigger it.
  document.addEventListener('submit', (event) => {
    if (!event.target.matches('.dialog-form')) return;
    if (event.submitter && event.submitter.value === 'cancel') return;
    launchConfetti();
  });
})();
