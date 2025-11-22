import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Пути к файлам
const PLANETS_FILE = "planets.json";
const LOGS_FILE = "logs.json";

// --- Вспомогательные функции для работы с файлами ---
function readJSON(filePath, defaultValue = []) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return defaultValue; // если файла нет или ошибка — возвращаем пустой массив
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --- Загружаем данные из файлов при старте ---
let planets = readJSON(PLANETS_FILE, [
  { id: 1, name: "Earth", radius: 6371, distance: 149.6, description: "Our home planet", author: "Zavhorodnii Vladyslav" },
  { id: 2, name: "Mars", radius: 3389, distance: 227.9, description: "The Red Planet", author: "Zavhorodnii Vladyslav" },
  { id: 3, name: "Jupiter", radius: 69911, distance: 778.5, description: "Gas giant", author: "Zavhorodnii Vladyslav" }
]);

let logs = readJSON(LOGS_FILE);

// --------------------------
// GET /planets — получить все планеты
// --------------------------
app.get("/planets", (req, res) => {
  res.json(planets);
});

// --------------------------
// GET /logs — получить все логи
// --------------------------
app.get("/logs", (req, res) => {
  res.json(logs);
});

// --------------------------
// POST /planets — добавить планету
// --------------------------
app.post("/planets", (req, res) => {
  const { name, radius, distance, description, author } = req.body;

  if (!name || !radius || !distance || !description || !author) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newPlanet = {
    id: Date.now(),
    name,
    radius,
    distance,
    description,
    author
  };

  planets.push(newPlanet);
  writeJSON(PLANETS_FILE, planets); // сохраняем в файл

  const logEntry = { action: "ADD", planet: newPlanet, date: new Date() };
  logs.push(logEntry);
  writeJSON(LOGS_FILE, logs); // сохраняем логи
  console.log("Added planet:", newPlanet);

  res.json(newPlanet);
});

// --------------------------
// DELETE /planets/:id — удалить планету
// --------------------------
app.delete("/planets/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedPlanet = planets.find(p => p.id === id);

  planets = planets.filter(p => p.id !== id);
  writeJSON(PLANETS_FILE, planets); // обновляем файл

  const logEntry = { action: "DELETE", planet: deletedPlanet || { id }, date: new Date() };
  logs.push(logEntry);
  writeJSON(LOGS_FILE, logs); // сохраняем логи
  console.log("Deleted planet:", deletedPlanet || { id });

  res.json({ status: "deleted" });
});

// --------------------------
// Запуск сервера
// --------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
