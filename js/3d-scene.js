import * as THREE from "three";

// Setup basic scene
const container = document.getElementById("cat-canvas-container");
if (!container) {
  console.warn(
    "3D Scene: Container #cat-canvas-container not found. Skipping initialization.",
  );
} else {
  const scene = new THREE.Scene();

  // Camera setup
  const getCameraZ = () => (window.innerWidth < 768 ? 6 : 4);
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.z = getCameraZ();

  // Renderer setup with alpha true for transparent background
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(5, 8, 5);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0xffecd1, 0.5); // Warm fill
  fillLight.position.set(-5, 0, 5);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0xd1e8ff, 0.8); // Cool rim light
  backLight.position.set(0, 5, -5);
  scene.add(backLight);

  // Group to hold the cat models (main + outline)
  const catGroup = new THREE.Group();
  scene.add(catGroup);

  // --- Create Improved Procedural CUTE Brown Cat ---
  const buildProceduralCat = () => {
    // Colors
    const brownColor = 0x8d6e63; // Warm brown
    const pinkColor = 0xf48fb1; // Cute pink for nose/ears
    const eyeColor = 0xa5d6a7; // Soft green
    const pupilColor = 0x111111; // Almost black
    const whiskerColor = 0x4e342e; // Dark brown for whiskers

    // Materials
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: brownColor,
      roughness: 0.6,
      metalness: 0.1,
    });

    const pinkMaterial = new THREE.MeshStandardMaterial({
      color: pinkColor,
      roughness: 0.4,
      metalness: 0.1,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: eyeColor,
      roughness: 0.1, // Shiny eyes
      metalness: 0.3,
    });

    const darkMaterial = new THREE.MeshBasicMaterial({ color: pupilColor });
    const whiskerMat = new THREE.MeshBasicMaterial({ color: whiskerColor });

    const cat = new THREE.Group();

    // 1. Head (Squished Sphere)
    const headGeo = new THREE.SphereGeometry(1, 64, 64);
    // Make it wide and slightly flat at the bottom, chubbier cheeks
    headGeo.scale(1.2, 0.95, 1.05);
    const head = new THREE.Mesh(headGeo, baseMaterial);
    cat.add(head);

    // 2. Ears
    const earGeo = new THREE.ConeGeometry(0.35, 0.9, 32);
    earGeo.translate(0, 0.45, 0); // Origin at base

    const innerEarGeo = new THREE.ConeGeometry(0.2, 0.7, 16);
    innerEarGeo.translate(0, 0.35, 0.05); // slightly foreground

    // Left Ear
    const earGroupL = new THREE.Group();
    const earL = new THREE.Mesh(earGeo, baseMaterial);
    const innerEarL = new THREE.Mesh(innerEarGeo, pinkMaterial);
    earGroupL.add(earL);
    earGroupL.add(innerEarL);
    earGroupL.position.set(-0.7, 0.5, 0);
    earGroupL.rotation.z = 0.3;
    earGroupL.rotation.x = -0.1;
    cat.add(earGroupL);

    // Right Ear
    const earGroupR = new THREE.Group();
    const earR = new THREE.Mesh(earGeo, baseMaterial);
    const innerEarR = new THREE.Mesh(innerEarGeo, pinkMaterial);
    earGroupR.add(earR);
    earGroupR.add(innerEarR);
    earGroupR.position.set(0.7, 0.5, 0);
    earGroupR.rotation.z = -0.3;
    earGroupR.rotation.x = -0.1;
    cat.add(earGroupR);

    // 3. Eyes
    const eyeBaseGeo = new THREE.SphereGeometry(0.18, 32, 32);
    eyeBaseGeo.scale(1, 1.1, 0.6); // slightly tall and flat on Z

    const pupilGeo = new THREE.SphereGeometry(0.08, 16, 16);
    pupilGeo.scale(0.5, 1.3, 0.4); // cat slit pupil

    // Left Eye
    const eyeGroupL = new THREE.Group();
    const eyeL = new THREE.Mesh(eyeBaseGeo, eyeMaterial);
    const pupilL = new THREE.Mesh(pupilGeo, darkMaterial);
    pupilL.position.z = 0.12; // bulge out slightly
    eyeGroupL.add(eyeL);
    eyeGroupL.add(pupilL);
    eyeGroupL.position.set(-0.45, 0.1, 0.95);
    // Slight rotation mapping head curve
    eyeGroupL.rotation.y = -0.2;
    eyeGroupL.rotation.x = -0.1;
    cat.add(eyeGroupL);

    // Right Eye
    const eyeGroupR = new THREE.Group();
    const eyeR = new THREE.Mesh(eyeBaseGeo, eyeMaterial);
    const pupilR = new THREE.Mesh(pupilGeo, darkMaterial);
    pupilR.position.z = 0.12;
    eyeGroupR.add(eyeR);
    eyeGroupR.add(pupilR);
    eyeGroupR.position.set(0.45, 0.1, 0.95);
    eyeGroupR.rotation.y = 0.2;
    eyeGroupR.rotation.x = -0.1;
    cat.add(eyeGroupR);

    // 4. Nose
    const noseGeo = new THREE.ConeGeometry(0.1, 0.12, 3); // triangle
    noseGeo.rotateX(Math.PI / 2);
    noseGeo.rotateY(Math.PI); // point down
    noseGeo.scale(1.5, 1, 1);
    const nose = new THREE.Mesh(noseGeo, pinkMaterial);
    nose.position.set(0, -0.15, 1.05);
    cat.add(nose);

    // 5. Mouth (Muzzle)
    const muzzleGeo = new THREE.SphereGeometry(0.2, 32, 32);
    muzzleGeo.scale(1.2, 0.8, 0.5); // Wide and flat

    // We'll use a slightly lighter brown for the muzzle to make it cute
    const muzzleMaterial = new THREE.MeshStandardMaterial({
      color: 0xa1887f,
      roughness: 0.7,
    });

    const muzzleL = new THREE.Mesh(muzzleGeo, muzzleMaterial);
    muzzleL.position.set(-0.15, -0.3, 1.0);
    cat.add(muzzleL);

    const muzzleR = new THREE.Mesh(muzzleGeo, muzzleMaterial);
    muzzleR.position.set(0.15, -0.3, 1.0);
    cat.add(muzzleR);

    // 6. Whiskers
    const whiskerGeo = new THREE.CylinderGeometry(0.015, 0.005, 0.8, 8);
    whiskerGeo.rotateZ(Math.PI / 2); // Lay horizontal
    whiskerGeo.translate(0.4, 0, 0); // Origin at root

    // Generate Whisker Group
    const createWhiskerSide = (isLeft) => {
      const wGroup = new THREE.Group();
      const sideMult = isLeft ? -1 : 1;

      for (let i = 0; i < 3; i++) {
        const w = new THREE.Mesh(whiskerGeo, whiskerMat);
        // Spread them vertically
        w.rotation.z = (i - 1) * 0.2 * sideMult;
        // Angle them back slightly
        w.rotation.y = 0.2 * sideMult;

        if (isLeft) {
          // Flip along Y essentially for left side geometry (since origin is at root +0.4)
          w.scale.x = -1;
        }
        wGroup.add(w);
      }
      return wGroup;
    };

    const whiskersL = createWhiskerSide(true);
    whiskersL.position.set(-0.5, -0.15, 0.9);
    cat.add(whiskersL);

    const whiskersR = createWhiskerSide(false);
    whiskersR.position.set(0.5, -0.15, 0.9);
    cat.add(whiskersR);

    return cat;
  };

  // Generate base brown cute cat
  const baseCat = buildProceduralCat();

  // Generate outline cat (clone, slightly larger, backside black)
  // For outlines, we want a simplified geometry to prevent weird overlaps with complex parts like whiskers
  // But since the inverse hull method is simple scale-based, we'll traverse and only keep large meshes
  const outlineCat = baseCat.clone();
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0x0c0908, // Very dark off-black
    side: THREE.BackSide,
  });

  // Remove small details from outline and apply material
  const toRemoveFromOutline = [];
  outlineCat.traverse((node) => {
    if (node.isMesh) {
      // Simple heuristic: if it's very small or a generic BasicMaterial (like whiskers/pupils), skip outlining it
      if (
        node.geometry.type === "CylinderGeometry" ||
        node.material.type === "MeshBasicMaterial"
      ) {
        toRemoveFromOutline.push(node);
      } else {
        node.material = outlineMaterial;
      }
    }
  });

  // Clean up outline meshes we don't need outlined
  toRemoveFromOutline.forEach((node) => {
    if (node.parent) node.parent.remove(node);
  });

  // Scale up outline
  outlineCat.scale.setScalar(1.04);

  catGroup.add(baseCat);
  catGroup.add(outlineCat);

  // Adjust initial rotation and scale for viewing
  catGroup.rotation.y = -0.15;
  catGroup.rotation.x = 0.05;
  catGroup.scale.setScalar(1.1); // Reduced from 1.4 to make it a little smaller

  catGroup.userData = {
    time: 0,
    startY: catGroup.position.y,
  };

  // Mouse interaction tracking
  const mouse = new THREE.Vector2();
  const targetRotation = new THREE.Vector2();
  const windowHalf = new THREE.Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2,
  );

  document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX - windowHalf.x;
    mouse.y = event.clientY - windowHalf.y;

    // Calculate target rotation based on mouse position
    targetRotation.y = mouse.x * 0.0015; // slightly more responsive
    targetRotation.x = mouse.y * 0.001;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Idle floating animation
    catGroup.userData.time += delta;
    catGroup.position.y =
      catGroup.userData.startY + Math.sin(catGroup.userData.time * 1.5) * 0.08;

    // Interactive subtle rotation based on mouse
    // adding a tiny bounce effect for cuteness
    catGroup.rotation.y += (targetRotation.y - catGroup.rotation.y) * 0.08;
    catGroup.rotation.x += (targetRotation.x - catGroup.rotation.x) * 0.08;

    renderer.render(scene, camera);
  }

  // Handle Window Resize
  window.addEventListener("resize", () => {
    if (!container) return;

    windowHalf.x = window.innerWidth / 2;
    windowHalf.y = window.innerHeight / 2;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.position.z = getCameraZ();
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate();
}
