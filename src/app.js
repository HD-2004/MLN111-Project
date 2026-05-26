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
    return `
      <aside class="progress-nav" aria-label="Điều hướng chương">
        <div class="nav-line"></div>
        ${data.chapters
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
          <div class="hero-artifact" aria-label="Tượng triết gia dạng hiện vật số">
            <p class="artifact-label">Future Philosophy Archive</p>
            <div class="statue-orbit">
              <svg class="statue-svg" viewBox="0 0 420 520" role="img" aria-label="Tượng triết gia phát sáng">
                <defs>
                  <linearGradient id="statueGlow" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="#f4e7c0" />
                    <stop offset="48%" stop-color="#8a6a35" />
                    <stop offset="100%" stop-color="#51d6ff" />
                  </linearGradient>
                </defs>
                <path d="M211 39c52 0 96 37 99 92 3 49-25 88-59 104v31h61c31 0 58 20 68 49l42 126H0l42-126c10-29 37-49 68-49h60v-31c-35-17-61-56-59-104 3-55 47-92 100-92Z" fill="rgba(244,231,192,.08)" stroke="url(#statueGlow)" stroke-width="2" />
                <path d="M116 145c30-30 70-43 126-35m-93 54c46 15 85 14 116-5m-128 54c32 25 79 27 118 1m-105 61c40 27 82 27 123 0M72 438h276M97 371h226" fill="none" stroke="#f4e7c0" stroke-opacity=".55" stroke-width="2" />
                <path d="M141 115c16-34 48-55 85-54 43 2 74 29 83 70M178 235c19 12 45 12 66 0" fill="none" stroke="#51d6ff" stroke-opacity=".4" stroke-width="2" />
                <circle cx="144" cy="152" r="8" fill="#f0c86b" />
                <circle cx="268" cy="152" r="8" fill="#f0c86b" />
                <path d="M196 173l-19 37 43-7-22 39 54-57-39 7 14-31Z" fill="#f59d2a" opacity=".9" />
              </svg>
            </div>
          </div>
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
          <strong>${data.manifesto.finalQuote}</strong>
        </div>
      </section>
    `;
  }

  function renderApp() {
    app.innerHTML = `
      ${renderNav()}
      <main>
        ${renderHero()}
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
