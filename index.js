const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 1234;
const MAX_ITEMS = 1_000_000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const order = Array.from({ length: MAX_ITEMS }, (_, i) => i + 1);
const selected = new Set();

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/client/index.html");
});

app.get("/items", (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search;

  const array = search ? order.filter((id) => id.toString().includes(search.toString())) : order;
  let items = array.slice(offset, offset + limit);

  res.json(items.map((id) => ({ id, selected: selected.has(id) })));
});

app.post("/move-item", (req, res) => {
  const { fromId, toId } = req.body;

  if (typeof fromId !== "number" || typeof toId !== "number") {
    return res.status(400).json({ error: "Дайте мне корректные данные :(" });
  }

  const fromIndex = order.indexOf(fromId);
  const toIndex = order.indexOf(toId);

  if (fromIndex === -1 || toIndex === -1) {
    return res.status(400).json({ error: "Не нашел" });
  }

  if (fromIndex === toIndex) {
    return res.json({ success: true });
  }

  const item = order.splice(fromIndex, 1)[0];
  const newToIndex = order.indexOf(toId);

  order.splice(newToIndex, 0, item);

  res.json({ success: true });
});

app.post("/select", (req, res) => {
  const { itemId, selected: isSelected } = req.body;

  if (typeof itemId !== "number" || typeof isSelected !== "boolean") {
    return res.status(400).json({ error: "Дайте мне корректные данные :(" });
  }

  if (isSelected) {
    selected.add(itemId);
  } else {
    selected.delete(itemId);
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
