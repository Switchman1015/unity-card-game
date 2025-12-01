const startButton = document.getElementById("startButton");
const statusPill = document.getElementById("statusPill");
const startMessage = document.getElementById("startMessage");
let isStarting = false;

function setStatus(text, intent = "ready") {
  statusPill.textContent = text;
  statusPill.dataset.intent = intent;
}

function startGame() {
  if (isStarting) return;
  isStarting = true;
  document.body.classList.add("starting");
  setStatus("Starting...", "active");
  startMessage.textContent = "Loading prototype...";
  startButton.disabled = true;
  startButton.textContent = "Loading";

  // Placeholder for hooking into the real game scene
  setTimeout(() => {
    startMessage.textContent = "Transition to the game scene here.";
    setStatus("Ready", "ready");
    startButton.disabled = false;
    startButton.textContent = "Start";
    document.body.classList.remove("starting");
    isStarting = false;
  }, 1000);
}

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startGame();
  }
});
