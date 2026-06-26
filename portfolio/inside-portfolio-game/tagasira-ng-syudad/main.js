// Tagasira ng Syudad - Overhaul (Weapons & Decor)

// --- Procedural Sound Manager (Web Audio API) ---
const SFX = {
  ctx: null,
  initialized: false,

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.initialized = true;
    this.playAmbient(); // Start background hum
  },

  // Explosion: white noise burst with low-pass filter decay
  playExplosion(big = false) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const duration = big ? 0.8 : 0.4;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(big ? 600 : 400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      60,
      ctx.currentTime + duration,
    );
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(big ? 0.6 : 0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + duration);
  },

  // Asteroid whoosh: filtered noise with rising pitch
  playWhoosh() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.6);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 400;
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  },

  // Fire crackle: multiple tiny noise pops
  playCrackle() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    for (let j = 0; j < 3; j++) {
      setTimeout(() => {
        const dur = 0.05;
        const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
        const s = ctx.createBufferSource();
        s.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = 0.1;
        s.connect(g).connect(ctx.destination);
        s.start();
      }, j * 80);
    }
  },

  // Kaiju footstep: deep bass thud
  playFootstep() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  },

  // Ambient city hum: continuous low drone
  playAmbient() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 55; // Low A note
    const gain = ctx.createGain();
    gain.gain.value = 0.03; // Very quiet
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    // This runs forever as background
  },

  // Thunder rumble for lightning
  playThunder() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const dur = 1.5;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5);
    }
    const s = ctx.createBufferSource();
    s.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 200;
    const g = ctx.createGain();
    g.gain.value = 0.25;
    s.connect(filter).connect(g).connect(ctx.destination);
    s.start();
  },

  // Laser Zap: high pitch square wave with rapid decay
  playLaser() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },

  // Nuke Boom: massive deep explosion
  playNuke() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const duration = 2.0;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      20,
      ctx.currentTime + duration,
    );
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1.0, ctx.currentTime); // LOUD
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + duration);
  },
};

// Activate audio on first user interaction (browser requirement)
window.addEventListener("pointerdown", () => SFX.init(), { once: true });

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827); // Darker night sky
scene.fog = new THREE.FogExp2(0x111827, 0.015);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 45, 60);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- OrbitControls ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minDistance = 20;
controls.maxDistance = 150;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Very dark ambient for night vibe
scene.add(ambientLight);

// Moon/Main light
const dirLight = new THREE.DirectionalLight(0xa5b4fc, 0.8); // Pale blue moonlight
dirLight.position.set(30, 60, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 150;
const d = 40;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xfca5a5, 0.2); // faint red city glow from below
fillLight.position.set(-30, 5, -30);
scene.add(fillLight);

// --- State & UI Elements ---
const buildings = [];
const particles = [];
const traffic = []; // Holds moving vehicles
const activeFires = []; // Stores objects currently burning
const activeAsteroids = []; // Stores falling asteroids
const activeMonsters = []; // Stores the AI Kaijus
const flashLights = []; // Stores temporary explosion lights
const activeLasers = []; // Temporarily visible laser beams
const activeShockwaves = []; // Expanding nuke rings
const activeCraters = []; // Ground markings after destruction
let isGameOver = false;

// Screen Shake variables
let shakeIntensity = 0;
const shakeDecay = 0.9; // How fast the shake fades

// Bullet Time
let gameSpeed = 1.0;
let bulletTimeTimer = 0;

// Combo System
let lastDestroyTime = 0;
let comboCount = 0;
let comboFadeTimer = 0;
const comboDisplay = document.getElementById("combo-display");

// Destruction Stats
const stats = {
  bombs: 0,
  asteroids: 0,
  fires: 0,
  kaiju: 0,
  lasers: 0,
  nukes: 0,
};
let gameStartTime = Date.now();

let currentWeapon = "bomb"; // Default

const buildingsLeftUI = document.getElementById("buildings-left");
const winScreenUI = document.getElementById("win-screen");
const retryBtn = document.getElementById("retry-btn");
const uiContainer = document.getElementById("ui-container");
const weaponBtns = document.querySelectorAll(".weapon-btn");

// Weapon Selection Logic
weaponBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Remove active class from all
    weaponBtns.forEach((b) => b.classList.remove("active"));
    // Add to clicked
    btn.classList.add("active");
    currentWeapon = btn.getAttribute("data-weapon");
  });
});

const cityGroup = new THREE.Group();
scene.add(cityGroup);

const groundGeo = new THREE.PlaneGeometry(200, 200);
const streetTex = generateStreetTexture();
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x333333,
  map: streetTex,
  roughness: 0.9,
  metalness: 0.2,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
cityGroup.add(ground);

// --- Procedural Textures ---
function generateStreetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Base asphalt
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, 512, 512);

  // Draw Grid (Roads)
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = 15;

  // The grid spacing should somewhat match our building spacing (which is 4.5 units)
  // We'll just draw a generic street grid pattern
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke(); // Vert
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke(); // Horz
  }

  // Dashed center lines
  ctx.strokeStyle = "#eab308"; // Yellow
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10); // scale across the 200x200 plane
  return texture;
}

function generateWindowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Base dark building color
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(0, 0, 64, 256);

  // Draw windows
  for (let y = 10; y < 250; y += 15) {
    for (let x = 8; x < 60; x += 16) {
      // 30% chance window is on
      if (Math.random() > 0.7) {
        // Randomize light temp (yellow or white)
        ctx.fillStyle = Math.random() > 0.5 ? "#fef08a" : "#e0f2fe";
        // Add glow effect trick in 2D
        ctx.shadowBlur = 4;
        ctx.shadowColor = ctx.fillStyle;
      } else {
        ctx.fillStyle = "#0f172a"; // dark window
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(x, y, 6, 8);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Generate a few variations of window textures to reuse
const windowTextures = [
  generateWindowTexture(),
  generateWindowTexture(),
  generateWindowTexture(),
];

// --- City Generation ---
const gridSize = 8;
const spacing = 4.5;
const buildingColors = [0x555555, 0x666666, 0x8d6e63]; // less saturation
const lineMat = new THREE.LineBasicMaterial({
  color: 0x000000,
  linewidth: 2,
  transparent: true,
  opacity: 0.8,
});

// Helper function to create one "block" of a building
function createBuildingBlock(
  width,
  height,
  depth,
  yOffset,
  parentGroup,
  isTargetable = true,
) {
  const geo = new THREE.BoxGeometry(width, height, depth);
  const tex = windowTextures[Math.floor(Math.random() * windowTextures.length)];
  tex.repeat.set(width / 3, height / 4); // scale window density based on block size

  const color =
    buildingColors[Math.floor(Math.random() * buildingColors.length)];
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    map: tex,
    roughness: 0.6,
    metalness: 0.4,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = yOffset + height / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const edges = new THREE.EdgesGeometry(geo);
  const wireframe = new THREE.LineSegments(edges, lineMat);
  mesh.add(wireframe);

  // Store metadata on the Mesh
  mesh.userData = {
    parentGroup: parentGroup, // Link to the master building complex
    isHovered: false,
    height: height + yOffset, // Max height of this specific block
    targetable: isTargetable,
  };

  // Update parent's max height tracking (for Asteroids/Explosions)
  if (mesh.userData.height > parentGroup.userData.maxHeight) {
    parentGroup.userData.maxHeight = mesh.userData.height;
  }

  parentGroup.add(mesh);
  // Only standard blocks are raycast targets, meaning clicking any block triggers the Parent
  if (isTargetable) buildings.push(mesh);

  return mesh;
}

// Factory function for complex building archetypes
function generateBuildingArchetype(x, z) {
  const pGroup = new THREE.Group();
  pGroup.position.set(x, 0, z);
  pGroup.userData = { maxHeight: 0, targetable: true };

  const typeRoll = Math.random();

  if (typeRoll < 0.3) {
    // 1. The Wedding Cake (Tiered)
    const baseH = Math.random() * 4 + 3;
    createBuildingBlock(4, baseH, 4, 0, pGroup);
    const midH = Math.random() * 4 + 2;
    createBuildingBlock(2.5, midH, 2.5, baseH, pGroup);
    if (Math.random() > 0.5) {
      const topH = Math.random() * 3 + 1;
      createBuildingBlock(1.5, topH, 1.5, baseH + midH, pGroup);
    }
  } else if (typeRoll < 0.45) {
    // 2. Twin Towers
    const h = Math.random() * 7 + 5;
    // Tower 1
    const t1 = createBuildingBlock(1.5, h, 1.5, 0, pGroup);
    t1.position.x = -1.2;
    // Tower 2
    const t2 = createBuildingBlock(1.5, h, 1.5, 0, pGroup);
    t2.position.x = 1.2;
    // Skybridge
    if (Math.random() > 0.3) {
      const bridge = createBuildingBlock(2, 1, 1, h * 0.7, pGroup, false); // Dont target bridge directly
      bridge.position.x = 0;
    }
  } else if (typeRoll < 0.6) {
    // 3. The Overhang (L-Shape)
    const h = Math.random() * 6 + 4;
    createBuildingBlock(2, h, 2, 0, pGroup); // main stalk
    const overhangW = Math.random() * 2 + 1;
    const overhang = createBuildingBlock(
      overhangW,
      Math.random() * 2 + 1,
      2,
      h - 1.5,
      pGroup,
    );
    overhang.position.x = (Math.random() > 0.5 ? 1 : -1) * (1 + overhangW / 2);
  } else {
    // 4. Standard Block (with optional small antenna roof)
    const h = Math.random() * 9 + 4;
    createBuildingBlock(3, h, 3, 0, pGroup);
    if (Math.random() > 0.5) {
      const roofH = Math.random() * 2 + 0.5;
      createBuildingBlock(1, roofH, 1, h, pGroup, false); // Non-targetable small roof
    }
  }

  return pGroup;
}

// Factory function for generating moving traffic (Cars)
function spawnTraffic(offset) {
  const numCars = 60; // Dense traffic
  const carMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Front lights white
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Tail lights red
  const carGeo = new THREE.BoxGeometry(0.2, 0.2, 0.4);

  for (let i = 0; i < numCars; i++) {
    // Cars drive in the "streets" (spaces between grid coordinates)
    // Pick a random grid line X or Z
    const isAxisX = Math.random() > 0.5;
    // Snap to a grid line (approximate street center)
    const gridIndex = Math.floor(Math.random() * gridSize);
    const streetPos = gridIndex * spacing - offset + spacing / 2;

    // Random position along the other axis
    const alongPos = Math.random() * gridSize * spacing - offset;

    // Direction (+ or -)
    const dir = Math.random() > 0.5 ? 1 : -1;

    // Visual mesh
    const mesh = new THREE.Mesh(carGeo, dir > 0 ? carMat : tailMat);

    if (isAxisX) {
      mesh.position.set(alongPos, 0.2, streetPos);
      mesh.rotation.y = Math.PI / 2;
    } else {
      mesh.position.set(streetPos, 0.2, alongPos);
    }

    cityGroup.add(mesh);

    traffic.push({
      mesh: mesh,
      isAxisX: isAxisX,
      dir: dir,
      speed: (Math.random() * 2 + 1) * dir, // Random speed
      limitPos: (gridSize * spacing) / 2,
    });
  }
}

function createCity() {
  buildings.forEach((b) => {
    // Only remove parent groups since blocks are children
    if (b.userData.parentGroup.parent === cityGroup) {
      cityGroup.remove(b.userData.parentGroup);
    }
    b.geometry.dispose();
    b.material.dispose();
  });
  buildings.length = 0;
  particles.length = 0;

  // Clear old traffic
  traffic.forEach((t) => {
    cityGroup.remove(t.mesh);
    t.mesh.geometry.dispose();
    t.mesh.material.dispose();
  });
  traffic.length = 0;

  // Clear Monsters
  activeMonsters.forEach((m) => {
    scene.remove(m.meshGroup);
    m.meshGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  });
  activeMonsters.length = 0;

  activeFires.length = 0;
  activeAsteroids.length = 0;

  // Clear old flashes
  flashLights.forEach((f) => scene.remove(f));
  flashLights.length = 0;

  // Clear craters
  activeCraters.forEach((c) => {
    scene.remove(c);
    c.geometry.dispose();
    c.material.dispose();
  });
  activeCraters.length = 0;

  while (scene.children.length > 4) {
    // keep lights and cityGroup
    let c = scene.children[scene.children.length - 1];
    if (
      c !== cityGroup &&
      c.type !== "Light" &&
      c.type !== "AmbientLight" &&
      c.type !== "DirectionalLight"
    ) {
      scene.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    } else {
      break;
    }
  }

  const offset = (gridSize * spacing) / 2 - spacing / 2;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (Math.random() > 0.85) continue; // Leaves gaps

      const px = i * spacing - offset;
      const pz = j * spacing - offset;

      // Generate a complex building array
      const buildingGroup = generateBuildingArchetype(px, pz);
      cityGroup.add(buildingGroup);
    }
  }

  spawnTraffic(offset);
  updateUI();
}

function updateUI() {
  // We count the number of UNIQUE parent groups remaining
  const parentSets = new Set(
    buildings
      .filter((b) => b.userData.parentGroup.userData.targetable)
      .map((b) => b.userData.parentGroup),
  );
  const count = parentSets.size;
  buildingsLeftUI.innerText = count;

  if (count === 0 && !isGameOver) {
    isGameOver = true;
    // Populate stats
    document.getElementById("stat-bombs").textContent = stats.bombs;
    document.getElementById("stat-asteroids").textContent = stats.asteroids;
    document.getElementById("stat-fires").textContent = stats.fires;
    document.getElementById("stat-kaiju").textContent = stats.kaiju;
    document.getElementById("stat-lasers").textContent = stats.lasers;
    document.getElementById("stat-nukes").textContent = stats.nukes;
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    document.getElementById("stat-time").textContent = elapsed + "s";
    winScreenUI.classList.remove("hidden");
    uiContainer.classList.add("hidden");
    controls.autoRotateSpeed = 3.0;
  }
}

// --- Floating Damage Text ---
function spawnFloatingText(position3D, text) {
  const screenPos = position3D.clone();
  screenPos.project(camera);
  const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;
  const el = document.createElement("div");
  el.className = "float-text";
  el.textContent = text;
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// --- Combo System ---
function registerDestruction() {
  const now = Date.now();
  if (now - lastDestroyTime < 2000) {
    comboCount++;
  } else {
    comboCount = 1;
  }
  lastDestroyTime = now;

  if (comboCount >= 2) {
    comboDisplay.textContent = "x" + comboCount + " COMBO!";
    comboDisplay.classList.remove("visible");
    void comboDisplay.offsetWidth; // Force reflow for re-animation
    comboDisplay.classList.add("visible");
    comboFadeTimer = 1.5; // seconds to stay visible
  }
}

// --- Bullet Time ---
function triggerBulletTime() {
  gameSpeed = 0.15;
  bulletTimeTimer = 0.3; // Real-time seconds to hold slow-mo
}

// --- Weapon Systems ---

// --- Craters ---
function spawnCrater(position, weaponType) {
  // We use a flat PlaneGeometry for most craters slightly above ground
  let geo = new THREE.PlaneGeometry(5, 5);
  let mat;
  let scale = 1.0;

  if (weaponType === "bomb") {
    mat = new THREE.MeshBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.8,
    });
    geo.dispose(); // change to circle
    geo = new THREE.CircleGeometry(3, 16);
  } else if (weaponType === "asteroid") {
    mat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.9,
    });
    geo.dispose();
    geo = new THREE.CircleGeometry(4, 16);
  } else if (weaponType === "fire") {
    mat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.9,
    });
    geo.dispose();
    geo = new THREE.CircleGeometry(3.5, 12);
  } else if (weaponType === "monster") {
    mat = new THREE.MeshBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.9,
    });
    geo.dispose();
    geo = new THREE.PlaneGeometry(4, 4); // jagged square look
    scale = 1.2;
  } else if (weaponType === "laser") {
    mat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });
    geo.dispose();
    geo = new THREE.RingGeometry(0.5, 2.5, 16);
  } else if (weaponType === "nuke") {
    mat = new THREE.MeshBasicMaterial({
      color: 0x112200,
      transparent: true,
      opacity: 0.85,
    });
    geo.dispose();
    geo = new THREE.CircleGeometry(16, 32);
    // Massive blast mark
  }

  const crater = new THREE.Mesh(geo, mat);
  crater.rotation.x = -Math.PI / 2;
  crater.position.copy(position);
  crater.position.y = 0.05 + Math.random() * 0.05; // Slightly above ground, randomized to prevent Z-fighting if overlapping
  crater.scale.set(scale, scale, 1);

  scene.add(crater);
  activeCraters.push(crater);
}

// --- Screen Shake (Juice) ---
function addScreenShake(intensity) {
  shakeIntensity = Math.max(shakeIntensity, intensity);
}

// 1. Explosion (Bomb)
function triggerExplosion(position, height, isAsteroid = false) {
  const particleCount = Math.floor(20 + height * 2.5);
  const pGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const pMat = new THREE.MeshStandardMaterial({
    color: 0xfca5a5,
    emissive: 0x991b1b,
    emissiveIntensity: 1.2,
  });

  for (let i = 0; i < particleCount; i++) {
    const particle = new THREE.Mesh(pGeo, pMat);
    particle.position.set(
      position.x + (Math.random() - 0.5) * 2,
      Math.random() * height,
      position.z + (Math.random() - 0.5) * 2,
    );
    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      Math.random() * 5 + 3, // blast upwards
      (Math.random() - 0.5) * 5,
    );
    // Extra Juice: Asteroids create wider, stronger bursts
    if (isAsteroid) {
      particle.userData.velocity.multiplyScalar(1.5);
      particle.scale.multiplyScalar(1.5);
    }
    particle.userData.rotSpeed = new THREE.Vector3(
      Math.random() * 0.3,
      Math.random() * 0.3,
      Math.random() * 0.3,
    );
    particle.userData.bounces = 0; // Track floor bounces
    particle.castShadow = true;
    scene.add(particle);
    particles.push(particle);
  }

  // Explostion Flash (PointLight Juice)
  const flash = new THREE.PointLight(0xffa500, 5, 40); // Intense orange light
  flash.position.copy(position);
  flash.position.y += height / 2; // Middle of building
  scene.add(flash);
  flashLights.push(flash);

  // Screen Trauma
  addScreenShake(isAsteroid ? 2.5 : 1.0);

  // SFX
  SFX.playExplosion(isAsteroid);
}

function destroyBuildingDirectly(mesh) {
  const parent = mesh.userData.parentGroup;
  triggerExplosion(parent.position, parent.userData.maxHeight);
  parent.userData.targetable = false;
  cityGroup.remove(parent);
  stats.bombs++;
  spawnCrater(parent.position, "bomb");
  spawnFloatingText(parent.position, "+1");
  registerDestruction();
  updateUI();
}

// 2. Asteroid
function spawnAsteroid(targetMesh) {
  const parent = targetMesh.userData.parentGroup;
  parent.userData.targetable = false; // Prevent targeting again

  const aGeo = new THREE.SphereGeometry(1.5, 8, 8);
  const aMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff4400,
    emissiveIntensity: 1.0,
    roughness: 1.0,
  });
  const asteroid = new THREE.Mesh(aGeo, aMat);

  // Spawn high above
  asteroid.position.set(parent.position.x, 60, parent.position.z);
  scene.add(asteroid);

  // Track it
  activeAsteroids.push({
    mesh: asteroid,
    targetMesh: targetMesh,
    speed: 1.5, // fast fall
  });

  stats.asteroids++;

  // SFX
  SFX.playWhoosh();
}

// 3. Fire
function startFire(targetMesh) {
  const parent = targetMesh.userData.parentGroup;
  parent.userData.targetable = false;

  // Add to burning list
  activeFires.push({
    parentGroup: parent,
    originalHeight: parent.userData.maxHeight,
    burnRate: 0.05, // shrink rate
  });

  stats.fires++;

  // SFX
  SFX.playCrackle();
}

// 4. Monster / Kaiju
function spawnMonster(targetMesh) {
  const parent = targetMesh.userData.parentGroup;

  // Create Procedural Voxel Monster
  const mGroup = new THREE.Group();

  // Body
  const bodyGeo = new THREE.BoxGeometry(2.5, 3.5, 3.5);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.8,
  }); // Green
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.75;
  body.castShadow = true;
  mGroup.add(body);

  // Head
  const headGeo = new THREE.BoxGeometry(2, 2, 2.5);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.set(0, 4.5, 1);
  mGroup.add(head);

  // Eyes (Glowing Red)
  const eyeGeo = new THREE.BoxGeometry(0.5, 0.4, 0.2);
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 2.0,
  });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(0.6, 4.8, 2.3);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(-0.6, 4.8, 2.3);
  mGroup.add(eyeL);
  mGroup.add(eyeR);

  // Spikes (Back)
  const spikeGeo = new THREE.ConeGeometry(0.8, 1.5, 4);
  const spikeMat = new THREE.MeshStandardMaterial({ color: 0x9333ea }); // Purple
  for (let i = 0; i < 3; i++) {
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(0, 3 - i * 0.5, -1.5 - i * 0.5);
    spike.rotation.x = -Math.PI / 4;
    mGroup.add(spike);
  }

  // Spawn exactly at the clicked building's location
  mGroup.position.copy(parent.position);
  scene.add(mGroup);

  // Destroy initial building immediately on spawn to make room
  triggerExplosion(parent.position, parent.userData.maxHeight, true);
  parent.userData.targetable = false;
  cityGroup.remove(parent);
  stats.kaiju++;
  spawnFloatingText(parent.position, "+1");
  registerDestruction();
  updateUI();

  // Add to AI Loop
  activeMonsters.push({
    meshGroup: mGroup,
    cooldown: 4.0, // Initial wait before finding next
    currentTarget: null,
    speed: 3.0,
  });
}

// 5. Laser Beam
function fireLaser(targetMesh) {
  const parent = targetMesh.userData.parentGroup;

  // Create Beam Visual
  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    linewidth: 4,
    transparent: true,
    opacity: 1,
  });

  const points = [];
  points.push(new THREE.Vector3(parent.position.x, 60, parent.position.z));
  points.push(parent.position); // Strike down to base

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  activeLasers.push({ mesh: line, life: 0.3 }); // lives for 0.3s

  // Explode instantly
  parent.userData.targetable = false;
  triggerExplosion(parent.position, parent.userData.maxHeight, false);
  cityGroup.remove(parent);

  spawnCrater(parent.position, "laser");

  stats.lasers++;
  spawnFloatingText(parent.position, "+1");
  registerDestruction();

  SFX.playLaser();
}

// 6. Atomic Bomb
function dropAtomicBomb(targetMesh) {
  const centerPos = targetMesh.userData.parentGroup.position.clone();
  const radius = 15.0; // AOE radius

  // Find all alive buildings within radius
  const aliveGroups = [
    ...new Set(
      buildings
        .filter((b) => b.userData.parentGroup.userData.targetable)
        .map((b) => b.userData.parentGroup),
    ),
  ];

  let destroyedCount = 0;

  aliveGroups.forEach((g) => {
    // 2D distance (ignore height)
    const dist = Math.hypot(
      g.position.x - centerPos.x,
      g.position.z - centerPos.z,
    );
    if (dist <= radius) {
      g.userData.targetable = false;
      triggerExplosion(g.position, g.userData.maxHeight, true);
      cityGroup.remove(g);
      destroyedCount++;
    }
  });

  spawnCrater(centerPos, "nuke");

  // Visual Shockwave
  const ringGeo = new THREE.RingGeometry(0.1, 1, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x84cc16, // lime green toxic
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.copy(centerPos);
  ring.position.y = 1.0;
  scene.add(ring);

  activeShockwaves.push({ mesh: ring, scale: 1, life: 1.0 });

  // Flash
  const flash = new THREE.PointLight(0xffffff, 8, 100);
  flash.position.copy(centerPos);
  flash.position.y = 10;
  scene.add(flash);
  flashLights.push(flash);

  stats.nukes++;
  if (destroyedCount > 0) {
    spawnFloatingText(centerPos, "+" + destroyedCount);
    // Combo hack: forcefully add combo
    comboCount += destroyedCount - 1;
    registerDestruction();
  }

  triggerBulletTime();
  addScreenShake(5.0); // Massive shake
  SFX.playNuke();
}

// --- Interaction / Raycasting ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredBuilding = null;

window.addEventListener("mousemove", (event) => {
  if (isGameOver) return;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Only raycast against alive buildings
  const aliveTargets = buildings.filter((b) => b.userData.targetable);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(aliveTargets);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    // We highlight all children block meshes of the parent group
    const parentGroup = object.userData.parentGroup;

    if (hoveredBuilding !== parentGroup) {
      if (hoveredBuilding) {
        hoveredBuilding.children.forEach((c) => {
          if (c.material && c.material.emissive)
            c.material.emissive.setHex(0x000000);
        });
      }
      hoveredBuilding = parentGroup;

      let glowColor = 0x550000;
      if (currentWeapon === "fire") glowColor = 0x552200;
      if (currentWeapon === "asteroid") glowColor = 0x444400;
      if (currentWeapon === "monster") glowColor = 0x004400; // Dark green for Kaiju
      if (currentWeapon === "laser") glowColor = 0x003344; // Cyan for Laser
      if (currentWeapon === "nuke") glowColor = 0x334400; // Toxic yellow for Nuke

      hoveredBuilding.children.forEach((c) => {
        if (c.material && c.material.emissive)
          c.material.emissive.setHex(glowColor);
      });
      document.body.style.cursor = "crosshair";
    }
  } else {
    if (hoveredBuilding) {
      hoveredBuilding.children.forEach((c) => {
        if (c.material && c.material.emissive)
          c.material.emissive.setHex(0x000000);
      });
      hoveredBuilding = null;
      document.body.style.cursor = "default";
    }
  }
});

let pointerDownX = 0;
let pointerDownY = 0;

window.addEventListener("pointerdown", (event) => {
  pointerDownX = event.clientX;
  pointerDownY = event.clientY;
});

// Track clicks for destruction (distinguish from drag)
window.addEventListener("pointerup", (event) => {
  // Ignore UI clicks
  if (
    event.button !== 0 ||
    isGameOver ||
    event.target.closest("#weapon-toolbar") ||
    event.target.closest("#win-screen")
  )
    return;

  // If dragged more than 5 pixels, it's a camera rotation, not a click
  const dist = Math.hypot(
    event.clientX - pointerDownX,
    event.clientY - pointerDownY,
  );
  if (dist > 5) return;

  // Update mouse coordinates just to be safe
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const aliveTargets = buildings.filter(
    (b) => b.userData.parentGroup.userData.targetable,
  );
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(aliveTargets);

  if (intersects.length > 0) {
    const clickedBlock = intersects[0].object;
    const parentGroup = clickedBlock.userData.parentGroup;

    // Remove hover state instantly
    if (hoveredBuilding === parentGroup) {
      hoveredBuilding.children.forEach((c) => {
        if (c.material && c.material.emissive)
          c.material.emissive.setHex(0x000000);
      });
      hoveredBuilding = null;
    }

    // Apply Weapon Logic to the block, which handles the parent inside
    if (currentWeapon === "bomb") {
      destroyBuildingDirectly(clickedBlock);
    } else if (currentWeapon === "asteroid") {
      spawnAsteroid(clickedBlock);
      updateUI(); // Updates count instantly
    } else if (currentWeapon === "fire") {
      startFire(clickedBlock);
      updateUI();
    } else if (currentWeapon === "monster") {
      spawnMonster(clickedBlock);
    } else if (currentWeapon === "laser") {
      fireLaser(clickedBlock);
      updateUI();
    } else if (currentWeapon === "nuke") {
      dropAtomicBomb(clickedBlock);
      updateUI();
    }
  }
});

controls.addEventListener("start", () => {
  controls.autoRotate = false;
});

retryBtn.addEventListener("click", () => {
  isGameOver = false;
  winScreenUI.classList.add("hidden");
  uiContainer.classList.remove("hidden");
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = true;
  // Reset stats
  stats.bombs = 0;
  stats.asteroids = 0;
  stats.fires = 0;
  stats.kaiju = 0;
  gameStartTime = Date.now();
  comboCount = 0;
  gameSpeed = 1.0;
  createCity();
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Main Game Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const rawDelta = clock.getDelta();

  // Bullet Time: lerp gameSpeed back to 1.0
  if (bulletTimeTimer > 0) {
    bulletTimeTimer -= rawDelta;
    if (bulletTimeTimer <= 0) {
      gameSpeed = 1.0;
    }
  } else {
    gameSpeed = Math.min(gameSpeed + rawDelta * 4, 1.0); // Smooth return
  }

  const delta = rawDelta * gameSpeed;
  controls.update();

  // Combo fade
  if (comboFadeTimer > 0) {
    comboFadeTimer -= rawDelta;
    if (comboFadeTimer <= 0) {
      comboDisplay.classList.remove("visible");
      comboDisplay.style.opacity = "0";
    }
  }

  // Apply Screen Shake
  if (shakeIntensity > 0.01) {
    camera.position.x += (Math.random() - 0.5) * shakeIntensity;
    camera.position.y += (Math.random() - 0.5) * shakeIntensity;
    camera.position.z += (Math.random() - 0.5) * shakeIntensity;
    shakeIntensity *= shakeDecay; // Rapidly fade out
  } else {
    shakeIntensity = 0;
  }

  // Flash Lights Fade Out
  for (let i = flashLights.length - 1; i >= 0; i--) {
    const f = flashLights[i];
    f.intensity *= 0.8; // dim very fast
    if (f.intensity < 0.1) {
      scene.remove(f);
      flashLights.splice(i, 1);
    }
  }

  // Lasers Fade Out
  for (let i = activeLasers.length - 1; i >= 0; i--) {
    const l = activeLasers[i];
    l.life -= delta;
    l.mesh.material.opacity = l.life / 0.3;
    if (l.life <= 0) {
      scene.remove(l.mesh);
      l.mesh.geometry.dispose();
      l.mesh.material.dispose();
      activeLasers.splice(i, 1);
    }
  }

  // Shockwaves Expanding
  for (let i = activeShockwaves.length - 1; i >= 0; i--) {
    const s = activeShockwaves[i];
    s.life -= delta;
    s.scale += delta * 60; // Expands fast
    s.mesh.scale.set(s.scale, s.scale, 1);
    s.mesh.material.opacity = s.life; // Fades out
    if (s.life <= 0) {
      scene.remove(s.mesh);
      s.mesh.geometry.dispose();
      s.mesh.material.dispose();
      activeShockwaves.splice(i, 1);
    }
  }

  // Handle Particles (with Bouncing Physics)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.position.addScaledVector(p.userData.velocity, delta * 60);
    p.userData.velocity.y -= 0.2; // Gravity
    p.rotation.x += p.userData.rotSpeed.x;
    p.rotation.y += p.userData.rotSpeed.y;
    p.scale.multiplyScalar(0.96);

    // Ground Bouncing Physics
    if (p.position.y <= 0 && p.userData.bounces < 2) {
      p.position.y = 0;
      p.userData.velocity.y *= -0.6; // Bounce up losing energy
      p.userData.velocity.x *= 0.8; // Friction
      p.userData.velocity.z *= 0.8;
      p.userData.bounces++;
    } else if (p.position.y < -2 || p.scale.x < 0.05) {
      // Kill if fell off or too small
      scene.remove(p);
      p.geometry.dispose();
      p.material.dispose();
      particles.splice(i, 1);
    }
  }

  // Handle Traffic
  for (let i = 0; i < traffic.length; i++) {
    const car = traffic[i];
    if (car.isAxisX) {
      car.mesh.position.x += car.speed * delta * 4;
      // Loop around bounds
      if (car.mesh.position.x > car.limitPos)
        car.mesh.position.x = -car.limitPos;
      if (car.mesh.position.x < -car.limitPos)
        car.mesh.position.x = car.limitPos;
    } else {
      car.mesh.position.z += car.speed * delta * 4;
      if (car.mesh.position.z > car.limitPos)
        car.mesh.position.z = -car.limitPos;
      if (car.mesh.position.z < -car.limitPos)
        car.mesh.position.z = car.limitPos;
    }
  }

  // Handle Asteroids (Movement and Trail Emitters)
  for (let i = activeAsteroids.length - 1; i >= 0; i--) {
    const ast = activeAsteroids[i];
    ast.mesh.position.y -= ast.speed;

    // Trail Particle
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.8,
    });
    const trailGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.position.copy(ast.mesh.position);
    trail.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      Math.random() * 1,
      (Math.random() - 0.5) * 0.5,
    );
    trail.userData.rotSpeed = new THREE.Vector3(0.1, 0.1, 0.1);
    trail.userData.bounces = 2; // dont bounce
    scene.add(trail);
    particles.push(trail);

    const targetH = ast.targetMesh.userData.parentGroup.userData.maxHeight;
    // Collision Math
    if (ast.mesh.position.y <= targetH) {
      // Explode
      ast.mesh.visible = false;
      triggerExplosion(
        ast.targetMesh.userData.parentGroup.position,
        targetH,
        true,
      );
      spawnCrater(ast.targetMesh.userData.parentGroup.position, "asteroid");
      spawnFloatingText(ast.targetMesh.userData.parentGroup.position, "+1");
      registerDestruction();
      triggerBulletTime(); // Dramatic slow-mo
      cityGroup.remove(ast.targetMesh.userData.parentGroup);

      scene.remove(ast.mesh);
      ast.mesh.geometry.dispose();
      ast.mesh.material.dispose();
      activeAsteroids.splice(i, 1);
      updateUI();
    }
  }

  // Handle Fire (Shrinking and Charring)
  for (let i = activeFires.length - 1; i >= 0; i--) {
    const fire = activeFires[i];
    const group = fire.parentGroup;

    // Scale down Y axis
    group.scale.y -= fire.burnRate * delta * 60;

    // Charring Lerp (Fade ALL child blocks to black)
    group.children.forEach((child) => {
      if (child.material) {
        const targetChar = new THREE.Color(0x111111);
        child.material.color.lerp(targetChar, 0.05);
        if (child.material.emissive) {
          child.material.emissive.lerp(targetChar, 0.05);
        }
      }
    });

    // Spawn small fire particles around base
    if (Math.random() > 0.5) {
      const fGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const fMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xff4400 : 0xffaa00,
      });
      const p = new THREE.Mesh(fGeo, fMat);
      p.position.set(
        group.position.x + (Math.random() - 0.5) * 3,
        1,
        group.position.z + (Math.random() - 0.5) * 3,
      );
      p.userData.velocity = new THREE.Vector3(0, Math.random() * 0.2 + 0.1, 0); // float up
      p.userData.rotSpeed = new THREE.Vector3(0.1, 0.1, 0.1);
      p.userData.bounces = 2; // dont bounce fire specs
      scene.add(p);
      particles.push(p); // use same cleanup array
    }

    if (group.scale.y <= 0.05) {
      spawnCrater(group.position, "fire");
      spawnFloatingText(group.position, "+1");
      registerDestruction();
      cityGroup.remove(group);
      activeFires.splice(i, 1);
      updateUI();
    }
  }

  // Handle Monsters (AI Loop)
  for (let i = activeMonsters.length - 1; i >= 0; i--) {
    const monster = activeMonsters[i];

    // Cooldown state
    if (monster.cooldown > 0) {
      monster.cooldown -= delta;
      // Idle animation (breathing)
      monster.meshGroup.scale.y = 1 + Math.sin(clock.elapsedTime * 4) * 0.05;
      continue;
    }

    // Find nearest target if none
    if (
      !monster.currentTarget ||
      !monster.currentTarget.userData.targetable ||
      monster.currentTarget.parent !== cityGroup
    ) {
      let closest = null;
      let minD = Infinity;

      // Get all alive Parent Groups
      const aliveGroups = [
        ...new Set(
          buildings
            .filter((b) => b.userData.parentGroup.userData.targetable)
            .map((b) => b.userData.parentGroup),
        ),
      ];

      if (aliveGroups.length === 0) {
        monster.cooldown = 1; // Sleep if city is gone
        continue;
      }

      aliveGroups.forEach((g) => {
        const d = g.position.distanceTo(monster.meshGroup.position);
        if (d < minD) {
          minD = d;
          closest = g;
        }
      });

      monster.currentTarget = closest;
    }

    // Move toward target
    if (monster.currentTarget) {
      const targetPos = monster.currentTarget.position.clone();
      const monsterPos = monster.meshGroup.position;

      // Look at target (smooth)
      const lookV = targetPos.clone().sub(monsterPos);
      monster.meshGroup.rotation.y = Math.atan2(lookV.x, lookV.z);

      // Move
      const distance = lookV.length();
      if (distance > 2.0) {
        // Keep walking
        lookV.normalize();
        monsterPos.addScaledVector(lookV, monster.speed * delta);

        // Waddle animation
        monster.meshGroup.rotation.z = Math.sin(clock.elapsedTime * 10) * 0.1;
      } else {
        // Reached target! Smash it!
        monster.currentTarget.userData.targetable = false;
        triggerExplosion(
          monster.currentTarget.position,
          monster.currentTarget.userData.maxHeight,
          true,
        ); // True = Big Explosion
        spawnCrater(monster.currentTarget.position, "monster");
        spawnFloatingText(monster.currentTarget.position, "+1");
        registerDestruction();
        triggerBulletTime(); // Dramatic slow-mo
        cityGroup.remove(monster.currentTarget);
        updateUI();
        SFX.playFootstep(); // Kaiju stomp SFX

        monster.currentTarget = null;
        monster.cooldown = 4.0; // Wait 4 seconds
        // Reset rotation
        monster.meshGroup.rotation.z = 0;
        monster.meshGroup.scale.y = 1;
      }
    }
  }

  // Rotate stars slowly for a living sky
  stars.rotation.y += delta * 0.02;

  // Handle Rain
  const rPositions = rain.geometry.attributes.position.array;
  for (let i = 0; i < rainCount; i++) {
    rPositions[i * 3 + 1] -= 0.8; // fall speed
    if (rPositions[i * 3 + 1] < 0) {
      rPositions[i * 3 + 1] = 70 + Math.random() * 10; // Reset to top
    }
  }
  rain.geometry.attributes.position.needsUpdate = true;

  // Handle Lightning
  lightningTimer -= delta;
  if (lightningTimer <= 0) {
    // Flash!
    lightningFlash = new THREE.PointLight(0xffffff, 8, 200);
    lightningFlash.position.set(
      (Math.random() - 0.5) * 60,
      60,
      (Math.random() - 0.5) * 60,
    );
    scene.add(lightningFlash);
    lightningTimer = Math.random() * 10 + 8; // reset timer
    SFX.playThunder();
    addScreenShake(0.3); // subtle rumble
  }
  // Fade lightning
  if (lightningFlash) {
    lightningFlash.intensity *= 0.7;
    if (lightningFlash.intensity < 0.1) {
      scene.remove(lightningFlash);
      lightningFlash = null;
    }
  }

  renderer.render(scene, camera);
}

// --- Starfield Sky ---
const starCount = 500;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPositions[i * 3] = (Math.random() - 0.5) * 200;
  starPositions[i * 3 + 1] = 80 + Math.random() * 40; // High above city
  starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.3,
  transparent: true,
  opacity: 0.7,
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// --- Rain System ---
const rainCount = 2000;
const rainGeo = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);
for (let i = 0; i < rainCount; i++) {
  rainPositions[i * 3] = (Math.random() - 0.5) * 120; // x
  rainPositions[i * 3 + 1] = Math.random() * 80; // y
  rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 120; // z
}
rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
const rainMat = new THREE.PointsMaterial({
  color: 0x8888cc,
  size: 0.15,
  transparent: true,
  opacity: 0.5,
});
const rain = new THREE.Points(rainGeo, rainMat);
scene.add(rain);

// Lightning state
let lightningTimer = Math.random() * 10 + 8; // 8-18 seconds between strikes
let lightningFlash = null;

// Start
activeMonsters.length = 0; // reset
activeLasers.length = 0;
activeShockwaves.length = 0;
createCity();
animate();
