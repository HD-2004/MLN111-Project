(function () {
  const root = document.documentElement;
  const TRANSITION_KEY = "mln-page-transition";
  const EXIT_CLASS = "page-transition-exiting";
  const ENTER_CLASS = "page-transition-entering";
  const EXIT_DURATION_MS = 480;
  let isNavigating = false;

  function clearEnterState() {
    window.setTimeout(() => root.classList.remove(ENTER_CLASS), 560);
  }

  function shouldHandleAnchor(anchor, event) {
    if (!anchor || event.defaultPrevented) return false;
    if (event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;

    const rawHref = anchor.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#")) return false;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (!url.pathname.endsWith(".html")) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return false;

    return true;
  }

  function navigateWithTransition(href) {
    if (isNavigating) return;
    isNavigating = true;
    try {
      sessionStorage.setItem(TRANSITION_KEY, "1");
    } catch {}
    root.classList.remove(ENTER_CLASS);
    root.classList.add(EXIT_CLASS);
    window.setTimeout(() => {
      window.location.href = href;
    }, EXIT_DURATION_MS);
  }

  if (root.classList.contains(ENTER_CLASS)) {
    clearEnterState();
  }

  document.addEventListener(
    "click",
    (event) => {
      const anchor = event.target.closest("a[href]");
      if (!shouldHandleAnchor(anchor, event)) return;
      event.preventDefault();
      navigateWithTransition(anchor.href);
    },
    true
  );

  window.addEventListener("pageshow", () => {
    root.classList.remove(EXIT_CLASS);
    if (root.classList.contains(ENTER_CLASS)) clearEnterState();
  });
})();
