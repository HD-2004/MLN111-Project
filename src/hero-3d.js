import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const MAX_CANVAS_ATTEMPTS = 120;

function waitForCanvas(attempt = 0) {
  const canvas = document.querySelector("[data-hero-three]");
  if (canvas) {
    initHeroScene(canvas);
    return;
  }

  if (attempt < MAX_CANVAS_ATTEMPTS) {
    window.requestAnimationFrame(() => waitForCanvas(attempt + 1));
  }
}

function initHeroScene(canvas) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.15, 7.4);

  const system = new THREE.Group();
  scene.add(system);

  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4a84f,
    transparent: true,
    opacity: 0.42,
    wireframe: true,
  });
  const shellMaterial = new THREE.MeshBasicMaterial({
    color: 0x63d7ff,
    transparent: true,
    opacity: 0.2,
    wireframe: true,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.26, 3), coreMaterial);
  const shell = new THREE.Mesh(new THREE.TorusKnotGeometry(1.95, 0.035, 180, 12, 2, 3), shellMaterial);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.62, 0.018, 8, 190), shellMaterial.clone());
  orbit.material.opacity = 0.24;
  orbit.rotation.set(1.1, 0.18, 0.36);

  system.add(core, shell, orbit);

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 760;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const cyan = new THREE.Color(0x63d7ff);
  const gold = new THREE.Color(0xd4a84f);

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.3 + Math.random() * 2.2;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 3.4;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = height;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.54;

    const mixed = cyan.clone().lerp(gold, Math.random() * 0.45);
    colors[index * 3] = mixed.r;
    colors[index * 3 + 1] = mixed.g;
    colors[index * 3 + 2] = mixed.b;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  system.add(particles);

  const pointer = { x: 0, y: 0 };
  let active = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const narrow = width < 760;
    system.position.set(narrow ? 1.1 : 2.15, narrow ? -0.48 : -0.08, 0);
    system.scale.setScalar(narrow ? 0.78 : 1);
  }

  function onPointerMove(event) {
    pointer.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
    pointer.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      active = entry?.isIntersecting ?? true;
    },
    { threshold: 0.02 }
  );
  observer.observe(canvas);

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  resize();

  const clock = new THREE.Clock();

  function render() {
    const elapsed = clock.getElapsedTime();
    const drift = reducedMotion ? 0 : elapsed;

    if (active || reducedMotion) {
      core.rotation.set(drift * 0.16 + pointer.y * 0.08, drift * 0.22 + pointer.x * 0.14, 0);
      shell.rotation.set(drift * -0.08, drift * 0.18, drift * 0.05);
      orbit.rotation.z = 0.36 + drift * 0.1;
      particles.rotation.y = drift * 0.026 + pointer.x * 0.05;
      particles.rotation.x = pointer.y * 0.035;
      renderer.render(scene, camera);
    }

    if (!reducedMotion) window.requestAnimationFrame(render);
  }

  render();
}

waitForCanvas();
