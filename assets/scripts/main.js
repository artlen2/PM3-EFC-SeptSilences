// =====================================================================
// SEPT SILENCES — main.js
// Moteur de l'expérience interactive — lit histoire.json
// =====================================================================

//     STATE
let HISTOIRE = [];
let currentScene = null;
let unlockedJours = new Set([1]);
let timerTimeout = null;
let currentJourNum = 0;

// Opacité overlay sombre par jour (index 0 = jour 1)
const OVERLAY_VALUES = [0.3, 0.38, 0.46, 0.54, 0.62, 0.7, 0.8];

//     DOM REFS
let audio,
  bruitage,
  musique,
  bgVideo,
  bgVideoSrc,
  bgOverlay,
  stage,
  objectHints;

//     INIT
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("stage")) return;

  audio = document.getElementById("narration");
  bruitage = document.getElementById("bruitage");
  musique = document.getElementById("musique-fond");
  bgVideo = document.getElementById("bg-video");
  bgVideoSrc = document.getElementById("bg-video-src");
  bgOverlay = document.getElementById("bg-overlay");
  stage = document.getElementById("stage");
  timerBar = document.getElementById("timer-bar");
  timerWrap = document.getElementById("timer-wrap");
  objectHints = document.getElementById("object-hints");

  // Scènes auto sans audio : avancer quand l'audio se termine
  audio.addEventListener("ended", () => {
    if (!currentScene) return;
    if (currentScene.type === "auto") {
      const delai = currentScene.delaiApresAudio ?? 1500; // ms de pause après la fin du son
      timerTimeout = setTimeout(() => goToScene(currentScene.next), delai);
    }
  });

  document.addEventListener("keydown", handleKeydown);

  document.getElementById("help-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeHelp();
  });

  fetch("histoire.json")
    .then((r) => r.json())
    .then((data) => {
      HISTOIRE = data;
      goToScene("1A");
    })
    .catch((err) =>
      console.error("Impossible de charger histoire.json :", err),
    );
});

//     RECHERCHE
function findScene(id) {
  for (const jour of HISTOIRE) {
    for (const scene of jour.scenes) {
      if (scene.id === id) return { scene, jourNum: jour.jour };
    }
  }
  return null;
}

//     VIDEO
function loadVideo(path) {
  if (!path) return;
  bgVideo.style.opacity = "0";
  setTimeout(() => {
    bgVideoSrc.src = path;
    bgVideo.load();
    bgVideo.play().catch(() => {});
    bgVideo.style.opacity = "1";
  }, 500);
}

//     AUDIO
function loadAudio(path) {
  if (!path) {
    audio.src = "";
    audio.volume = 1;
    return;
  }
  audio.src = path;
  audio.load();
  audio.volume = 1;
  audio.play().catch(() => {});
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
}

//     MUSIQUE DE FOND
// IMPORTANT DE AUTORISER LE PLAYBACK AUTOMATIQUE DANS NAVIGATEUR !!!!
function loadMusique(jourNum) {
  if (!musique) return;
  if (jourNum === currentJourNum) return; // déjà en cours
  const jourData = HISTOIRE.find((j) => j.jour === jourNum);
  if (!jourData || !jourData.musique) return;
  musique.src = jourData.musique;
  musique.load();
  musique.volume = 0.1; // ajuster le volume si c trop fort
  musique.loop = true;
  musique.play().catch(() => {});
  currentJourNum = jourNum;
}

function clearTimer() {
  if (timerTimeout) {
    clearTimeout(timerTimeout);
    timerTimeout = null;
  }
  if (!timerBar) return;
  timerBar.style.transition = "none";
  timerBar.style.width = "0%";
  timerWrap.style.opacity = "0";
}

//     HINTS
const ALL_KEYS = ["T", "C", "D", "L"];

function showHints(availableKeys) {
  objectHints.style.opacity = "1";
  ALL_KEYS.forEach((k) => {
    const el = document.getElementById("hint-" + k);
    if (!el) return;
    if (availableKeys.includes(k)) {
      el.classList.add("hint-available");
      el.style.opacity = "1";
    } else {
      el.classList.remove("hint-available");
      el.style.opacity = "0.15";
    }
  });
}

function hideHints() {
  if (objectHints) objectHints.style.opacity = "0";
  ALL_KEYS.forEach((k) => {
    const el = document.getElementById("hint-" + k);
    if (!el) return;
    el.classList.remove("hint-available");
    el.style.opacity = "0.15";
  });
}

//     JOUR NAV
function updateJourNav(jourNum) {
  document.querySelectorAll(".jour-btn").forEach((btn) => {
    const j = parseInt(btn.dataset.jour);
    btn.classList.toggle("active", j === jourNum);
    btn.classList.toggle("locked", !unlockedJours.has(j));
    btn.classList.toggle("unlocked", unlockedJours.has(j));
  });
}

function goToJour(jour) {
  if (!unlockedJours.has(jour)) return;
  const jourData = HISTOIRE.find((j) => j.jour === jour);
  if (jourData) goToScene(jourData.scenes[0].id);
}

//     TEXTE AVEC MOTS FLOUS
function renderText(texte) {
  if (!texte) return "";
  let result = texte;
  return result;
}

//     AVANCER
function scheduleNext(nextId) {
  if (!nextId) return;
  setTimeout(() => goToScene(nextId), 1200);
}

//     GO TO SCENE
function goToScene(id) {
  if (!id) return;
  if (id === "FIN") {
    showFin();
    return;
  }

  const found = findScene(id);
  if (!found) {
    console.warn("Scène introuvable :", id);
    return;
  }

  const { scene, jourNum } = found;
  currentScene = scene;

  unlockedJours.add(jourNum);
  clearTimer();
  stopAudio();

  if (bgOverlay) bgOverlay.style.opacity = OVERLAY_VALUES[jourNum - 1];

  updateJourNav(jourNum);
  loadMusique(jourNum);
  loadVideo(scene.video);
  loadAudio(scene.audio);
  renderScene(scene, jourNum);

  const skipBtn = document.getElementById("skip-hint");

  switch (scene.type) {
    case "auto":
      if (skipBtn) skipBtn.style.visibility = "visible";
      hideHints();
      // Si pas d'audio, setTimeout comme fallback
      if (!scene.audio) {
        timerTimeout = setTimeout(
          () => goToScene(scene.next),
          scene.timer || 4000,
        );
      }
      // Sinon, c'est audio.addEventListener("ended") qui déclenche scheduleNext
      break;

    case "timed-auto":
      if (skipBtn) skipBtn.style.visibility = "visible";
      hideHints();
      timerTimeout = setTimeout(
        () => goToScene(scene.next),
        scene.timer || 10000,
      );
      break;

    case "choice":
      if (skipBtn) skipBtn.style.visibility = "visible";
      showHints([scene.key]);
      (scene.timer || 7000,
        () => {
          hideHints();
          goToScene(scene.next.timeout);
        });
      break;

    case "free":
      if (skipBtn) skipBtn.style.visibility = "hidden";
      showHints(scene.choix.map((c) => c.key));
      // Pas de timer — choix libre
      break;

    case "fin-jour":
      if (skipBtn) skipBtn.style.visibility = "hidden";
      hideHints();
      showTransitionJour(scene.nextJour);
      break;

    case "fin-experience":
      if (skipBtn) skipBtn.style.visibility = "hidden";
      showFin();
      break;
  }
}

//     RENDER SCENE
function renderScene(scene, jourNum) {
  const existing = stage.querySelector(".scene-el");
  if (existing) {
    existing.style.opacity = "0";
    existing.style.pointerEvents = "none";
  }

  const texteRendu = renderText(scene.texte, scene.blurred);
  const delay = existing ? 500 : 0;

  setTimeout(() => {
    stage.innerHTML = `
      <div class="scene-el absolute inset-0 flex flex-col items-center justify-center px-16 pb-24 opacity-0 pointer-events-none">
        <div class="max-w-6xl w-full text-center flex flex-col items-center gap-6">
          ${
            texteRendu
              ? `
          <p class="scene-text font-game text-4xl leading-relaxed text-cream
                     opacity-0 translate-y-2 transition-all duration-700 delay-300"
             style="text-shadow: 0 1px 10px rgba(0,0,0,0.8)">
            ${texteRendu}
          </p>`
              : ""
          }
        </div>
      </div>`;

    const el = stage.querySelector(".scene-el");
    if (!el) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.querySelectorAll(".scene-text").forEach((c) => {
          c.classList.remove("opacity-0", "translate-y-2");
          c.classList.add("opacity-100", "translate-y-0");
        });
      });
    });
  }, delay);
}

//     TRANSITION JOUR
function showTransitionJour(nextJour) {
  hideHints();

  stage.innerHTML = `
    <div class="absolute inset-0 flex items-center justify-center">
      <p class="font-title text-cream text-4xl">
        Jour ${nextJour}
      </p>
    </div>`;

  setTimeout(() => {
    const jourData = HISTOIRE.find((j) => j.jour === nextJour);
    if (jourData) goToScene(jourData.scenes[0].id);
  }, 8000);
}

//     FIN DE L'EXPÉRIENCE
function showFin() {
  stopAudio();
  clearTimer();
  hideHints();
  if (bgOverlay) bgOverlay.style.opacity = "0.92";

  stage.innerHTML = `
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-10 px-16">
      <p class="font-title text-cream/70 text-3xl italic text-center max-w-lg leading-relaxed"
         style="text-shadow: 0 2px 20px rgba(0,0,0,0.5)">
        N'oublie pas... la petite lampe... de l'entrée...
      </p>
      <a href="index.html"
         class="py-1.5 rounded-4xl text-center bg-no-repeat bg-cover bg-center transition-all duration-200 hover:brightness-125 hover:scale-105 hover:shadow-xl px-8 text-cream text-2xl font-btn"
         style="background-image: url('images/boutoncropped.png')">
        Retourner à l'accueil
      </a>
    </div>`;
}

// CLAVIER / MAKEY MAKEY
// T = téléphone   C = café   D = bain   L = liste
// Espace = passer, Escape = fermer l'aide

function handleKeydown(e) {
  const k = e.key.toUpperCase();

  if (e.key === "Escape") {
    closeHelp();
    return;
  }

  if (e.key === " ") {
    e.preventDefault();
    handleSkip();
    return;
  }

  if (!ALL_KEYS.includes(k) || !currentScene) return;

  if (currentScene.type === "choice") {
    if (k === currentScene.key) {
      clearTimer();
      hideHints();
      goToScene(currentScene.next.success);
    }
    // Mauvais objet = rien
  } else if (currentScene.type === "free") {
    const choix = currentScene.choix.find((c) => c.key === k);
    if (choix) {
      hideHints();
      goToScene(choix.next);
    }
  }
}

function handleSkip() {
  if (!currentScene) return;
  if (currentScene.type === "free") return; // guard explicite, rien ne se passe

  stopAudio();
  clearTimer();
  hideHints();

  if (currentScene.type === "auto" || currentScene.type === "timed-auto") {
    if (currentScene.next) goToScene(currentScene.next);
  } else if (currentScene.type === "choice") {
    goToScene(currentScene.next.timeout);
  }
}

//     OVERLAY AIDE
function openHelp() {
  const o = document.getElementById("help-overlay");
  if (!o) return;
  o.classList.remove("opacity-0", "pointer-events-none");
  o.classList.add("opacity-100");
}

function closeHelp() {
  const o = document.getElementById("help-overlay");
  if (!o) return;
  o.classList.add("opacity-0", "pointer-events-none");
  o.classList.remove("opacity-100");
}
