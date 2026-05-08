const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
let audioContext;
let musicNodes = [];
let musicTimer;
let isMusicPlaying = false;

if (year) {
  year.textContent = new Date().getFullYear();
}

function updateHeader() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
  });
});

function makeGain(value) {
  const gain = audioContext.createGain();
  gain.gain.value = value;
  return gain;
}

function startTone(frequency, type, gainValue) {
  const osc = audioContext.createOscillator();
  const gain = makeGain(0);

  osc.type = type;
  osc.frequency.value = frequency;
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  gain.gain.linearRampToValueAtTime(gainValue, audioContext.currentTime + 1.6);
  musicNodes.push({ osc, gain });
}

function playBell(frequency, delay = 0) {
  const startAt = audioContext.currentTime + delay;
  const osc = audioContext.createOscillator();
  const gain = makeGain(0);

  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(0.045, startAt + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + 2.6);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(startAt);
  osc.stop(startAt + 2.8);
}

function startBackgroundMusic() {
  audioContext = audioContext || new AudioContext();
  audioContext.resume();

  startTone(146.83, "sine", 0.018);
  startTone(220.0, "triangle", 0.012);
  startTone(293.66, "sine", 0.009);

  const pattern = [440, 493.88, 392, 329.63, 440, 293.66];
  let step = 0;
  playBell(pattern[step]);
  musicTimer = window.setInterval(() => {
    step = (step + 1) % pattern.length;
    playBell(pattern[step]);
    playBell(pattern[(step + 2) % pattern.length] / 2, 0.35);
  }, 3600);
}

function stopBackgroundMusic() {
  window.clearInterval(musicTimer);
  musicNodes.forEach(({ osc, gain }) => {
    gain.gain.cancelScheduledValues(audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, audioContext.currentTime + 0.6);
    osc.stop(audioContext.currentTime + 0.8);
  });
  musicNodes = [];
}

// Background music is intentionally kept disabled for now.
// To restore it later, add a button with [data-music-toggle] and wire this block back.

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
