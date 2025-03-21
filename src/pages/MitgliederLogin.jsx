import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MitgliederLogin({ setIsLoggedIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Login-Anfrage an das Backend
            const response = await fetch("http://localhost:5000/mitglieder/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Erfolgreicher Login
                setIsLoggedIn(true);  // Status auf eingeloggt setzen
                navigate("/mitglieder");  // Weiterleitung zur Mitglieder-Seite
            } else {
                // Fehler beim Login
                setError(data.error);
            }
        } catch (err) {
            setError("Serverfehler, bitte später erneut versuchen.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Mitglieder-Login</h2>
            <form onSubmit={handleLogin} className="bg-white shadow-md p-6 rounded-lg">
                <label className="block mb-2">Benutzername:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                />

                <label className="block mb-2">Passwort:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                />

                {error && <p className="text-red-500">{error}</p>}

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
