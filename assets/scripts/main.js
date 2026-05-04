// ─── STATE
let DAYS = [];
let currentDay = 1;
let currentScene = 0;
let unlockedDays = new Set([1]);

// ─── DOM REFS
const audio = document.getElementById("narration");
const bgVideo = document.getElementById("bg-video");
const bgVideoSrc = document.getElementById("bg-video-src");
const bgOverlay = document.getElementById("bg-overlay");
const progressFill = document.getElementById("audio-progress-fill");
const stage = document.getElementById("stage");
const objectHints = document.getElementById("object-hints");
const audioBar = document.getElementById("audio-bar");
const skipHint = document.getElementById("skip-hint");
const progressBar = document.getElementById("progress-bar");

// Overlay opacity per day (index 0 = day 1)
const OVERLAY_VALUES = [0.35, 0.42, 0.48, 0.55, 0.62, 0.7, 0.78];

// ─── INIT — load JSON then start
fetch("histoire.json")
  .then((r) => r.json())
  .then((data) => {
    DAYS = data;
    render(true);
  })
  .catch((err) => {
    console.error("Impossible de charger days.json :", err);
  });

// ─── HELP OVERLAY
function openHelp() {
  const overlay = document.getElementById("help-overlay");
  overlay.classList.remove("opacity-0", "pointer-events-none");
  overlay.classList.add("opacity-100");
}

function closeHelp() {
  const overlay = document.getElementById("help-overlay");
  overlay.classList.add("opacity-0", "pointer-events-none");
  overlay.classList.remove("opacity-100");
}

document.getElementById("help-overlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeHelp();
});

// ─── VIDEO
function loadVideo(path) {
  bgVideo.style.opacity = "0";
  setTimeout(() => {
    bgVideoSrc.src = path;
    bgVideo.load();
    bgVideo.play().catch(() => {});
    bgVideo.style.opacity = "1";
  }, 600);
}

// ─── AUDIO
function loadAudio(path) {
  audio.src = path;
  audio.load();
  audio.play().catch(() => {});
}

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  }
});

// ─── OBJECT HINTS
function updateHints() {
  const available = DAYS[currentDay - 1].scenes[currentScene].key;

  objectHints.style.opacity = "1";
  audioBar.style.opacity = "1";
  skipHint.style.opacity = "1";

  ["T", "C", "D", "L"].forEach((k) => {
    const el = document.getElementById("hint-" + k);
    if (k === available) {
      el.classList.add("hint-available");
    } else {
      el.classList.remove("hint-available");
    }
  });
}

// ─── PROGRESS BAR
function updateProgressBar() {
  const total = DAYS.reduce((a, d) => a + d.scenes.length, 0);
  const done =
    DAYS.slice(0, currentDay - 1).reduce((a, d) => a + d.scenes.length, 0) +
    currentScene;
  progressBar.style.width = (done / (total - 1)) * 100 + "%";
}

// ─── RENDER
function render(instant = false) {
  if (!DAYS.length) return;

  const s = DAYS[currentDay - 1].scenes[currentScene];
  const existing = stage.querySelector(".scene-el");

  // Fade out existing scene
  if (existing && !instant) {
    existing.style.opacity = "0";
    existing.style.pointerEvents = "none";
  }

  const delay = existing && !instant ? 700 : 0;

  setTimeout(() => {
    stage.innerHTML = `
      <div class="scene-el blur-day-${currentDay} absolute inset-0 flex flex-col items-center justify-center px-16 pb-24 opacity-0 pointer-events-none">
        <div class="max-w-2xl w-full text-center flex flex-col items-center gap-6">

          <p class="scene-label font-sans text-[10px] tracking-[0.3em] uppercase text-dust
                     opacity-0 translate-y-1.5 transition-all duration-500 delay-300">
            ${s.label}
          </p>

          <h2 class="scene-title font-title text-5xl leading-tight text-cream
                      opacity-0 translate-y-2 transition-all duration-700 delay-[450ms]"
              style="text-shadow: 0 2px 20px rgba(0,0,0,0.6)">
            ${s.title}
          </h2>

          <p class="scene-text font-sans text-lg leading-relaxed text-faded
                     opacity-0 translate-y-2 transition-all duration-700 delay-[600ms]"
             style="text-shadow: 0 1px 8px rgba(0,0,0,0.7)">
            ${s.text}
          </p>

          ${
            s.quote
              ? `
          <blockquote class="scene-quote font-title text-xl italic leading-relaxed text-cream/80
                             border-l border-cream/25 pl-6 text-left
                             opacity-0 translate-y-2 transition-all duration-700 delay-[550ms]"
                      style="text-shadow: 0 1px 8px rgba(0,0,0,0.6)">
            ${s.quote}
          </blockquote>`
              : ""
          }

        </div>
      </div>`;

    // Update environment
    bgOverlay.style.opacity = OVERLAY_VALUES[currentDay - 1];
    loadVideo(s.video);
    loadAudio(s.audio);
    progressFill.style.width = "0%";

    updateDayNav();
    updateProgressBar();
    updateHints();

    // Fade in scene and animate children
    requestAnimationFrame(() => {
      const el = stage.querySelector(".scene-el");
      if (!el) return;

      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";

        el.querySelectorAll(
          ".scene-label, .scene-title, .scene-text, .scene-quote",
        ).forEach((child) => {
          requestAnimationFrame(() => {
            child.classList.remove(
              "opacity-0",
              "translate-y-2",
              "translate-y-1.5",
            );
            child.classList.add("opacity-100", "translate-y-0");
          });
        });
      });
    });
  }, delay);
}

// ─── NAVIGATION
function goToDay(day) {
  if (!unlockedDays.has(day)) return;
  currentDay = day;
  currentScene = 0;
  render();
}

function advanceScene() {
  if (!DAYS.length) return;

  const dayData = DAYS[currentDay - 1];

  if (currentScene < dayData.scenes.length - 1) {
    currentScene++;
  } else if (currentDay < DAYS.length) {
    currentDay++;
    currentScene = 0;
    unlockedDays.add(currentDay);
  }
  // Last scene of last day — do nothing

  render();
}

// ─── MAKEY MAKEY INPUT
// T = téléphone   C = café   D = bain   L = liste
// Space = passer la scène   Escape = fermer l'overlay

document.addEventListener("keydown", (e) => {
  const k = e.key.toUpperCase();

  if (e.key === " ") {
    e.preventDefault();
    audio.pause();
    advanceScene();
    return;
  }

  if (e.key === "Escape") {
    closeHelp();
    return;
  }

  if (["T", "C", "D", "L"].includes(k)) {
    const expected = DAYS[currentDay - 1]?.scenes[currentScene]?.key;
    if (k === expected) advanceScene();
    // Mauvais objet = rien
  }
});
