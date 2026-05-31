(function () {
  const app = document.querySelector("#app");

  if (!app || !window.GAME?.renderGame) return;

  app.innerHTML = `
    <a class="doc-shortcut" href="index.html" aria-label="Quay lại trang chủ">
      <span>←</span>
      <strong>Trang chủ</strong>
    </a>
    <main class="game-page-main">
      ${window.GAME.renderGame()}
    </main>
  `;

  window.GAME.setupGame?.();
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
})();
