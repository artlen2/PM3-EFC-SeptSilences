// audio-manager.js (importé dans chaque page)
const MUSIC = {
  "index.html": "./audio/MUSIQUE/Debut.wav",
  "about.html": "./audio/MUSIQUE/Debut.wav",
};

const page = location.pathname.split("/").pop() || "index.html";
const src = MUSIC[page] ?? MUSIC["index.html"];

let audio = window.__bgAudio;

if (!audio) {
  audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.5;
  window.__bgAudio = audio;
  audio.play().catch(() => {
    // Autoplay bloqué — attendre un clic utilisateur (obligatoire par Google )
    document.addEventListener("click", () => audio.play(), { once: true });
  });
} else if (audio.src !== new URL(src, location.href).href) {
  // Changement de musique (ex: index -> game)
  audio.src = src;
  audio.play();
}
