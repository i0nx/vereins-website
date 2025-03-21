const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Redis Client
const redisClient = createClient({
    socket: {
        host: "localhost",
        port: 6379,
    },
});

redisClient.on("error", (err) => console.error("Redis-Fehler:", err));

(async () => {
    await redisClient.connect();

    // Testeintrag für Admin (Passwort sollte in einer realen App gehasht sein!)
    await redisClient.set("admin", "supergeheim");

    console.log("Admin-Passwort gesetzt!");

    app.post("/api/comments", async (req, res) => {
        const { name, comment } = req.body;

        if (!name || !comment) {
            return res.status(400).json({ error: "Name und Kommentar sind erforderlich." });
        }

        try {
            const commentsData = await redisClient.get("comments");
            const commentsList = commentsData ? JSON.parse(commentsData) : [];

            // Neuen Kommentar zur Liste hinzufügen
            commentsList.push({ name, comment });

            await redisClient.set("comments", JSON.stringify(commentsList));

            res.status(200).json({ success: true, message: "Kommentar erfolgreich gespeichert." });
        } catch (err) {
            console.error("Fehler beim Speichern des Kommentars:", err);
            res.status(500).json({ error: "Fehler beim Speichern des Kommentars." });
        }
    });

    // Route: Alle Kommentare abrufen
    app.get("/api/comments", async (req, res) => {
        try {
            const commentsData = await redisClient.get("comments");
            const commentsList = commentsData ? JSON.parse(commentsData) : [];
            res.status(200).json(commentsList);
        } catch (err) {
            console.error("Fehler beim Abrufen der Kommentare:", err);
            res.status(500).json({ error: "Fehler beim Abrufen der Kommentare." });
        }
    });

    // **Login-Route für Admin**
    app.post("/admin/login", async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Bitte Benutzername und Passwort eingeben." });
        }

        const storedPassword = await redisClient.get(username);

        if (storedPassword && storedPassword === password) {
            return res.status(200).json({ message: "Login erfolgreich", success: true });
        } else {
            return res.status(401).json({ error: "Falsche Anmeldeinformationen" });
        }
    });

    // **Route: Neues Mitglied erstellen (nur Admin)**
    app.post("/admin/create-user", async (req, res) => {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ error: "Benutzername, Passwort und E-Mail müssen angegeben werden." });
        }

        try {
            // Admin-Check
            const storedPassword = await redisClient.get("admin");
            if (storedPassword !== "supergeheim") {
                return res.status(403).json({ error: "Nicht berechtigt, diesen Benutzer zu erstellen." });
            }

            // Hole die bestehenden Benutzer aus Redis und füge einen neuen Benutzer mit einer eindeutigen ID hinzu
            const usersData = await redisClient.get("users");
            const usersList = usersData ? JSON.parse(usersData) : [];

            // Erstelle eine neue eindeutige ID
            const newUserId = usersList.length > 0 ? usersList[usersList.length - 1].id + 1 : 1;

            const newUser = { id: newUserId, username, password, email };

            usersList.push(newUser);
            await redisClient.set("users", JSON.stringify(usersList));

            res.status(201).json({ message: `Benutzer ${username} erfolgreich erstellt!`, user: newUser });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Fehler beim Erstellen des Benutzers." });
        }
    });

    // **Route: Alle Benutzer abrufen**
    app.get("/admin/users", async (req, res) => {
        try {
            const data = await redisClient.get("users");
            const usersList = data ? JSON.parse(data) : [];
            res.json(usersList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Fehler beim Abrufen der Benutzer." });
        }
    });

    // **Route: Benutzer löschen**
    app.delete("/admin/users/:id", async (req, res) => {
        const userId = parseInt(req.params.id);

        try {
            const data = await redisClient.get("users");
            let usersList = data ? JSON.parse(data) : [];

            usersList = usersList.filter((user) => user.id !== userId);

            await redisClient.set("users", JSON.stringify(usersList));
            res.json({ message: "Benutzer gelöscht", id: userId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Fehler beim Löschen des Benutzers." });
        }
    });

    // **Mitgliederverwaltung (CRUD für Mitglieder)**
    const mitglieder = [
        { id: 1, name: "Max Mustermann", email: "max@example.com" },
        { id: 2, name: "Erika Musterfrau", email: "erika@example.com" },
    ];

    // **Route: Alle Mitglieder abrufen**
    app.get("/api/mitglieder", async (req, res) => {
        const data = await redisClient.get("mitglieder");
        const mitgliederList = data ? JSON.parse(data) : mitglieder;
        res.json(mitgliederList);
    });

    // **Route: Mitglied hinzufügen**
    app.post("/api/mitglieder", async (req, res) => {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name und E-Mail erforderlich" });
        }

        const data = await redisClient.get("mitglieder");
        let mitgliederList = data ? JSON.parse(data) : mitglieder;

        const newMember = { id: mitgliederList.length + 1, name, email };
        mitgliederList.push(newMember);

        await redisClient.set("mitglieder", JSON.stringify(mitgliederList));
        res.json({ message: "Mitglied hinzugefügt", member: newMember });
    });

    // **Route: Mitglied löschen**
    app.delete("/api/mitglieder/:id", async (req, res) => {
        const memberId = parseInt(req.params.id);

        const data = await redisClient.get("mitglieder");
        let mitgliederList = data ? JSON.parse(data) : mitglieder;

        mitgliederList = mitgliederList.filter((member) => member.id !== memberId);

        await redisClient.set("mitglieder", JSON.stringify(mitgliederList));
        res.json({ message: "Mitglied gelöscht", id: memberId });
    });

    // **Route: Mitglieder-Login**
    app.post("/mitglieder/login", async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Benutzername und Passwort müssen angegeben werden." });
        }

        try {
            const data = await redisClient.get("users");
            const usersList = data ? JSON.parse(data) : [];

            // Benutzer mit passendem Benutzernamen und Passwort finden
            const user = usersList.find((user) => user.username === username && user.password === password);

            if (user) {
                // Erfolgreicher Login
                return res.status(200).json({ success: true, message: "Login erfolgreich" });
            } else {
                // Fehler, wenn Benutzername oder Passwort falsch sind
                return res.status(401).json({ error: "Falsche Anmeldeinformationen" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Fehler beim Login." });
        }
    });

    // **Route: IBAN für Mitglied speichern**
    app.post("/api/mitglieder/iban", async (req, res) => {
        const { iban } = req.body;

        if (!iban) {
            return res.status(400).json({ error: "IBAN muss angegeben werden." });
        }

        try {
            // Annahme: Benutzer-Identifikation anhand der Session oder JWT (oder ähnliches)
            const userId = 1;  // Beispiel: Benutzer-ID des eingeloggten Benutzers

            // IBAN für das Mitglied speichern
            const data = await redisClient.get("users");
            const usersList = data ? JSON.parse(data) : [];

            const userIndex = usersList.findIndex((user) => user.id === userId);
            if (userIndex !== -1) {
                usersList[userIndex].iban = iban;
                await redisClient.set("users", JSON.stringify(usersList));

                return res.status(200).json({ success: true, message: "IBAN erfolgreich gespeichert." });
            } else {
                return res.status(404).json({ error: "Benutzer nicht gefunden." });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Fehler beim Speichern der IBAN." });
        }
    });
    // **Route: IBAN eines Mitglieds abrufen**
    app.get("/api/mitglieder/getiban", async (req, res) => {
        const userId = 1; // Beispiel: Benutzer-ID des eingeloggten Benutzers

        try {
            const data = await redisClient.get("users");
            const usersList = data ? JSON.parse(data) : [];

            const user = usersList.find((user) => user.id === userId);

            if (user) {
                res.status(200).json({ iban: user.iban || null });
            } else {
                res.status(404).json({ error: "Benutzer nicht gefunden." });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Fehler beim Abrufen der IBAN." });
        }
    });


    // Start des Servers
    app.listen(PORT, () => {
        console.log(`Server läuft auf Port ${PORT}`);
    });
})();
