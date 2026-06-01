import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const showIntro = true;
const EXIT_DURATION = 900;
const philosophicalPalette = {
  charcoal: 0x12141b,
  darkNavy: 0x070c17,
  deepPurple: 0x2a2142,
  smokyGray: 0x6f7480,
  mutedCyan: 0x7bbfcc,
  softPurple: 0x786a9e,
  dimBlue: 0x324a68,
};

if (showIntro) {
  // sessionStorage can be added here later if the intro should only appear once per visit.
  mountIntroScene();
}

function mountIntroScene() {
  const overlay = document.createElement("section");
  overlay.className = "intro-overlay";
  overlay.setAttribute("aria-label", "Màn mở đầu Lời Gọi Mời Từ Tương Lai");
  overlay.innerHTML = `
    <div class="intro-grid" aria-hidden="true"></div>
    <div class="intro-scanline" aria-hidden="true"></div>
    <div class="intro-shell">
      <p class="intro-boot">INITIALIZING FUTURE CORE...</p>
      <h1 class="intro-title">Lời Gọi Mời Từ Tương Lai</h1>
      <div class="intro-core-stage">
        <canvas
          class="intro-core-canvas"
          data-future-core-canvas
          aria-label="Enter website"
          role="button"
          tabindex="0"
        ></canvas>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("intro-is-open");

  const canvas = overlay.querySelector("[data-future-core-canvas]");
  if (!canvas) return;

  const introScene = initFutureCoreSphere(canvas, overlay);
  let hasEntered = false;

  function enterWebsite() {
    if (hasEntered) return;
    hasEntered = true;
    overlay.classList.add("is-activating");

    window.setTimeout(() => {
      overlay.classList.add("is-exiting");
      document.body.classList.remove("intro-is-open");
    }, 260);

    window.setTimeout(() => {
      introScene.destroy();
      overlay.remove();
    }, EXIT_DURATION);
  }

  canvas.addEventListener("click", enterWebsite);
  canvas.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    enterWebsite();
  });
}

function initFutureCoreSphere(canvas, overlay) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
  camera.position.set(0, 0.08, 6.8);

  const coreSystem = new THREE.Group();
  scene.add(coreSystem);

  const mutedCyan = new THREE.Color(philosophicalPalette.mutedCyan);
  const softPurple = new THREE.Color(philosophicalPalette.softPurple);
  const smokyGray = new THREE.Color(philosophicalPalette.smokyGray);

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: philosophicalPalette.charcoal,
    emissive: philosophicalPalette.deepPurple,
    emissiveIntensity: 0.34,
    metalness: 0.58,
    roughness: 0.5,
    transparent: true,
    opacity: 0.96,
  });
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: philosophicalPalette.smokyGray,
    transparent: true,
    opacity: 0.18,
    wireframe: true,
  });
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: philosophicalPalette.mutedCyan,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.08, 3), coreMaterial);
  const wireCore = new THREE.Mesh(new THREE.IcosahedronGeometry(1.17, 2), wireMaterial);
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.54, 48, 32),
    new THREE.MeshBasicMaterial({
      color: philosophicalPalette.softPurple,
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const innerEnergyLines = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.98, 0.006, 140, 8, 2, 5),
    new THREE.MeshBasicMaterial({
      color: philosophicalPalette.mutedCyan,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const hitArea = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 24, 16),
    new THREE.MeshBasicMaterial({ visible: false })
  );

  const rings = [
    new THREE.Mesh(new THREE.TorusGeometry(1.82, 0.012, 12, 180), ringMaterial.clone()),
    new THREE.Mesh(new THREE.TorusGeometry(2.16, 0.01, 12, 180), ringMaterial.clone()),
    new THREE.Mesh(new THREE.TorusGeometry(2.48, 0.008, 12, 180), ringMaterial.clone()),
  ];
  rings[0].rotation.set(1.16, 0.12, 0.2);
  rings[1].rotation.set(0.34, 1.18, 0.72);
  rings[1].material.color.set(philosophicalPalette.softPurple);
  rings[1].material.opacity = 0.16;
  rings[2].rotation.set(1.42, 0.64, 1.36);
  rings[2].material.color.set(philosophicalPalette.dimBlue);
  rings[2].material.opacity = 0.12;

  const orbitingEnergySpheres = createOrbitingEnergySpheres();
  coreSystem.add(halo, core, wireCore, innerEnergyLines, hitArea, ...rings, orbitingEnergySpheres);

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = window.matchMedia("(max-width: 640px)").matches ? 70 : 130;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.3 + Math.random() * 2.25;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 3.2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.58;

    const mixed = smokyGray.clone().lerp(index % 4 === 0 ? softPurple : mutedCyan, Math.random() * 0.42);
    colors[index * 3] = mixed.r;
    colors[index * 3 + 1] = mixed.g;
    colors[index * 3 + 2] = mixed.b;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  coreSystem.add(particles);

  const keyLight = new THREE.PointLight(philosophicalPalette.mutedCyan, 1.45, 10);
  keyLight.position.set(0.4, 1.2, 3.4);
  const rimLight = new THREE.PointLight(philosophicalPalette.softPurple, 1.05, 9);
  rimLight.position.set(-2.8, -1.4, 2.6);
  scene.add(keyLight, rimLight, new THREE.AmbientLight(philosophicalPalette.smokyGray, 0.46));

  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const clock = new THREE.Clock();
  let hovered = false;
  let animationId = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    coreSystem.scale.setScalar(width < 340 ? 0.82 : 1);
  }

  function setPointerFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
  }

  function updateHover(event) {
    setPointerFromEvent(event);
    raycaster.setFromCamera(pointer, camera);
    hovered = raycaster.intersectObject(hitArea, false).length > 0;
    overlay.classList.toggle("is-core-hovered", hovered);
  }

  function clearHover() {
    hovered = false;
    overlay.classList.remove("is-core-hovered");
  }

  function render() {
    const elapsed = clock.getElapsedTime();
    const activation = overlay.classList.contains("is-activating") ? 1 : 0;
    const hoverBoost = hovered ? 1 : 0;
    const drift = reducedMotion ? 0.8 : elapsed;
    const pulse = 1 + Math.sin(drift * 2.1) * 0.035 + hoverBoost * 0.045 + activation * 0.22;

    core.scale.setScalar(pulse);
    halo.scale.setScalar(1.02 + hoverBoost * 0.11 + activation * 0.42);
    halo.material.opacity = 0.045 + hoverBoost * 0.035 + activation * 0.1;
    coreMaterial.emissiveIntensity = 0.34 + hoverBoost * 0.18 + activation * 0.9;

    core.rotation.set(drift * 0.16, drift * 0.24, drift * 0.04);
    wireCore.rotation.set(drift * -0.1, drift * 0.18, drift * 0.08);
    innerEnergyLines.rotation.set(drift * 0.04, drift * -0.16, drift * 0.1);
    rings.forEach((ring, index) => {
      const speed = (0.08 + index * 0.035) * (hovered ? 1.6 : 1);
      ring.rotation.z += reducedMotion ? 0 : speed * 0.016;
      ring.scale.setScalar(1 + hoverBoost * 0.035 + activation * (0.11 + index * 0.025));
    });
    orbitingEnergySpheres.userData.spheres.forEach((sphere) => {
      const { radius, speed, phase, yTilt, zDepth } = sphere.userData;
      const angle = phase + drift * speed;
      sphere.position.set(Math.cos(angle) * radius, Math.sin(angle * 0.78 + phase) * yTilt, Math.sin(angle) * zDepth);
      sphere.scale.setScalar(1 + Math.sin(drift * 1.7 + phase) * 0.08 + hoverBoost * 0.05);
    });
    particles.rotation.y = drift * 0.035;
    particles.rotation.x = Math.sin(drift * 0.28) * 0.025;
    camera.position.z = 6.8 - activation * 0.62;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    if (!reducedMotion) animationId = window.requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  canvas.addEventListener("pointermove", updateHover, { passive: true });
  canvas.addEventListener("pointerleave", clearHover);

  resize();
  render();

  return {
    destroy() {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", updateHover);
      canvas.removeEventListener("pointerleave", clearHover);
      renderer.dispose();
      particleGeometry.dispose();
      core.geometry.dispose();
      wireCore.geometry.dispose();
      halo.geometry.dispose();
      innerEnergyLines.geometry.dispose();
      hitArea.geometry.dispose();
      [...rings].forEach((ring) => ring.geometry.dispose());
      orbitingEnergySpheres.userData.geometries.forEach((geometry) => geometry.dispose());
      orbitingEnergySpheres.userData.materials.forEach((material) => material.dispose());
    },
  };
}

function createOrbitingEnergySpheres() {
  const orbitingEnergySpheres = new THREE.Group();
  const coreGeometry = new THREE.SphereGeometry(0.07, 16, 12);
  const glowGeometry = new THREE.SphereGeometry(0.18, 18, 12);
  const configs = [
    { radius: 1.72, speed: 0.42, phase: 0.1, yTilt: 0.38, zDepth: 0.72, color: philosophicalPalette.mutedCyan },
    { radius: 2.08, speed: -0.31, phase: 1.8, yTilt: 0.52, zDepth: 0.94, color: philosophicalPalette.softPurple },
    { radius: 2.36, speed: 0.25, phase: 3.2, yTilt: 0.46, zDepth: 1.08, color: philosophicalPalette.dimBlue },
    { radius: 1.94, speed: -0.36, phase: 4.4, yTilt: 0.28, zDepth: 0.82, color: philosophicalPalette.smokyGray },
  ];
  const materials = [];

  configs.forEach((config) => {
    const sphere = new THREE.Group();
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.64,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materials.push(glowMaterial, coreMaterial);
    sphere.add(new THREE.Mesh(glowGeometry, glowMaterial), new THREE.Mesh(coreGeometry, coreMaterial));
    sphere.userData = config;
    orbitingEnergySpheres.add(sphere);
  });

  orbitingEnergySpheres.userData = {
    spheres: orbitingEnergySpheres.children,
    geometries: [coreGeometry, glowGeometry],
    materials,
  };
  return orbitingEnergySpheres;
}
