const fileInput = document.getElementById("fileInput");
const listEl = document.getElementById("cardList");
const listCount = document.getElementById("listCount");

const sampleCards = [
  { id: "c1", title: "テンペスト", cost: 2, type: "スペル", text: "敵に3ダメージ。既に呪文を使っていればエナジー+1。" },
  { id: "c2", title: "鉄壁", cost: 1, type: "防御", text: "シールドを5得る。連続して防御を使っていれば+2。" },
  { id: "c3", title: "急襲", cost: 0, type: "スキル", text: "カードを1枚引く。このターン最初に使うカードなら敵に1ダメージ。" },
];

let cards = [...sampleCards];

function updateCount() {
  listCount.textContent = `${cards.length}件`;
}

function renderList() {
  listEl.innerHTML = "";
  cards.forEach((card) => {
    const li = document.createElement("li");
    li.className = "card-list-item card-row";

    const header = document.createElement("header");
    const titleSpan = document.createElement("span");
    titleSpan.textContent = card.title || "(名称未設定)";
    header.appendChild(titleSpan);

    const badge = document.createElement("span");
    badge.className = "badge";
    const typeText = card.type ? `${card.type}` : "タイプ未設定";
    badge.textContent = `${typeText} / コスト ${card.cost ?? 0}`;
    header.appendChild(badge);

    const body = document.createElement("div");
    body.className = "body";
    body.textContent = card.text || "効果テキストなし";

    li.append(header, body);
    listEl.appendChild(li);
  });
  updateCount();
}

function parseJson(text) {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("JSONは配列を想定しています");
  return parsed.map(normalizeCard);
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const idx = {
    id: header.indexOf("id"),
    title: header.indexOf("title"),
    cost: header.indexOf("cost"),
    type: header.indexOf("type"),
    text: header.indexOf("text"),
  };
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const card = {
      id: cols[idx.id] || crypto.randomUUID(),
      title: cols[idx.title] || "",
      cost: Number(cols[idx.cost] || 0),
      type: cols[idx.type] || "",
      text: cols[idx.text] || "",
    };
    return normalizeCard(card);
  });
}

function normalizeCard(raw) {
  return {
    id: raw.id || crypto.randomUUID(),
    title: raw.title ?? "",
    cost: Number(raw.cost) || 0,
    type: raw.type ?? "",
    text: raw.text ?? "",
  };
}

function handleFile(text, name) {
  try {
    if (name.endsWith(".json")) {
      cards = parseJson(text);
    } else if (name.endsWith(".csv")) {
      cards = parseCsv(text);
    } else {
      // 試しにJSONとして読む
      cards = parseJson(text);
    }
    renderList();
  } catch (err) {
    alert(`読込に失敗しました: ${err.message}`);
    console.error(err);
  }
}

fileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result;
    if (typeof text === "string") {
      handleFile(text, file.name.toLowerCase());
    }
  };
  reader.readAsText(file, "utf-8");
});

// 初期表示: サンプルデータ
renderList();
