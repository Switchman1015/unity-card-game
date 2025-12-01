const turnLabel = document.getElementById("turnLabel");
const stageNameEl = document.getElementById("stageName");
const enemyIntent = document.getElementById("enemyIntent");
const playerName = document.getElementById("playerName");
const playerHP = document.getElementById("playerHP");
const playerShield = document.getElementById("playerShield");
const playerEnergy = document.getElementById("playerEnergy");
const enemyUnits = document.getElementById("enemyUnits");
const playerHand = document.getElementById("playerHand");
const logList = document.getElementById("logList");

// JSONで外部管理する場合は window.MIXED_STATE に上書きしてください。
const sampleState = {
  turn: 1,
  stage: "Astropolis",
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
  enemies: [
    { id: "e1", name: "センチネル", hp: 18, maxHp: 22, shield: 0, energy: 2, intent: "次ターン: 4ダメージ" },
    { id: "e2", name: "ゴーレム", hp: 15, maxHp: 18, shield: 2, energy: 1, intent: "防御+攻撃" },
    { id: "e3", name: "コボルト", hp: 12, maxHp: 12, shield: 0, energy: 3, intent: "毒付与" },
  ],
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

function renderEnemies(enemies) {
  enemyUnits.innerHTML = "";
  (enemies || []).forEach((enemy) => {
    const wrapper = document.createElement("div");
    wrapper.className = "enemy-unit";

    const sprite = document.createElement("div");
    sprite.className = "sprite enemy-sprite";

    const nameEl = document.createElement("div");
    nameEl.className = "unit-name";
    nameEl.textContent = enemy.name || "敵";

    const hpRow = document.createElement("div");
    hpRow.className = "hp-row";
    renderHP(hpRow, enemy.hp ?? 0, enemy.maxHp ?? enemy.hp ?? 0);

    const tokens = document.createElement("div");
    tokens.className = "token-row";
    const shieldEl = document.createElement("span");
    shieldEl.className = "token shield";
    shieldEl.textContent = enemy.shield ?? 0;
    const energyEl = document.createElement("span");
    energyEl.className = "token energy";
    energyEl.textContent = enemy.energy ?? 0;
    tokens.append(shieldEl, energyEl);

    wrapper.append(sprite, nameEl, hpRow, tokens);
    enemyUnits.appendChild(wrapper);
  });
}

function renderHand(hand) {
  playerHand.innerHTML = "";
  (hand || []).slice(0, 3).forEach((card) => {
    const li = document.createElement("li");
    li.className = "hand-card";

    const top = document.createElement("div");
    top.className = "card-top";
    const cost = document.createElement("span");
    cost.className = "card-cost";
    cost.textContent = Number(card.cost) || 0;
    const title = document.createElement("span");
    title.className = "card-title";
    title.textContent = card.title || "(名称未設定)";
    const type = document.createElement("span");
    type.className = "card-type-tag";
    type.textContent = card.type || "タイプ未設定";
    top.append(cost, title, type);

    const illust = document.createElement("div");
    illust.className = "card-illustration";

    const bottom = document.createElement("div");
    bottom.className = "card-bottom";
    const sub = document.createElement("div");
    sub.className = "card-sub";
    sub.textContent = "PARALLEL SPACETIME";
    const body = document.createElement("p");
    body.className = "card-text";
    body.textContent = card.text || "効果テキストなし";
    bottom.append(sub, body);

    li.append(top, illust, bottom);
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
  stageNameEl.textContent = s.stage || "Stage";
  enemyIntent.textContent = s.enemies?.[0]?.intent || "-";
  playerName.textContent = s.player?.name || "プレイヤー";

  renderHP(playerHP, s.player?.hp ?? 0, s.player?.maxHp ?? s.player?.hp ?? 0);

  renderTokens(playerShield, playerEnergy, s.player?.shield ?? 0, s.player?.energy ?? 0);

  renderEnemies(s.enemies || []);
  renderHand(s.player?.hand || []);
  renderLog(s.log || []);
}

function loadState() {
  // window.MIXED_STATE に外部から注入した状態をセットすればそのまま表示されます。
  return window.MIXED_STATE || sampleState;
}

renderState(loadState());
