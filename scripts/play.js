const turnLabel = document.getElementById("turnLabel");
const enemyIntent = document.getElementById("enemyIntent");
const enemyName = document.getElementById("enemyName");
const playerName = document.getElementById("playerName");
const playerHP = document.getElementById("playerHP");
const enemyHP = document.getElementById("enemyHP");
const playerShield = document.getElementById("playerShield");
const playerEnergy = document.getElementById("playerEnergy");
const enemyShield = document.getElementById("enemyShield");
const enemyEnergy = document.getElementById("enemyEnergy");
const playerHand = document.getElementById("playerHand");
const logList = document.getElementById("logList");

// JSONで外部管理する場合は window.MIXED_STATE に上書きしてください。
const sampleState = {
  turn: 1,
  player: {
    name: "プレイヤー",
    hp: 20,
    maxHp: 25,
    shield: 3,
    energy: 3,
    hand: [
      { id: "c1", title: "テンペスト", cost: 2, type: "スペル", text: "敵に3ダメージ。既に呪文を使っていればエナジー+1。" },
      { id: "c2", title: "鉄壁", cost: 1, type: "防御", text: "シールドを5得る。連続して防御を使っていれば+2。" },
      { id: "c3", title: "急襲", cost: 0, type: "スキル", text: "カードを1枚引く。このターン最初なら敵に1ダメージ。" },
    ]
  },
  enemy: {
    name: "センチネル",
    hp: 18,
    maxHp: 22,
    shield: 0,
    energy: 2,
    intent: "次ターン: 4ダメージ"
  },
  log: [
    "対戦開始",
    "プレイヤーはエナジー3を得た",
    "敵は次の攻撃を準備している"
  ]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function renderHP(container, current, max) {
  container.innerHTML = "";
  const bar = document.createElement("div");
  bar.className = "hp-bar";
  const fill = document.createElement("div");
  fill.className = "hp-fill";
  const ratio = max > 0 ? clamp(current, 0, max) / max : 0;
  fill.style.width = `${ratio * 100}%`;
  bar.appendChild(fill);
  const label = document.createElement("span");
  label.className = "hp-label";
  label.textContent = `${current}/${max}`;
  container.append(bar, label);
}

function renderTokens(shieldEl, energyEl, shield, energy) {
  shieldEl.textContent = shield ?? 0;
  energyEl.textContent = energy ?? 0;
}

function renderHand(hand) {
  playerHand.innerHTML = "";
  (hand || []).slice(0, 3).forEach((card) => {
    const li = document.createElement("li");
    li.className = "hand-card";

    const header = document.createElement("header");
    const title = document.createElement("span");
    title.textContent = card.title || "(名称未設定)";
    const meta = document.createElement("span");
    meta.className = "badge";
    meta.textContent = `${card.type || "タイプ未設定"} / コスト ${Number(card.cost) || 0}`;
    header.append(title, meta);

    const body = document.createElement("div");
    body.className = "body";
    body.textContent = card.text || "効果テキストなし";

    li.append(header, body);
    playerHand.appendChild(li);
  });
}

function renderLog(log) {
  logList.innerHTML = "";
  (log || []).forEach((line) => {
    const li = document.createElement("li");
    li.className = "log-item";
    li.textContent = line;
    logList.appendChild(li);
  });
}

function renderState(state) {
  const s = state || {};
  turnLabel.textContent = `Turn ${s.turn ?? "-"}`;
  enemyIntent.textContent = s.enemy?.intent || "-";
  playerName.textContent = s.player?.name || "プレイヤー";
  enemyName.textContent = s.enemy?.name || "敵";

  renderHP(playerHP, s.player?.hp ?? 0, s.player?.maxHp ?? s.player?.hp ?? 0);
  renderHP(enemyHP, s.enemy?.hp ?? 0, s.enemy?.maxHp ?? s.enemy?.hp ?? 0);

  renderTokens(playerShield, playerEnergy, s.player?.shield ?? 0, s.player?.energy ?? 0);
  renderTokens(enemyShield, enemyEnergy, s.enemy?.shield ?? 0, s.enemy?.energy ?? 0);

  renderHand(s.player?.hand || []);
  renderLog(s.log || []);
}

function loadState() {
  // window.MIXED_STATE に外部から注入した状態をセットすればそのまま表示されます。
  return window.MIXED_STATE || sampleState;
}

renderState(loadState());
