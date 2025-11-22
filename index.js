import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Стартовые данные (как в твоей таблице)
let planets = [
    { id: 1, name: "Earth", radius: 6371, distance: 149.6, description: "Our home planet", author: "Zavhorodnii Vladyslav" },
    { id: 2, name: "Mars", radius: 3389, distance: 227.9, description: "The Red Planet", author: "Zavhorodnii Vladyslav" },
    { id: 3, name: "Jupiter", radius: 69911, distance: 778.5, description: "Gas giant", author: "Zavhorodnii Vladyslav" }
];

// --------------------------
//   GET  /planets
// --------------------------
app.get("/planets", (req, res) => {
    res.json(planets);
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
    res.json(newPlanet);
});

// --------------------------
//   DELETE  /planets/:id
// --------------------------
app.delete("/planets/:id", (req, res) => {
    const id = Number(req.params.id);

    planets = planets.filter(p => p.id !== id);

    res.json({ status: "deleted" });
});

// --------------------------
//   Запуск сервера
// --------------------------
// Render задаёт порт через переменную окружения PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
