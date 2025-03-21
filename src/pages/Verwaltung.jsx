import { useEffect, useState } from "react";
import axios from "axios";

export default function Verwaltung() {
    const [mitglieder, setMitglieder] = useState([]);
    const [users, setUsers] = useState([]);  // Für Benutzer
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");  // Neuer Benutzername für die Erstellung
    const [userEmail, setUserEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");  // Neues Passwort

    useEffect(() => {
        fetchMitglieder();
        fetchUsers();
    }, []);

    // Mitglieder und Benutzer laden
    const fetchMitglieder = async () => {
        const response = await fetch("http://localhost:5000/api/mitglieder");
        const data = await response.json();
        setMitglieder(data);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/admin/users");
            setUsers(response.data);
        } catch (err) {
            setError("Fehler beim Laden der Benutzer.");
        }
    };
    // Benutzer löschen
    const handleDeleteUser = async (userId) => {
        try {
            // DELETE-Anfrage an das Backend senden, um den Benutzer zu löschen
            const response = await axios.delete(`http://localhost:5000/admin/users/${userId}`);

            // Wenn der Benutzer erfolgreich gelöscht wurde
            if (response.status === 200) {
                setMessage(`Benutzer mit ID ${userId} erfolgreich gelöscht.`);
                fetchUsers();  // Benutzer nach dem Löschen erneut laden
            }
        } catch (err) {
            // Falls ein Fehler auftritt
            setError("Fehler beim Löschen des Benutzers.");
        }
    };

    // Neuer Benutzer hinzufügen (Admin)
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/admin/create-user", {
                username,
                password,
                email: userEmail,
            });

            if (response.status === 201) {
                setMessage(`Benutzer ${username} erfolgreich erstellt!`);
                setUsername("");
                setUserEmail("");
                fetchUsers();
            }
        } catch (err) {
            setError("Fehler beim Erstellen des Benutzers.");
        }
    };

    // IBAN hinzufügen
    const handleAddIban = async (userId, iban) => {
        try {
            const response = await axios.post("http://localhost:5000/api/mitglieder/iban", {
                iban: iban,
                userId: userId,  // userId wird mitgeschickt
            });
            fetchUsers();
        } catch (err) {
            console.error("Fehler beim Hinzufügen der IBAN:", err.response ? err.response.data : err.message);
            setError("Fehler beim Hinzufügen der IBAN.");
        }
    };
    const handleIbanChange = (e, userId) => {
        const updatedUsers = users.map((user) =>
            user.id === userId ? { ...user, ibanInput: e.target.value } : user
        );
        setUsers(updatedUsers);  // Aktualisiere die Benutzerliste mit der neuen IBAN
    };

    // IBAN löschen
    const handleDeleteIban = async (userId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/mitglieder/iban`, {
                iban: "",  // Leere IBAN für Löschung
                userId,
            });
            fetchUsers();  // Aktualisiere die Benutzerliste
            setMessage("IBAN erfolgreich gelöscht!");
        } catch (err) {
            setError("Fehler beim Löschen der IBAN.");
        }
    };

    const handleChangePassword = async (userId) => {
        try {
            const response = await axios.post("http://localhost:5000/admin/change-password", {
                userId,
                newPassword: password,
            });
            fetchUsers();  // Aktualisiere die Benutzerliste
            setMessage("Passwort erfolgreich geändert!");
            setPassword(""); // Leere das Passwortfeld
        } catch (err) {
            setError("Fehler beim Ändern des Passworts.");
        }
    };

    // Funktion zum Setzen des Passworts für einen bestimmten Benutzer
    const handlePasswordChange = (e, userId) => {
        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, passwordInput: e.target.value } : user
        );
        setUsers(updatedUsers);
    };
    return (
        <div className="p-10">
            <h2 className="text-2xl font-semibold mb-4">Mitgliederverwaltung</h2>

            {/* Neuer Benutzer erstellen */}
            <h3 className="text-xl font-semibold mb-4 mt-8">Neuen Benutzer erstellen</h3>
            <form onSubmit={handleCreateUser} className="mb-4">
                <input
                    type="text"
                    placeholder="Benutzername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="email"
                    placeholder="E-Mail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 mr-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    Benutzer erstellen
                </button>
            </form>

            {/* Erfolgs-/Fehlermeldung */}
            {message && <p className="mt-4 text-green-500">{message}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {/* Benutzer anzeigen */}
            <h3 className="text-xl font-semibold mb-4 mt-8">Benutzer anzeigen</h3>
            <ul className="mt-6">
                {users.map((user) => (
                    <li key={user.id} className="flex justify-between border p-2">
                        <div>
                            ID: {user.id} <br />
                            {user.username} ({user.email}) <br />
                            {user.iban ? (
                                <span className="text-green-500">IBAN vorhanden ✔</span>
                            ) : (
                                <span className="text-red-500">Keine IBAN</span>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            {/* IBAN hinzufügen */}
                            {!user.iban && (
                                <input
                                    type="text"
                                    placeholder="IBAN eingeben"
                                    value={user.ibanInput || ""}
                                    onChange={(e) => handleIbanChange(e, user.id)}
                                    className="border p-2 mr-2"
                                />
                            )}
                            {!user.iban && (
                                <button
                                    onClick={() => handleAddIban(user.id, user.ibanInput)}
                                    className="bg-blue-500 text-white px-2 py-1"
                                >
                                    IBAN hinzufügen
                                </button>
                            )}
                            {/* IBAN löschen */}
                            {user.iban && (
                                <button
                                    onClick={() => handleDeleteIban(user.id)}
                                    className="bg-yellow-500 text-white px-2 py-1"
                                >
                                    IBAN löschen
                                </button>
                            )}
                            {/* Passwort ändern */}
                            <input
                                type="password"
                                placeholder="Neues Passwort"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border p-2 mr-2"
                            />
                            <button
                                onClick={() => handleChangePassword(user.id)}
                                className="bg-purple-500 text-white px-2 py-1"
                            >
                                Passwort ändern
                            </button>

                            {/* Benutzer löschen */}
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-500 text-white px-2 py-1"
                            >
                                Löschen
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

}
