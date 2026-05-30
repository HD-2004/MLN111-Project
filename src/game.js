/* Lightweight game module for the Thought Experiments demo
   Exposes `window.GAME.renderGame()` and `window.GAME.setupGame()`
   Depends on `window.APP_DATA` and DOM elements within #app.
*/
(function () {
  const data = window.APP_DATA;

  function renderGame() {
    if (!data || !data.game) return "";
    return `
      <section class="section game-section" id="game" data-chapter="game">
        <div class="section-heading">
          <p class="eyebrow">${data.game.eyebrow}</p>
          <h2>${data.game.title}</h2>
          ${data.game.lead ? `<p>${data.game.lead}</p>` : ""}
        </div>
        <div class="game-panel reveal">
          <div class="game-tabs" role="tablist" aria-label="Chọn trò chơi chương 6">
            <button class="game-tab active" type="button" data-game-tab="quiz" role="tab" aria-selected="true">Quiz nhanh</button>
            <button class="game-tab" type="button" data-game-tab="aiConsciousness" role="tab" aria-selected="false">AI có ý thức?</button>
            <button class="game-tab" type="button" data-game-tab="classifier" role="tab" aria-selected="false">Phân loại</button>
          </div>
          <div id="gameArea">
            <div id="quizContainer" class="subgame" data-game-panel="quiz">
              <div id="gameQuizPrompt" class="game-prompt"></div>
              <div id="gameQuizOptions" class="game-options"></div>
              <div id="gameQuizFeedback" class="game-feedback" aria-live="polite"></div>
              <div id="gameQuizControls" class="game-controls"></div>
            </div>
            <div id="classifierContainer" class="subgame hidden" data-game-panel="classifier">
              <div class="classifier-intro">
                <h3>${data.game.classifier?.title || ""}</h3>
                <p>${data.game.classifier?.lead || ""}</p>
              </div>
              <div class="classifier-status">
                <span id="classifierProgress"></span>
                <strong id="classifierScore"></strong>
              </div>
              <div id="classifierCard" class="classifier-card"></div>
              <div id="classifierChoices" class="classifier-choices"></div>
              <div id="classifierFeedback" class="game-feedback" aria-live="polite"></div>
              <div id="classifierControls" class="game-controls"></div>
            </div>
            <div id="aiConsciousnessContainer" class="subgame hidden" data-game-panel="aiConsciousness">
              <div class="classifier-intro">
                <h3>${data.game.aiConsciousness?.title || ""}</h3>
                <p>${data.game.aiConsciousness?.lead || ""}</p>
              </div>
              <div class="classifier-status">
                <span id="aiScenarioProgress"></span>
                <strong id="aiScenarioScore"></strong>
              </div>
              <div id="aiScenarioCard" class="ai-scenario-card"></div>
              <div id="aiScenarioOptions" class="game-options"></div>
              <div id="aiScenarioFeedback" class="game-feedback" aria-live="polite"></div>
              <div id="aiScenarioControls" class="game-controls"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function setupGame() {
    const area = document.querySelector('#gameArea');
    if (!area || !data?.game || !Array.isArray(data.game.questions)) return;
    setupGameTabs();
    setupGameQuizDeckFlow();
    setupClassifierFlow();
    setupAIConsciousnessFlipCardFlow();
  }

  function setupGameTabs() {
    const tabs = document.querySelectorAll('[data-game-tab]');
    const panels = document.querySelectorAll('[data-game-panel]');
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const selected = tab.dataset.gameTab;
        tabs.forEach((item) => {
          const active = item.dataset.gameTab === selected;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
          panel.classList.toggle('hidden', panel.dataset.gamePanel !== selected);
        });
      });
    });
  }

  // Extracted quiz flow into its own function so we can re-init on tab switch
  function setupGameQuizFlow() {
    // The logic below mirrors the randomized question flow but scoped to quiz IDs
    const promptEl = document.querySelector('#gameQuizPrompt');
    const optionsEl = document.querySelector('#gameQuizOptions');
    const feedbackEl = document.querySelector('#gameQuizFeedback');
    const controlsEl = document.querySelector('#gameQuizControls');

    let order = data.game.questions.map((_, i) => i);
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const maxQuestions = 5;
    const count = Math.min(maxQuestions, order.length);
    order = shuffle(order.slice()).slice(0, count);
    let idx = 0;

    function renderQuestionByOrder(pos) {
      const qIndex = order[pos];
      const q = data.game.questions[qIndex];
      if (!q) return;
      promptEl.className = 'quiz-card-shell';
      promptEl.innerHTML = `
        <button class="quiz-card" type="button" aria-expanded="false">
          <span class="quiz-card-face quiz-card-front">
            <small>Thẻ ${pos + 1}/${order.length}</small>
            <strong>Lật thẻ để mở câu hỏi</strong>
          </span>
          <span class="quiz-card-face quiz-card-back">
            <small>Câu hỏi</small>
            <strong>${q.prompt}</strong>
          </span>
        </button>
      `;
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('show');
      controlsEl.innerHTML = '';

      const opts = q.options.map((opt, i) => ({ ...opt, __orig: i }));
      shuffle(opts);

      optionsEl.classList.add('hidden');
      optionsEl.innerHTML = opts
        .map((opt, j) => `<button class="game-choice" type="button" data-orig="${opt.__orig}" data-shuf="${j}">${opt.text}</button>`)
        .join('');

      const card = promptEl.querySelector('.quiz-card');
      card.addEventListener('click', () => {
        card.classList.add('flipped');
        card.setAttribute('aria-expanded', 'true');
        card.disabled = true;
        optionsEl.classList.remove('hidden');
      });

      optionsEl.querySelectorAll('.game-choice').forEach((btn) => {
        btn.addEventListener('click', () => {
          const orig = Number(btn.dataset.orig);
          const f = q.options[orig]?.feedback || '';
          optionsEl.querySelectorAll('.game-choice').forEach((choice) => {
            choice.disabled = true;
          });
          feedbackEl.textContent = f;
          feedbackEl.classList.add('show');
          controlsEl.innerHTML = `<button id="nextBtn" type="button">${pos < order.length - 1 ? 'Thẻ tiếp theo' : 'Xong'}</button>`;
          const next = document.querySelector('#nextBtn');
          next.addEventListener('click', () => {
            if (pos < order.length - 1) {
              idx = pos + 1;
              renderQuestionByOrder(idx);
            } else {
              promptEl.className = 'quiz-card-shell';
              promptEl.innerHTML = `
                <div class="quiz-card quiz-card-complete">
                  <span class="quiz-card-face">
                    <small>Hoàn thành</small>
                    <strong>Cảm ơn, bạn đã hoàn thành thử thách.</strong>
                  </span>
                </div>
              `;
              optionsEl.innerHTML = '';
              optionsEl.classList.remove('hidden');
              feedbackEl.textContent = '';
              feedbackEl.classList.remove('show');
              controlsEl.innerHTML = `<button id="restartBtn" type="button">Chơi lại</button>`;
              document.querySelector('#restartBtn').addEventListener('click', () => {
                order = shuffle(data.game.questions.map((_, i) => i)).slice(0, count);
                idx = 0;
                renderQuestionByOrder(idx);
              });
            }
          });
        });
      });
    }

    renderQuestionByOrder(idx);
  }

  function setupGameQuizDeckFlow() {
    const promptEl = document.querySelector('#gameQuizPrompt');
    const optionsEl = document.querySelector('#gameQuizOptions');
    const feedbackEl = document.querySelector('#gameQuizFeedback');
    const controlsEl = document.querySelector('#gameQuizControls');
    if (!promptEl || !optionsEl || !feedbackEl || !controlsEl) return;

    const maxQuestions = 5;
    const count = Math.min(maxQuestions, data.game.questions.length);
    let order = [];
    let completed = new Set();

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function start() {
      order = shuffle(data.game.questions.map((_, i) => i)).slice(0, count);
      completed = new Set();
      renderDeck();
    }

    function renderDeck(selectedPos = null) {
      const selectedQuestion = selectedPos === null ? null : data.game.questions[order[selectedPos]];
      promptEl.className = 'quiz-deck-panel';
      promptEl.innerHTML = `
        <div class="quiz-deck-status">
          <span>Chọn 1 trong ${order.length} lá bài</span>
          <strong>${completed.size}/${order.length} đã trả lời</strong>
        </div>
        <div class="quiz-deck">
          ${order
            .map((questionIndex, pos) => {
              const question = data.game.questions[questionIndex];
              const isSelected = selectedPos === pos;
              const isDone = completed.has(pos);
              return `
                <button class="quiz-mini-card${isSelected ? ' selected' : ''}${isDone ? ' answered' : ''}" type="button" data-card="${pos}" ${isDone ? 'disabled' : ''}>
                  <span class="quiz-card-face quiz-card-front">
                    <small>Lá ${pos + 1}</small>
                    <strong>${isDone ? 'Đã trả lời' : 'Chọn thẻ'}</strong>
                  </span>
                  <span class="quiz-card-face quiz-card-back">
                    <small>Lá ${pos + 1}</small>
                    <strong>${question.prompt}</strong>
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      `;

      optionsEl.innerHTML = '';
      optionsEl.classList.add('hidden');
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('show');
      controlsEl.innerHTML = '';

      if (completed.size === order.length) {
        feedbackEl.textContent = 'Bạn đã hoàn thành toàn bộ 5 lá bài.';
        feedbackEl.classList.add('show');
        controlsEl.innerHTML = `<button id="restartBtn" type="button">Chơi lại</button>`;
        document.querySelector('#restartBtn').addEventListener('click', start);
        return;
      }

      promptEl.querySelectorAll('.quiz-mini-card:not(.answered)').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (completed.has(Number(card.dataset.card))) return;
          card.classList.toggle('flipped');
          if (card.classList.contains('flipped')) {
            setTimeout(() => renderQuestion(Number(card.dataset.card)), 300);
          }
        });
      });
    }

    function renderQuestion(pos) {
      const q = data.game.questions[order[pos]];
      if (!q || completed.has(pos)) return;

      // Reset flip state
      promptEl.querySelectorAll('.quiz-mini-card').forEach(card => {
        card.classList.remove('flipped');
      });
      
      renderDeck(pos);
      const opts = shuffle(q.options.map((opt, i) => ({ ...opt, __orig: i })));
      optionsEl.classList.remove('hidden');
      optionsEl.innerHTML = opts
        .map((opt, j) => `<button class="game-choice" type="button" data-orig="${opt.__orig}" data-shuf="${j}">${opt.text}</button>`)
        .join('');

      optionsEl.querySelectorAll('.game-choice').forEach((btn) => {
        btn.addEventListener('click', () => {
          const orig = Number(btn.dataset.orig);
          const f = q.options[orig]?.feedback || '';
          completed.add(pos);

          optionsEl.querySelectorAll('.game-choice').forEach((choice) => {
            choice.disabled = true;
          });
          feedbackEl.textContent = f;
          feedbackEl.classList.add('show');
          controlsEl.innerHTML = `<button id="backToDeckBtn" type="button">${completed.size === order.length ? 'Xem kết quả' : 'Chọn lá khác'}</button>`;
          document.querySelector('#backToDeckBtn').addEventListener('click', () => renderDeck());
        });
      });
    }

    start();
  }

  function setupClassifierFlow() {
    const config = data.game.classifier;
    if (!config || !Array.isArray(config.items) || !Array.isArray(config.categories)) return;

    const progressEl = document.querySelector('#classifierProgress');
    const scoreEl = document.querySelector('#classifierScore');
    const cardEl = document.querySelector('#classifierCard');
    const choicesEl = document.querySelector('#classifierChoices');
    const feedbackEl = document.querySelector('#classifierFeedback');
    const controlsEl = document.querySelector('#classifierControls');
    if (!progressEl || !scoreEl || !cardEl || !choicesEl || !feedbackEl || !controlsEl) return;

    let order = [];
    let index = 0;
    let score = 0;
    let answered = false;

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function start() {
      const roundSize = Math.min(config.maxItemsPerRound || config.items.length, config.items.length);
      order = shuffle(config.items.map((_, i) => i)).slice(0, roundSize);
      index = 0;
      score = 0;
      renderItem();
    }

    function renderItem() {
      const item = config.items[order[index]];
      answered = false;
      progressEl.textContent = `Khái niệm ${index + 1}/${order.length}`;
      scoreEl.textContent = `Điểm ${score}`;
      cardEl.innerHTML = `<span>Hãy phân loại</span><strong>${item.term}</strong>`;
      feedbackEl.textContent = '';
      feedbackEl.className = 'game-feedback';
      controlsEl.innerHTML = '';
      const categories = shuffle(config.categories.slice());
      choicesEl.innerHTML = categories
        .map(
          (category) => `
            <button class="classifier-choice" type="button" data-category="${category.id}">
              <strong>${category.label}</strong>
              <span>${category.hint}</span>
            </button>
          `
        )
        .join('');

      choicesEl.querySelectorAll('.classifier-choice').forEach((button) => {
        button.addEventListener('click', () => handleChoice(button, item));
      });
    }

    function handleChoice(button, item) {
      if (answered) return;
      answered = true;
      const selected = button.dataset.category;
      const correct = selected === item.answer;
      const correctCategory = config.categories.find((category) => category.id === item.answer);

      if (correct) score += 1;
      scoreEl.textContent = `Điểm ${score}`;
      choicesEl.querySelectorAll('.classifier-choice').forEach((choice) => {
        const isCorrectChoice = choice.dataset.category === item.answer;
        choice.disabled = true;
        choice.classList.toggle('correct', isCorrectChoice);
        choice.classList.toggle('wrong', choice === button && !correct);
      });

      feedbackEl.textContent = `${correct ? 'Đúng.' : `Chưa đúng. Đáp án phù hợp hơn là "${correctCategory?.label || ''}".`} ${item.explanation}`;
      feedbackEl.classList.add('show', correct ? 'correct' : 'wrong');

      controlsEl.innerHTML = `<button id="classifierNextBtn" type="button">${index < order.length - 1 ? 'Khái niệm tiếp' : 'Xem kết quả'}</button>`;
      document.querySelector('#classifierNextBtn').addEventListener('click', () => {
        if (index < order.length - 1) {
          index += 1;
          renderItem();
          return;
        }
        renderResult();
      });
    }

    function renderResult() {
      progressEl.textContent = 'Hoàn thành';
      scoreEl.textContent = `Điểm ${score}/${order.length}`;
      cardEl.innerHTML = `<span>Kết quả phân loại</span><strong>${score}/${order.length}</strong>`;
      choicesEl.innerHTML = '';
      feedbackEl.textContent = score === order.length
        ? 'Bạn đã phân biệt tốt các tầng: vật chất khách quan, ý thức chủ quan và thực tiễn xã hội.'
        : 'Hãy chơi lại để củng cố ranh giới giữa vật chất, ý thức và vai trò trung gian của thực tiễn.';
      feedbackEl.className = 'game-feedback show';
      controlsEl.innerHTML = `<button id="classifierRestartBtn" type="button">Chơi lại</button>`;
      document.querySelector('#classifierRestartBtn').addEventListener('click', start);
    }

    start();
  }

  function setupAIConsciousnessFlipCardFlow() {
    const config = data.game.aiConsciousness;
    if (!config || !Array.isArray(config.scenarios)) return;

    const promptEl = document.querySelector('#aiScenarioCard');
    const optionsEl = document.querySelector('#aiScenarioOptions');
    const feedbackEl = document.querySelector('#aiScenarioFeedback');
    const controlsEl = document.querySelector('#aiScenarioControls');
    const progressEl = document.querySelector('#aiScenarioProgress');
    const scoreEl = document.querySelector('#aiScenarioScore');
    if (!promptEl || !optionsEl || !feedbackEl || !controlsEl || !progressEl || !scoreEl) return;

    let order = [];
    let completed = new Set();
    let score = 0;

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function start() {
      const roundSize = Math.min(config.maxScenariosPerRound || config.scenarios.length, config.scenarios.length);
      order = shuffle(config.scenarios.map((_, i) => i)).slice(0, roundSize);
      completed = new Set();
      score = 0;
      renderDeck();
    }

    function renderDeck(selectedPos = null) {
      const selectedScenario = selectedPos === null ? null : config.scenarios[order[selectedPos]];
      
      progressEl.textContent = `Chọn 1 trong ${order.length} lá bài`;
      scoreEl.textContent = `Điểm ${score}/${order.length}`;
      
      promptEl.className = 'quiz-deck-panel';
      promptEl.innerHTML = `
        <div class="quiz-deck-status">
          <span>Chọn 1 trong ${order.length} lá bài</span>
          <strong>${completed.size}/${order.length} đã trả lời</strong>
        </div>
        <div class="quiz-deck">
          ${order
            .map((scenarioIndex, pos) => {
              const scenario = config.scenarios[scenarioIndex];
              const isDone = completed.has(pos);
              const isSelected = selectedPos === pos;
              return `
                <button class="quiz-mini-card${isSelected ? ' selected' : ''}${isDone ? ' answered' : ''}" type="button" data-card="${pos}" ${isDone ? 'disabled' : ''}>
                  <span class="quiz-card-face quiz-card-front">
                    <small>Lá ${pos + 1}</small>
                    <strong>${isDone ? 'Đã trả lời' : 'Chọn thẻ'}</strong>
                  </span>
                  <span class="quiz-card-face quiz-card-back">
                    <small>Lá ${pos + 1}</small>
                    <strong>${scenario.prompt}</strong>
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      `;

      optionsEl.innerHTML = '';
      optionsEl.classList.add('hidden');
      feedbackEl.textContent = '';
      feedbackEl.className = 'game-feedback';
      controlsEl.innerHTML = '';

      if (completed.size === order.length) {
        feedbackEl.textContent = score >= Math.ceil(order.length * 0.75)
          ? 'Bạn đã nắm khá chắc ranh giới giữa mô phỏng hành vi thông minh và ý thức người.'
          : 'Hãy chơi lại để luyện cách phân biệt biểu hiện ngôn ngữ của AI với trải nghiệm chủ quan của con người.';
        feedbackEl.classList.add('show');
        controlsEl.innerHTML = `<button id="aiRestartBtn" type="button">Chơi lại</button>`;
        document.querySelector('#aiRestartBtn').addEventListener('click', start);
        return;
      }

      promptEl.querySelectorAll('.quiz-mini-card:not(.answered)').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (completed.has(Number(card.dataset.card))) return;
          card.classList.toggle('flipped');
          if (card.classList.contains('flipped')) {
            setTimeout(() => renderScenario(Number(card.dataset.card)), 300);
          }
        });
      });
    }

    function renderScenario(pos) {
      const scenario = config.scenarios[order[pos]];
      if (!scenario || completed.has(pos)) return;

      // Reset flip state
      promptEl.querySelectorAll('.quiz-mini-card').forEach(card => {
        card.classList.remove('flipped');
      });
      
      renderDeck(pos);
      const shuffledOptions = shuffle(scenario.options.map((opt, i) => ({ ...opt, __orig: i })));
      optionsEl.classList.remove('hidden');
      optionsEl.innerHTML = shuffledOptions
        .map((opt, j) => `<button class="game-choice" type="button" data-orig="${opt.__orig}">${opt.text}</button>`)
        .join('');

      optionsEl.querySelectorAll('.game-choice').forEach((btn) => {
        btn.addEventListener('click', () => handleAnswer(btn, scenario, pos));
      });
    }

    function handleAnswer(button, scenario, pos) {
      const orig = Number(button.dataset.orig);
      const isCorrect = orig === scenario.answer;
      if (isCorrect) score += 1;
      
      completed.add(pos);
      
      optionsEl.querySelectorAll('.game-choice').forEach((choice) => {
        choice.disabled = true;
        const isCorrectChoice = Number(choice.dataset.orig) === scenario.answer;
        choice.classList.toggle('correct', isCorrectChoice);
        choice.classList.toggle('wrong', choice === button && !isCorrect);
      });

      const feedback = scenario.options[orig]?.feedback || '';
      feedbackEl.textContent = feedback;
      feedbackEl.classList.add('show', isCorrect ? 'correct' : 'wrong');

      controlsEl.innerHTML = `<button id="aiBackBtn" type="button">${completed.size === order.length ? 'Xem kết quả' : 'Chọn lá khác'}</button>`;
      document.querySelector('#aiBackBtn').addEventListener('click', () => renderDeck());
    }

    start();
  }

  function setupAIConsciousnessFlow() {
    const config = data.game.aiConsciousness;
    if (!config || !Array.isArray(config.scenarios)) return;

    const progressEl = document.querySelector('#aiScenarioProgress');
    const scoreEl = document.querySelector('#aiScenarioScore');
    const cardEl = document.querySelector('#aiScenarioCard');
    const optionsEl = document.querySelector('#aiScenarioOptions');
    const feedbackEl = document.querySelector('#aiScenarioFeedback');
    const controlsEl = document.querySelector('#aiScenarioControls');
    if (!progressEl || !scoreEl || !cardEl || !optionsEl || !feedbackEl || !controlsEl) return;

    let order = [];
    let index = 0;
    let score = 0;
    let answered = false;

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function start() {
      const roundSize = Math.min(config.maxScenariosPerRound || config.scenarios.length, config.scenarios.length);
      order = shuffle(config.scenarios.map((_, i) => i)).slice(0, roundSize);
      index = 0;
      score = 0;
      renderScenario();
    }

    function renderScenario() {
      const scenario = config.scenarios[order[index]];
      answered = false;
      progressEl.textContent = `Tình huống ${index + 1}/${order.length}`;
      scoreEl.textContent = `Điểm ${score}`;
      cardEl.innerHTML = `<span>Quan sát hành vi AI</span><p>${scenario.prompt}</p>`;
      feedbackEl.textContent = '';
      feedbackEl.className = 'game-feedback';
      controlsEl.innerHTML = '';

      const options = shuffle(scenario.options.map((option, originalIndex) => ({ ...option, originalIndex })));
      optionsEl.innerHTML = options
        .map(
          (option) => `
            <button class="game-choice ai-scenario-choice" type="button" data-answer="${option.originalIndex}">
              ${option.text}
            </button>
          `
        )
        .join('');

      optionsEl.querySelectorAll('.ai-scenario-choice').forEach((button) => {
        button.addEventListener('click', () => handleChoice(button, scenario));
      });
    }

    function handleChoice(button, scenario) {
      if (answered) return;
      answered = true;
      const selected = Number(button.dataset.answer);
      const correct = selected === scenario.answer;
      if (correct) score += 1;
      scoreEl.textContent = `Điểm ${score}`;

      optionsEl.querySelectorAll('.ai-scenario-choice').forEach((choice) => {
        const isCorrectChoice = Number(choice.dataset.answer) === scenario.answer;
        choice.disabled = true;
        choice.classList.toggle('correct', isCorrectChoice);
        choice.classList.toggle('wrong', choice === button && !correct);
      });

      feedbackEl.textContent = scenario.options[selected]?.feedback || '';
      feedbackEl.classList.add('show', correct ? 'correct' : 'wrong');
      controlsEl.innerHTML = `<button id="aiScenarioNextBtn" type="button">${index < order.length - 1 ? 'Tình huống tiếp' : 'Xem kết quả'}</button>`;
      document.querySelector('#aiScenarioNextBtn').addEventListener('click', () => {
        if (index < order.length - 1) {
          index += 1;
          renderScenario();
          return;
        }
        renderResult();
      });
    }

    function renderResult() {
      const strongResult = score >= Math.ceil(order.length * 0.75);
      progressEl.textContent = 'Hoàn thành';
      scoreEl.textContent = `Điểm ${score}/${order.length}`;
      cardEl.innerHTML = `<span>Kết luận</span><p>${strongResult
        ? 'Bạn đã nắm khá chắc ranh giới giữa mô phỏng hành vi thông minh và ý thức người.'
        : 'Hãy chơi lại để luyện cách phân biệt biểu hiện ngôn ngữ của AI với trải nghiệm chủ quan của con người.'
      }</p>`;
      optionsEl.innerHTML = '';
      feedbackEl.textContent = '';
      feedbackEl.className = 'game-feedback';
      controlsEl.innerHTML = `<button id="aiScenarioRestartBtn" type="button">Chơi lại</button>`;
      document.querySelector('#aiScenarioRestartBtn').addEventListener('click', start);
    }

    start();
  }

  window.GAME = {
    renderGame,
    setupGame,
  };
})();
