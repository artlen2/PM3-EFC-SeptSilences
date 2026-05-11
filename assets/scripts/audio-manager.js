// Objet Audio
window.bgAudio = new Audio("audio/MUSIQUE/Debut.wav");

// Les configs
window.bgAudio.loop = true;
window.bgAudio.volume = 0.5;

// Joue la musique
window.bgAudio.play().catch((error) => {
  console.log("Autoplay prevented by browser: ", error);
});
