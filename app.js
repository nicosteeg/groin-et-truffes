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

  // 1 new hat unlocked every 3 Pickle Lollipops (3, 6, 9, 12, 15, 18, 21+)
  const PIG_HATS = [
    {
      id: 1,
      unlockAt: 3,
      name: 'Le Béret du Truffier',
      shortName: 'Béret',
      svg: `
        <path d="M-11,1 Q0,4 11,1 L10,-2 Q0,0 -10,-2 Z" fill="#1e2640" />
        <path d="M-16,-2 C-18,-10 -6,-14 6,-11 C15,-9 16,-2 11,1 Q0,3 -16,-2 Z" fill="#2b3a67" stroke="#182240" stroke-width="1.2" />
        <path d="M-1,-11 Q0,-16 3,-15" fill="none" stroke="#182240" stroke-width="2" stroke-linecap="round" />
        <circle cx="6" cy="-4" r="2.2" fill="#67c742" stroke="#1f5412" stroke-width="0.8" />
      `
    },
    {
      id: 2,
      unlockAt: 6,
      name: 'Le Chapeau d’Explorateur',
      shortName: 'Explorateur',
      svg: `
        <ellipse cx="0" cy="0.5" rx="18" ry="4.2" fill="#c79c63" stroke="#7d592d" stroke-width="1.2" />
        <path d="M-11,0 C-11,-12 -5,-15 0,-13 C5,-15 11,-12 11,0 Z" fill="#dfbc86" stroke="#7d592d" stroke-width="1.2" />
        <path d="M-11,-1 Q0,2 11,-1 L10.5,-4.2 Q0,-1.5 -10.5,-4.2 Z" fill="#3f8f29" />
      `
    },
    {
      id: 3,
      unlockAt: 9,
      name: 'La Toque de Grand Chef',
      shortName: 'Chef',
      svg: `
        <circle cx="-7" cy="-13" r="6.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <circle cx="7" cy="-13" r="6.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <circle cx="0" cy="-16" r="7.8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="-10.5" y="-7" width="21" height="8" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <path d="M-4,-7 L-5,-12 M0,-7 L0,-13 M4,-7 L5,-12" stroke="#cbd5e1" stroke-width="1" stroke-linecap="round" />
      `
    },
    {
      id: 4,
      unlockAt: 12,
      name: 'Le Haut-de-Forme Cornichon',
      shortName: 'Haut-de-Forme',
      svg: `
        <ellipse cx="0" cy="1" rx="16" ry="3.6" fill="#1d5c2a" stroke="#0f3818" stroke-width="1.2" />
        <path d="M-9.5,1 L-11,-18 Q0,-21 11,-18 L9.5,1 Z" fill="#297a3a" stroke="#0f3818" stroke-width="1.2" />
        <path d="M-9.8,-2.5 Q0,-0.5 9.8,-2.5 L10,-6.5 Q0,-4.5 -10,-6.5 Z" fill="#f5c542" />
        <ellipse cx="6" cy="-9" rx="2.5" ry="5.2" transform="rotate(18 6 -9)" fill="#6be048" stroke="#1b4f0e" stroke-width="1" />
      `
    },
    {
      id: 5,
      unlockAt: 15,
      name: 'Le Bicorne des Sous-Bois',
      shortName: 'Pirate',
      svg: `
        <path d="M-19,1 Q-12,-16 0,-15 Q12,-16 19,1 Q0,5 -19,1 Z" fill="#2c2523" stroke="#f5c542" stroke-width="1.4" />
        <path d="M-12,1 Q0,4 12,1 L11,-2 Q0,1 -11,-2 Z" fill="#d93829" />
        <circle cx="0" cy="-7" r="3.2" fill="#ffd84d" stroke="#8c620a" stroke-width="0.9" />
      `
    },
    {
      id: 6,
      unlockAt: 18,
      name: 'Le Chapeau d’Enchanteur',
      shortName: 'Magicien',
      svg: `
        <ellipse cx="0" cy="1" rx="17.5" ry="3.8" fill="#3b2d7a" stroke="#1f1547" stroke-width="1.2" />
        <path d="M-10.5,1 C-8,-10 -3,-20 5,-25 C3,-17 7,-10 10.5,1 Z" fill="#4f3da1" stroke="#1f1547" stroke-width="1.2" />
        <path d="M-10,0 Q0,2 10,0" stroke="#ffd84d" stroke-width="2.2" fill="none" />
        <circle cx="-2" cy="-8" r="1.8" fill="#ffe159" />
        <circle cx="3" cy="-14" r="1.4" fill="#ffe159" />
      `
    },
    {
      id: 7,
      unlockAt: 21,
      name: 'La Couronne Royale Cornichon',
      shortName: 'Couronne',
      svg: `
        <ellipse cx="0" cy="-3" rx="10" ry="6" fill="#c92a2a" />
        <path d="M-11,1 L-12,-12 L-5,-5 L0,-15 L5,-5 L12,-12 L11,1 Q0,4 -11,1 Z" fill="#ffd43b" stroke="#b57c00" stroke-width="1.3" stroke-linejoin="round" />
        <circle cx="0" cy="-4" r="2.3" fill="#4cd938" stroke="#1d6613" stroke-width="0.7" />
        <circle cx="-6.5" cy="-3.5" r="1.6" fill="#e03131" />
        <circle cx="6.5" cy="-3.5" r="1.6" fill="#e03131" />
        <circle cx="-12" cy="-13" r="1.6" fill="#fff9db" />
        <circle cx="0" cy="-16" r="1.8" fill="#fff9db" />
        <circle cx="12" cy="-13" r="1.6" fill="#fff9db" />
      `
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
      equippedHat: 0,   // 0 = none, 1..7 = PIG_HATS id
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
      freshTap: false, // Replaces existing box value if user tapped an already-filled box
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
    hatFanfare() {
      const notes = [587.33, 739.99, 880, 1174.66, 1479.98, 1760];
      const times = [0, 0.08, 0.16, 0.25, 0.36, 0.48];
      const durs = [0.12, 0.12, 0.14, 0.16, 0.18, 0.55];
      notes.forEach((n, idx) => {
        playTone(n, 'sine', durs[idx], times[idx], 0.15);
      });
    },
    oops() {
      playTone(270, 'sine', 0.12, 0, 0.1, 230);
      playTone(215, 'sine', 0.18, 0.11, 0.1, 185);
    },
    dustBoom() {
      // Cartoonish puffy dust explosion (filtered noise burst + comical splat/boop)
      const ctx = ensureAudio();
      if (ctx) {
        try {
          const duration = 0.34;
          const bufferSize = Math.floor(ctx.sampleRate * duration);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(950, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + duration);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.24, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start(ctx.currentTime);
        } catch (_) {}
      }
      playTone(210, 'sawtooth', 0.16, 0.01, 0.09, 95);
      playTone(165, 'triangle', 0.22, 0.12, 0.11, 115);
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
    btnOpenWardrobeHud: document.getElementById('btnOpenWardrobeHud'),
    btnQuickCycleHat: document.getElementById('btnQuickCycleHat'),
    hatHudText: document.getElementById('hatHudText'),

    forestSvgWrap: document.querySelector('.forest-svg-wrap'),
    forestSvg: document.getElementById('forestSvg'),
    trailSpotsGroup: document.getElementById('trailSpotsGroup'),
    pigletMover: document.getElementById('pigletMover'),
    pigHatSlot: document.getElementById('pigHatSlot'),
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
    hatUnlockBanner: document.getElementById('hatUnlockBanner'),
    hatUnlockSvgWrap: document.getElementById('hatUnlockSvgWrap'),
    hatUnlockTitle: document.getElementById('hatUnlockTitle'),
    hatUnlockSub: document.getElementById('hatUnlockSub'),
    hatProgressPill: document.getElementById('hatProgressPill'),
    btnContinueAfterReward: document.getElementById('btnContinueAfterReward'),

    collectionModal: document.getElementById('collectionModal'),
    collectionStatsLine: document.getElementById('collectionStatsLine'),
    hatWardrobeGrid: document.getElementById('hatWardrobeGrid'),
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
  function getUnlockedHatsCount() {
    return Math.min(PIG_HATS.length, Math.floor(state.progress.pickleLollipops / 3));
  }

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
        const maxUnlocked = getUnlockedHatsCount();
        if (typeof parsed.progress.equippedHat === 'number') {
          state.progress.equippedHat = Math.min(maxUnlocked, Math.max(0, parsed.progress.equippedHat));
        } else {
          // Automatically equip highest earned hat if upgrading from older save
          state.progress.equippedHat = maxUnlocked;
        }
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
          equippedHat: state.progress.equippedHat,
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
      freshTap: false,
      attemptsOnCurrent: 0
    };

    renderProblem();
    updateSubmitKeyAppearance();

    if (state.settings.timerMode === '20' || state.settings.timerMode === '12') {
      startQuestionTimer(Number(state.settings.timerMode) * 1000);
    }
  }

  /* ==========================================================================
     Barnabé Hat System (1 New Hat Every 3 Pickle Lollipops!)
     ========================================================================== */
  function renderHatPreviewSvg(hatObj) {
    return `<svg viewBox="-22 -28 44 33" aria-hidden="true">${hatObj.svg}</svg>`;
  }

  function syncPigHatUI(celebrate = false) {
    const activeHat = PIG_HATS.find((h) => h.id === state.progress.equippedHat) || null;
    if (dom.pigHatSlot) {
      dom.pigHatSlot.innerHTML = activeHat ? activeHat.svg : '';
    }
    if (window.Barnabe3D && window.Barnabe3D.initialized) {
      window.Barnabe3D.setHat(state.progress.equippedHat, celebrate);
    }
    if (dom.btnQuickCycleHat) {
      dom.btnQuickCycleHat.hidden = getUnlockedHatsCount() < 2;
    }
    if (dom.hatHudText) {
      const count = state.progress.pickleLollipops;
      const inCycle = count % 3;
      if (!activeHat && count < 3) {
        dom.hatHudText.textContent = `🎩 ${inCycle}/3 🍭`;
      } else if (count < PIG_HATS.length * 3) {
        const label = activeHat ? activeHat.shortName : 'Chapeaux';
        dom.hatHudText.textContent = `🎩 ${label} • ${inCycle}/3`;
      } else {
        dom.hatHudText.textContent = `🎩 ${activeHat ? activeHat.shortName : '7/7'}`;
      }
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

  function syncTruffleTrackUI(newlyEarnedIdx = -1, lostRange = null) {
    const slots = dom.truffleSlotsContainer.querySelectorAll('.truffle-slot');
    slots.forEach((el, idx) => {
      const filled = idx < state.progress.cycleTruffles;
      el.classList.toggle('is-filled', filled);
      el.classList.remove('just-earned', 'just-lost');
      if (idx === newlyEarnedIdx) {
        void el.offsetWidth;
        el.classList.add('just-earned');
      } else if (lostRange && idx >= lostRange.start && idx < lostRange.end) {
        void el.offsetWidth;
        el.classList.add('just-lost');
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

    syncPigHatUI();
    renderTrailSpotsOnSvg();
  }

  function renderTrailSpotsOnSvg() {
    const foundCount = state.progress.cycleTruffles;
    if (window.Barnabe3D && window.Barnabe3D.initialized) {
      window.Barnabe3D.setFoundCount(foundCount);
    }
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
    if (window.Barnabe3D && window.Barnabe3D.initialized) {
      window.Barnabe3D.setPosition(clampedIdx, animateCamera);
    }
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
    if (window.Barnabe3D && window.Barnabe3D.initialized) {
      window.Barnabe3D.setPigState(stateName);
    }
  }

  function bumpElement(el) {
    el.classList.remove('pill-bump');
    void el.offsetWidth;
    el.classList.add('pill-bump');
  }

  /* ==========================================================================
     Equation Display & Input Handling (Multi-digit friendly in ALL boxes!)
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
      dom.opTypeBadge.textContent = '🔄 Trouve 2 facteurs (≥ 2)';
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

      document.getElementById('slotSingle').addEventListener('click', () => {
        if (state.isBusy) return;
        state.input.freshTap = state.input.single.length > 0;
        sfx.switchSlot();
      });
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
        <span id="opMultiplySwitch" class="eq-operator eq-operator--clickable" title="Passer à l'autre case">×</span>
        <button type="button" class="${classB}" id="slotFactorB" aria-label="Deuxième facteur">
          ${valB === '' ? '?' : valB}
        </button>
        <span class="eq-equals">=</span>
        <span>${p.product}</span>
      `;

      document.getElementById('slotFactorA').addEventListener('click', () => {
        if (state.isBusy) return;
        state.input.activeSlot = 'A';
        state.input.freshTap = state.input.factorA.length > 0;
        sfx.switchSlot();
        renderProblem();
        updateSubmitKeyAppearance();
      });

      document.getElementById('slotFactorB').addEventListener('click', () => {
        if (state.isBusy) return;
        state.input.activeSlot = 'B';
        state.input.freshTap = state.input.factorB.length > 0;
        sfx.switchSlot();
        renderProblem();
        updateSubmitKeyAppearance();
      });

      document.getElementById('opMultiplySwitch').addEventListener('click', () => {
        if (state.isBusy) return;
        state.input.activeSlot = state.input.activeSlot === 'A' ? 'B' : 'A';
        const targetVal = state.input.activeSlot === 'A' ? state.input.factorA : state.input.factorB;
        state.input.freshTap = targetVal.length > 0;
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
      if (state.input.freshTap) {
        state.input.single = '';
        state.input.freshTap = false;
      }
      if (state.input.single.length >= 4) return;
      state.input.single = state.input.single === '0' ? digitStr : state.input.single + digitStr;
      renderProblem();
      return;
    }

    // Reverse Multiplication: ALWAYS allow 1, 2, or 3 digits in BOTH factor boxes!
    // Focus stays in the active box until the user taps the other box or presses "× Suiv. ⇥".
    const maxFactorDigits = 3;
    if (state.input.activeSlot === 'A') {
      if (state.input.freshTap) {
        state.input.factorA = '';
        state.input.freshTap = false;
      }
      if (state.input.factorA.length >= maxFactorDigits) return;
      state.input.factorA = state.input.factorA === '0' ? digitStr : state.input.factorA + digitStr;
    } else {
      if (state.input.freshTap) {
        state.input.factorB = '';
        state.input.freshTap = false;
      }
      if (state.input.factorB.length >= maxFactorDigits) return;
      state.input.factorB = state.input.factorB === '0' ? digitStr : state.input.factorB + digitStr;
    }

    renderProblem();
    updateSubmitKeyAppearance();
  }

  function handleBackspace() {
    if (state.isBusy || isAnyModalOpen()) return;
    const p = state.problem;
    if (!p) return;

    sfx.erase();
    state.input.freshTap = false;

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

    state.input.freshTap = false;

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

    // Reverse Multiplication: if user typed factor A and factor B is still empty, move to factor B!
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

        // Every 3 Pickle Lollipops -> Barnabé unlocks & equips a brand new hat!
        let newlyUnlockedHat = null;
        if (state.progress.pickleLollipops % 3 === 0) {
          const hatIdx = (Math.floor(state.progress.pickleLollipops / 3) - 1) % PIG_HATS.length;
          newlyUnlockedHat = PIG_HATS[hatIdx];
          state.progress.equippedHat = newlyUnlockedHat.id;
        }
        syncPigHatUI();
        saveState();

        setTimeout(() => {
          dom.pickleLollipopsCount.textContent = String(state.progress.pickleLollipops);
          bumpElement(dom.btnOpenCollection);
          if (newlyUnlockedHat && dom.btnOpenWardrobeHud) {
            bumpElement(dom.btnOpenWardrobeHud);
          }
          openPickleRewardCelebration(newlyUnlockedHat);
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

    // Lose up to 3 truffles from the current basket on a wrong answer!
    const prevCycle = state.progress.cycleTruffles;
    const lost = Math.min(3, prevCycle);
    if (lost > 0) {
      state.progress.cycleTruffles -= lost;
      state.progress.totalTruffles = Math.max(0, state.progress.totalTruffles - lost);
      saveState();
    }

    sfx.dustBoom();
    setPigState('oops');
    renderProblem('is-wrong');

    if (window.Barnabe3D && window.Barnabe3D.initialized) {
      window.Barnabe3D.triggerDustExplosion(lost);
    }

    if (lost > 0) {
      syncTruffleTrackUI(-1, { start: state.progress.cycleTruffles, end: prevCycle });
      bumpElement(dom.btnTruffleStats);
    }

    const lostTag = lost > 0 ? ` -${lost} truffe${lost > 1 ? 's' : ''} !` : '';

    if (state.input.attemptsOnCurrent === 1) {
      // Friendly second chance after shaking off the dust explosion!
      state.isBusy = true;
      setFeedback(
        customFirstHint
          ? `💥 Pouf !${lostTag} ${customFirstHint}`
          : `💥 Pouf ! Explosion de poussière !${lostTag} Essaie encore 🐽`,
        'hint'
      );
      setTimeout(() => {
        if (lost > 0) {
          setPigState('trot');
          updatePigletPosition(state.progress.cycleTruffles, true);
        }
      }, 650);
      setTimeout(() => {
        state.input.single = '';
        state.input.factorA = '';
        state.input.factorB = '';
        state.input.activeSlot = 'A';
        state.input.freshTap = false;
        setPigState('sniff');
        state.isBusy = false;
        renderProblem();
        updateSubmitKeyAppearance();
      }, lost > 0 ? 1150 : 950);
    } else {
      // Reveal solution gently and move to a fresh problem
      state.isBusy = true;
      setFeedback(`💥 Pouf !${lostTag} C'était ${correctSolutionText}`, 'hint');
      setTimeout(() => {
        if (lost > 0) {
          setPigState('trot');
          updatePigletPosition(state.progress.cycleTruffles, true);
        }
      }, 750);
      setTimeout(() => {
        setPigState('sniff');
        state.isBusy = false;
        setFeedback('Nouvelle piste ! Aide Barnabé à fouiller 🐽');
        nextProblem();
      }, 1750);
    }
  }

  /* ==========================================================================
     10-Truffle Pickle Lollipop Celebration & Confetti Engine
     ========================================================================== */
  function openPickleRewardCelebration(newlyUnlockedHat = null) {
    sfx.pickleFanfare();
    if (newlyUnlockedHat) {
      setTimeout(() => sfx.hatFanfare(), 350);
    }
    launchConfetti();

    const count = state.progress.pickleLollipops;
    const flavor = PICKLE_FLAVORS[(count - 1) % PICKLE_FLAVORS.length];
    const prestigeSuffix = count > PICKLE_FLAVORS.length ? ` (Édition #${count})` : '';

    dom.rewardFlavorName.textContent = `${flavor.name}${prestigeSuffix}`;
    dom.rewardDescription.innerHTML = `${flavor.desc}<br>Tu as maintenant <strong>${count}</strong> sucette${count > 1 ? 's' : ''} au cornichon !`;

    if (newlyUnlockedHat) {
      dom.hatUnlockSvgWrap.innerHTML = renderHatPreviewSvg(newlyUnlockedHat);
      dom.hatUnlockTitle.textContent = `🎩 Nouveau chapeau : ${newlyUnlockedHat.name} !`;
      dom.hatUnlockSub.textContent = '3 sucettes gagnées ! Barnabé le porte dès maintenant !';
      dom.hatUnlockBanner.classList.add('is-visible');
      dom.hatProgressPill.style.display = 'none';
    } else {
      dom.hatUnlockBanner.classList.remove('is-visible');
      const rem = 3 - (count % 3);
      dom.hatProgressPill.style.display = 'inline-flex';
      dom.hatProgressPill.textContent = `🎩 Nouveau chapeau dans ${rem} sucette${rem > 1 ? 's' : ''} (${count % 3}/3)`;
    }

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
    const { totalTruffles, pickleLollipops, equippedHat, bestStreak } = state.progress;
    const unlockedHats = getUnlockedHatsCount();
    dom.collectionStatsLine.textContent = `${totalTruffles} truffe${totalTruffles > 1 ? 's' : ''} • ${pickleLollipops} sucette${pickleLollipops > 1 ? 's' : ''} • ${unlockedHats} chapeau${unlockedHats > 1 ? 'x' : ''} • Série max : ${bestStreak}`;

    // Render Barnabé's Hat Wardrobe (1 hat unlocked every 3 lollipops!)
    const hatCardsHtml = [];
    if (unlockedHats > 0) {
      const bareSelected = equippedHat === 0;
      hatCardsHtml.push(`
        <button type="button" class="trophy-item trophy-item--hat ${bareSelected ? 'trophy-item--equipped' : ''}" data-hat-id="0">
          <div class="hat-preview-wrap" style="font-size:1.75rem;" aria-hidden="true">🐽</div>
          <div class="trophy-item-title">Tête nue</div>
          ${bareSelected ? '<span class="trophy-item-badge">Porté ✓</span>' : ''}
        </button>
      `);
    }

    PIG_HATS.forEach((hat) => {
      const isUnlocked = pickleLollipops >= hat.unlockAt;
      const isEquipped = isUnlocked && equippedHat === hat.id;
      hatCardsHtml.push(`
        <button type="button" class="trophy-item trophy-item--hat ${isUnlocked ? '' : 'is-locked'} ${isEquipped ? 'trophy-item--equipped' : ''}" data-hat-id="${hat.id}" ${isUnlocked ? '' : 'disabled'}>
          <div class="hat-preview-wrap">${isUnlocked ? renderHatPreviewSvg(hat) : '<span style="font-size:1.6rem;">🔒</span>'}</div>
          <div class="trophy-item-title">${isUnlocked ? hat.name : `À ${hat.unlockAt} sucettes`}</div>
          ${isEquipped ? '<span class="trophy-item-badge">Porté ✓</span>' : ''}
        </button>
      `);
    });
    dom.hatWardrobeGrid.innerHTML = hatCardsHtml.join('');

    dom.hatWardrobeGrid.querySelectorAll('[data-hat-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosenId = Number(btn.dataset.hatId);
        if (chosenId > 0 && state.progress.pickleLollipops < chosenId * 3) return;
        state.progress.equippedHat = chosenId;
        sfx.switchSlot();
        syncPigHatUI(true);
        saveState();
        openCollectionModal();
      });
    });

    // Render Pickle Lollipops Collection
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
        const targetVal = state.input.activeSlot === 'A' ? state.input.factorA : state.input.factorB;
        state.input.freshTap = targetVal.length > 0;
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

    // Modals: Reward, Collection & Wardrobe, Sprint
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
    if (dom.btnOpenWardrobeHud) {
      dom.btnOpenWardrobeHud.addEventListener('click', () => {
        sfx.tap();
        openCollectionModal();
      });
    }
    if (dom.btnQuickCycleHat) {
      dom.btnQuickCycleHat.addEventListener('click', () => {
        const unlocked = getUnlockedHatsCount();
        if (unlocked < 2) return;
        const nextId = state.progress.equippedHat >= unlocked ? 1 : state.progress.equippedHat + 1;
        state.progress.equippedHat = nextId;
        sfx.switchSlot();
        syncPigHatUI(true);
        saveState();
      });
    }
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
        equippedHat: 0,
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
     Bootstrap (including 3D Pixar Barnabé Stage)
     ========================================================================== */
  function init3DStageIfReady() {
    if (!window.Barnabe3D || window.Barnabe3D.initialized || !dom.forestSvgWrap) return;
    window.Barnabe3D.init(dom.forestSvgWrap, {
      spotIndex: state.progress.cycleTruffles,
      foundCount: state.progress.cycleTruffles,
      hatId: state.progress.equippedHat,
      pigState: 'sniff'
    });
  }

  function init() {
    loadState();
    renderTruffleBasketSlots();
    updateSummaryChips();
    bindEvents();
    updatePigletPosition(state.progress.cycleTruffles, false);
    init3DStageIfReady();
    window.addEventListener('barnabe3d-ready', init3DStageIfReady);

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
