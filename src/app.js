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

  function getYouTubeEmbedUrl(url) {
    try {
      const parsedUrl = new URL(url);
      const videoId = parsedUrl.hostname.includes("youtu.be")
        ? parsedUrl.pathname.replaceAll("/", "")
        : parsedUrl.searchParams.get("v");

      if (!videoId) return url;
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return url;
    }
  }

  function renderGameShortcut() {
    return `
      <a class="game-shortcut" href="game.html" aria-label="Mở trang trò chơi">
        <span class="game-shortcut__title">Start game</span>
      </a>
    `;
  }

  function renderBullets(bullets = []) {
    if (!bullets.length) return "";
    return `<ul>${bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  function renderTheorySectionIntro(section) {
    if (!section.intro) return "";

    const { eyebrow, lead, paragraphs = [], stages = [], note } = section.intro;

    return `
      <section class="theory-concept-panel">
        <div class="theory-concept-copy">
          ${eyebrow ? `<p class="micro-label">${eyebrow}</p>` : ""}
          ${lead ? `<p class="theory-concept-lead">${lead}</p>` : ""}
          ${renderParagraphs(paragraphs)}
        </div>
        ${
          stages.length
            ? `
              <div class="theory-stage-grid">
                ${stages
                  .map(
                    (stage, index) => `
                      <article class="theory-stage-card">
                        <span class="theory-stage-number">${String(index + 1).padStart(2, "0")}</span>
                        <p class="theory-stage-period">${stage.period}</p>
                        <h4>${stage.title}</h4>
                        <p>${stage.text}</p>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            `
            : ""
        }
        ${note ? `<p class="theory-concept-note">${note}</p>` : ""}
      </section>
    `;
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

  function renderSection2CustomContent(content) {
    if (!content) return "";
    if (typeof content === "string") return `<article class="content-block"><p>${content}</p></article>`;
    if (Array.isArray(content.paragraphs) || Array.isArray(content.bullets) || content.quote) {
      return renderContentBlock(content);
    }
    if (Array.isArray(content.blocks)) {
      return `
        ${renderTheorySectionIntro(content)}
        ${content.blocks.map(renderContentBlock).join("")}
      `;
    }
    return "";
  }

  function renderPhilosophySubNodeButton(childNode, index, isActive) {
    return `
      <button
        class="section2-subnode-button"
        type="button"
        data-section2-subnode-button
        data-subnode-id="${childNode.id}"
        aria-pressed="${isActive ? "true" : "false"}"
      >
        <span>${childNode.icon}</span>
        <strong>${childNode.title}</strong>
      </button>
    `;
  }

  function renderPhilosophySubPanel(childNode, index, isActive) {
    return `
      <div
        class="section2-subpanel"
        data-section2-subpanel="${childNode.id}"
        ${isActive ? "" : "hidden"}
      >
        ${childNode.subtitle ? `<p class="section2-subpanel-label">${childNode.subtitle}</p>` : ""}
        <p class="section2-panel-short">${childNode.shortDescription}</p>
        ${renderSection2CustomContent(childNode.fullContent)}
      </div>
    `;
  }

  function renderPhilosophyNodePanel(node, index, isActive) {
    const section = node.fullContent;
    const childNodes = Array.isArray(node.childNodes) ? node.childNodes : [];

    return `
      <article
        class="section2-node-panel"
        data-section2-panel="${node.id}"
        ${isActive ? "" : "hidden"}
      >
        <div class="section2-panel-kicker">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <small>${node.subtitle}</small>
        </div>
        <h3>${node.title}</h3>
        <p class="section2-panel-short">${node.shortDescription}</p>
        ${
          childNodes.length
            ? `
              <div class="section2-subnode-list" aria-label="Các node nhỏ trong ${node.title}">
                ${childNodes
                  .map((childNode, childIndex) =>
                    renderPhilosophySubNodeButton(childNode, childIndex, childIndex === 0)
                  )
                  .join("")}
              </div>
            `
            : ""
        }
        <button class="section2-expand-button" type="button" data-section2-expand aria-expanded="false">
          <span>Khám phá</span>
        </button>
        <div class="section2-panel-full" data-section2-full hidden>
          ${
            childNodes.length
              ? childNodes
                  .map((childNode, childIndex) =>
                    renderPhilosophySubPanel(childNode, childIndex, childIndex === 0)
                  )
                  .join("")
              : renderSection2CustomContent(section)
          }
        </div>
      </article>
    `;
  }

  function renderPhilosophyNodeButton(node, index, isActive) {
    return `
      <button
        class="section2-node-button"
        type="button"
        data-section2-node-button
        data-node-id="${node.id}"
        data-node-index="${index}"
        data-node-color="${node.color}"
        style="--node-color: ${node.color}; --node-angle: ${(360 / Math.max(section2Nodes.length, 1)) * index}deg;"
        aria-pressed="${isActive ? "true" : "false"}"
      >
        <span class="section2-node-orb">${node.icon}</span>
        <span>${node.title}</span>
      </button>
    `;
  }

  function renderGearSphere3D(nodes) {
    return `
      <div class="section2-gear-stage" data-section2-stage>
        <canvas class="section2-gear-canvas" data-section2-gear aria-label="Quả cầu bánh răng 3D"></canvas>
        <div class="section2-node-orbit" aria-label="Các điểm tư tưởng quanh quả cầu">
          ${nodes.map((node, index) => renderPhilosophyNodeButton(node, index, index === 0)).join("")}
        </div>
      </div>
    `;
  }

  const section2Nodes = window.Section2ContentData?.createNodesFromTheory(data.theory) || [];

  function renderSection2GearPhilosophy() {
    const nodes = section2Nodes;
    const firstNode = nodes[0];

    return `
      <section class="section section2-gear-philosophy" id="theory" data-chapter="theory" data-section2-root>
        <div class="section2-atmosphere" aria-hidden="true"></div>
        <div class="section2-heading reveal">
          <p class="eyebrow">${data.theory.eyebrow}</p>
          <h2>Khám phá tư tưởng qua Quả Cầu Bánh Răng</h2>
          <p>${data.theory.lead}</p>
        </div>
        <div
          class="section2-gear-layout reveal"
          style="--active-node-color: ${firstNode?.color || "var(--cyan)"};"
        >
          <div class="section2-panel-shell">
            <div class="section2-panel-stack" data-section2-panels>
              ${nodes.map((node, index) => renderPhilosophyNodePanel(node, index, index === 0)).join("")}
            </div>
          </div>
          ${renderGearSphere3D(nodes)}
        </div>
      </section>
    `;
  }

  function renderHero() {
    return `
      <section class="section hero-section" id="portal" data-chapter="portal">
        <canvas class="hero-three-canvas" data-hero-three aria-hidden="true"></canvas>
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
    return renderSection2GearPhilosophy();
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

  function renderVision() {
    return `
      <section class="section video-section" id="vision" data-chapter="vision">
        <div class="video-section__inner">
          <header class="video-section__header reveal">
            <p class="eyebrow">${data.vision.eyebrow}</p>
            <h2 class="video-section__title">${data.vision.title}</h2>
            <p class="video-section__lead">${data.vision.lead}</p>
          </header>
          <div class="video-section__frame reveal">
            <div class="video-section__frame-inner">
              <iframe
                class="video-section__player"
                src="${getYouTubeEmbedUrl(data.vision.videoUrl)}"
                title="Đối Thoại Với Tương Lai — Giải mã AI"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
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
        ${renderVision()}
        ${renderManifesto()}
      </main>
      ${renderGameShortcut()}
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
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.dataset.target;
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setActiveChapter(targetId);
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

  function setupSection2GearPhilosophy() {
    const root = document.querySelector("[data-section2-root]");
    if (!root) return;

    const layout = root.querySelector(".section2-gear-layout");
    const panelShell = root.querySelector(".section2-panel-shell");
    const nodeButtons = Array.from(root.querySelectorAll("[data-section2-node-button]"));
    const panels = Array.from(root.querySelectorAll("[data-section2-panel]"));

    function restartClass(element, className) {
      if (!element) return;
      element.classList.remove(className);
      void element.offsetWidth;
      element.classList.add(className);
    }

    function collapsePanel(panel) {
      const fullContent = panel.querySelector("[data-section2-full]");
      const button = panel.querySelector("[data-section2-expand]");
      if (!fullContent || !button) return;
      fullContent.hidden = true;
      button.setAttribute("aria-expanded", "false");
      button.querySelector("span").textContent = "Khám phá";
    }

    function selectSubNode(panel, subNodeId) {
      const subButtons = Array.from(panel.querySelectorAll("[data-section2-subnode-button]"));
      const subPanels = Array.from(panel.querySelectorAll("[data-section2-subpanel]"));

      subButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.subnodeId === subNodeId));
      });

      subPanels.forEach((subPanel) => {
        const isActive = subPanel.dataset.section2Subpanel === subNodeId;
        subPanel.hidden = !isActive;
        if (isActive) restartClass(subPanel, "is-sub-switching");
      });
    }

    function resetSubNodes(panel) {
      const firstSubButton = panel.querySelector("[data-section2-subnode-button]");
      if (firstSubButton) selectSubNode(panel, firstSubButton.dataset.subnodeId);
    }

    function selectNode(nodeId) {
      const activeButton = nodeButtons.find((button) => button.dataset.nodeId === nodeId);
      if (!activeButton) return;

      nodeButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button === activeButton));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.section2Panel === nodeId;
        panel.hidden = !isActive;
        if (isActive) restartClass(panel, "section2-panel-enter");
        if (isActive) resetSubNodes(panel);
        if (!isActive) collapsePanel(panel);
      });

      const color = activeButton.dataset.nodeColor || "var(--cyan)";
      layout?.style.setProperty("--active-node-color", color);
      restartClass(panelShell, "is-switching");
      root.dispatchEvent(
        new CustomEvent("section2-node-change", {
          detail: {
            id: nodeId,
            index: Number.parseInt(activeButton.dataset.nodeIndex || "0", 10),
            color,
          },
        })
      );
    }

    nodeButtons.forEach((button) => {
      button.addEventListener("click", () => selectNode(button.dataset.nodeId));
    });

    root.addEventListener("click", (event) => {
      const subNodeButton =
        event.target instanceof Element ? event.target.closest("[data-section2-subnode-button]") : null;
      if (subNodeButton) {
        const panel = subNodeButton.closest("[data-section2-panel]");
        if (panel) selectSubNode(panel, subNodeButton.dataset.subnodeId);
        return;
      }

      const button = event.target instanceof Element ? event.target.closest("[data-section2-expand]") : null;
      if (!button) return;
      const panel = button.closest("[data-section2-panel]");
      const fullContent = panel?.querySelector("[data-section2-full]");
      if (!fullContent) return;

      const nextExpanded = button.getAttribute("aria-expanded") !== "true";
      fullContent.hidden = !nextExpanded;
      panel.classList.toggle("is-expanded", nextExpanded);
      button.setAttribute("aria-expanded", String(nextExpanded));
      button.querySelector("span").textContent = nextExpanded ? "Thu gọn" : "Khám phá";
    });
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
      const found = data.vision.responses.find((entry) =>
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
  setupSection2GearPhilosophy();
  setupChatbot();
})();
