const form = document.getElementById("cardForm");
const cardId = document.getElementById("cardId");
const cardTitle = document.getElementById("cardTitle");
const cardCost = document.getElementById("cardCost");
const cardType = document.getElementById("cardType");
const cardText = document.getElementById("cardText");
const listEl = document.getElementById("cardList");
const listCount = document.getElementById("listCount");
const resetButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");

const STORAGE_KEY = "mixed.cards";
let cards = [];

const defaultCards = [
  { id: "c1", title: "テンペスト", cost: 2, type: "スペル", text: "敵に3ダメージ。呪文を既に使っていればエナジー+1。" },
  { id: "c2", title: "鉄壁", cost: 1, type: "防御", text: "シールドを5得る。連続して防御を使っていれば+2。" },
];

function loadCards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultCards];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("invalid data");
    return parsed;
  } catch (err) {
    console.warn("カード読み込みに失敗したためデフォルトを使用", err);
    return [...defaultCards];
  }
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  updateCount();
}

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

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn ghost";
    editBtn.type = "button";
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => startEdit(card));

    const delBtn = document.createElement("button");
    delBtn.className = "btn ghost";
    delBtn.type = "button";
    delBtn.textContent = "削除";
    delBtn.addEventListener("click", () => deleteCard(card.id));

    actions.append(editBtn, delBtn);
    li.append(header, body, actions);
    listEl.appendChild(li);
  });
  updateCount();
}

function startEdit(card) {
  cardId.value = card.id;
  cardTitle.value = card.title || "";
  cardCost.value = card.cost ?? 0;
  cardType.value = card.type || "";
  cardText.value = card.text || "";
  saveButton.textContent = "変更を保存";
}

function resetForm() {
  form.reset();
  cardId.value = "";
  saveButton.textContent = "カードを保存";
}

function deleteCard(id) {
  const target = cards.find((c) => c.id === id);
  if (!target) return;
  const ok = confirm(`「${target.title || "名称未設定"}」を削除しますか？`);
  if (!ok) return;
  cards = cards.filter((c) => c.id !== id);
  saveCards();
  renderList();
  if (cardId.value === id) {
    resetForm();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = cardId.value || crypto.randomUUID();
  const newCard = {
    id,
    title: cardTitle.value.trim(),
    cost: Number(cardCost.value) || 0,
    type: cardType.value.trim(),
    text: cardText.value.trim(),
  };

  const existingIndex = cards.findIndex((c) => c.id === id);
  if (existingIndex >= 0) {
    cards[existingIndex] = newCard;
  } else {
    cards.unshift(newCard);
  }
  saveCards();
  renderList();
  resetForm();
});

resetButton.addEventListener("click", resetForm);

cards = loadCards();
renderList();
resetForm();
