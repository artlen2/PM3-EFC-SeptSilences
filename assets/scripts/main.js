// =====================================================================
// SEPT SILENCES — main.js
// Moteur de l'expérience interactive — lit histoire.json
// =====================================================================

//     STATE
let HISTOIRE = [];
let currentScene = null;
let timerTimeout = null;
let currentJourNum = 0;
let enTransition = false;

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
  objectHints = document.getElementById("object-hints");

  // Scènes auto sans audio : avancer quand l'audio se termine
  audio.addEventListener("ended", () => {
    if (!currentScene) return;
    if (enTransition) return;
    if (currentScene.type === "auto") {
      const delai = currentScene.delaiApresAudio ?? 1500;
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
  bgVideo.style.transition = "opacity 600ms ease";
  bgVideo.style.opacity = "0";
  setTimeout(() => {
    bgVideoSrc.src = path;
    bgVideo.load();
    bgVideo.play().catch(() => {});
    bgVideo.style.opacity = "1";
  }, 600);
}

//     AUDIO
function fadeOutAudio(el, duree = 600) {
  if (!el || el.paused) return;
  const volumeDepart = el.volume;
  const pas = volumeDepart / (duree / 30);
  const interval = setInterval(() => {
    if (el.volume > pas) {
      el.volume -= pas;
    } else {
      el.volume = 0;
      el.pause();
      el.currentTime = 0;
      clearInterval(interval);
    }
  }, 30);
}

// Stocke les intervals actifs par élément
const fadeIntervals = new WeakMap();

function fadeOutAudio(el, duree = 600) {
  if (!el || el.paused) return;
  
  // Annuler tout fade en cours
  if (fadeIntervals.has(el)) {
    clearInterval(fadeIntervals.get(el));
    fadeIntervals.delete(el);
  }

  const volumeDepart = el.volume;
  const pas = volumeDepart / (duree / 30);
  const interval = setInterval(() => {
    if (el.volume > pas) {
      el.volume -= pas;
    } else {
      el.volume = 0;
      el.pause();
      el.currentTime = 0;
      clearInterval(interval);
      fadeIntervals.delete(el);
    }
  }, 30);
  fadeIntervals.set(el, interval);
}

function fadeInAudio(el, volumeCible, duree = 800) {
  if (!el) return;

  // Annuler tout fade en cours
  if (fadeIntervals.has(el)) {
    clearInterval(fadeIntervals.get(el));
    fadeIntervals.delete(el);
  }

  el.volume = 0;
  el.play().catch(() => {});

  if (duree === 0) {
    el.volume = volumeCible;
    return;
  }

  const pas = volumeCible / (duree / 30);
  const interval = setInterval(() => {
    if (el.volume + pas < volumeCible) {
      el.volume += pas;
    } else {
      el.volume = volumeCible;
      clearInterval(interval);
      fadeIntervals.delete(el);
    }
  }, 30);
  fadeIntervals.set(el, interval);
}

function stopAudio() {
  fadeOutAudio(audio, 400);
  fadeOutAudio(bruitage, 400);
}

function loadAudio(path) {
  fadeOutAudio(audio, 400);
  if (!path) return;
  setTimeout(() => {
    audio.src = path;
    audio.load();
    fadeInAudio(audio, 1.0, 0);
  }, 400);
}

function loadBruitage(path) {
  fadeOutAudio(bruitage, 400);
  if (!path) return;
  setTimeout(() => {
    bruitage.src = path;
    bruitage.load();
    fadeInAudio(bruitage, 0.2, 200);
  }, 400);
}

//     MUSIQUE DE FOND
// IMPORTANT DE AUTORISER LE PLAYBACK AUTOMATIQUE DANS NAVIGATEUR !!!!
function loadMusique(jourNum) {
  console.log(
    "loadMusique appelée — jourNum:",
    jourNum,
    "currentJourNum:",
    currentJourNum,
  );

  if (!musique) {
    console.warn("élément musique introuvable");
    return;
  }
  if (jourNum === currentJourNum) {
    console.warn("même jour, skip");
    return;
  }

  const jourData = HISTOIRE.find((j) => j.jour === jourNum);
  if (!jourData) {
    console.warn("jourData introuvable pour jour", jourNum);
    return;
  }
  if (!jourData.musique) {
    console.warn("pas de champ musique dans jourData", jourData);
    return;
  }

  console.log("chargement musique:", jourData.musique);
  currentJourNum = jourNum;

  fadeOutAudio(musique, 1200);
  setTimeout(() => {
    musique.src = jourData.musique;
    musique.load();
    musique.loop = true;
    console.log("play musique:", musique.src);
    fadeInAudio(musique, 0.1, 500);
  }, 1200);
}

// timer
function clearTimer() {
  if (timerTimeout) {
    clearTimeout(timerTimeout);
    timerTimeout = null;
  }
}

function startTimer(duree, callback) {
  timerTimeout = setTimeout(callback, duree);
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

// Render texte
function renderText(texte) {
  if (!texte) return "";
  let result = texte;
  return result;
}

//     GO TO SCENE
function goToScene(id) {
  if (!id) return;
  if (enTransition) return;
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

  clearTimer();
  stopAudio();

  if (bgOverlay) bgOverlay.style.opacity = OVERLAY_VALUES[jourNum - 1];

  loadMusique(jourNum);
  loadVideo(scene.video);
  loadAudio(scene.audio);
  loadBruitage(scene.bruitage);
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
      if (skipBtn) skipBtn.style.visibility = "hidden";
      console.log("choice state");

      showHints([scene.key]);

      startTimer(scene.timer ?? 5000, () => {
        console.log("working");
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

function renderScene(scene, jourNum) {
  const texteRendu = renderText(scene.texte, scene.blurred);
  const existing = stage.querySelector(".scene-el");

  const doRender = () => {
    stage.innerHTML = `
      <div class="scene-el absolute inset-0 flex flex-col items-center justify-center px-16 pb-24"
           style="opacity:0; transition: opacity 700ms ease;">
        <div class="max-w-6xl w-full text-center flex flex-col items-center gap-6">
          ${
            texteRendu
              ? `<p class="scene-text font-game text-4xl leading-relaxed text-cream"
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
      });
    });
  };

  if (existing) {
    existing.style.transition = "opacity 500ms ease";
    existing.style.opacity = "0";
    setTimeout(doRender, 500);
  } else {
    doRender();
  }
}

//     TRANSITION JOUR
function showTransitionJour(nextJour) {
  hideHints();
  enTransition = true;

  // Charger la vidéo et la musique du jour suivant tout de suite
  const jourData = HISTOIRE.find((j) => j.jour === nextJour);
  if (jourData) {
    currentJourNum = 0;
    loadMusique(nextJour);
    // Charger la première vidéo du jour en arrière-plan pendant la transition
    const premiereScene = jourData.scenes[0];
    if (premiereScene?.video) loadVideo(premiereScene.video);
  }

  stage.innerHTML = `
    <div class="absolute inset-0 flex items-center justify-center">
      <p id="transition-texte" class="font-title text-cream text-4xl"
         style="opacity: 0; transition: opacity 800ms ease;">
        Jour ${nextJour}
      </p>
    </div>`;

  const texte = document.getElementById("transition-texte");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      texte.style.opacity = "1";
    });
  });

  setTimeout(() => {
    texte.style.opacity = "0";
  }, 800 + 2000);

  setTimeout(
    () => {
      enTransition = false;
      if (jourData) goToScene(jourData.scenes[0].id);
    },
    800 + 2000 + 600,
  );
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

// DEBUG — accès direct à un jour (à retirer en production)
function debugGoToJour(jourNum) {
  const jourData = HISTOIRE.find((j) => j.jour === jourNum);
  if (!jourData) {
    console.warn("Jour introuvable :", jourNum);
    return;
  }
  enTransition = false;
  clearTimer();
  stopAudio();
  currentJourNum = 0; // forcer le rechargement de la musique
  goToScene(jourData.scenes[0].id);
  console.log(`DEBUG — sauté au jour ${jourNum}`);
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

  // DEBUG
  const num = parseInt(e.key);
  if (!isNaN(num) && num >= 1 && num <= 7) {
    debugGoToJour(num);
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
