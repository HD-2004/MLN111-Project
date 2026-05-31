(function () {
  const data = window.APP_DATA;
  const app = document.querySelector("#app");

  if (!data || !Array.isArray(data.chapters)) {
    app.innerHTML = `
      <main>
        <section class="section">
          <div class="section-heading">
            <p class="eyebrow">Runtime error</p>
            <h1>Không tải được dữ liệu website</h1>
            <p>Hãy kiểm tra file <code>src/data.js</code>. Biến <code>window.APP_DATA</code> cần được khai báo trước khi <code>src/app.js</code> chạy.</p>
          </div>
        </section>
      </main>
    `;
    return;
  }

  function renderNav() {
    const sidebarChapters = data.chapters.filter((chapter) => chapter.id !== "game");

    return `
      <aside class="progress-nav" aria-label="Điều hướng chương">
        <div class="nav-line"></div>
        ${sidebarChapters
          .map(
            (chapter) => `
              <a href="#${chapter.id}" class="progress-link" data-target="${chapter.id}">
                <span>${chapter.number}</span>
                <strong>${chapter.label}</strong>
              </a>
            `
          )
          .join("")}
      </aside>
    `;
  }

  function renderParagraphs(paragraphs = []) {
    return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  function renderGameShortcut() {
    return `
      <a class="game-shortcut" href="game.html" aria-label="Mở trang trò chơi">
        <span class="game-shortcut__label">INTERACTIVE QUEST</span>
        <strong class="game-shortcut__title">Trò Chơi Tư Duy</strong>
        <p class="game-shortcut__description">Khám phá các câu hỏi về AI, ý thức và thế giới khách quan.</p>
        <span class="game-shortcut__cta">
          <span>Bắt đầu</span>
          <span class="game-shortcut__cta-arrow" aria-hidden="true">→</span>
        </span>
      </a>
    `;
  }

  function renderBullets(bullets = []) {
    if (!bullets.length) return "";
    return `<ul>${bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  function renderContentBlock(block) {
    return `
      <article class="content-block">
        <h4>${block.heading}</h4>
        ${block.quote ? `<blockquote>${block.quote}</blockquote>` : ""}
        ${renderParagraphs(block.paragraphs)}
        ${renderBullets(block.bullets)}
      </article>
    `;
  }

  function renderHero() {
    return `
      <section class="section hero-section" id="portal" data-chapter="portal">
        <div class="code-rain" aria-hidden="true">
          ${Array.from({ length: 18 })
            .map(
              (_, index) =>
                `<span style="--delay:${index * 0.34}s">matter.objectiveReality(); consciousness.reflect();</span>`
            )
            .join("")}
        </div>
        <div class="museum-frame hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">${data.portal.eyebrow}</p>
            <h1>${data.portal.title}</h1>
            <div class="typewriter-wrap">
              <span class="terminal-mark">&gt;</span>
              <p id="typewriter" aria-label="${data.portal.slogan}"></p>
            </div>
            <div class="intro-essay">${renderParagraphs(data.portal.intro)}</div>
            <a class="scroll-cta" href="#theory">Bước vào bản đồ lý thuyết</a>
          </div>
          <div class="hero-artifact">
            <p class="artifact-label">Future Philosophy Archive</p>
            <div class="hero-image-frame">
              <img
                class="hero-image"
                src="img/01.jpg"
                alt="Minh họa chương mở đầu"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderTransitionVisual() {
    return `
      <section class="transition-section" aria-label="Minh họa chuyển cảnh">
        <div class="transition-layout reveal">
          ${renderGameShortcut()}
          <figure class="transition-card">
            <div class="transition-image-frame">
              <img
                class="transition-image"
                src="img/04.jpg"
                alt="Minh họa chuyển cảnh"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>
        </div>
      </section>
    `;
  }

  function renderTheory() {
    return `
      <section class="section" id="theory" data-chapter="theory">
        <div class="section-heading">
          <p class="eyebrow">${data.theory.eyebrow}</p>
          <h2>${data.theory.title}</h2>
          <p>${data.theory.lead}</p>
        </div>
        <div class="theory-layout">
          <aside class="theory-side-visual reveal" aria-hidden="true">
            <div class="theory-visual-frame">
              <img
                class="theory-visual-image"
                src="img/05.png"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </aside>
          <div class="theory-main">
            <div class="timeline">
              ${data.theory.timeline
                .map(
                  (item) => `
                    <article class="timeline-item reveal">
                      <span class="timeline-number">${item.number}</span>
                      <div>
                        <small>${item.label}</small>
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
        <div class="accordion-stack">
          ${data.theory.sections
            .map(
              (section, index) => `
                <details class="theory-detail reveal" ${index === 0 ? "open" : ""}>
                  <summary>
                    <span>${String(index + 1).padStart(2, "0")}</span>
                    <strong>${section.title}</strong>
                  </summary>
                  <div class="detail-body">
                    ${section.blocks.map(renderContentBlock).join("")}
                  </div>
                </details>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderAI() {
    return `
      <section class="section ai-section" id="ai" data-chapter="ai">
        <div class="neural-bg" aria-hidden="true"></div>
        <div class="section-heading">
          <p class="eyebrow">${data.ai.eyebrow}</p>
          <h2>${data.ai.title}</h2>
          <p>${data.ai.lead}</p>
        </div>
        <div class="artifact-grid reveal">
          ${data.ai.ontologyCards
            .map(
              (card, index) => `
                <article class="artifact-card">
                  <span>0${index + 1}</span>
                  <h3>${card.title}</h3>
                  <p>${card.text}</p>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="verdict-panel reveal">
          <span>Kết luận biện chứng 1</span>
          <strong>${data.ai.verdict}</strong>
        </div>
        <div class="contrast-stack">
          ${data.ai.contrasts
            .map(
              (item, index) => `
                <article class="contrast-card reveal">
                  <div class="contrast-index">${String(index + 1).padStart(2, "0")}</div>
                  <h3>${item.title}</h3>
                  <div class="contrast-columns">
                    <div>
                      <small>AI</small>
                      <p>${item.ai}</p>
                    </div>
                    <div>
                      <small>Con người</small>
                      <p>${item.human}</p>
                    </div>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="future-panel reveal">
          <p class="eyebrow">${data.ai.future.title}</p>
          <div class="future-map">
            ${data.ai.future.map.map((item) => `<span>${item}</span>`).join("")}
          </div>
          <div class="artifact-grid two">
            ${data.ai.future.perspectives
              .map(
                (item) => `
                  <article class="artifact-card">
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="concept-lock reveal">
          <p>Kết luận chương 3</p>
          ${renderParagraphs(data.ai.conclusion)}
        </div>
      </section>
    `;
  }

  function renderDialogue() {
    return `
      <section class="section chatbot-section" id="dialogue" data-chapter="dialogue">
        <div class="section-heading">
          <p class="eyebrow">${data.dialogue.eyebrow}</p>
          <h2>${data.dialogue.title}</h2>
          <p>${data.dialogue.lead}</p>
        </div>
        <div class="chat-layout reveal">
          <div class="chat-panel">
            <div class="chat-header">
              <span class="bot-avatar">Σ</span>
              <div>
                <strong>Triết gia máy</strong>
                <small>Dialectical script mode</small>
              </div>
            </div>
            <div class="chat-log" id="chatLog">
              <div class="message bot">${data.dialogue.initial}</div>
            </div>
            <form class="chat-form" id="chatForm">
              <input id="chatInput" type="text" placeholder="Nhập câu hỏi..." autocomplete="off" />
              <button type="submit">Gửi</button>
            </form>
          </div>
          <div class="prompt-panel">
            <p class="micro-label">Tình huống gợi ý</p>
            ${data.dialogue.suggestions
              .map((prompt) => `<button class="suggestion" type="button">${prompt}</button>`)
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  // Game UI is provided by src/game.js as window.GAME

  function renderManifesto() {
    return `
      <section class="section" id="manifesto" data-chapter="manifesto">
        <div class="section-heading">
          <p class="eyebrow">${data.manifesto.eyebrow}</p>
          <h2>${data.manifesto.title}</h2>
        </div>
        <div class="artifact-grid reveal">
          ${data.manifesto.synthesis
            .map(
              (item, index) => `
                <article class="artifact-card">
                  <span>0${index + 1}</span>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="final-statement reveal">
          ${renderParagraphs(data.manifesto.manifestoText)}
          <div class="final-callout">
            <strong>${data.manifesto.finalStatement?.headline || ""}</strong>
            <p>${data.manifesto.finalStatement?.body || ""}</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderApp() {
    app.innerHTML = `
      ${renderNav()}
      <main>
        ${renderHero()}
        ${renderTransitionVisual()}
        ${renderTheory()}
        ${renderAI()}
        ${renderDialogue()}
        ${renderManifesto()}
      </main>
    `;
  }

  function runTypewriter() {
    const target = document.querySelector("#typewriter");
    if (!target) return;
    const text = data.portal.slogan;
    let index = 0;
    const timer = window.setInterval(() => {
      target.textContent = text.slice(0, index);
      index += 1;
      if (index > text.length) window.clearInterval(timer);
    }, 24);
  }

  function setupScrollState() {
    const links = Array.from(document.querySelectorAll(".progress-link"));
    const sections = Array.from(document.querySelectorAll("[data-chapter]"));
    let ticking = false;

    function setActiveChapter(id) {
      links.forEach((link) => link.classList.toggle("active", link.dataset.target === id));
    }

    function updateActiveFromScroll() {
      const anchorLine = window.scrollY + Math.min(window.innerHeight * 0.38, 320);
      let activeId = sections[0]?.id;

      sections.forEach((section) => {
        if (section.offsetTop <= anchorLine) activeId = section.id;
      });

      if (activeId) setActiveChapter(activeId);
      ticking = false;
    }

    function requestActiveUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveFromScroll);
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        setActiveChapter(link.dataset.target);
        window.setTimeout(requestActiveUpdate, 450);
      });
    });

    window.addEventListener("scroll", requestActiveUpdate, { passive: true });
    window.addEventListener("resize", requestActiveUpdate);
    requestActiveUpdate();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
  }

  function setupChatbot() {
    const form = document.querySelector("#chatForm");
    const input = document.querySelector("#chatInput");
    const log = document.querySelector("#chatLog");
    if (!form || !input || !log) return;

    function normalize(text) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function getAnswer(question) {
      const normalized = normalize(question);
      const found = data.dialogue.responses.find((entry) =>
        entry.match.some((keyword) => normalized.includes(normalize(keyword)))
      );
      return (
        found?.answer ||
        "Một câu hỏi hay. Nếu nhìn từ bài học này, tôi vẫn là hệ thống vật chất xử lý ký hiệu. Người đặt câu hỏi, biết hoài nghi và tự điều chỉnh nhận thức, mới là chủ thể có ý thức."
      );
    }

    function addMessage(type, text) {
      const message = document.createElement("div");
      message.className = `message ${type}`;
      message.textContent = text;
      log.appendChild(message);
      log.scrollTop = log.scrollHeight;
    }

    function submitQuestion(question) {
      const trimmed = question.trim();
      if (!trimmed) return;
      addMessage("user", trimmed);
      input.value = "";
      window.setTimeout(() => addMessage("bot", getAnswer(trimmed)), 220);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitQuestion(input.value);
    });

    function handleSuggestionClick(event) {
      const target = event.target instanceof Element ? event.target : event.target?.parentElement;
      const button = target?.closest(".suggestion");
      if (!button) return;
      submitQuestion(button.textContent);
    }

    document.addEventListener("click", handleSuggestionClick);

    document.querySelectorAll(".suggestion").forEach((button) => {
      button.addEventListener("click", handleSuggestionClick);
    });
  }

  renderApp();
  runTypewriter();
  setupScrollState();
  setupChatbot();
})();
