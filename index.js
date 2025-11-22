import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Стартовые данные
let planets = [
    { id: 1, name: "Earth", radius: 6371, distance: 149.6, description: "Our home planet", author: "Zavhorodnii Vladyslav" },
    { id: 2, name: "Mars", radius: 3389, distance: 227.9, description: "The Red Planet", author: "Zavhorodnii Vladyslav" },
    { id: 3, name: "Jupiter", radius: 69911, distance: 778.5, description: "Gas giant", author: "Zavhorodnii Vladyslav" }
];

// Массив для хранения логов
let logs = [];

// --------------------------
//   GET  /planets
// --------------------------
app.get("/planets", (req, res) => {
    res.json(planets);
});

// --------------------------
//   GET /logs — просмотр истории изменений
// --------------------------
app.get("/logs", (req, res) => {
    res.json(logs);
});

// --------------------------
//   POST  /planets
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

    // Логирование
    const logEntry = { action: "ADD", planet: newPlanet, date: new Date() };
    logs.push(logEntry);
    console.log("Added planet:", newPlanet);

    res.json(newPlanet);
});

// --------------------------
//   DELETE  /planets/:id
// --------------------------
app.delete("/planets/:id", (req, res) => {
    const id = Number(req.params.id);
    const deletedPlanet = planets.find(p => p.id === id);

    planets = planets.filter(p => p.id !== id);

    // Логирование
    const logEntry = { action: "DELETE", planet: deletedPlanet || { id }, date: new Date() };
    logs.push(logEntry);
    console.log("Deleted planet:", deletedPlanet || { id });

    res.json({ status: "deleted" });
});

// --------------------------
//   Запуск сервера
// --------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
