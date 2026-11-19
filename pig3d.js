/* ==========================================================================
   Groin & Truffes — Barnabé 3D Pixar-Style Character & Woodland Stage
   Powered by Three.js (local vendor bundle, tuned for iPhone & iPad 60fps)
   ========================================================================== */

import * as THREE from './vendor/three.module.min.js';

const SPOT_COUNT = 10;
const TRAIL_START_X = -5.2;
const TRAIL_END_X = 5.2;

function getSpotPosition(idx) {
  const clamped = Math.max(0, Math.min(SPOT_COUNT - 1, idx));
  const t = clamped / (SPOT_COUNT - 1);
  const x = TRAIL_START_X + (TRAIL_END_X - TRAIL_START_X) * t;
  const z = Math.sin(t * Math.PI * 1.35) * 0.36;
  return { x, z };
}

/* ==========================================================================
   Procedural Canvas Textures (Sky Gradient, Soft Cheek Blush, "+1" Badge)
   ========================================================================== */
function createSkyTexture() {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 256;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.0, '#7ecbf4');
  grad.addColorStop(0.35, '#b6e6fb');
  grad.addColorStop(0.68, '#e3f7ee');
  grad.addColorStop(1.0, '#fff5dc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBlushTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  g.addColorStop(0, 'rgba(255, 102, 140, 0.65)');
  g.addColorStop(0.55, 'rgba(255, 118, 152, 0.28)');
  g.addColorStop(1, 'rgba(255, 118, 152, 0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createIrisTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  // Rich Pixar warm chestnut-amber iris with dark limbal ring & bottom glow!
  const bg = ctx.createRadialGradient(128, 128, 30, 128, 128, 124);
  bg.addColorStop(0.0, '#120805');
  bg.addColorStop(0.46, '#140906');
  bg.addColorStop(0.50, '#4f2918');
  bg.addColorStop(0.76, '#7a4124');
  bg.addColorStop(0.90, '#3a1c10');
  bg.addColorStop(1.0, '#1d0d08');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 256);

  // Warm golden-amber lower iris crescent glow (classic Pixar eye soulfulness!)
  const glow = ctx.createRadialGradient(128, 178, 8, 128, 178, 72);
  glow.addColorStop(0, 'rgba(240, 168, 88, 0.68)');
  glow.addColorStop(0.6, 'rgba(204, 118, 52, 0.28)');
  glow.addColorStop(1, 'rgba(204, 118, 52, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(128, 128, 116, 0, Math.PI * 2);
  ctx.fill();

  // Crisp pupil center
  ctx.fillStyle = '#0c0504';
  ctx.beginPath();
  ctx.arc(128, 128, 60, 0, Math.PI * 2);
  ctx.fill();

  // Dual bright Pixar specular catchlights baked cleanly onto the eye!
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(94, 86, 26, 22, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(166, 162, 11, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPlusOneSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 96;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 128, 96);
  ctx.font = '900 58px ui-rounded, "SF Pro Rounded", "Nunito", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 13;
  ctx.strokeStyle = '#5a3308';
  ctx.strokeText('+1', 64, 52);
  const grad = ctx.createLinearGradient(0, 16, 0, 80);
  grad.addColorStop(0, '#fff7a8');
  grad.addColorStop(0.55, '#ffdf4d');
  grad.addColorStop(1, '#f5a623');
  ctx.fillStyle = grad;
  ctx.fillText('+1', 64, 52);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSparkleTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,252,210,1)');
  g.addColorStop(0.35, 'rgba(255,224,96,0.85)');
  g.addColorStop(1, 'rgba(255,224,96,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ==========================================================================
   Organic Sculpted Geometries for Pixar-Smooth Piglet Head & Ears
   ========================================================================== */
function createSculptedPixarHeadGeo() {
  const geo = new THREE.SphereGeometry(0.53, 44, 34);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Subtle pear-shaped Pixar baby cranium: slightly rounder crown, fuller lower cheeks!
    const normY = y / 0.53;
    const normX = x / 0.53;
    const absZ = Math.abs(z) / 0.53;

    // Gentle chubby cheek fullness in lower-front-sides (100% seamless!)
    const cheekFactor =
      Math.exp(-Math.pow((normY + 0.24) / 0.44, 2)) *
      Math.exp(-Math.pow((normX - 0.22) / 0.58, 2)) *
      Math.pow(absZ, 0.85);
    z *= 1.04 + cheekFactor * 0.14;
    x *= 1.02 + cheekFactor * 0.05;

    // Slightly taller adorable forehead, gentle soft jaw
    y *= 0.96;
    if (normY < -0.45 && normX > 0.1) {
      x += 0.025 * (-normY - 0.45);
    }

    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

function createSculptedPixarEarGeo(side) {
  // Single seamless organic floppy piglet ear with curved forward tip!
  const geo = new THREE.SphereGeometry(0.24, 26, 22);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Map y from [-0.24, 0.24] to u in [0, 1] (base to tip)
    const u = (y + 0.24) / 0.48;

    // Smooth teardrop leaf width: widest around u = 0.35, soft rounded tip at u = 1
    const widthProfile = Math.sin(Math.pow(u, 0.72) * Math.PI);
    const thickness = 0.34 * (1 - 0.35 * u);

    // Elongate height cleanly
    let ny = u * 0.48;
    let nx = x * (0.64 + widthProfile * 0.50);
    let nz = z * thickness;

    // Cute soft forward flop near the upper tip (balanced Pixar silhouette!)
    const droop = Math.pow(Math.max(0, u - 0.32) / 0.68, 2.0);
    nx += droop * 0.15;
    ny -= droop * 0.08;
    nz += side * droop * 0.05;

    // Slight concave cup facing forward-outward
    if (z * side > 0) {
      nz -= side * 0.018 * widthProfile;
    }

    pos.setXYZ(i, nx, ny, nz);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ==========================================================================
   Pixar-Style 3D Barnabé Character Builder
   ========================================================================== */
function buildPixarPiglet() {
  const pigRoot = new THREE.Group();

  // Warm luminous peach-pink Pixar skin with subsurface-like sheen & soft warm bounce!
  const skinMat = new THREE.MeshPhysicalMaterial({
    color: 0xffb3c6,
    emissive: 0x3d1220,
    emissiveIntensity: 0.16,
    roughness: 0.48,
    metalness: 0.0,
    sheen: 0.65,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color(0xffeaf0),
    clearcoat: 0.08,
    clearcoatRoughness: 0.65
  });

  const bellyMat = new THREE.MeshPhysicalMaterial({
    color: 0xffdee8,
    emissive: 0x3b1824,
    emissiveIntensity: 0.14,
    roughness: 0.56,
    metalness: 0.0,
    sheen: 0.5,
    sheenColor: new THREE.Color(0xfff5f8)
  });

  const snoutMat = new THREE.MeshPhysicalMaterial({
    color: 0xff7fa0,
    emissive: 0x3a0f1d,
    emissiveIntensity: 0.14,
    roughness: 0.28,
    metalness: 0.0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.24,
    sheen: 0.35,
    sheenColor: new THREE.Color(0xffccd9)
  });

  const innerEarMat = new THREE.MeshStandardMaterial({
    color: 0xf46d91,
    emissive: 0x360c18,
    emissiveIntensity: 0.15,
    roughness: 0.62
  });

  const blushMat = new THREE.MeshBasicMaterial({
    map: createBlushTexture(),
    transparent: true,
    depthWrite: false
  });

  const nostrilMat = new THREE.MeshStandardMaterial({
    color: 0x5c192b,
    roughness: 0.38
  });

  const hoofMat = new THREE.MeshStandardMaterial({
    color: 0x4f3021,
    roughness: 0.36,
    metalness: 0.06
  });

  const bandanaMat = new THREE.MeshPhysicalMaterial({
    color: 0xde3526,
    emissive: 0x240604,
    emissiveIntensity: 0.12,
    roughness: 0.68,
    sheen: 0.4,
    sheenColor: new THREE.Color(0xff8e84)
  });

  const polkaDotMat = new THREE.MeshStandardMaterial({
    color: 0xfffaf0,
    roughness: 0.55
  });

  const scleraMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0x22201e,
    emissiveIntensity: 0.18,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04
  });

  const irisTex = createIrisTexture();
  const irisDiscMat = new THREE.MeshPhysicalMaterial({
    map: irisTex,
    roughness: 0.08,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03
  });

  const darkLineMat = new THREE.MeshStandardMaterial({
    color: 0x2b1410,
    roughness: 0.35
  });

  const browMat = new THREE.MeshStandardMaterial({
    color: 0xb8506e,
    roughness: 0.65
  });

  // Main body group (for bounce, squash & stretch)
  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, 0.70, 0);
  pigRoot.add(bodyGroup);

  // Chubby pear-shaped Pixar baby piglet body
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.55, 36, 26), skinMat);
  torso.scale.set(1.22, 0.94, 0.98);
  torso.castShadow = true;
  torso.receiveShadow = true;
  bodyGroup.add(torso);

  // Soft cream-pink tummy
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 18), bellyMat);
  belly.scale.set(1.12, 0.78, 0.88);
  belly.position.set(0.04, -0.14, 0);
  belly.receiveShadow = true;
  bodyGroup.add(belly);

  // True 3D Helical Corkscrew Tail!
  const tailPivot = new THREE.Group();
  tailPivot.position.set(-0.64, 0.12, 0);
  bodyGroup.add(tailPivot);

  const tailPts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const angle = t * Math.PI * 3.3;
    const radius = 0.052 + t * 0.045;
    const tx = -0.03 - t * 0.27;
    const ty = 0.04 + t * 0.18 + Math.sin(angle) * radius;
    const tz = Math.cos(angle) * radius - radius * 0.45;
    tailPts.push(new THREE.Vector3(tx, ty, tz));
  }
  const tailCurve = new THREE.CatmullRomCurve3(tailPts);
  const tailMesh = new THREE.Mesh(
    new THREE.TubeGeometry(tailCurve, 30, 0.036, 10, false),
    snoutMat
  );
  tailMesh.castShadow = true;
  tailPivot.add(tailMesh);

  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), snoutMat);
  tailTip.position.copy(tailPts[tailPts.length - 1]);
  tailPivot.add(tailTip);

  // 4 Articulated Stubby Piglet Legs with Cute Cloven Trotters
  function buildLeg(x, z) {
    const legPivot = new THREE.Group();
    legPivot.position.set(x, -0.25, z);

    const upperLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.125, 0.16, 10, 16), skinMat);
    upperLeg.position.y = -0.14;
    upperLeg.castShadow = true;
    upperLeg.receiveShadow = true;
    legPivot.add(upperLeg);

    // Split dark-cocoa hooves
    const hoofGroup = new THREE.Group();
    hoofGroup.position.set(0.02, -0.34, 0);
    const toeGeo = new THREE.SphereGeometry(0.072, 12, 10);
    toeGeo.scale(1.25, 0.85, 0.72);
    const toeL = new THREE.Mesh(toeGeo, hoofMat);
    toeL.position.set(0.01, 0, -0.042);
    toeL.castShadow = true;
    const toeR = new THREE.Mesh(toeGeo, hoofMat);
    toeR.position.set(0.01, 0, 0.042);
    toeR.castShadow = true;
    hoofGroup.add(toeL, toeR);
    legPivot.add(hoofGroup);

    bodyGroup.add(legPivot);
    return legPivot;
  }

  const legs = {
    fl: buildLeg(0.32, -0.26),
    fr: buildLeg(0.32, 0.26),
    bl: buildLeg(-0.36, -0.27),
    br: buildLeg(-0.36, 0.27)
  };

  // Signature Périgord Red Polka-Dot Bandana (prominent & cozy around neck/chest!)
  const bandanaGroup = new THREE.Group();
  bandanaGroup.position.set(0.38, 0.12, 0);
  bandanaGroup.rotation.z = -0.58;
  bodyGroup.add(bandanaGroup);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.075, 14, 30), bandanaMat);
  collar.rotation.x = Math.PI / 2;
  collar.castShadow = true;
  bandanaGroup.add(collar);

  // Cute front kerchief triangle hanging down the chest
  const bib = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.42, 4), bandanaMat);
  bib.position.set(0.30, -0.18, 0);
  bib.rotation.z = Math.PI + 0.48;
  bib.rotation.y = Math.PI / 4;
  bib.scale.set(0.55, 1.0, 1.25);
  bib.castShadow = true;
  bandanaGroup.add(bib);

  // Crisp white polka dots across bandana & chest triangle
  const dotGeo = new THREE.SphereGeometry(0.028, 10, 8);
  [
    [0.42, -0.02, 0.12],
    [0.42, -0.02, -0.12],
    [0.39, -0.16, 0.07],
    [0.39, -0.16, -0.07],
    [0.33, -0.27, 0.0],
    [0.24, 0.01, 0.36],
    [0.24, 0.01, -0.36],
    [0.02, 0.03, 0.43],
    [0.02, 0.03, -0.43]
  ].forEach(([dx, dy, dz]) => {
    const d = new THREE.Mesh(dotGeo, polkaDotMat);
    d.position.set(dx, dy, dz);
    bandanaGroup.add(d);
  });

  // Back knot + cute tails
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), bandanaMat);
  knot.position.set(-0.41, 0.05, 0);
  bandanaGroup.add(knot);

  // ========================================================================
  // Expressive Sculpted Pixar Head Rig
  // ========================================================================
  const headPivot = new THREE.Group();
  headPivot.position.set(0.54, 0.38, 0);
  bodyGroup.add(headPivot);

  // Seamless sculpted Pixar cranium with integrated chubby cheeks!
  const headMesh = new THREE.Mesh(createSculptedPixarHeadGeo(), skinMat);
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;
  headPivot.add(headMesh);

  // Soft watercolor-style rosy blush overlays curved right against cheeks
  const blushGeo = new THREE.CircleGeometry(0.145, 22);
  const blushL = new THREE.Mesh(blushGeo, blushMat);
  blushL.position.set(0.33, -0.11, -0.42);
  blushL.rotation.y = Math.PI - 0.65;
  const blushR = new THREE.Mesh(blushGeo, blushMat);
  blushR.position.set(0.33, -0.11, 0.42);
  blushR.rotation.y = 0.65;
  headPivot.add(blushL, blushR);

  // Sculpted Glossy Snout (Groin) nestled warmly into lower face
  const snoutGroup = new THREE.Group();
  snoutGroup.position.set(0.49, -0.09, 0);
  headPivot.add(snoutGroup);

  const snoutPad = new THREE.Mesh(new THREE.SphereGeometry(0.22, 30, 22), snoutMat);
  snoutPad.scale.set(0.68, 0.76, 1.10);
  snoutPad.castShadow = true;
  snoutGroup.add(snoutPad);

  const snoutRim = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.042, 14, 28), snoutMat);
  snoutRim.rotation.y = Math.PI / 2;
  snoutRim.scale.set(1.10, 0.76, 0.62);
  snoutRim.position.x = 0.068;
  snoutGroup.add(snoutRim);

  // Cute oval nostrils angled gently outward
  const nostrilGeo = new THREE.SphereGeometry(0.044, 14, 12);
  nostrilGeo.scale(0.50, 1.24, 0.74);
  const nostrilL = new THREE.Mesh(nostrilGeo, nostrilMat);
  nostrilL.position.set(0.146, 0.012, -0.084);
  nostrilL.rotation.x = 0.18;
  const nostrilR = new THREE.Mesh(nostrilGeo, nostrilMat);
  nostrilR.position.set(0.146, 0.012, 0.084);
  nostrilR.rotation.x = -0.18;
  snoutGroup.add(nostrilL, nostrilR);

  // Sweet Warm Smile tucked neatly beneath snout
  const smileCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.42, -0.215, -0.13),
    new THREE.Vector3(0.47, -0.268, -0.055),
    new THREE.Vector3(0.485, -0.28, 0),
    new THREE.Vector3(0.47, -0.268, 0.055),
    new THREE.Vector3(0.42, -0.215, 0.13)
  ]);
  const smileMesh = new THREE.Mesh(
    new THREE.TubeGeometry(smileCurve, 20, 0.016, 8, false),
    nostrilMat
  );
  headPivot.add(smileMesh);

  // Adorable tiny forehead hair curl (auto-hides when wearing a hat!)
  const tuftGroup = new THREE.Group();
  tuftGroup.position.set(0.18, 0.49, 0);
  const tuftCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.06, 0.09, 0.02),
    new THREE.Vector3(0.12, 0.06, 0.03)
  ]);
  const tuft1 = new THREE.Mesh(new THREE.TubeGeometry(tuftCurve, 12, 0.028, 8, false), snoutMat);
  const tuftTip = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), snoutMat);
  tuftTip.position.set(0.12, 0.06, 0.03);
  tuftGroup.add(tuft1, tuftTip);
  headPivot.add(tuftGroup);

  // Big Soulful Glossy Pixar Eyes (properly positioned on skull curve with curved domed iris!)
  function createCurvedIrisGeo(radius) {
    const geo = new THREE.CircleGeometry(radius, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const rNorm = Math.min(1, Math.hypot(vx, vy) / radius);
      // Gentle convex dome wrapping tightly onto sclera front
      pos.setZ(i, 0.028 * (1 - rNorm * rNorm));
    }
    geo.computeVertexNormals();
    return geo;
  }
  const curvedIrisGeo = createCurvedIrisGeo(0.106);

  function buildPixarEye(side) {
    // side: -1 = left (-Z), +1 = right (+Z)
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(0.425, 0.105, side * 0.215);
    // Negative Y rotation angles +X toward +Z (right cheek), positive toward -Z (left cheek)
    eyeGroup.rotation.y = -side * 0.36;
    eyeGroup.rotation.z = 0.05;
    headPivot.add(eyeGroup);

    const openGroup = new THREE.Group();
    eyeGroup.add(openGroup);

    // Glossy sclera eyeball nestled right into the sculpted face
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.136, 28, 22), scleraMat);
    sclera.scale.set(0.74, 1.08, 0.96);
    openGroup.add(sclera);

    // Curved glossy Pixar chestnut-amber iris + pupil + dual catchlights facing +X!
    const irisMesh = new THREE.Mesh(curvedIrisGeo, irisDiscMat);
    irisMesh.rotation.y = Math.PI / 2;
    irisMesh.position.set(0.079, 0.0, 0.0);
    openGroup.add(irisMesh);

    // Soft curved upper lash / eyelid line framing the top of the eye
    const lashCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.055, 0.088, -0.105),
      new THREE.Vector3(0.098, 0.140, 0),
      new THREE.Vector3(0.055, 0.088, 0.105)
    ]);
    const lashLine = new THREE.Mesh(
      new THREE.TubeGeometry(lashCurve, 14, 0.015, 8, false),
      darkLineMat
    );
    openGroup.add(lashLine);

    // Smooth blink lid (hidden except during the 130ms natural blink)
    const blinkLid = new THREE.Mesh(
      new THREE.SphereGeometry(0.143, 20, 14),
      skinMat
    );
    blinkLid.scale.set(0.78, 1.10, 0.99);
    blinkLid.visible = false;
    openGroup.add(blinkLid);

    // Happy squinting crescent arc (^ ^)
    const happyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.07, -0.01, -0.095),
      new THREE.Vector3(0.125, 0.072, 0),
      new THREE.Vector3(0.07, -0.01, 0.095)
    ]);
    const happyArc = new THREE.Mesh(
      new THREE.TubeGeometry(happyCurve, 14, 0.022, 8, false),
      darkLineMat
    );
    happyArc.visible = false;
    eyeGroup.add(happyArc);

    // Tiny soft curved eyebrow tucked gently above eye
    const browCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.028, 0.185, -0.065),
      new THREE.Vector3(0.058, 0.208, 0),
      new THREE.Vector3(0.028, 0.190, 0.065)
    ]);
    const brow = new THREE.Mesh(
      new THREE.TubeGeometry(browCurve, 10, 0.014, 8, false),
      browMat
    );
    eyeGroup.add(brow);

    return { eyeGroup, openGroup, blinkLid, happyArc, brow };
  }

  const eyeL = buildPixarEye(-1);
  const eyeR = buildPixarEye(1);

  // Seamless Sculpted Floppy Piglet Ears (balanced upward-and-forward Pixar silhouette!)
  function buildEar(side) {
    const earPivot = new THREE.Group();
    earPivot.position.set(-0.02, 0.35, side * 0.30);
    earPivot.rotation.set(side * 0.28, -side * 0.15, -0.08);
    headPivot.add(earPivot);

    const earOuter = new THREE.Mesh(createSculptedPixarEarGeo(side), skinMat);
    earOuter.castShadow = true;
    earPivot.add(earOuter);

    const earInner = new THREE.Mesh(createSculptedPixarEarGeo(side), innerEarMat);
    earInner.scale.set(0.72, 0.78, 0.60);
    earInner.position.set(0.035, 0.045, side * 0.032);
    earPivot.add(earInner);

    return earPivot;
  }

  const earL = buildEar(-1);
  const earR = buildEar(1);

  // 3D Hat Anchor sitting snugly on Barnabé's crown between his ears
  const hatAnchor = new THREE.Group();
  hatAnchor.position.set(-0.02, 0.48, 0);
  hatAnchor.rotation.z = 0.08;
  headPivot.add(hatAnchor);

  return {
    pigRoot,
    bodyGroup,
    headPivot,
    snoutGroup,
    smileMesh,
    tuftGroup,
    tailPivot,
    legs,
    eyeL,
    eyeR,
    earL,
    earR,
    hatAnchor
  };
}

/* ==========================================================================
   All 7 Collectible 3D Hats (1 New Hat Every 3 Pickle Lollipops!)
   ========================================================================== */
function build3DHat(hatId) {
  const g = new THREE.Group();
  if (!hatId || hatId < 1 || hatId > 7) return g;

  if (hatId === 1) {
    // 1. Le Béret du Truffier (Navy Velvet Beret + Green Cornichon Pin)
    const navyMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a3b6e,
      roughness: 0.68,
      sheen: 0.75,
      sheenColor: new THREE.Color(0x6482cf)
    });
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x1a2547, roughness: 0.72 });
    const pinMat = new THREE.MeshPhysicalMaterial({ color: 0x67c742, roughness: 0.3, clearcoat: 0.5 });

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.33, 0.09, 24), bandMat);
    band.position.y = 0.03;
    g.add(band);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.43, 26, 18), navyMat);
    dome.scale.set(1.08, 0.45, 1.06);
    dome.position.set(-0.06, 0.16, 0.03);
    dome.rotation.z = 0.16;
    dome.castShadow = true;
    g.add(dome);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.11, 8), bandMat);
    stem.position.set(-0.05, 0.36, 0.02);
    stem.rotation.z = -0.25;
    g.add(stem);

    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), pinMat);
    pin.position.set(0.24, 0.16, 0.25);
    g.add(pin);
  } else if (hatId === 2) {
    // 2. Le Chapeau d'Explorateur
    const khakiMat = new THREE.MeshStandardMaterial({ color: 0xe3c088, roughness: 0.72 });
    const brimMat = new THREE.MeshStandardMaterial({ color: 0xcfa466, roughness: 0.75 });
    const greenBand = new THREE.MeshStandardMaterial({ color: 0x3b8c2a, roughness: 0.60 });

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.43, 0.05, 28), brimMat);
    brim.scale.set(1.06, 1.0, 0.96);
    brim.position.y = 0.07;
    brim.castShadow = true;
    g.add(brim);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 0.28, 24), khakiMat);
    crown.position.y = 0.22;
    crown.castShadow = true;
    g.add(crown);

    const crownTop = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 12), khakiMat);
    crownTop.scale.set(1.0, 0.38, 1.0);
    crownTop.position.y = 0.35;
    g.add(crownTop);

    const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.292, 0.306, 0.08, 24), greenBand);
    ribbon.position.y = 0.13;
    g.add(ribbon);
  } else if (hatId === 3) {
    // 3. La Toque de Grand Chef
    const whiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.55,
      sheen: 0.4,
      sheenColor: new THREE.Color(0xeef4ff)
    });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.29, 0.24, 24), whiteMat);
    band.position.y = 0.14;
    band.castShadow = true;
    g.add(band);

    [
      [0, 0.39, 0, 0.23],
      [0.18, 0.33, 0.08, 0.17],
      [-0.18, 0.33, 0.08, 0.17],
      [0.18, 0.33, -0.08, 0.17],
      [-0.18, 0.33, -0.08, 0.17],
      [0, 0.34, 0.18, 0.16],
      [0, 0.34, -0.18, 0.16]
    ].forEach(([px, py, pz, r]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 14), whiteMat);
      puff.position.set(px, py, pz);
      puff.castShadow = true;
      g.add(puff);
    });
  } else if (hatId === 4) {
    // 4. Le Haut-de-Forme Cornichon
    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x227535,
      roughness: 0.42,
      sheen: 0.65,
      sheenColor: new THREE.Color(0x6be080)
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf7c93e, roughness: 0.28, metalness: 0.45 });
    const pickleMat = new THREE.MeshPhysicalMaterial({ color: 0x57c738, roughness: 0.30, clearcoat: 0.5 });

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.42, 0.05, 28), emeraldMat);
    brim.position.y = 0.07;
    brim.castShadow = true;
    g.add(brim);

    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.26, 0.45, 24), emeraldMat);
    cyl.position.y = 0.31;
    cyl.castShadow = true;
    g.add(cyl);

    const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.282, 0.272, 0.10, 24), goldMat);
    ribbon.position.y = 0.15;
    g.add(ribbon);

    const miniPickle = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.13, 8, 12), pickleMat);
    miniPickle.position.set(0.22, 0.25, 0.21);
    miniPickle.rotation.set(0.2, 0, -0.35);
    g.add(miniPickle);
  } else if (hatId === 5) {
    // 5. Le Bicorne des Sous-Bois
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x2b2422, roughness: 0.62 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf7c942, roughness: 0.26, metalness: 0.55 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xd93829, roughness: 0.62 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.31, 0.12, 20), redMat);
    base.position.y = 0.07;
    g.add(base);

    const crest = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 16), darkMat);
    crest.scale.set(0.68, 0.82, 1.32);
    crest.position.y = 0.28;
    crest.castShadow = true;
    g.add(crest);

    const goldTrim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.026, 10, 28), goldMat);
    goldTrim.scale.set(0.72, 0.85, 1.0);
    goldTrim.rotation.y = Math.PI / 2;
    goldTrim.position.y = 0.28;
    g.add(goldTrim);

    const medal = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16), goldMat);
    medal.rotation.z = Math.PI / 2;
    medal.position.set(0.30, 0.26, 0);
    g.add(medal);
  } else if (hatId === 6) {
    // 6. Le Chapeau d'Enchanteur
    const wizMat = new THREE.MeshPhysicalMaterial({
      color: 0x4b389e,
      roughness: 0.50,
      sheen: 0.7,
      sheenColor: new THREE.Color(0x9a86f7)
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffdf4d,
      emissive: 0x8a5d00,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.55
    });

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.05, 28), wizMat);
    brim.position.y = 0.07;
    brim.castShadow = true;
    g.add(brim);

    const lowerCone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.48, 22), wizMat);
    lowerCone.position.set(-0.02, 0.31, 0);
    lowerCone.rotation.z = 0.14;
    lowerCone.castShadow = true;
    g.add(lowerCone);

    const tipCone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 16), wizMat);
    tipCone.position.set(-0.13, 0.57, 0);
    tipCone.rotation.z = 0.65;
    tipCone.castShadow = true;
    g.add(tipCone);

    const band = new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.03, 10, 24), goldMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.12;
    g.add(band);

    const starGeo = new THREE.OctahedronGeometry(0.044, 0);
    [
      [0.21, 0.24, 0.12],
      [0.12, 0.41, -0.09],
      [-0.12, 0.34, 0.16],
      [-0.22, 0.66, 0]
    ].forEach(([sx, sy, sz]) => {
      const star = new THREE.Mesh(starGeo, goldMat);
      star.position.set(sx, sy, sz);
      g.add(star);
    });
  } else if (hatId === 7) {
    // 7. La Couronne Royale Cornichon
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd236,
      roughness: 0.22,
      metalness: 0.72,
      clearcoat: 0.6
    });
    const velvetMat = new THREE.MeshPhysicalMaterial({
      color: 0xc92626,
      roughness: 0.70,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xff7878)
    });
    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x42db32,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      emissive: 0x165c0e,
      emissiveIntensity: 0.38
    });
    const pearlMat = new THREE.MeshPhysicalMaterial({ color: 0xfffbe6, roughness: 0.18, clearcoat: 0.9 });

    const cushion = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 14), velvetMat);
    cushion.scale.set(1.0, 0.78, 1.0);
    cushion.position.y = 0.18;
    g.add(cushion);

    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.29, 0.18, 24), goldMat);
    ring.position.y = 0.10;
    ring.castShadow = true;
    g.add(ring);

    const spikeGeo = new THREE.ConeGeometry(0.085, 0.22, 4);
    const pearlGeo = new THREE.SphereGeometry(0.036, 10, 10);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const sx = Math.cos(a) * 0.30;
      const sz = Math.sin(a) * 0.30;
      const spike = new THREE.Mesh(spikeGeo, goldMat);
      spike.position.set(sx, 0.26, sz);
      spike.rotation.y = -a;
      spike.castShadow = true;
      g.add(spike);

      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(sx, 0.38, sz);
      g.add(pearl);
    }

    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.072, 0), emeraldMat);
    gem.position.set(0.32, 0.13, 0);
    gem.scale.set(0.55, 1.25, 0.95);
    g.add(gem);
  }

  return g;
}

/* ==========================================================================
   Pixar-Style Périgord Truffle Woodland Environment Builder
   ========================================================================== */
function buildWoodlandEnvironment(scene) {
  // Soft sunlit rolling meadow & background hills
  const meadowGeo = new THREE.PlaneGeometry(46, 30, 36, 22);
  meadowGeo.rotateX(-Math.PI / 2);
  const posAttr = meadowGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    let y = 0;
    if (z < -2.2) {
      const dist = -z - 2.2;
      y = Math.sin(x * 0.24) * 0.38 + Math.min(2.7, dist * 0.21);
    } else if (z > 2.8) {
      y = -0.10 * (z - 2.8);
    }
    posAttr.setY(i, y);
  }
  meadowGeo.computeVertexNormals();

  const meadowMat = new THREE.MeshStandardMaterial({
    color: 0x7bc257,
    roughness: 0.90,
    metalness: 0.0
  });
  const meadow = new THREE.Mesh(meadowGeo, meadowMat);
  meadow.receiveShadow = true;
  scene.add(meadow);

  // Softly curved earthy Périgord truffle trail
  const trailPts = [];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    const x = -8.6 + t * 17.6;
    const norm = (x - TRAIL_START_X) / (TRAIL_END_X - TRAIL_START_X);
    const z = Math.sin(Math.max(0, Math.min(1, norm)) * Math.PI * 1.35) * 0.36;
    trailPts.push(new THREE.Vector3(x, 0.012, z));
  }
  const trailCurve = new THREE.CatmullRomCurve3(trailPts);
  const trailGeo = new THREE.TubeGeometry(trailCurve, 64, 0.88, 10, false);
  trailGeo.scale(1, 0.025, 1);
  const trailMat = new THREE.MeshStandardMaterial({
    color: 0xcba173,
    roughness: 0.94
  });
  const trailMesh = new THREE.Mesh(trailGeo, trailMat);
  trailMesh.position.y = 0.01;
  trailMesh.receiveShadow = true;
  scene.add(trailMesh);

  // Stylized Pixar Truffle Oak Trees (Chênes Truffiers)
  function buildOakTree(x, z, scale = 1.0) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x825636, roughness: 0.90 });
    const leafDark = new THREE.MeshStandardMaterial({ color: 0x468e37, roughness: 0.80 });
    const leafMid = new THREE.MeshStandardMaterial({ color: 0x59a845, roughness: 0.76 });
    const leafLight = new THREE.MeshStandardMaterial({ color: 0x73c25b, roughness: 0.72 });
    const acornMat = new THREE.MeshStandardMaterial({ color: 0xcf8e46, roughness: 0.42 });
    const acornCapMat = new THREE.MeshStandardMaterial({ color: 0x6e4522, roughness: 0.85 });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.54, 2.75, 14), barkMat);
    trunk.position.y = 1.32;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    for (let r = 0; r < 4; r++) {
      const ang = (r / 4) * Math.PI * 2 + 0.4;
      const root = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.75, 8), barkMat);
      root.position.set(Math.cos(ang) * 0.44, 0.16, Math.sin(ang) * 0.44);
      root.rotation.z = -Math.cos(ang) * 0.9;
      root.rotation.x = Math.sin(ang) * 0.9;
      tree.add(root);
    }

    const canopy = new THREE.Group();
    canopy.position.y = 2.68;
    tree.add(canopy);

    [
      [0, 0.55, 0, 1.35, leafMid],
      [-1.0, 0.15, 0.25, 1.02, leafDark],
      [0.98, 0.22, -0.15, 0.98, leafDark],
      [-0.35, 0.92, 0.48, 0.88, leafLight],
      [0.52, 0.78, 0.55, 0.82, leafLight],
      [0, 0.25, -0.78, 1.0, leafDark]
    ].forEach(([px, py, pz, pr, mat]) => {
      const p = new THREE.Mesh(new THREE.SphereGeometry(pr, 16, 14), mat);
      p.position.set(px, py, pz);
      p.scale.y = 0.86;
      p.castShadow = true;
      canopy.add(p);
    });

    [[-0.82, -0.42, 0.65], [0.76, -0.36, 0.62]].forEach(([ax, ay, az]) => {
      const acorn = new THREE.Group();
      acorn.position.set(ax, ay, az);
      const nut = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), acornMat);
      nut.scale.set(0.85, 1.15, 0.85);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.115, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.52), acornCapMat);
      cap.position.y = 0.04;
      acorn.add(nut, cap);
      canopy.add(acorn);
    });

    scene.add(tree);
    return canopy;
  }

  const swayCanopies = [
    buildOakTree(7.1, -2.2, 1.12),
    buildOakTree(-7.5, -3.0, 0.94),
    buildOakTree(0.9, -5.8, 0.86)
  ];

  // Cozy sunlit bushes
  const bushMat = new THREE.MeshStandardMaterial({ color: 0x62af4b, roughness: 0.85 });
  [
    [-4.1, 0.35, -3.2, 0.85],
    [-3.4, 0.25, -3.0, 0.60],
    [3.8, 0.35, -3.5, 0.90],
    [4.6, 0.24, -3.3, 0.62],
    [-1.2, 0.32, -3.8, 0.78]
  ].forEach(([bx, by, bz, br]) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(br, 14, 12), bushMat);
    b.scale.set(1.2, 0.78, 1.0);
    b.position.set(bx, by, bz);
    b.castShadow = true;
    scene.add(b);
  });

  // Storybook red-and-white toadstool mushrooms
  const stemMat = new THREE.MeshStandardMaterial({ color: 0xf9eedb, roughness: 0.68 });
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0xe34536, roughness: 0.36, clearcoat: 0.3 });
  const spotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

  function addMushroom(mx, mz, sc = 1) {
    const m = new THREE.Group();
    m.position.set(mx, 0, mz);
    m.scale.setScalar(sc);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.24, 10), stemMat);
    stem.position.y = 0.12;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.20, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.54), capMat);
    cap.position.y = 0.21;
    cap.castShadow = true;
    m.add(stem, cap);
    [[0.09, 0.32, 0.08], [-0.08, 0.30, 0.10], [0.02, 0.37, -0.06]].forEach(([sx, sy, sz]) => {
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), spotMat);
      sp.position.set(sx, sy, sz);
      m.add(sp);
    });
    scene.add(m);
  }

  addMushroom(6.0, 1.05, 1.0);
  addMushroom(6.35, 0.88, 0.65);
  addMushroom(-5.9, -1.25, 0.9);
  addMushroom(-3.6, 1.25, 0.78);
  addMushroom(-1.8, -1.35, 0.82);
  addMushroom(2.5, -1.5, 0.85);

  // Grass tufts & wildflowers softening the trail borders
  const grassBladeMat = new THREE.MeshStandardMaterial({ color: 0x529b39, roughness: 0.82 });
  const flowerColors = [0xfff6a6, 0xffffff, 0xffd1dc];
  const flowerCenterMat = new THREE.MeshStandardMaterial({ color: 0xf7b731, roughness: 0.5 });
  [
    [-5.1, 0.95], [-4.2, -0.95], [-2.8, 1.05], [-1.3, -1.0], [0.2, 1.05],
    [1.7, -1.05], [3.2, 1.0], [4.6, -1.0], [5.5, 0.95]
  ].forEach(([fx, fz], i) => {
    const tuft = new THREE.Group();
    tuft.position.set(fx, 0, fz);
    for (let b = -1; b <= 1; b++) {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 5), grassBladeMat);
      blade.position.set(b * 0.05, 0.10, (b % 2) * 0.03);
      blade.rotation.z = b * -0.26;
      tuft.add(blade);
    }
    if (i % 2 === 0) {
      const petalMat = new THREE.MeshStandardMaterial({ color: flowerColors[i % flowerColors.length], roughness: 0.6 });
      const disc = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), petalMat);
      disc.scale.set(1.2, 0.35, 1.2);
      disc.position.set(0.11, 0.05, 0.06);
      const ctr = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), flowerCenterMat);
      ctr.position.set(0.11, 0.075, 0.06);
      tuft.add(disc, ctr);
    }
    scene.add(tuft);
  });

  // Soft Drifting 3D Clouds & Glowing Warm Sun
  const clouds = [];
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    emissive: 0xfffdf5,
    emissiveIntensity: 0.3
  });
  [
    [-5.8, 5.1, -10.5, 1.05],
    [1.6, 5.6, -12.0, 1.2],
    [8.0, 4.9, -10.0, 0.95]
  ].forEach(([cx, cy, cz, cs]) => {
    const cl = new THREE.Group();
    cl.position.set(cx, cy, cz);
    cl.scale.setScalar(cs);
    [[0, 0, 0, 0.85], [-0.75, -0.1, 0.05, 0.62], [0.78, -0.08, -0.05, 0.68], [0.22, 0.32, 0.1, 0.58]].forEach(([px, py, pz, r]) => {
      const p = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), cloudMat);
      p.position.set(px, py, pz);
      cl.add(p);
    });
    scene.add(cl);
    clouds.push({ group: cl, baseX: cx });
  });

  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 18, 16),
    new THREE.MeshBasicMaterial({ color: 0xffea8a })
  );
  sunMesh.position.set(-7.2, 5.7, -13.5);
  scene.add(sunMesh);

  // 10 Interactive 3D Truffle Dirt Mounds
  const undugMat = new THREE.MeshStandardMaterial({ color: 0x8a5c36, roughness: 0.94 });
  const dugOuterMat = new THREE.MeshStandardMaterial({ color: 0x694225, roughness: 0.96 });
  const dugHoleMat = new THREE.MeshStandardMaterial({ color: 0x351e10, roughness: 1.0 });
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.68, side: THREE.DoubleSide });
  const gemMat = new THREE.MeshBasicMaterial({ color: 0xffe46b });

  const mounds = [];
  for (let i = 0; i < SPOT_COUNT; i++) {
    const pos = getSpotPosition(i);
    const moundGroup = new THREE.Group();
    moundGroup.position.set(pos.x, 0.03, pos.z);

    const undug = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), undugMat);
    undug.scale.set(1.15, 0.56, 1.0);
    undug.receiveShadow = true;
    moundGroup.add(undug);

    const activeRing = new THREE.Mesh(new THREE.RingGeometry(0.30, 0.39, 26), ringMat.clone());
    activeRing.rotation.x = -Math.PI / 2;
    activeRing.position.y = 0.024;
    activeRing.visible = false;
    moundGroup.add(activeRing);

    const dugGroup = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.065, 8, 18), dugOuterMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.03;
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.21, 14), dugHoleMat);
    hole.rotation.x = -Math.PI / 2;
    hole.position.y = 0.02;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), gemMat);
    gem.position.y = 0.16;
    dugGroup.add(rim, hole, gem);
    dugGroup.visible = false;
    moundGroup.add(dugGroup);

    scene.add(moundGroup);
    mounds.push({ group: moundGroup, undug, activeRing, dugGroup, gem });
  }

  return { swayCanopies, clouds, mounds };
}

/* ==========================================================================
   3D Popped Périgord Black Truffle & Particle Effects
   ========================================================================== */
function build3DTruffleReward() {
  const group = new THREE.Group();
  group.visible = false;

  const geo = new THREE.IcosahedronGeometry(0.25, 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const lump = 1 + 0.14 * Math.sin(vx * 18) * Math.cos(vy * 16 + vz * 14);
    pos.setXYZ(i, vx * lump * 1.08, vy * lump * 0.92, vz * lump);
  }
  geo.computeVertexNormals();

  const truffleMat = new THREE.MeshPhysicalMaterial({
    color: 0x3b2417,
    roughness: 0.60,
    metalness: 0.05,
    clearcoat: 0.25,
    sheen: 0.4,
    sheenColor: new THREE.Color(0x9e7556)
  });
  const truffleMesh = new THREE.Mesh(geo, truffleMat);
  truffleMesh.castShadow = true;
  group.add(truffleMesh);

  const auraSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createSparkleTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    })
  );
  auraSprite.scale.set(1.05, 1.05, 1);
  group.add(auraSprite);

  const plusSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createPlusOneSpriteTexture(),
      transparent: true,
      depthTest: false
    })
  );
  plusSprite.position.set(0, 0.56, 0);
  plusSprite.scale.set(0.86, 0.64, 1);
  group.add(plusSprite);

  return { group, truffleMesh, auraSprite, plusSprite };
}

/* ==========================================================================
   Main Barnabe3D Controller
   ========================================================================== */
class Barnabe3DController {
  constructor() {
    this.initialized = false;
    this.container = null;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.pig = null;
    this.env = null;
    this.truffleReward = null;
    this.rafId = null;
    this.resizeObserver = null;
    this.clock = new THREE.Clock();

    this.pigState = 'sniff';
    this.stateTime = 0;
    this.spotIndex = 0;
    this.foundCount = 0;
    this.currentHatId = 0;
    this.hatPopTimer = 0;
    this.tapHopTimer = 0;

    const initPos = getSpotPosition(0);
    this.pigPos = new THREE.Vector3(initPos.x - 1.02, 0, initPos.z);
    this.pigTargetPos = this.pigPos.clone();
    this.camLookX = initPos.x - 0.52;
    this.camTargetX = this.camLookX;

    this.blinkTimer = 2.6;
    this.blinkRemaining = 0;

    this.trufflePop = {
      active: false,
      t: 0,
      origin: new THREE.Vector3()
    };

    this.dirtParticles = [];
    this.sniffPuffs = [];
    this.hatSparkles = [];
    this.sniffEmitCooldown = 0;
    this.dirtEmitCooldown = 0;
  }

  init(containerEl, initial = {}) {
    if (this.initialized || !containerEl) return this.initialized;

    const canvas = document.createElement('canvas');
    canvas.className = 'forest-3d-canvas';
    canvas.setAttribute('aria-label', 'Barnabé le petit cochon en 3D cherche des truffes');

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
    } catch (_) {
      return false;
    }

    if (!renderer || !renderer.getContext()) {
      return false;
    }

    this.container = containerEl;
    this.canvas = canvas;
    this.renderer = renderer;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = createSkyTexture();
    this.scene.fog = new THREE.Fog(0xe2f6ef, 15, 36);

    this.camera = new THREE.PerspectiveCamera(32, 2, 0.1, 60);
    this.camera.position.set(this.camLookX + 1.45, 2.05, 5.45);

    // 3-Point Warm Pixar Studio Woodland Lighting (Rosy Bounce + Sun Key + Peach Rim!)
    const hemiLight = new THREE.HemisphereLight(0xfff9f2, 0xf2baa8, 1.18);
    this.scene.add(hemiLight);

    const sunKey = new THREE.DirectionalLight(0xfff5db, 1.38);
    sunKey.position.set(-3.5, 8.8, 7.5);
    sunKey.castShadow = true;
    sunKey.shadow.mapSize.set(1024, 1024);
    sunKey.shadow.camera.near = 1;
    sunKey.shadow.camera.far = 28;
    sunKey.shadow.camera.left = -10;
    sunKey.shadow.camera.right = 10;
    sunKey.shadow.camera.top = 7;
    sunKey.shadow.camera.bottom = -5;
    sunKey.shadow.bias = -0.0005;
    this.scene.add(sunKey);
    this.sunKey = sunKey;

    // Warm golden-peach rim light from behind-right to outline ears & plush fur!
    const rimLight = new THREE.DirectionalLight(0xffd7bd, 0.85);
    rimLight.position.set(5.0, 5.2, -5.0);
    this.scene.add(rimLight);

    // Subtle soft fill light on the camera side so Barnabé's cute face is brightly lit
    const faceFill = new THREE.DirectionalLight(0xffeef4, 0.42);
    faceFill.position.set(3.5, 2.2, 6.5);
    this.scene.add(faceFill);

    this.env = buildWoodlandEnvironment(this.scene);
    this.pig = buildPixarPiglet();
    this.pig.pigRoot.position.copy(this.pigPos);
    this.pig.pigRoot.rotation.y = -0.48;
    this.scene.add(this.pig.pigRoot);

    this.truffleReward = build3DTruffleReward();
    this.scene.add(this.truffleReward.group);

    this._buildParticlePools();

    const hud = containerEl.querySelector('.stage-hud');
    if (hud) {
      containerEl.insertBefore(canvas, hud);
    } else {
      containerEl.appendChild(canvas);
    }
    containerEl.classList.add('has-3d');

    // Interactive cute tap on Barnabé
    canvas.addEventListener('pointerdown', () => {
      if (this.pigState === 'sniff') {
        this.tapHopTimer = 0.58;
      }
    });

    this.setFoundCount(initial.foundCount ?? 0);
    this.setPosition(initial.spotIndex ?? 0, false);
    this.setHat(initial.hatId ?? 0, false);
    this.setPigState(initial.pigState ?? 'sniff');

    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(containerEl);
    }
    window.addEventListener('resize', () => this.resize());

    this.initialized = true;
    this.clock.start();
    this._loop();
    return true;
  }

  _buildParticlePools() {
    const dirtGeo = new THREE.DodecahedronGeometry(0.072, 0);
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x6e472b, roughness: 0.95 });
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(dirtGeo, dirtMat);
      m.visible = false;
      this.scene.add(m);
      this.dirtParticles.push({ mesh: m, vel: new THREE.Vector3(), life: 0, maxLife: 0.55 });
    }

    const puffGeo = new THREE.SphereGeometry(0.056, 10, 8);
    for (let i = 0; i < 6; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      const m = new THREE.Mesh(puffGeo, mat);
      m.visible = false;
      this.scene.add(m);
      this.sniffPuffs.push({ mesh: m, mat, vel: new THREE.Vector3(), life: 0, maxLife: 0.9 });
    }

    const starGeo = new THREE.OctahedronGeometry(0.068, 0);
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xffdf4d : 0x7be053, transparent: true, opacity: 0 });
      const m = new THREE.Mesh(starGeo, mat);
      m.visible = false;
      this.scene.add(m);
      this.hatSparkles.push({ mesh: m, mat, vel: new THREE.Vector3(), life: 0, maxLife: 0.95 });
    }
  }

  resize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const rect = this.container.getBoundingClientRect();
    const w = Math.max(100, Math.round(rect.width));
    const h = Math.max(100, Math.round(rect.height));
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    this.camera.fov = aspect > 1.75 ? 30 : aspect > 1.25 ? 34 : 38;
    this.camera.updateProjectionMatrix();
  }

  setPosition(spotIndex, animate = true) {
    this.spotIndex = Math.max(0, Math.min(SPOT_COUNT - 1, spotIndex));
    const spot = getSpotPosition(this.spotIndex);
    this.pigTargetPos.set(spot.x - 1.02, 0, spot.z);
    this.camTargetX = spot.x - 0.45;

    if (!animate) {
      this.pigPos.copy(this.pigTargetPos);
      this.camLookX = this.camTargetX;
      if (this.pig) this.pig.pigRoot.position.copy(this.pigPos);
    }
  }

  setFoundCount(count) {
    this.foundCount = Math.max(0, Math.min(SPOT_COUNT, count));
    if (!this.env) return;
    this.env.mounds.forEach((m, idx) => {
      const isDug = idx < this.foundCount;
      const isCurrent = idx === this.foundCount;
      m.undug.visible = !isDug;
      m.dugGroup.visible = isDug;
      m.activeRing.visible = isCurrent;
    });
  }

  setPigState(nextState) {
    if (this.pigState !== nextState) {
      this.pigState = nextState;
      this.stateTime = 0;
    }
    this._applyEyeExpression(nextState);
  }

  setHat(hatId, celebrate = false) {
    const cleanId = Number(hatId) || 0;
    if (!this.pig) return;
    if (cleanId === this.currentHatId && !celebrate) return;
    this.currentHatId = cleanId;

    while (this.pig.hatAnchor.children.length > 0) {
      this.pig.hatAnchor.remove(this.pig.hatAnchor.children[0]);
    }

    this.pig.tuftGroup.visible = cleanId === 0;

    if (cleanId > 0) {
      const hatMesh = build3DHat(cleanId);
      this.pig.hatAnchor.add(hatMesh);
      if (celebrate) {
        this.hatPopTimer = 0.65;
        this._emitHatSparkles();
      } else {
        this.pig.hatAnchor.scale.setScalar(1);
      }
    }
  }

  popTruffle() {
    if (!this.truffleReward) return;
    const spot = getSpotPosition(this.spotIndex);
    this.trufflePop.active = true;
    this.trufflePop.t = 0;
    this.trufflePop.origin.set(spot.x, 0.12, spot.z);
    this.truffleReward.group.position.copy(this.trufflePop.origin);
    this.truffleReward.group.visible = true;
    this._emitHatSparkles(this.trufflePop.origin.clone().add(new THREE.Vector3(0, 0.45, 0)));
  }

  _applyEyeExpression(stateName) {
    if (!this.pig) return;
    const isHappy = stateName === 'happy';
    const isOops = stateName === 'oops';

    [this.pig.eyeL, this.pig.eyeR].forEach((eye, idx) => {
      const side = idx === 0 ? -1 : 1;
      eye.openGroup.visible = !isHappy;
      eye.happyArc.visible = isHappy;
      eye.openGroup.scale.setScalar(isOops ? 1.15 : 1.0);

      if (isHappy) {
        eye.brow.position.y = 0.035;
        eye.brow.rotation.x = 0;
      } else if (isOops) {
        eye.brow.position.y = 0.05;
        eye.brow.rotation.x = side * 0.22;
      } else if (stateName === 'dig') {
        eye.brow.position.y = -0.02;
        eye.brow.rotation.x = -side * 0.20;
      } else {
        eye.brow.position.y = 0.0;
        eye.brow.rotation.x = 0;
      }
    });
  }

  _emitDirtClod() {
    const p = this.dirtParticles.find((item) => item.life <= 0);
    if (!p) return;
    p.life = p.maxLife;
    p.mesh.visible = true;
    p.mesh.position.set(
      this.pigPos.x + 0.58 + (Math.random() - 0.5) * 0.20,
      0.14,
      this.pigPos.z + (Math.random() - 0.5) * 0.28
    );
    p.mesh.scale.setScalar(0.75 + Math.random() * 0.55);
    p.vel.set(
      -1.2 - Math.random() * 1.3,
      2.2 + Math.random() * 1.2,
      (Math.random() - 0.5) * 1.4
    );
  }

  _emitSniffPuff() {
    const p = this.sniffPuffs.find((item) => item.life <= 0);
    if (!p) return;
    p.life = p.maxLife;
    p.mesh.visible = true;
    p.mesh.position.set(
      this.pigPos.x + 0.92,
      0.72 + (Math.random() - 0.5) * 0.08,
      this.pigPos.z + 0.45 + (Math.random() - 0.5) * 0.1
    );
    p.mesh.scale.setScalar(0.45);
    p.vel.set(0.36 + Math.random() * 0.20, 0.52 + Math.random() * 0.22, 0.20);
  }

  _emitHatSparkles(centerOverride = null) {
    const center = centerOverride || new THREE.Vector3(
      this.pigPos.x + 0.48,
      1.66,
      this.pigPos.z + 0.22
    );
    this.hatSparkles.forEach((p, idx) => {
      const a = (idx / this.hatSparkles.length) * Math.PI * 2;
      p.life = p.maxLife * (0.75 + Math.random() * 0.35);
      p.mesh.visible = true;
      p.mesh.position.copy(center);
      p.vel.set(
        Math.cos(a) * (1.2 + Math.random() * 0.85),
        1.4 + Math.random() * 1.3,
        Math.sin(a) * (1.2 + Math.random() * 0.85)
      );
    });
  }

  _loop() {
    this.rafId = requestAnimationFrame(() => this._loop());
    if (document.hidden) {
      this.clock.getDelta();
      return;
    }

    const dt = Math.min(0.05, this.clock.getDelta());
    const elapsed = this.clock.elapsedTime;
    this.stateTime += dt;

    this._updatePiglet(dt, elapsed);
    this._updateEnvironment(dt, elapsed);
    this._updateParticles(dt);
    this._updateCamera(dt);

    this.renderer.render(this.scene, this.camera);
  }

  _updatePiglet(dt, elapsed) {
    const {
      pigRoot, bodyGroup, headPivot, snoutGroup, smileMesh, tailPivot, legs, eyeL, eyeR, earL, earR, hatAnchor
    } = this.pig;

    const moveLerp = 1 - Math.exp(-dt * 5.8);
    this.pigPos.lerp(this.pigTargetPos, moveLerp);
    pigRoot.position.copy(this.pigPos);

    // Classic Pixar front-three-quarter hero pose (negative Y turns +X toward +Z viewer!)
    let targetYaw = -0.46;
    let bodyY = 0.70;
    let bodyPitch = 0;
    let bodyScaleX = 1;
    let bodyScaleY = 1;
    let bodyScaleZ = 1;
    let headPitch = 0;
    let headYaw = -0.22; // Negative Y turns Barnabé's cute face warmly toward the player!
    let headRoll = 0;

    if (this.pigState === 'sniff') {
      const s = Math.sin(elapsed * 4.0);
      bodyY = 0.70 + s * 0.022;
      bodyPitch = -0.04 - s * 0.025;
      headPitch = -0.14 - s * 0.09;
      headYaw = -0.24 + Math.sin(elapsed * 1.7) * 0.10;
      snoutGroup.scale.set(
        1 + Math.sin(elapsed * 11) * 0.06,
        1 + Math.cos(elapsed * 11) * 0.045,
        1
      );
      snoutGroup.position.y = -0.09 + Math.sin(elapsed * 11) * 0.012;
      earL.rotation.z = -0.14 + Math.sin(elapsed * 4.0 + 0.5) * 0.11;
      earR.rotation.z = -0.14 + Math.sin(elapsed * 4.0 + 0.5) * 0.11;
      tailPivot.rotation.y = Math.sin(elapsed * 8.5) * 0.28;
      tailPivot.rotation.z = Math.cos(elapsed * 8.5) * 0.15;

      Object.values(legs).forEach((l) => { l.rotation.z *= 0.85; });

      this.sniffEmitCooldown -= dt;
      if (this.sniffEmitCooldown <= 0) {
        this._emitSniffPuff();
        this.sniffEmitCooldown = 0.85 + Math.random() * 0.45;
      }

      if (this.tapHopTimer > 0) {
        this.tapHopTimer = Math.max(0, this.tapHopTimer - dt);
        const hp = 1 - this.tapHopTimer / 0.58;
        const arc = Math.sin(hp * Math.PI);
        bodyY += arc * 0.44;
        headPitch = 0.18 * arc;
        headYaw = -0.45 * arc - 0.18;
        earL.rotation.z = -0.14 - arc * 0.42;
        earR.rotation.z = -0.14 - arc * 0.42;
      }
    } else if (this.pigState === 'dig') {
      const f = elapsed * 24;
      targetYaw = -0.32;
      bodyY = 0.67 + Math.abs(Math.sin(f)) * 0.04;
      bodyPitch = -0.16;
      headPitch = -0.32 + Math.sin(f * 0.5) * 0.06;
      headYaw = -0.08;
      legs.fr.rotation.z = Math.sin(f) * 0.78 + 0.30;
      legs.fl.rotation.z = -Math.sin(f) * 0.78 + 0.30;
      legs.br.rotation.z = -0.12;
      legs.bl.rotation.z = -0.12;
      earL.rotation.z = -0.22 + Math.sin(f) * 0.20;
      earR.rotation.z = -0.22 - Math.sin(f) * 0.20;
      tailPivot.rotation.y = Math.sin(elapsed * 20) * 0.45;

      this.dirtEmitCooldown -= dt;
      if (this.dirtEmitCooldown <= 0) {
        this._emitDirtClod();
        this.dirtEmitCooldown = 0.055;
      }
    } else if (this.pigState === 'happy') {
      const p = Math.min(1, this.stateTime / 0.62);
      const jump = Math.sin(p * Math.PI);
      bodyY = 0.70 + jump * 0.62;
      bodyPitch = jump * 0.12;
      bodyScaleY = 1 + jump * 0.11 - (p > 0.85 ? (p - 0.85) * 0.45 : 0);
      bodyScaleX = 1 - jump * 0.055;
      bodyScaleZ = 1 - jump * 0.055;
      targetYaw = -0.62; // Turn joyously toward the player!
      headPitch = 0.16 * jump;
      headYaw = -0.34;
      smileMesh.scale.set(1.15, 1.35, 1.15);
      legs.fr.rotation.z = jump * 0.46;
      legs.fl.rotation.z = jump * 0.46;
      legs.br.rotation.z = -jump * 0.40;
      legs.bl.rotation.z = -jump * 0.40;
      earL.rotation.z = -0.14 - jump * 0.52;
      earR.rotation.z = -0.14 - jump * 0.52;
      tailPivot.rotation.y = Math.sin(elapsed * 22) * 0.52;
    } else if (this.pigState === 'trot') {
      const f = elapsed * 16;
      targetYaw = -0.28;
      bodyY = 0.72 + Math.abs(Math.sin(f)) * 0.13;
      bodyPitch = Math.sin(f * 2) * 0.04;
      headPitch = -0.02 + Math.sin(f) * 0.045;
      headYaw = -0.16;
      legs.fr.rotation.z = Math.sin(f) * 0.56;
      legs.bl.rotation.z = Math.sin(f) * 0.56;
      legs.fl.rotation.z = -Math.sin(f) * 0.56;
      legs.br.rotation.z = -Math.sin(f) * 0.56;
      earL.rotation.z = -0.14 - Math.abs(Math.sin(f)) * 0.22;
      earR.rotation.z = -0.14 - Math.abs(Math.sin(f)) * 0.22;
      tailPivot.rotation.y = Math.sin(f) * 0.32;
    } else if (this.pigState === 'oops') {
      const shake = Math.sin(this.stateTime * 34) * Math.exp(-this.stateTime * 3.5);
      targetYaw = -0.55;
      bodyY = 0.70;
      headYaw = -0.30 + shake * 0.42;
      headRoll = shake * 0.15;
      headPitch = 0.06;
      earL.rotation.z = 0.14;
      earR.rotation.z = 0.14;
      Object.values(legs).forEach((l) => { l.rotation.z *= 0.85; });
    }

    if (this.pigState !== 'happy') {
      smileMesh.scale.set(1, 1, 1);
    }
    if (this.pigState !== 'sniff') {
      snoutGroup.scale.set(1, 1, 1);
      snoutGroup.position.y = -0.09;
    }

    pigRoot.rotation.y += (targetYaw - pigRoot.rotation.y) * Math.min(1, dt * 8);
    bodyGroup.position.y = bodyY;
    bodyGroup.rotation.z = bodyPitch;
    bodyGroup.scale.set(bodyScaleX, bodyScaleY, bodyScaleZ);

    headPivot.rotation.z += (headPitch - headPivot.rotation.z) * Math.min(1, dt * 12);
    headPivot.rotation.y += (headYaw - headPivot.rotation.y) * Math.min(1, dt * 10);
    headPivot.rotation.x += (headRoll - headPivot.rotation.x) * Math.min(1, dt * 12);

    // Crisp natural Pixar blink
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0 && this.pigState !== 'happy') {
      this.blinkRemaining = 0.13;
      this.blinkTimer = 2.6 + Math.random() * 2.8;
    }
    if (this.blinkRemaining > 0) {
      this.blinkRemaining = Math.max(0, this.blinkRemaining - dt);
    }
    const isBlinking = this.blinkRemaining > 0;
    eyeL.blinkLid.visible = isBlinking;
    eyeR.blinkLid.visible = isBlinking;

    // Elastic Hat Pop-in Bounce!
    if (this.hatPopTimer > 0) {
      this.hatPopTimer = Math.max(0, this.hatPopTimer - dt);
      const t = 1 - this.hatPopTimer / 0.65;
      const elastic = 1 + Math.sin(t * Math.PI * 2.5) * Math.exp(-t * 4.2) * 0.45;
      hatAnchor.scale.setScalar(Math.max(0.01, elastic));
    } else {
      hatAnchor.scale.setScalar(1);
    }
  }

  _updateEnvironment(dt, elapsed) {
    if (!this.env) return;

    this.env.swayCanopies.forEach((c, idx) => {
      c.rotation.z = Math.sin(elapsed * 0.9 + idx * 1.4) * 0.03;
    });

    this.env.clouds.forEach((c, idx) => {
      c.group.position.x = c.baseX + Math.sin(elapsed * 0.14 + idx * 2.1) * 0.9;
    });

    this.env.mounds.forEach((m, idx) => {
      if (m.activeRing.visible) {
        const pulse = 1 + Math.sin(elapsed * 4.5) * 0.12;
        m.activeRing.scale.setScalar(pulse);
        m.activeRing.material.opacity = 0.48 + Math.sin(elapsed * 4.5) * 0.22;
      }
      if (m.dugGroup.visible) {
        m.gem.rotation.y = elapsed * 2.2 + idx;
        m.gem.position.y = 0.16 + Math.sin(elapsed * 3.5 + idx) * 0.035;
      }
    });

    if (this.trufflePop.active && this.truffleReward) {
      this.trufflePop.t += dt;
      const p = this.trufflePop.t / 1.05;
      if (p >= 1) {
        this.trufflePop.active = false;
        this.truffleReward.group.visible = false;
      } else {
        const arcY = Math.sin(p * Math.PI) * 1.38 + p * 0.45;
        this.truffleReward.group.position.set(
          this.trufflePop.origin.x + p * 0.25,
          this.trufflePop.origin.y + arcY,
          this.trufflePop.origin.z + 0.18
        );
        const popScale = p < 0.2 ? (p / 0.2) * 1.15 : p > 0.78 ? (1 - (p - 0.78) / 0.22) : 1.05;
        this.truffleReward.group.scale.setScalar(Math.max(0.01, popScale));
        this.truffleReward.truffleMesh.rotation.y += dt * 5.2;
        this.truffleReward.truffleMesh.rotation.x += dt * 2.4;
      }
    }
  }

  _updateParticles(dt) {
    this.dirtParticles.forEach((p) => {
      if (p.life <= 0) return;
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        return;
      }
      p.vel.y -= 8.8 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += dt * 7;
      p.mesh.rotation.z += dt * 5;
    });

    this.sniffPuffs.forEach((p) => {
      if (p.life <= 0) return;
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        return;
      }
      const prog = 1 - p.life / p.maxLife;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.scale.setScalar(0.45 + prog * 1.1);
      p.mat.opacity = Math.sin(prog * Math.PI) * 0.55;
    });

    this.hatSparkles.forEach((p) => {
      if (p.life <= 0) return;
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        return;
      }
      const prog = 1 - p.life / p.maxLife;
      p.vel.y -= 3.6 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.y += dt * 9;
      p.mesh.scale.setScalar(1 - prog * 0.75);
      p.mat.opacity = 1 - prog;
    });
  }

  _updateCamera(dt) {
    const lerp = 1 - Math.exp(-dt * 4.5);
    this.camLookX += (this.camTargetX - this.camLookX) * lerp;
    // Slight front-right angle so Barnabé's 3/4 Pixar face & eyes shine!
    this.camera.position.set(this.camLookX + 1.48, 2.02, 5.45);
    this.camera.lookAt(this.camLookX - 0.05, 1.02, 0.0);

    if (this.sunKey) {
      this.sunKey.position.set(this.camLookX - 3.5, 8.8, 7.5);
      this.sunKey.target.position.set(this.camLookX, 0, 0);
      this.sunKey.target.updateMatrixWorld();
    }
  }
}

window.Barnabe3D = new Barnabe3DController();
window.dispatchEvent(new Event('barnabe3d-ready'));
