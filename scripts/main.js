const startButton = document.getElementById("startButton");
const statusPill = document.getElementById("statusPill");
let isStarting = false;
let longPressTimer = null;
let longPressTriggered = false;

function setStatus(text) {
  statusPill.textContent = text;
}

function goToCards() {
  longPressTriggered = true;
  setStatus("カード管理へ移動します...");
  window.location.href = "cards.html";
}

function startGame() {
  if (isStarting || longPressTriggered) return;
  isStarting = true;
  startButton.disabled = true;
  startButton.textContent = "ロード中";
  setStatus("準備中...");

  // 実際のゲームシーン遷移処理をここに接続してください
  setTimeout(() => {
    setStatus("準備完了: ゲームシーンへ遷移してください");
    startButton.disabled = false;
    startButton.textContent = "タップして開始";
    isStarting = false;
  }, 800);
}

function startLongPress() {
  longPressTriggered = false;
  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(goToCards, 3000);
}

function endPress(triggerStart = false) {
  clearTimeout(longPressTimer);
  if (!longPressTriggered && triggerStart) {
    startGame();
  }
}

startButton.addEventListener("pointerdown", startLongPress);
startButton.addEventListener("pointerup", () => endPress(true));
startButton.addEventListener("pointerleave", () => endPress(false));
startButton.addEventListener("pointercancel", () => endPress(false));

startButton.addEventListener("click", (event) => {
  // クリックは Enter キー対応も含む。長押しで遷移した場合は何もしない。
  if (longPressTriggered) {
    event.preventDefault();
    return;
  }
  startGame();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") startGame();
});
