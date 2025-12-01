const startButton = document.getElementById("startButton");
const statusPill = document.getElementById("statusPill");
let isStarting = false;

function setStatus(text) {
  statusPill.textContent = text;
}

function startGame() {
  if (isStarting) return;
  isStarting = true;
  startButton.disabled = true;
  startButton.textContent = "ロード中";
  setStatus("準備中...");

  // 実際のゲームシーン遷移処理をここに接続してください
  setTimeout(() => {
    setStatus("準備完了: ゲームシーンへ遷移してください");
    startButton.disabled = false;
    startButton.textContent = "ゲームスタート";
    isStarting = false;
  }, 800);
}

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") startGame();
});
