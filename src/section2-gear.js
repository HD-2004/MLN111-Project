import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const MAX_CANVAS_ATTEMPTS = 120;

function waitForSection2Canvas(attempt = 0) {
  const canvas = document.querySelector("[data-section2-gear]");
  const root = document.querySelector("[data-section2-root]");

  if (canvas && root) {
    initSection2GearPhilosophy(canvas, root);
    return;
  }

  if (attempt < MAX_CANVAS_ATTEMPTS) {
    window.requestAnimationFrame(() => waitForSection2Canvas(attempt + 1));
  }
}

function createGlowMaterial(color, opacity = 0.78) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function initSection2GearPhilosophy(canvas, root) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.1, 7.2);

  const system = new THREE.Group();
  scene.add(system);

  const cyan = new THREE.Color(0x63d7ff);
  const gold = new THREE.Color(0xd4a84f);
  const ember = new THREE.Color(0xf28d35);

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: cyan,
    transparent: true,
    opacity: 0.2,
    wireframe: true,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 3), wireMaterial);
  const equator = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.035, 10, 180), createGlowMaterial(0x63d7ff, 0.42));
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.06, 0.018, 8, 180), createGlowMaterial(0xd4a84f, 0.36));
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.36, 0.014, 8, 180), createGlowMaterial(0x63d7ff, 0.26));
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.014, 8, 160), createGlowMaterial(0xf28d35, 0.24));
  const crown = new THREE.Mesh(new THREE.TorusKnotGeometry(1.45, 0.018, 180, 8, 3, 5), createGlowMaterial(0x63d7ff, 0.2));

  ringA.rotation.set(1.14, 0.18, 0.2);
  ringB.rotation.set(0.58, 1.1, -0.18);
  ringC.rotation.set(1.7, -0.46, 0.44);
  system.add(core, equator, ringA, ringB, ringC, crown);

  const teeth = new THREE.Group();
  const toothGeometry = new THREE.BoxGeometry(0.08, 0.24, 0.08);
  const toothMaterial = createGlowMaterial(0xd4a84f, 0.38);
  for (let index = 0; index < 28; index += 1) {
    const angle = (index / 28) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
    tooth.position.set(Math.cos(angle) * 1.82, Math.sin(angle) * 1.82, 0);
    tooth.rotation.z = angle;
    teeth.add(tooth);
  }
  system.add(teeth);

  const nodeButtons = Array.from(root.querySelectorAll("[data-section2-node-button]"));
  const nodeMeshes = nodeButtons.map((button, index) => {
    const angle = (index / Math.max(nodeButtons.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const color = new THREE.Color(button.dataset.nodeColor || "#63d7ff");
    const nodeGroup = new THREE.Group();
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), createGlowMaterial(color, index === 0 ? 0.95 : 0.58));
    const coreDot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 18, 12), createGlowMaterial(0xffffff, 0.9));
    nodeGroup.add(halo, coreDot);
    nodeGroup.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 1.42, Math.sin(angle) * 0.72);
    nodeGroup.userData = { id: button.dataset.nodeId, color };
    system.add(nodeGroup);
    return nodeGroup;
  });

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 240;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 1.8 + Math.random() * 2.4;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 2.6;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = height;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.44;

    const mixed = cyan.clone().lerp(index % 3 === 0 ? gold : ember, Math.random() * 0.5);
    colors[index * 3] = mixed.r;
    colors[index * 3 + 1] = mixed.g;
    colors[index * 3 + 2] = mixed.b;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.64,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  system.add(particles);

  const pointer = { x: 0, y: 0 };
  let active = true;
  let activeIndex = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    system.scale.setScalar(width < 520 ? 0.82 : 1);
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
  }

  function onNodeChange(event) {
    activeIndex = event.detail?.index || 0;
    const color = new THREE.Color(event.detail?.color || "#63d7ff");
    equator.material.color.copy(color);
    nodeMeshes.forEach((node, index) => {
      const halo = node.children[0];
      halo.material.opacity = index === activeIndex ? 0.98 : 0.48;
      halo.scale.setScalar(index === activeIndex ? 1.32 : 1);
    });
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      active = entry?.isIntersecting ?? true;
    },
    { threshold: 0.08 }
  );
  observer.observe(canvas);

  root.addEventListener("pointermove", onPointerMove, { passive: true });
  root.addEventListener("section2-node-change", onNodeChange);
  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();

  function isIntroBlocking() {
    return document.body.classList.contains("intro-is-open");
  }

  function render() {
    const elapsed = clock.getElapsedTime();
    const drift = reducedMotion ? 0 : elapsed;

    if ((active && !isIntroBlocking()) || reducedMotion) {
      system.rotation.y = drift * 0.12 + pointer.x * 0.16;
      system.rotation.x = pointer.y * 0.08;
      core.rotation.y = drift * 0.26;
      crown.rotation.x = drift * -0.08;
      crown.rotation.y = drift * 0.16;
      teeth.rotation.z = drift * 0.18;
      ringA.rotation.z = 0.2 + drift * 0.12;
      ringB.rotation.y = 1.1 + drift * -0.08;
      particles.rotation.y = drift * 0.035;

      nodeMeshes.forEach((node, index) => {
        const pulse = 1 + Math.sin(drift * 2.4 + index) * 0.08;
        const base = index === activeIndex ? 1.28 : 1;
        node.scale.setScalar(base * pulse);
      });

      renderer.render(scene, camera);
    }

    if (!reducedMotion) window.requestAnimationFrame(render);
  }

  render();
}

waitForSection2Canvas();
