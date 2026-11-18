/* ==========================================================================
   Groin & Truffes — Calcul Mental (Logique, Générateur, Animations & Audio)
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'groin_truffes_save_v1';

  const PICKLE_FLAVORS = [
    {
      name: 'La Croquante Aigre-Douce du Périgord',
      desc: 'Un cornichon bien croquant enrobé de sucre doré des bois !'
    },
    {
      name: 'La Malossol Pétillante au Miel',
      desc: 'Ça crépite sur le groin et ça pique juste ce qu’il faut !'
    },
    {
      name: 'L’Impériale Double-Cornichon Caramélisée',
      desc: 'Deux fois plus de cornichon pour les champions du calcul !'
    },
    {
      name: 'La Torsade Vinaigrée aux Éclats d’Or',
      desc: 'Le secret le mieux gardé sous le grand chêne truffier.'
    },
    {
      name: 'L’Émeraude Acidulée des Sous-Bois',
      desc: 'Verte, brillante et approuvée à 100 % par Barnabé !'
    },
    {
      name: 'La Suprême Extra-Cornichon Givré',
      desc: 'Fraîcheur croquante pour cerveau en ébullition !'
    },
    {
      name: 'La Royale Aigrelette Millésimée',
      desc: 'Réservée aux chercheurs de truffes au flair infaillible.'
    },
    {
      name: 'La Mythique Corni-Sucette d’Or Massif',
      desc: 'Le sommet absolu de la confiserie au cornichon !'
    }
  ];

  // 10 Truffle spots along the forest trail (x, y)
  const TRAIL_SPOTS = [
    { x: 168, y: 181 },
    { x: 206, y: 178 },
    { x: 244, y: 176 },
    { x: 282, y: 178 },
    { x: 320, y: 180 },
    { x: 358, y: 181 },
    { x: 396, y: 180 },
    { x: 434, y: 178 },
    { x: 472, y: 177 },
    { x: 510, y: 176 }
  ];

  // Persistent + Session State
  const state = {
    settings: {
      ops: ['add', 'mul', 'rev'], // 'add' | 'mul' | 'rev'
      digits: '1',                // '1' | '2' | 'mix'
      difficulty: 'medium',       // 'easy' | 'medium' | 'hard'
      timerMode: 'off',           // 'off' | '20' | '12' | 'sprint60'
      sound: true
    },
    progress: {
      totalTruffles: 0,
      cycleTruffles: 0, // 0..9 (at 10 -> awards Pickle Lollipop and resets to 0)
      pickleLollipops: 0,
      streak: 0,
      bestStreak: 0
    },
    draftSettings: null,
    problem: null,
    lastProblemKey: '',
    input: {
      single: '',
      factorA: '',
      factorB: '',
      activeSlot: 'A', // 'A' | 'B' for reverse multiplication
      attemptsOnCurrent: 0
    },
    isBusy: false, // Locks input during celebration / transition
    timer: {
      remainingMs: 0,
      totalMs: 0,
      lastTick: 0,
      sprintTruffles: 0,
      rafId: null
    },
    camera: {
      currentX: 0,
      targetX: 0,
      rafId: null
    }
  };

  /* ==========================================================================
     Web Audio API Synthesizer (Zero external assets, iOS Safari friendly)
     ========================================================================== */
  let audioCtx = null;

  function ensureAudio() {
    if (!state.settings.sound) return null;
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTone(freq, type, durationSec, delaySec = 0, gainVal = 0.12, slideToFreq = null) {
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideToFreq) {
        osc.frequency.exponentialRampToValueAtTime(slideToFreq, now + durationSec);
      }
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durationSec + 0.02);
    } catch (_) {
      // Ignore audio errors on restricted devices
    }
  }

  const sfx = {
    tap() {
      playTone(520, 'triangle', 0.045, 0, 0.07, 420);
    },
    switchSlot() {
      playTone(620, 'sine', 0.06, 0, 0.08, 760);
    },
    erase() {
      playTone(340, 'triangle', 0.055, 0, 0.07, 250);
    },
    trufflePop() {
      // Digging pop + happy major triad
      playTone(280, 'sine', 0.09, 0, 0.12, 580);
      playTone(523.25, 'triangle', 0.13, 0.08, 0.12); // C5
      playTone(659.25, 'triangle', 0.13, 0.16, 0.12); // E5
      playTone(783.99, 'triangle', 0.22, 0.24, 0.14); // G5
      playTone(1046.5, 'sine', 0.28, 0.33, 0.11);     // C6
    },
    pickleFanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5, 1318.5];
      const times = [0, 0.09, 0.18, 0.28, 0.42, 0.52, 0.64];
      const durs = [0.12, 0.12, 0.14, 0.18, 0.12, 0.14, 0.45];
      notes.forEach((n, idx) => {
        playTone(n, 'triangle', durs[idx], times[idx], 0.15);
      });
    },
    oops() {
      playTone(270, 'sine', 0.12, 0, 0.1, 230);
      playTone(215, 'sine', 0.18, 0.11, 0.1, 185);
    }
  };

  /* ==========================================================================
     DOM References
     ========================================================================== */
  const dom = {
    totalTrufflesCount: document.getElementById('totalTrufflesCount'),
    pickleLollipopsCount: document.getElementById('pickleLollipopsCount'),
    btnTruffleStats: document.getElementById('btnTruffleStats'),
    btnOpenCollection: document.getElementById('btnOpenCollection'),
    btnToggleTimerQuick: document.getElementById('btnToggleTimerQuick'),
    quickTimerLabel: document.getElementById('quickTimerLabel'),
    btnToggleSound: document.getElementById('btnToggleSound'),
    soundIcon: document.getElementById('soundIcon'),
    btnOpenSettings: document.getElementById('btnOpenSettings'),
    btnStageSummary: document.getElementById('btnStageSummary'),
    summaryChipText: document.getElementById('summaryChipText'),
    streakChip: document.getElementById('streakChip'),
    streakCount: document.getElementById('streakCount'),

    forestSvgWrap: document.querySelector('.forest-svg-wrap'),
    forestSvg: document.getElementById('forestSvg'),
    trailSpotsGroup: document.getElementById('trailSpotsGroup'),
    pigletMover: document.getElementById('pigletMover'),
    poppedTruffle: document.getElementById('poppedTruffle'),
    truffleSlotsContainer: document.getElementById('truffleSlotsContainer'),
    cycleProgressText: document.getElementById('cycleProgressText'),

    timerStrip: document.getElementById('timerStrip'),
    timerStripFill: document.getElementById('timerStripFill'),
    opTypeBadge: document.getElementById('opTypeBadge'),
    timerReadout: document.getElementById('timerReadout'),
    equationRow: document.getElementById('equationRow'),
    feedbackBanner: document.getElementById('feedbackBanner'),
    keySubmit: document.getElementById('keySubmit'),

    settingsModal: document.getElementById('settingsModal'),
    btnCloseSettings: document.getElementById('btnCloseSettings'),
    btnApplySettings: document.getElementById('btnApplySettings'),

    pickleRewardModal: document.getElementById('pickleRewardModal'),
    rewardFlavorName: document.getElementById('rewardFlavorName'),
    rewardTotalPickles: document.getElementById('rewardTotalPickles'),
    rewardDescription: document.getElementById('rewardDescription'),
    btnContinueAfterReward: document.getElementById('btnContinueAfterReward'),

    collectionModal: document.getElementById('collectionModal'),
    collectionStatsLine: document.getElementById('collectionStatsLine'),
    trophyGrid: document.getElementById('trophyGrid'),
    btnCloseCollection: document.getElementById('btnCloseCollection'),
    btnCloseCollectionMain: document.getElementById('btnCloseCollectionMain'),
    btnResetProgress: document.getElementById('btnResetProgress'),

    sprintEndModal: document.getElementById('sprintEndModal'),
    sprintResultText: document.getElementById('sprintResultText'),
    sprintDetailText: document.getElementById('sprintDetailText'),
    btnRestartSprint: document.getElementById('btnRestartSprint'),

    confettiCanvas: document.getElementById('confettiCanvas')
  };

  /* ==========================================================================
     Persistence (localStorage)
     ========================================================================== */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.settings) {
        if (Array.isArray(parsed.settings.ops) && parsed.settings.ops.length > 0) {
          state.settings.ops = parsed.settings.ops;
        }
        if (['1', '2', 'mix'].includes(parsed.settings.digits)) {
          state.settings.digits = parsed.settings.digits;
        }
        if (['easy', 'medium', 'hard'].includes(parsed.settings.difficulty)) {
          state.settings.difficulty = parsed.settings.difficulty;
        }
        if (['off', '20', '12', 'sprint60'].includes(parsed.settings.timerMode)) {
          state.settings.timerMode = parsed.settings.timerMode;
        }
        if (typeof parsed.settings.sound === 'boolean') {
          state.settings.sound = parsed.settings.sound;
        }
      }
      if (parsed.progress) {
        state.progress.totalTruffles = Math.max(0, Number(parsed.progress.totalTruffles) || 0);
        state.progress.pickleLollipops = Math.max(0, Number(parsed.progress.pickleLollipops) || 0);
        state.progress.cycleTruffles = Math.min(9, Math.max(0, Number(parsed.progress.cycleTruffles) || 0));
        state.progress.bestStreak = Math.max(0, Number(parsed.progress.bestStreak) || 0);
      }
    } catch (_) {
      // Ignore storage access issues in private/sandboxed browsing
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: state.settings,
        progress: {
          totalTruffles: state.progress.totalTruffles,
          cycleTruffles: state.progress.cycleTruffles,
          pickleLollipops: state.progress.pickleLollipops,
          bestStreak: state.progress.bestStreak
        }
      }));
    } catch (_) {}
  }

  /* ==========================================================================
     Smart Pedagogical Math Problem Generator
     ========================================================================== */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function makeAddition(digits, diff) {
    let a = 2;
    let b = 3;

    if (digits === '1') {
      if (diff === 'easy') {
        a = randInt(1, 5);
        b = randInt(1, 5);
      } else if (diff === 'medium') {
        a = randInt(2, 9);
        b = randInt(2, 9);
      } else {
        // Hard: guaranteed bridge across 10
        a = randInt(5, 9);
        b = randInt(Math.max(5, 11 - a), 9);
      }
    } else if (digits === '2') {
      if (diff === 'easy') {
        // 2-digit without ones-column carry
        const tensA = randInt(1, 4);
        const onesA = randInt(0, 7);
        const tensB = randInt(1, 4);
        const onesB = randInt(1, 9 - onesA);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
      } else if (diff === 'medium') {
        a = randInt(12, 58);
        b = randInt(12, 46);
      } else {
        // Hard: 2-digit with guaranteed carry
        const tensA = randInt(2, 8);
        const onesA = randInt(4, 9);
        const tensB = randInt(1, 7);
        const onesB = randInt(10 - onesA, 9);
        a = tensA * 10 + onesA;
        b = tensB * 10 + onesB;
      }
    } else {
      // Mix 1 & 2 digits
      if (diff === 'easy') {
        const tens = randInt(1, 6);
        const onesA = randInt(1, 6);
        const onesB = randInt(2, 9 - onesA);
        a = tens * 10 + onesA;
        b = onesB;
      } else if (diff === 'medium') {
        if (Math.random() < 0.65) {
          const tens = randInt(1, 7);
          const onesA = randInt(4, 9);
          const onesB = randInt(10 - onesA, 9);
          a = tens * 10 + onesA;
          b = onesB;
        } else {
          a = randInt(14, 68);
          b = randInt(1, 4) * 10;
        }
      } else {
        if (Math.random() < 0.45) {
          a = randInt(35, 89);
          b = randInt(6, 9);
        } else {
          a = randInt(25, 76);
          b = randInt(16, 58);
        }
      }
      if (Math.random() < 0.4) {
        [a, b] = [b, a];
      }
    }

    return {
      op: 'add',
      a,
      b,
      answer: a + b,
      key: `add:${a}+${b}`
    };
  }

  function makeMultiplication(digits, diff) {
    let a = 3;
    let b = 4;

    if (digits === '1') {
      if (diff === 'easy') {
        a = randInt(2, 5);
        b = randInt(2, 9);
      } else if (diff === 'medium') {
        a = randInt(2, 9);
        b = randInt(3, 9);
      } else {
        a = randInt(6, 9);
        b = randInt(5, 9);
      }
      if (Math.random() < 0.5) [a, b] = [b, a];
    } else if (digits === '2') {
      if (diff === 'easy') {
        // Gentle 2-digit mental multiplication (e.g. 12×3, 20×4, 15×2)
        if (Math.random() < 0.4) {
          a = randInt(1, 5) * 10;
          b = randInt(2, 9);
        } else {
          a = randInt(11, 19);
          b = randInt(2, 5);
        }
      } else if (diff === 'medium') {
        if (Math.random() < 0.7) {
          a = randInt(12, 29);
          b = randInt(3, 8);
        } else {
          a = randInt(11, 16);
          b = randInt(10, 12);
        }
      } else {
        // Hard: authentic 2-digit × 2-digit mental challenge
        a = randInt(11, 25);
        b = randInt(11, 18);
      }
      if (Math.random() < 0.35) [a, b] = [b, a];
    } else {
      // Mix 1 & 2 digits
      if (Math.random() < 0.45) {
        return makeMultiplication('1', diff);
      }
      return makeMultiplication('2', diff === 'hard' ? 'medium' : diff);
    }

    return {
      op: 'mul',
      a,
      b,
      answer: a * b,
      key: `mul:${a}x${b}`
    };
  }

  function makeReverseMultiplication(digits, diff) {
    let f1 = 3;
    let f2 = 4;
    let singleDigitOnly = false;

    if (digits === '1') {
      singleDigitOnly = true;
      if (diff === 'easy') {
        f1 = randInt(2, 5);
        f2 = randInt(2, 7);
      } else if (diff === 'medium') {
        f1 = randInt(3, 9);
        f2 = randInt(3, 9);
      } else {
        f1 = randInt(6, 9);
        f2 = randInt(5, 9);
      }
    } else if (digits === '2') {
      singleDigitOnly = false;
      if (diff === 'easy') {
        f1 = pickRandom([10, 11, 12, 13, 14, 15, 20, 25]);
        f2 = randInt(2, 5);
      } else if (diff === 'medium') {
        f1 = randInt(11, 19);
        f2 = randInt(4, 9);
      } else {
        f1 = randInt(11, 20);
        f2 = randInt(11, 15);
      }
    } else {
      // Mix
      if (Math.random() < 0.55) {
        return makeReverseMultiplication('1', diff);
      }
      return makeReverseMultiplication('2', diff === 'hard' ? 'medium' : 'easy');
    }

    const product = f1 * f2;
    return {
      op: 'rev',
      sampleA: f1,
      sampleB: f2,
      product,
      singleDigitOnly,
      key: `rev:${product}:${singleDigitOnly ? 1 : 2}`
    };
  }

  function nextProblem() {
    const { ops, digits, difficulty } = state.settings;
    let candidate = null;
    for (let i = 0; i < 8; i++) {
      const chosenOp = pickRandom(ops);
      if (chosenOp === 'add') {
        candidate = makeAddition(digits, difficulty);
      } else if (chosenOp === 'mul') {
        candidate = makeMultiplication(digits, difficulty);
      } else {
        candidate = makeReverseMultiplication(digits, difficulty);
      }
      if (candidate.key !== state.lastProblemKey) break;
    }

    state.problem = candidate;
    state.lastProblemKey = candidate.key;
    state.input = {
      single: '',
      factorA: '',
      factorB: '',
      activeSlot: 'A',
      attemptsOnCurrent: 0
    };

    renderProblem();
    updateSubmitKeyAppearance();

    if (state.settings.timerMode === '20' || state.settings.timerMode === '12') {
      startQuestionTimer(Number(state.settings.timerMode) * 1000);
    }
  }

  /* ==========================================================================
     Woodland Trail, Camera & Barnabé Animation Choreography
     ========================================================================== */
  function renderTruffleBasketSlots() {
    const truffleSvgIcon = `
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M5,15 C3,8 10,4 16,5 C22,4 26,9 24,16 C26,21 20,25 14,24 C7,25 3,20 5,15 Z" fill="#3b2518" stroke="#f5c56b" stroke-width="1.5"/>
        <circle cx="11" cy="12" r="1.8" fill="#8b654b"/>
        <circle cx="17" cy="14" r="1.5" fill="#8b654b"/>
        <circle cx="13" cy="18" r="1.5" fill="#8b654b"/>
      </svg>
    `;
    dom.truffleSlotsContainer.innerHTML = Array.from({ length: 10 }, (_, idx) => (
      `<div class="truffle-slot" data-slot-idx="${idx}">${truffleSvgIcon}</div>`
    )).join('');
    syncTruffleTrackUI();
  }

  function syncTruffleTrackUI(newlyEarnedIdx = -1) {
    const slots = dom.truffleSlotsContainer.querySelectorAll('.truffle-slot');
    slots.forEach((el, idx) => {
      const filled = idx < state.progress.cycleTruffles;
      el.classList.toggle('is-filled', filled);
      el.classList.remove('just-earned');
      if (idx === newlyEarnedIdx) {
        void el.offsetWidth;
        el.classList.add('just-earned');
      }
    });
    dom.cycleProgressText.textContent = `${state.progress.cycleTruffles}/10`;
    dom.totalTrufflesCount.textContent = String(state.progress.totalTruffles);
    dom.pickleLollipopsCount.textContent = String(state.progress.pickleLollipops);

    if (state.progress.streak >= 2) {
      dom.streakCount.textContent = String(state.progress.streak);
      dom.streakChip.classList.add('is-visible');
    } else {
      dom.streakChip.classList.remove('is-visible');
    }

    renderTrailSpotsOnSvg();
  }

  function renderTrailSpotsOnSvg() {
    const foundCount = state.progress.cycleTruffles;
    dom.trailSpotsGroup.innerHTML = TRAIL_SPOTS.map((pt, idx) => {
      if (idx < foundCount) {
        // Dug-up cozy mound with golden sparkle
        return `
          <g transform="translate(${pt.x}, ${pt.y})">
            <ellipse cx="0" cy="3" rx="9" ry="4" fill="#6b4629" />
            <ellipse cx="0" cy="2" rx="6" ry="2.4" fill="#3d2514" />
            <circle cx="0" cy="-2" r="2.2" fill="#ffe169" opacity="0.85" />
          </g>
        `;
      }
      const isCurrent = idx === foundCount;
      return `
        <g transform="translate(${pt.x}, ${pt.y})">
          <ellipse cx="0" cy="3" rx="${isCurrent ? 8.5 : 6.5}" ry="${isCurrent ? 3.5 : 2.6}" fill="${isCurrent ? '#875b37' : '#9c6e46'}" opacity="${isCurrent ? '0.95' : '0.6'}" />
          ${isCurrent ? '<path d="M-4,2 Q0,-3 4,2" stroke="#694324" stroke-width="1.6" fill="none" stroke-linecap="round"/>' : ''}
        </g>
      `;
    }).join('');
  }

  function updatePigletPosition(spotIndex, animateCamera = true) {
    const clampedIdx = Math.max(0, Math.min(9, spotIndex));
    const spot = TRAIL_SPOTS[clampedIdx];
    const pigX = spot.x - 40;
    const pigY = spot.y - 4;
    dom.pigletMover.setAttribute('transform', `translate(${pigX}, ${pigY})`);
    syncSvgCamera(pigX, animateCamera);
  }

  function syncSvgCamera(pigX, smooth = true) {
    const rect = dom.forestSvgWrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const viewH = 220;
    const visW = Math.min(640, Math.max(350, Math.round(viewH * (rect.width / rect.height))));
    const maxCamX = Math.max(0, 640 - visW);
    const desiredX = Math.max(0, Math.min(maxCamX, pigX + 26 - visW * 0.44));
    state.camera.targetX = desiredX;

    if (!smooth) {
      state.camera.currentX = desiredX;
      dom.forestSvg.setAttribute('viewBox', `${desiredX.toFixed(1)} 0 ${visW} ${viewH}`);
      return;
    }

    if (state.camera.rafId) cancelAnimationFrame(state.camera.rafId);
    const stepCamera = () => {
      const r = dom.forestSvgWrap.getBoundingClientRect();
      const currentVisW = r.width && r.height
        ? Math.min(640, Math.max(350, Math.round(viewH * (r.width / r.height))))
        : visW;
      const diff = state.camera.targetX - state.camera.currentX;
      if (Math.abs(diff) < 0.4) {
        state.camera.currentX = state.camera.targetX;
        dom.forestSvg.setAttribute('viewBox', `${state.camera.currentX.toFixed(1)} 0 ${currentVisW} ${viewH}`);
        state.camera.rafId = null;
        return;
      }
      state.camera.currentX += diff * 0.14;
      dom.forestSvg.setAttribute('viewBox', `${state.camera.currentX.toFixed(1)} 0 ${currentVisW} ${viewH}`);
      state.camera.rafId = requestAnimationFrame(stepCamera);
    };
    state.camera.rafId = requestAnimationFrame(stepCamera);
  }

  function setPigState(stateName) {
    dom.pigletMover.className.baseVal = `pig-state-${stateName}`;
  }

  function bumpElement(el) {
    el.classList.remove('pill-bump');
    void el.offsetWidth;
    el.classList.add('pill-bump');
  }

  /* ==========================================================================
     Equation Display & Input Handling
     ========================================================================== */
  function renderProblem(statusClass = '') {
    const p = state.problem;
    if (!p) return;

    if (p.op === 'add') {
      dom.opTypeBadge.textContent = '➕ Addition';
      dom.opTypeBadge.className = 'op-type-tag';
    } else if (p.op === 'mul') {
      dom.opTypeBadge.textContent = '✖️ Multiplication';
      dom.opTypeBadge.className = 'op-type-tag';
    } else {
      dom.opTypeBadge.textContent = p.singleDigitOnly
        ? '🔄 Facteurs (2 à 9)'
        : '🔄 Facteurs (2 à 99)';
      dom.opTypeBadge.className = 'op-type-tag op-type-tag--reverse';
    }

    if (p.op === 'add' || p.op === 'mul') {
      const symbol = p.op === 'add' ? '+' : '×';
      const val = state.input.single;
      const slotClasses = [
        'answer-slot',
        'is-focused',
        val === '' ? 'is-placeholder' : '',
        statusClass
      ].filter(Boolean).join(' ');

      dom.equationRow.innerHTML = `
        <span>${p.a}</span>
        <span class="eq-operator">${symbol}</span>
        <span>${p.b}</span>
        <span class="eq-equals">=</span>
        <button type="button" class="${slotClasses}" id="slotSingle" aria-label="Ta réponse">
          ${val === '' ? '?' : val}
        </button>
      `;
    } else {
      // Reverse Multiplication: [ ? ] × [ ? ] = Product
      const valA = state.input.factorA;
      const valB = state.input.factorB;
      const classA = [
        'answer-slot',
        state.input.activeSlot === 'A' && !statusClass ? 'is-focused' : '',
        valA === '' ? 'is-placeholder' : '',
        statusClass
      ].filter(Boolean).join(' ');
      const classB = [
        'answer-slot',
        state.input.activeSlot === 'B' && !statusClass ? 'is-focused' : '',
        valB === '' ? 'is-placeholder' : '',
        statusClass
      ].filter(Boolean).join(' ');

      dom.equationRow.innerHTML = `
        <button type="button" class="${classA}" id="slotFactorA" aria-label="Premier facteur">
          ${valA === '' ? '?' : valA}
        </button>
        <span class="eq-operator">×</span>
        <button type="button" class="${classB}" id="slotFactorB" aria-label="Deuxième facteur">
          ${valB === '' ? '?' : valB}
        </button>
        <span class="eq-equals">=</span>
        <span>${p.product}</span>
      `;

      document.getElementById('slotFactorA').addEventListener('click', () => {
        if (state.isBusy) return;
        state.input.activeSlot = 'A';
        sfx.switchSlot();
        renderProblem();
        updateSubmitKeyAppearance();
      });

      document.getElementById('slotFactorB').addEventListener('click', () => {
        if (state.isBusy) return;
        state.input.activeSlot = 'B';
        sfx.switchSlot();
        renderProblem();
        updateSubmitKeyAppearance();
      });
    }
  }

  function updateSubmitKeyAppearance() {
    const p = state.problem;
    if (!p) return;
    if (p.op === 'rev' && state.input.activeSlot === 'A' && state.input.factorA !== '' && state.input.factorB === '') {
      dom.keySubmit.textContent = '× Suiv. ⇥';
      dom.keySubmit.classList.add('is-next-factor');
    } else {
      dom.keySubmit.textContent = 'OK ✓';
      dom.keySubmit.classList.remove('is-next-factor');
    }
  }

  function setFeedback(message, tone = 'neutral') {
    dom.feedbackBanner.textContent = message;
    dom.feedbackBanner.className = 'feedback-banner';
    if (tone === 'positive') dom.feedbackBanner.classList.add('is-positive');
    if (tone === 'hint') dom.feedbackBanner.classList.add('is-hint');
  }

  function handleDigitInput(digitStr) {
    if (state.isBusy || isAnyModalOpen()) return;
    const p = state.problem;
    if (!p) return;

    sfx.tap();

    if (p.op === 'add' || p.op === 'mul') {
      if (state.input.single.length >= 4) return;
      // Avoid leading zero unless number is 0
      if (state.input.single === '0') {
        state.input.single = digitStr;
      } else {
        state.input.single += digitStr;
      }
      renderProblem();
      return;
    }

    // Reverse Multiplication
    const maxLen = p.singleDigitOnly ? 1 : 2;
    if (state.input.activeSlot === 'A') {
      if (p.singleDigitOnly) {
        state.input.factorA = digitStr;
        // Automatically advance to factor B for effortless 1-digit entry
        state.input.activeSlot = 'B';
      } else {
        if (state.input.factorA.length >= maxLen) return;
        state.input.factorA = state.input.factorA === '0' ? digitStr : state.input.factorA + digitStr;
        if (state.input.factorA.length === maxLen && state.input.factorB === '') {
          state.input.activeSlot = 'B';
        }
      }
    } else {
      if (p.singleDigitOnly) {
        state.input.factorB = digitStr;
      } else {
        if (state.input.factorB.length >= maxLen) return;
        state.input.factorB = state.input.factorB === '0' ? digitStr : state.input.factorB + digitStr;
      }
    }

    renderProblem();
    updateSubmitKeyAppearance();
  }

  function handleBackspace() {
    if (state.isBusy || isAnyModalOpen()) return;
    const p = state.problem;
    if (!p) return;

    sfx.erase();

    if (p.op === 'add' || p.op === 'mul') {
      state.input.single = state.input.single.slice(0, -1);
      renderProblem();
      return;
    }

    if (state.input.activeSlot === 'B') {
      if (state.input.factorB.length > 0) {
        state.input.factorB = state.input.factorB.slice(0, -1);
      } else {
        state.input.activeSlot = 'A';
        state.input.factorA = state.input.factorA.slice(0, -1);
      }
    } else {
      state.input.factorA = state.input.factorA.slice(0, -1);
    }

    renderProblem();
    updateSubmitKeyAppearance();
  }

  function handleSubmitOrAdvance() {
    if (state.isBusy || isAnyModalOpen()) return;
    const p = state.problem;
    if (!p) return;

    if (p.op === 'add' || p.op === 'mul') {
      if (state.input.single === '') {
        setFeedback('Entre un nombre avec le clavier !', 'hint');
        return;
      }
      const userVal = Number(state.input.single);
      if (userVal === p.answer) {
        onCorrectAnswer();
      } else {
        onWrongAnswer(`${p.a} ${p.op === 'add' ? '+' : '×'} ${p.b} = ${p.answer}`);
      }
      return;
    }

    // Reverse Multiplication
    if (state.input.activeSlot === 'A' && state.input.factorA !== '' && state.input.factorB === '') {
      state.input.activeSlot = 'B';
      sfx.switchSlot();
      renderProblem();
      updateSubmitKeyAppearance();
      return;
    }

    if (state.input.factorA === '' || state.input.factorB === '') {
      state.input.activeSlot = state.input.factorA === '' ? 'A' : 'B';
      setFeedback('Remplis les deux facteurs pour valider !', 'hint');
      renderProblem();
      updateSubmitKeyAppearance();
      return;
    }

    const a = Number(state.input.factorA);
    const b = Number(state.input.factorB);

    // Cheeky check against trivial 1 × N
    if (a <= 1 || b <= 1) {
      sfx.oops();
      setFeedback('Haha, pas de × 1 petit malin ! Trouve deux facteurs ≥ 2 🐽', 'hint');
      renderProblem('is-wrong');
      setTimeout(() => {
        state.input.factorA = '';
        state.input.factorB = '';
        state.input.activeSlot = 'A';
        renderProblem();
        updateSubmitKeyAppearance();
      }, 520);
      return;
    }

    if (p.singleDigitOnly && (a > 9 || b > 9)) {
      sfx.oops();
      setFeedback('Choisis deux facteurs d’un seul chiffre (2 à 9) !', 'hint');
      return;
    }

    if (a * b === p.product) {
      onCorrectAnswer();
    } else {
      const actualProd = a * b;
      onWrongAnswer(`${p.sampleA} × ${p.sampleB} = ${p.product}`, `${a} × ${b} = ${actualProd} ! Essaie encore 🐽`);
    }
  }

  /* ==========================================================================
     Answer Resolution: Digging, Truffle Discovery & 10-Truffle Pickle Lollipop!
     ========================================================================== */
  function onCorrectAnswer() {
    state.isBusy = true;
    renderProblem('is-correct');

    state.progress.totalTruffles += 1;
    const earnedSlotIndex = state.progress.cycleTruffles;
    state.progress.cycleTruffles += 1;
    state.progress.streak += 1;
    if (state.progress.streak > state.progress.bestStreak) {
      state.progress.bestStreak = state.progress.streak;
    }
    if (state.settings.timerMode === 'sprint60') {
      state.timer.sprintTruffles += 1;
    }

    const praises = [
      'Grouik ! Une belle truffe noire déterrée ! +1 🍄',
      'Quel flair ! Barnabé a trouvé une truffe ! +1 🍄',
      'Exact ! Miam, une pépite du Périgord ! +1 🍄',
      'Super calcul ! La truffe sort de terre ! +1 🍄'
    ];
    setFeedback(pickRandom(praises), 'positive');

    // Step 1: Barnabé digs rapidly
    setPigState('dig');
    sfx.trufflePop();

    setTimeout(() => {
      // Step 2: Truffle pops out of the soil & Barnabé jumps happily!
      setPigState('happy');
      dom.poppedTruffle.classList.remove('is-popping');
      void dom.poppedTruffle.offsetWidth;
      dom.poppedTruffle.classList.add('is-popping');

      syncTruffleTrackUI(earnedSlotIndex);
      bumpElement(dom.btnTruffleStats);

      const wonPickleLollipop = state.progress.cycleTruffles >= 10;

      if (wonPickleLollipop) {
        state.progress.pickleLollipops += 1;
        state.progress.cycleTruffles = 0;
        saveState();

        setTimeout(() => {
          dom.pickleLollipopsCount.textContent = String(state.progress.pickleLollipops);
          bumpElement(dom.btnOpenCollection);
          openPickleRewardCelebration();
        }, 720);
      } else {
        saveState();
        // Step 3: Barnabé trots forward to the next truffle mound!
        setTimeout(() => {
          setPigState('trot');
          updatePigletPosition(state.progress.cycleTruffles, true);
        }, 520);

        setTimeout(() => {
          setPigState('sniff');
          state.isBusy = false;
          setFeedback('Sniff sniff… une autre truffe se cache ici !');
          nextProblem();
        }, 1020);
      }
    }, 280);
  }

  function onWrongAnswer(correctSolutionText, customFirstHint = null) {
    state.input.attemptsOnCurrent += 1;
    state.progress.streak = 0;
    dom.streakChip.classList.remove('is-visible');
    sfx.oops();
    setPigState('oops');
    renderProblem('is-wrong');

    if (state.input.attemptsOnCurrent === 1) {
      // Give a friendly second chance!
      state.isBusy = true;
      setFeedback(customFirstHint || 'Oups, pas tout à fait ! Essaie encore une fois 🐽', 'hint');
      setTimeout(() => {
        state.input.single = '';
        state.input.factorA = '';
        state.input.factorB = '';
        state.input.activeSlot = 'A';
        setPigState('sniff');
        state.isBusy = false;
        renderProblem();
        updateSubmitKeyAppearance();
      }, 520);
    } else {
      // Reveal solution gently and move to a fresh problem
      state.isBusy = true;
      setFeedback(`La truffe s'est cachée ! C'était ${correctSolutionText}`, 'hint');
      setTimeout(() => {
        setPigState('sniff');
        state.isBusy = false;
        setFeedback('Nouvelle piste ! Aide Barnabé à fouiller 🐽');
        nextProblem();
      }, 1650);
    }
  }

  /* ==========================================================================
     10-Truffle Pickle Lollipop Celebration & Confetti Engine
     ========================================================================== */
  function openPickleRewardCelebration() {
    sfx.pickleFanfare();
    launchConfetti();

    const count = state.progress.pickleLollipops;
    const flavor = PICKLE_FLAVORS[(count - 1) % PICKLE_FLAVORS.length];
    const prestigeSuffix = count > PICKLE_FLAVORS.length ? ` (Édition #${count})` : '';

    dom.rewardFlavorName.textContent = `${flavor.name}${prestigeSuffix}`;
    dom.rewardDescription.innerHTML = `${flavor.desc}<br>Tu as maintenant <strong>${count}</strong> sucette${count > 1 ? 's' : ''} au cornichon !`;
    dom.pickleRewardModal.classList.add('is-open');
  }

  function closePickleRewardAndContinue() {
    dom.pickleRewardModal.classList.remove('is-open');
    syncTruffleTrackUI();
    setPigState('trot');
    updatePigletPosition(0, true);
    setTimeout(() => {
      setPigState('sniff');
      state.isBusy = false;
      setFeedback('En route pour 10 nouvelles truffes ! 🐽');
      nextProblem();
    }, 450);
  }

  function launchConfetti() {
    const canvas = dom.confettiCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#67c742', '#ffdf4d', '#ff8aa6', '#46a032', '#ffa133', '#ffffff'];
    const pieces = Array.from({ length: 85 }, () => ({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 160,
      y: canvas.height * 0.42,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 14 - 5,
      size: Math.random() * 7 + 5,
      color: pickRandom(colors),
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.25,
      gravity: 0.34
    }));

    let frame = 0;
    function drawConfetti() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach((p) => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.vx *= 0.985;
        p.rot += p.vRot;
        if (p.y < canvas.height + 30) alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        ctx.restore();
      });

      if (alive && frame < 190) {
        requestAnimationFrame(drawConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(drawConfetti);
  }

  /* ==========================================================================
     Timer Engine (Off | Per-Question 20s / 12s | Sprint 60s)
     ========================================================================== */
  function stopTimer() {
    if (state.timer.rafId) {
      cancelAnimationFrame(state.timer.rafId);
      state.timer.rafId = null;
    }
  }

  function refreshTimerVisibility() {
    const mode = state.settings.timerMode;
    const active = mode !== 'off';
    dom.timerStrip.classList.toggle('is-active', active);
    dom.btnToggleTimerQuick.classList.toggle('icon-btn--active', active);

    const labels = {
      off: 'Sans chrono',
      '20': '20s / calcul',
      '12': '12s / calcul',
      sprint60: 'Sprint 60s'
    };
    dom.quickTimerLabel.textContent = labels[mode] || 'Chrono';

    if (!active) {
      stopTimer();
      dom.timerReadout.textContent = '';
      dom.timerStripFill.style.transform = 'scaleX(1)';
    }
  }

  function startQuestionTimer(durationMs) {
    stopTimer();
    state.timer.totalMs = durationMs;
    state.timer.remainingMs = durationMs;
    state.timer.lastTick = performance.now();
    refreshTimerVisibility();
    state.timer.rafId = requestAnimationFrame(tickTimerLoop);
  }

  function startSprint60() {
    stopTimer();
    state.timer.totalMs = 60000;
    state.timer.remainingMs = 60000;
    state.timer.sprintTruffles = 0;
    state.timer.lastTick = performance.now();
    refreshTimerVisibility();
    state.timer.rafId = requestAnimationFrame(tickTimerLoop);
  }

  function isAnyModalOpen() {
    return (
      dom.settingsModal.classList.contains('is-open') ||
      dom.pickleRewardModal.classList.contains('is-open') ||
      dom.collectionModal.classList.contains('is-open') ||
      dom.sprintEndModal.classList.contains('is-open')
    );
  }

  function tickTimerLoop(now) {
    if (state.settings.timerMode === 'off') return;

    const dt = now - state.timer.lastTick;
    state.timer.lastTick = now;

    // Pause countdown while modals or celebration animations are active
    if (!state.isBusy && !isAnyModalOpen()) {
      state.timer.remainingMs = Math.max(0, state.timer.remainingMs - dt);
    }

    const ratio = state.timer.totalMs > 0 ? state.timer.remainingMs / state.timer.totalMs : 0;
    dom.timerStripFill.style.transform = `scaleX(${ratio.toFixed(4)})`;
    dom.timerStripFill.classList.toggle('is-warn', ratio <= 0.45 && ratio > 0.22);
    dom.timerStripFill.classList.toggle('is-danger', ratio <= 0.22);

    const secs = (state.timer.remainingMs / 1000).toFixed(1);
    dom.timerReadout.textContent = `⏱️ ${secs}s`;
    dom.timerReadout.classList.toggle('is-danger', state.timer.remainingMs <= 3500);

    if (state.timer.remainingMs <= 0) {
      if (state.settings.timerMode === 'sprint60') {
        onSprint60Finished();
      } else {
        onPerQuestionTimeout();
      }
      return;
    }

    state.timer.rafId = requestAnimationFrame(tickTimerLoop);
  }

  function onPerQuestionTimeout() {
    stopTimer();
    state.isBusy = true;
    state.progress.streak = 0;
    dom.streakChip.classList.remove('is-visible');
    sfx.oops();
    setPigState('oops');
    renderProblem('is-wrong');

    const p = state.problem;
    const sol = p.op === 'rev'
      ? `${p.sampleA} × ${p.sampleB} = ${p.product}`
      : `${p.a} ${p.op === 'add' ? '+' : '×'} ${p.b} = ${p.answer}`;
    setFeedback(`⏱️ Temps écoulé ! C'était ${sol}`, 'hint');

    setTimeout(() => {
      setPigState('sniff');
      state.isBusy = false;
      setFeedback('On repart à la chasse aux truffes ! 🐽');
      nextProblem();
    }, 1600);
  }

  function onSprint60Finished() {
    stopTimer();
    const count = state.timer.sprintTruffles;
    dom.sprintResultText.textContent = `${count} truffe${count > 1 ? 's' : ''} déterrée${count > 1 ? 's' : ''} en 60 secondes !`;
    dom.sprintDetailText.textContent = count >= 10
      ? 'Incroyable ! Tu as même gagné une sucette au cornichon pendant ce sprint !'
      : 'Chaque bonne réponse rapproche Barnabé de la prochaine sucette au cornichon !';
    dom.sprintEndModal.classList.add('is-open');
  }

  /* ==========================================================================
     Settings & Collection Modals
     ========================================================================== */
  function updateSummaryChips() {
    const opIcons = { add: '➕', mul: '✖️', rev: '🔄' };
    const opsText = state.settings.ops.map((o) => opIcons[o]).join(' ');
    const digitsLabels = { '1': '1 ch.', '2': '2 ch.', mix: '1-2 ch.' };
    const diffLabels = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };
    dom.summaryChipText.textContent = `${opsText} • ${digitsLabels[state.settings.digits]} • ${diffLabels[state.settings.difficulty]}`;
    dom.soundIcon.textContent = state.settings.sound ? '🔊' : '🔇';
    refreshTimerVisibility();
  }

  function openSettingsModal() {
    state.draftSettings = {
      ops: [...state.settings.ops],
      digits: state.settings.digits,
      difficulty: state.settings.difficulty,
      timerMode: state.settings.timerMode
    };
    syncSettingsModalChips();
    dom.settingsModal.classList.add('is-open');
  }

  function syncSettingsModalChips() {
    const d = state.draftSettings;
    if (!d) return;
    document.querySelectorAll('[data-op]').forEach((btn) => {
      btn.classList.toggle('is-selected', d.ops.includes(btn.dataset.op));
    });
    document.querySelectorAll('[data-digits]').forEach((btn) => {
      btn.classList.toggle('is-selected', d.digits === btn.dataset.digits);
    });
    document.querySelectorAll('[data-diff]').forEach((btn) => {
      btn.classList.toggle('is-selected', d.difficulty === btn.dataset.diff);
    });
    document.querySelectorAll('[data-timer]').forEach((btn) => {
      btn.classList.toggle('is-selected', d.timerMode === btn.dataset.timer);
    });
  }

  function applySettingsFromModal() {
    if (!state.draftSettings) return;
    state.settings.ops = [...state.draftSettings.ops];
    state.settings.digits = state.draftSettings.digits;
    state.settings.difficulty = state.draftSettings.difficulty;
    state.settings.timerMode = state.draftSettings.timerMode;
    saveState();
    dom.settingsModal.classList.remove('is-open');

    updateSummaryChips();
    setFeedback('Nouveaux réglages activés ! Sniff sniff… 🐽');
    if (state.settings.timerMode === 'sprint60') {
      startSprint60();
    }
    nextProblem();
  }

  function openCollectionModal() {
    const { totalTruffles, pickleLollipops, bestStreak } = state.progress;
    dom.collectionStatsLine.textContent = `${totalTruffles} truffe${totalTruffles > 1 ? 's' : ''} au total • ${pickleLollipops} sucette${pickleLollipops > 1 ? 's' : ''} • Meilleure série : ${bestStreak}`;

    const totalCards = Math.max(4, Math.min(PICKLE_FLAVORS.length, pickleLollipops + 2));
    dom.trophyGrid.innerHTML = PICKLE_FLAVORS.slice(0, totalCards).map((item, idx) => {
      const unlocked = idx < pickleLollipops;
      return `
        <div class="trophy-item ${unlocked ? '' : 'is-locked'}">
          <div style="font-size:1.85rem;" aria-hidden="true">${unlocked ? '🥒🍭' : '🔒'}</div>
          <div class="trophy-item-title">${unlocked ? item.name : `À ${10 * (idx + 1)} truffes`}</div>
        </div>
      `;
    }).join('');

    dom.collectionModal.classList.add('is-open');
  }

  /* ==========================================================================
     Event Listeners (Touch, Click & Hardware Keyboard for iPad / Mac / PC)
     ========================================================================== */
  function bindEvents() {
    // Keypad buttons
    document.querySelectorAll('.key-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        if (key === 'BACKSPACE') {
          handleBackspace();
        } else if (key === 'SUBMIT') {
          handleSubmitOrAdvance();
        } else {
          handleDigitInput(key);
        }
      });
    });

    // Physical keyboard support (iPad Magic Keyboard & Desktop)
    window.addEventListener('keydown', (e) => {
      if (isAnyModalOpen()) {
        if (e.key === 'Escape') {
          dom.settingsModal.classList.remove('is-open');
          dom.collectionModal.classList.remove('is-open');
        }
        if (e.key === 'Enter' && dom.pickleRewardModal.classList.contains('is-open')) {
          e.preventDefault();
          closePickleRewardAndContinue();
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitOrAdvance();
      } else if (
        (e.key === 'Tab' || e.key === ' ' || e.key === '*' || e.key.toLowerCase() === 'x' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') &&
        state.problem && state.problem.op === 'rev'
      ) {
        e.preventDefault();
        state.input.activeSlot = e.key === 'ArrowLeft'
          ? 'A'
          : (state.input.activeSlot === 'A' ? 'B' : 'A');
        sfx.switchSlot();
        renderProblem();
        updateSubmitKeyAppearance();
      }
    });

    // Header & HUD controls
    dom.btnOpenSettings.addEventListener('click', () => {
      sfx.tap();
      openSettingsModal();
    });
    dom.btnStageSummary.addEventListener('click', () => {
      sfx.tap();
      openSettingsModal();
    });
    dom.btnCloseSettings.addEventListener('click', () => {
      dom.settingsModal.classList.remove('is-open');
    });
    dom.btnApplySettings.addEventListener('click', () => {
      sfx.tap();
      applySettingsFromModal();
    });

    // Quick Timer Cycle button
    dom.btnToggleTimerQuick.addEventListener('click', () => {
      sfx.tap();
      const order = ['off', '20', '12', 'sprint60'];
      const nextIdx = (order.indexOf(state.settings.timerMode) + 1) % order.length;
      state.settings.timerMode = order[nextIdx];
      saveState();
      updateSummaryChips();
      if (state.settings.timerMode === 'sprint60') {
        setFeedback('⚡ Sprint 60 secondes lancé ! Déterre un max de truffes !');
        startSprint60();
        nextProblem();
      } else if (state.settings.timerMode === 'off') {
        setFeedback('🧘 Mode sans chronomètre activé.');
      } else {
        setFeedback(`⏱️ Chronomètre : ${state.settings.timerMode}s par calcul !`);
        startQuestionTimer(Number(state.settings.timerMode) * 1000);
      }
    });

    // Sound toggle
    dom.btnToggleSound.addEventListener('click', () => {
      state.settings.sound = !state.settings.sound;
      if (state.settings.sound) sfx.tap();
      updateSummaryChips();
      saveState();
    });

    // Settings Option Chips
    document.querySelectorAll('[data-op]').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.tap();
        const op = btn.dataset.op;
        const list = state.draftSettings.ops;
        if (list.includes(op)) {
          if (list.length > 1) {
            state.draftSettings.ops = list.filter((item) => item !== op);
          }
        } else {
          state.draftSettings.ops.push(op);
        }
        syncSettingsModalChips();
      });
    });

    document.querySelectorAll('[data-digits]').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.tap();
        state.draftSettings.digits = btn.dataset.digits;
        syncSettingsModalChips();
      });
    });

    document.querySelectorAll('[data-diff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.tap();
        state.draftSettings.difficulty = btn.dataset.diff;
        syncSettingsModalChips();
      });
    });

    document.querySelectorAll('[data-timer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.tap();
        state.draftSettings.timerMode = btn.dataset.timer;
        syncSettingsModalChips();
      });
    });

    // Modals: Reward, Collection, Sprint
    dom.btnContinueAfterReward.addEventListener('click', () => {
      sfx.tap();
      closePickleRewardAndContinue();
    });

    dom.btnOpenCollection.addEventListener('click', () => {
      sfx.tap();
      openCollectionModal();
    });
    dom.btnTruffleStats.addEventListener('click', () => {
      sfx.tap();
      openCollectionModal();
    });
    dom.btnCloseCollection.addEventListener('click', () => {
      dom.collectionModal.classList.remove('is-open');
    });
    dom.btnCloseCollectionMain.addEventListener('click', () => {
      dom.collectionModal.classList.remove('is-open');
    });

    dom.btnResetProgress.addEventListener('click', () => {
      state.progress = {
        totalTruffles: 0,
        cycleTruffles: 0,
        pickleLollipops: 0,
        streak: 0,
        bestStreak: 0
      };
      saveState();
      syncTruffleTrackUI();
      updatePigletPosition(0, false);
      openCollectionModal();
    });

    dom.btnRestartSprint.addEventListener('click', () => {
      sfx.tap();
      dom.sprintEndModal.classList.remove('is-open');
      startSprint60();
      nextProblem();
    });

    // Close backdrop on outside tap
    [dom.settingsModal, dom.collectionModal].forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('is-open');
      });
    });

    // Responsive resize / orientation change for iPhone & iPad rotation
    window.addEventListener('resize', () => {
      const spot = TRAIL_SPOTS[Math.min(9, state.progress.cycleTruffles)];
      syncSvgCamera(spot.x - 40, false);
    });
  }

  /* ==========================================================================
     Bootstrap
     ========================================================================== */
  function init() {
    loadState();
    renderTruffleBasketSlots();
    updateSummaryChips();
    bindEvents();
    updatePigletPosition(state.progress.cycleTruffles, false);

    if (state.settings.timerMode === 'sprint60') {
      startSprint60();
    }
    nextProblem();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
