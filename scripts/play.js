const stateFile = document.getElementById("stateFile");
const turnLabel = document.getElementById("turnLabel");
const enemyIntent = document.getElementById("enemyIntent");
const playerStats = document.getElementById("playerStats");
const enemyStats = document.getElementById("enemyStats");
const playerHand = document.getElementById("playerHand");
const logList = document.getElementById("logList");

const sampleState = {
  turn: 1,
  player: {
    name: "プレイヤー",
    hp: 20,
    shield: 3,
    energy: 3,
    deckCount: 15,
    discardCount: 2,
    hand: [
      { id: "c1", title: "テンペスト", cost: 2, type: "スペル", text: "敵に3ダメージ。既に呪文を使っていればエナジー+1。" },
      { id: "c2", title: "鉄壁", cost: 1, type: "防御", text: "シールドを5得る。連続して防御を使っていれば+2。" },
      { id: "c3", title: "急襲", cost: 0, type: "スキル", text: "カードを1枚引く。このターン最初なら敵に1ダメージ。" }
    ]
  },
  enemy: {
    name: "センチネル",
    hp: 18,
    shield: 0,
    intent: "次ターン: 4ダメージ"
  },
  log: [
    "対戦開始",
    "プレイヤーはエナジー3を得た",
    "敵は次の攻撃を準備している"
  ]
};

function renderStats(container, entries) {
  container.innerHTML = "";
  entries.forEach(({ label, value }) => {
    const div = document.createElement("div");
    div.className = "stat";
    div.innerHTML = `<strong>${label}</strong><br>${value}`;
    container.appendChild(div);
  });
}

function renderHand(hand) {
  playerHand.innerHTML = "";
  hand.forEach((card) => {
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
  log.forEach((line) => {
    const li = document.createElement("li");
    li.className = "log-item";
    li.textContent = line;
    logList.appendChild(li);
  });
}

function renderState(state) {
  turnLabel.textContent = `Turn ${state.turn ?? "-"}`;
  enemyIntent.textContent = state.enemy?.intent || "-";

  renderStats(playerStats, [
    { label: state.player?.name || "プレイヤー", value: "" },
    { label: "HP", value: state.player?.hp ?? "-" },
    { label: "シールド", value: state.player?.shield ?? 0 },
    { label: "エナジー", value: state.player?.energy ?? 0 },
    { label: "山札", value: state.player?.deckCount ?? 0 },
    { label: "捨て札", value: state.player?.discardCount ?? 0 },
  ]);

  renderStats(enemyStats, [
    { label: state.enemy?.name || "敵", value: "" },
    { label: "HP", value: state.enemy?.hp ?? "-" },
    { label: "シールド", value: state.enemy?.shield ?? 0 },
  ]);

  renderHand(state.player?.hand || []);
  renderLog(state.log || []);
}

function parseStateJson(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("JSONが不正です");
  return parsed;
}

stateFile.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result;
    if (typeof text === "string") {
      try {
        const state = parseStateJson(text);
        renderState(state);
      } catch (err) {
        alert(`読み込みに失敗しました: ${err.message}`);
        console.error(err);
      }
    }
  };
  reader.readAsText(file, "utf-8");
});

// 初期表示
renderState(sampleState);
