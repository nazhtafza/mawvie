/**
 * Mawvie - Mobile-First Theater Experience
 * Curtain Opening, Laut Bercerita Poster Zoom-In Animation, and Interactive Invitation
 */

// ---------------------------------------------------------------------------
// Global Navigation Functions: Show & Hide Thank You Page
// Defined at top level so inline onclick is 100% available immediately
// ---------------------------------------------------------------------------
function showThankYouPage() {
  const stage = document.getElementById('stageContent');
  const thankYou = document.getElementById('thankYouPage');

  if (stage) {
    stage.style.display = 'none';
  }
  if (thankYou) {
    thankYou.style.display = 'flex';
    thankYou.classList.add('active');
    thankYou.setAttribute('aria-hidden', 'false');
  }

  window.scrollTo(0, 0);

  try {
    if (typeof window.triggerCelebrationConfetti === 'function') {
      window.triggerCelebrationConfetti();
    }
  } catch (err) {
    console.warn('Confetti error:', err);
  }

  try {
    if (typeof window.playCelebrationChime === 'function') {
      window.playCelebrationChime();
    }
  } catch (err) {
    console.warn('Audio chime error:', err);
  }
}

function hideThankYouPage() {
  const stage = document.getElementById('stageContent');
  const thankYou = document.getElementById('thankYouPage');

  if (thankYou) {
    thankYou.style.display = 'none';
    thankYou.classList.remove('active');
    thankYou.setAttribute('aria-hidden', 'true');
  }
  if (stage) {
    stage.style.display = 'flex';
  }

  const rsvpSec = document.getElementById('rsvpSection');
  if (rsvpSec) {
    rsvpSec.scrollIntoView({ behavior: 'smooth' });
  }
}

window.showThankYouPage = showThankYouPage;
window.hideThankYouPage = hideThankYouPage;

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Initial State & URL Query Parsing
  // -------------------------------------------------------------------------
  const state = {
    recipientName: "'just a friend'",
    senderName: "Mawl",
    senderWa: "628123456789",
    location: "NSC Jepara\nJalan Veteran 14 59417 Kauman\nJawa Tengah",
    time: "Saturday, October 31 2026\n10:00 AM",
    audioActive: false,
    declineTries: 0,
    curtainOpened: false
  };

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('to')) state.recipientName = urlParams.get('to').trim();
  if (urlParams.get('from')) state.senderName = urlParams.get('from').trim();
  if (urlParams.get('wa')) state.senderWa = urlParams.get('wa').replace(/[^0-9]/g, '');
  if (urlParams.get('loc')) state.location = urlParams.get('loc').trim();
  if (urlParams.get('time')) state.time = urlParams.get('time').trim();

  // -------------------------------------------------------------------------
  // 2. DOM Elements
  // -------------------------------------------------------------------------
  const stageContent = document.getElementById('stageContent');
  const curtainOverlay = document.getElementById('curtainOverlay');
  const btnSeeDetail = document.getElementById('btnSeeDetail');
  const invitationDetailsSection = document.getElementById('invitationDetailsSection');

  // Displays
  const dispLocation = document.getElementById('dispLocation');
  const dispTime = document.getElementById('dispTime');
  const rsvpPromptText = document.getElementById('rsvpPromptText');
  const footerCredit = document.getElementById('footerCredit');

  // RSVP Buttons
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');

  // Thank You Page View
  const thankYouTitle = document.getElementById('thankYouTitle');
  const btnThankYouBack = document.getElementById('btnThankYouBack');

  // -------------------------------------------------------------------------
  // 3. Update UI Elements with Current State
  // -------------------------------------------------------------------------
  function renderState() {
    if (dispLocation) {
      dispLocation.innerHTML = state.location.replace(/\n/g, '<br>');
    }
    if (dispTime) {
      dispTime.innerHTML = state.time.replace(/\n/g, '<br>');
    }
    if (rsvpPromptText) {
      rsvpPromptText.textContent = `So, does my ${state.recipientName} accept my invitation? 😜`;
    }
    if (footerCredit) {
      footerCredit.innerHTML = `Made with 🤍 ${state.senderName}'s ${state.recipientName.replace(/'/g, '')}`;
    }
    if (thankYouTitle) {
      thankYouTitle.textContent = `Thank You ${state.senderName}!`;
    }
  }

  // -------------------------------------------------------------------------
  // 4. Curtain Opening & Hero Zoom-In Animation Sequence
  // -------------------------------------------------------------------------
  function triggerCurtainOpening() {
    if (state.curtainOpened) return;
    state.curtainOpened = true;

    if (curtainOverlay) {
      curtainOverlay.classList.add('curtain-opened');
      curtainOverlay.style.pointerEvents = 'none';
      setTimeout(() => {
        curtainOverlay.style.display = 'none';
      }, 1800);
    }

    tryStartMusic();

    // Activate stage content after slight delay for dramatic sync
    setTimeout(() => {
      if (stageContent) {
        stageContent.classList.add('stage-active');
      }
    }, 280);
  }

  // Tap anywhere on curtain overlay to open immediately
  if (curtainOverlay) {
    curtainOverlay.addEventListener('click', () => {
      triggerCurtainOpening();
    });
  }

  // Auto-open curtains smoothly after 1.4s so the user experiences the closed curtain first
  setTimeout(() => {
    if (!state.curtainOpened) {
      triggerCurtainOpening();
    }
  }, 1400);

  // -------------------------------------------------------------------------
  // 5. 'See the Detail' Smooth Scroll Button
  // -------------------------------------------------------------------------
  if (btnSeeDetail) {
    btnSeeDetail.addEventListener('click', () => {
      if (invitationDetailsSection) {
        invitationDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. RSVP Interactivity ('Yes' and 'No')
  // -------------------------------------------------------------------------
  const declineTeases = [
    "Are you sure? 🥺",
    "Free caramel popcorn included! 🍿",
    "You can't say no to this! 🌊",
    "There's a photobooth after the movie! 📸",
    "Think about it again... 🙈",
    "This button gave up, just click Yes! ✨"
  ];

  function handleDeclineAttempt(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    state.declineTries++;

    const teaseIndex = (state.declineTries - 1) % declineTeases.length;
    btnNo.textContent = declineTeases[teaseIndex];

    // Playful small dodge translation
    const offsetX = (Math.random() - 0.5) * 60;
    const offsetY = (Math.random() - 0.5) * 30;
    btnNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // Slightly expand the Yes button to make it irresistible
    const yesScale = 1 + Math.min(state.declineTries * 0.06, 0.35);
    btnYes.style.transform = `scale(${yesScale})`;
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', (e) => {
      if (window.innerWidth > 600 && state.declineTries < 4) {
        handleDeclineAttempt(e);
      }
    });
    btnNo.addEventListener('click', handleDeclineAttempt);
    btnNo.addEventListener('touchend', (e) => {
      handleDeclineAttempt(e);
    });
  }

  // Attach Yes button listeners
  if (btnYes) {
    btnYes.addEventListener('click', (e) => {
      if (e) e.preventDefault();
      showThankYouPage();
    });
    btnYes.addEventListener('touchend', (e) => {
      if (e) e.preventDefault();
      showThankYouPage();
    });
  }

  // Attach Back button listener
  if (btnThankYouBack) {
    btnThankYouBack.addEventListener('click', (e) => {
      if (e) e.preventDefault();
      hideThankYouPage();
    });
    btnThankYouBack.addEventListener('touchend', (e) => {
      if (e) e.preventDefault();
      hideThankYouPage();
    });
  }

  // -------------------------------------------------------------------------
  // 7. Background Music: Bee Gees - How Deep Is Your Love (Autoplay, No UI Buttons)
  // -------------------------------------------------------------------------
  const bgMusic = document.getElementById('bgMusic');

  function tryStartMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.volume = 0.85;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            cleanupMusicTriggers();
          })
          .catch(() => {
            // Waiting for first touch/click gesture according to browser autoplay policy
          });
      }
    }
  }

  function onFirstUserGesture() {
    tryStartMusic();
    cleanupMusicTriggers();
  }

  const musicEvents = ['touchstart', 'touchend', 'click', 'pointerdown', 'scroll', 'keydown'];

  function setupMusicTriggers() {
    musicEvents.forEach(evt => {
      window.addEventListener(evt, onFirstUserGesture, { once: true, passive: true });
    });
  }

  function cleanupMusicTriggers() {
    musicEvents.forEach(evt => {
      window.removeEventListener(evt, onFirstUserGesture);
    });
  }

  // Attempt autoplay immediately on load
  tryStartMusic();
  setupMusicTriggers();

  // Also ensure it triggers when curtain overlay is clicked or opening starts
  if (curtainOverlay) {
    curtainOverlay.addEventListener('click', tryStartMusic, { once: true });
  }

  // -------------------------------------------------------------------------
  // 8. Web Audio Synthesizer (Cinematic Chime on Yes)
  // -------------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtx = new AudioCtx();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  function playChimeTone() {
    try {
      initAudio();
      if (!audioCtx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = audioCtx.currentTime;
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.3);
      });
    } catch (e) {
      console.warn('Sound play error:', e);
    }
  }

  window.playCelebrationChime = playChimeTone;

  // -------------------------------------------------------------------------
  // 8. Confetti Particle Animation
  // -------------------------------------------------------------------------
  const confettiCanvas = document.getElementById('confettiCanvas');
  let ctx = null;
  if (confettiCanvas) {
    ctx = confettiCanvas.getContext('2d');
  }
  let confettiPieces = [];

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  class Confetto {
    constructor() {
      this.x = (confettiCanvas ? confettiCanvas.width : window.innerWidth) / 2 + (Math.random() - 0.5) * 240;
      this.y = (confettiCanvas ? confettiCanvas.height : window.innerHeight) * 0.72;
      this.size = Math.random() * 8 + 4;
      this.color = ['#f4b436', '#ffdd80', '#ffffff', '#e85d43', '#25d366'][Math.floor(Math.random() * 5)];
      const angle = (Math.random() * Math.PI) - Math.PI;
      const speed = Math.random() * 14 + 10;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.35;
      this.rot = Math.random() * 360;
      this.opacity = 1;
    }
    update() {
      this.x += this.vx;
      this.vy += this.gravity;
      this.y += this.vy;
      this.rot += 5;
      this.opacity -= 0.009;
    }
    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rot * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  function triggerConfetti() {
    if (!confettiCanvas || !ctx) return;
    resizeConfetti();
    confettiPieces = [];
    for (let i = 0; i < 120; i++) confettiPieces.push(new Confetto());

    function loop() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiPieces.forEach(c => {
        c.update();
        c.draw();
      });
      confettiPieces = confettiPieces.filter(c => c.opacity > 0 && c.y < confettiCanvas.height);
      if (confettiPieces.length > 0) requestAnimationFrame(loop);
    }
    loop();
  }

  window.triggerCelebrationConfetti = triggerConfetti;

  // Initial State Render
  renderState();
});
