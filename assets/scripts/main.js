// ─── DATA DE L'HISTOIRE ───────────────────────────────────────────────────────────────
// key: quel Makey Makey trigger la scène
// T = téléphone  C = café  D = douche  L = liste

const DAYS = [
  {
    day: 1,
    scenes: [
      {
        key: "C",
        label: "Jour 1 — Le matin",
        title: "Le café sent comme toujours.",
        text: "Marguerite se lève à six heures. Elle sait où est tout. La tasse bleue. La cuillère à thé. La fenêtre qui donne sur le jardin où les rosiers poussent depuis quarante ans.",
        quote: null,
      },
      {
        key: "T",
        label: "Jour 1 — L'après-midi",
        title: "Sa fille téléphone.",
        text: "Elles parlent longtemps. De rien en particulier. De tout. Marguerite se rappelle chaque anniversaire, chaque prénom des petits-enfants.",
        quote: "« Tu vas bien, maman ? » — « Comme un charme, ma chérie. »",
      },
      {
        key: "D",
        label: "Jour 1 — Le soir",
        title: "Elle ferme les yeux sans peur.",
        text: "Le monde est encore entier. Les souvenirs sont là, rangés, fidèles. Elle s'endort en pensant à demain.",
        quote: null,
      },
    ],
  },
  {
    day: 2,
    scenes: [
      {
        key: "C",
        label: "Jour 2 — Le matin",
        title: "Où est la cuillère à thé ?",
        text: "Elle est sûre de l'avoir vue hier. Elle cherche cinq minutes. Elle la trouve dans le bon tiroir. Ce n'est rien, pense-t-elle.",
        quote: null,
      },
      {
        key: "L",
        label: "Jour 2 — L'après-midi",
        title: "Un mot lui échappe.",
        text: "Elle parle à la voisine du… du… de l'appareil dans la cuisine. Elle fait un geste de la main.",
        quote: "« Le grille-pain ? » — « Oui. C'est ça. »",
      },
      {
        key: "D",
        label: "Jour 2 — Le soir",
        title: "Elle relit la même page deux fois.",
        text: "Elle ne s'en rend pas compte tout de suite. Quand elle comprend, elle ferme le livre. Elle regarde par la fenêtre un long moment.",
        quote: null,
      },
    ],
  },
  {
    day: 3,
    scenes: [
      {
        key: "C",
        label: "Jour 3 — Le matin",
        title: "La date lui résiste.",
        text: "Elle cherche dans sa tête. On est en… elle sait que c'est l'automne. Les feuilles le disent. Mais le chiffre exact refuse de venir.",
        quote: null,
      },
      {
        key: "T",
        label: "Jour 3 — L'après-midi",
        title: "Son fils est venu.",
        text: "Elle lui prépare du café. Elle lui demande deux fois comment va sa femme. Il ne dit rien la deuxième fois. Il sourit différemment.",
        quote:
          "« Tu m'as déjà posé la question, maman. » — Un silence. — « Ah. »",
      },
      {
        key: "L",
        label: "Jour 3 — Le soir",
        title: "Elle écrit son nom sur une enveloppe.",
        text: "Elle s'arrête au milieu. Elle regarde les lettres. Elles lui semblent soudain étranges, comme appartenant à quelqu'un d'autre.",
        quote: null,
      },
    ],
  },
  {
    day: 4,
    scenes: [
      {
        key: "C",
        label: "Jour 4 — Le matin",
        title: "Elle a laissé le gaz ouvert.",
        text: "Sa fille l'a trouvé en arrivant. Elle n'a pas crié. Elle a juste fermé le robinet et pris sa mère dans ses bras longtemps.",
        quote: null,
      },
      {
        key: "T",
        label: "Jour 4 — L'après-midi",
        title: "Le médecin parle doucement.",
        text: "Il y a des mots que Marguerite entend sans tout à fait les attraper. Sa fille prend des notes.",
        quote: "« Maladie d'Alzheimer à stade précoce. »",
      },
      {
        key: "D",
        label: "Jour 4 — Le soir",
        title: "Elle pleure une seule fois.",
        text: "Dans la salle de bains, le robinet ouvert pour couvrir le son. Puis elle se lave le visage. Elle revient dans le salon. Elle sourit à sa fille.",
        quote: null,
      },
    ],
  },
  {
    day: 5,
    scenes: [
      {
        key: "L",
        label: "Jour 5 — Le matin",
        title: "Les visages flottent.",
        text: "Elle sait qu'elle connaît cet homme dans le cadre photo. Elle sait qu'elle l'aime. Le nom vient par vagues, s'éloigne, revient à moitié.",
        quote: null,
      },
      {
        key: "T",
        label: "Jour 5 — L'après-midi",
        title: "Elle cherche sa mère.",
        text: "Sa mère est morte depuis vingt ans. Mais aujourd'hui, Marguerite la cherche dans chaque pièce. Elle l'appelle doucement.",
        quote: "« Maman ? Tu es là ? »",
      },
      {
        key: "C",
        label: "Jour 5 — Le soir",
        title: "Quelque chose d'ancien revient.",
        text: "Une chanson. Elle la chante sans s'en rendre compte, à voix basse, en rangeant la vaisselle. Ses mains savent encore.",
        quote: null,
      },
    ],
  },
  {
    day: 6,
    scenes: [
      {
        key: "D",
        label: "Jour 6 — Le matin",
        title: "Le miroir la déroute.",
        text: "Cette femme aux cheveux blancs. Elle la connaît. Mais quelque chose ne coïncide pas. Elle touche le verre.",
        quote: null,
      },
      {
        key: "T",
        label: "Jour 6 — L'après-midi",
        title: "Sa petite-fille lui lit une histoire.",
        text: "Le sens des mots s'évapore vite, mais la voix reste. La voix est chaude. Marguerite ferme les yeux et se laisse porter.",
        quote: "« Raconte-la encore. »",
      },
      {
        key: "L",
        label: "Jour 6 — Le soir",
        title: "Elle ne sait plus où elle est.",
        text: "Sa fille lui dit le nom de la rue. Le nom de la ville. Marguerite hoche la tête. Elle fait semblant de reconnaître.",
        quote: null,
      },
    ],
  },
  {
    day: 7,
    scenes: [
      {
        key: "C",
        label: "Jour 7 — Le matin",
        title: "Les mots sont presque tous partis.",
        text: "Il reste des fragments. Des images. La chaleur d'une main. L'odeur du café. Des choses que le langage ne peut plus nommer mais que le corps garde.",
        quote: null,
      },
      {
        key: "D",
        label: "Jour 7 — L'après-midi",
        title: "Elle reconnaît quelque chose.",
        text: "Pas un nom. Pas un visage précisément. Mais une présence. Sa fille lui tient la main et Marguerite serre fort.",
        quote: "« … »",
      },
      {
        key: "L",
        label: "Jour 7 — Le soir",
        title: "Elle est encore là.",
        text: "Différemment. Dans les espaces entre les mots. Dans la pression d'une main. Dans la chanson que ses lèvres murmurent sans que sa tête s'en souvienne.",
        quote: null,
      },
    ],
  },
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let currentDay = 1;
let currentScene = 0;
let unlockedDays = new Set([1]);
let fragmentTimers = [];

const audio = document.getElementById("narration");
const bgCurrent = document.getElementById("bg-current");
const bgNext = document.getElementById("bg-next");
const bgOverlay = document.getElementById("bg-overlay");
const progressFill = document.getElementById("audio-progress-fill");

// ─── AUDIO ───────────────────────────────────────────────────────────────────
function loadAudio(day, scene) {
  audio.src = `audio/day${day}-scene${scene + 1}.mp3`;
  audio.load();
  audio.play().catch(() => {
    /* autoplay blocked — needs user interaction first */
  });
}

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  }
});

// ─── BACKGROUND ──────────────────────────────────────────────────────────────
function crossfadeBackground(day, scene) {
  const path = `images/day${day}-scene${scene + 1}.jpg`;
  bgNext.style.backgroundImage = `url('${path}')`;
  bgNext.style.opacity = "1";
  setTimeout(() => {
    bgCurrent.style.backgroundImage = `url('${path}')`;
    bgNext.style.opacity = "0";
  }, 1200);
}

// ─── OVERLAY OPACITY per day ─────────────────────────────────────────────────
const OVERLAYS = [0.35, 0.42, 0.48, 0.55, 0.62, 0.7, 0.78];

// ─── OBJECT HINTS ────────────────────────────────────────────────────────────
function updateHints() {
  const availableKey = DAYS[currentDay - 1].scenes[currentScene].key;
  document.getElementById("object-hints").classList.add("visible");
  ["T", "C", "D", "L"].forEach((k) => {
    document
      .getElementById("hint-" + k)
      .classList.toggle("available", k === availableKey);
  });
  document.getElementById("skip-hint").classList.add("visible");
  document.getElementById("audio-bar").classList.add("visible");
}

// ─── RENDER ──────────────────────────────────────────────────────────────────
function render(instant = false) {
  const s = DAYS[currentDay - 1].scenes[currentScene];
  const stage = document.getElementById("stage");
  const existing = stage.querySelector(".scene");

  if (existing && !instant) {
    existing.style.opacity = "0";
    existing.style.pointerEvents = "none";
  }

  setTimeout(
    () => {
      stage.innerHTML = `
      <div class="scene blur-${currentDay}">
        <div class="scene-inner">
          <div class="day-label">${s.label}</div>
          <h2 class="scene-title">${s.title}</h2>
          <p class="scene-text">${s.text}</p>
          ${s.quote ? `<blockquote class="scene-quote">${s.quote}</blockquote>` : ""}
        </div>
      </div>`;

      bgOverlay.style.opacity = OVERLAYS[currentDay - 1];
      crossfadeBackground(currentDay, currentScene);
      loadAudio(currentDay, currentScene);
      progressFill.style.width = "0%";

      // Progress bar
      const total = DAYS.reduce((a, d) => a + d.scenes.length, 0);
      const done =
        DAYS.slice(0, currentDay - 1).reduce((a, d) => a + d.scenes.length, 0) +
        currentScene;
      document.getElementById("progress-bar").style.width =
        (done / (total - 1)) * 100 + "%";

      // Day nav
      document.querySelectorAll(".day-btn").forEach((btn) => {
        const d = parseInt(btn.dataset.day);
        btn.classList.toggle("active", d === currentDay);
        btn.classList.toggle("locked", !unlockedDays.has(d));
        btn.classList.toggle("unlocked", unlockedDays.has(d));
      });

      updateHints();
      if (currentDay >= 4) spawnFragments(currentDay);

      // Fade in
      requestAnimationFrame(() => {
        const scene = stage.querySelector(".scene");
        if (scene) {
          requestAnimationFrame(() => {
            scene.classList.add("active");
          });
        }
      });
    },
    existing && !instant ? 700 : 0,
  );
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function goToDay(day) {
  if (!unlockedDays.has(day)) return;
  currentDay = day;
  currentScene = 0;
  render();
}

function advanceScene() {
  const dayData = DAYS[currentDay - 1];
  if (currentScene < dayData.scenes.length - 1) {
    currentScene++;
  } else if (currentDay < 7) {
    currentDay++;
    currentScene = 0;
    unlockedDays.add(currentDay);
  }
  // If last scene of last day, do nothing
  render();
}

// ─── MAKEY MAKEY INPUT ───────────────────────────────────────────────────────
// Default Makey Makey wiring:
//   T key = téléphone object
//   C key = café object
//   D key = bain object
//   L key = liste object
//   Space = skip (advance regardless of which object is expected)

document.addEventListener("keydown", (e) => {
  const k = e.key.toUpperCase();

  if (e.key === " ") {
    e.preventDefault();
    audio.pause();
    advanceScene();
    return;
  }

  if (["T", "C", "D", "L"].includes(k)) {
    const expected = DAYS[currentDay - 1].scenes[currentScene].key;
    if (k === expected) advanceScene();
    // Wrong object — nothing happens
  }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
render(true);
