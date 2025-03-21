import { useState, useEffect } from "react";

export default function Mitglieder() {
    const [iban, setIban] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [ibanExists, setIbanExists] = useState(false); // Neuer Zustand für die IBAN-Prüfung

    // Funktion zum Abrufen der IBAN des Benutzers
    const fetchIban = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/mitglieder/getiban");
            const data = await response.json();
            if (data.iban) {
                setIbanExists(true); // IBAN gefunden, Haken setzen
            } else {
                setIbanExists(false); // Keine IBAN gefunden
            }
        } catch (err) {
            console.error("Fehler beim Abrufen der IBAN:", err);
        }
    };

    // Funktion zum Hinzufügen der IBAN
    const handleIbanSubmit = async (e) => {
        e.preventDefault();

        if (!iban) {
            setError("Bitte geben Sie eine gültige IBAN ein.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/mitglieder/iban", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ iban }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage("IBAN erfolgreich hinzugefügt!");
                setIban("");  // Eingabefeld zurücksetzen
                fetchIban();  // IBAN erneut abrufen, um den Status zu aktualisieren
            } else {
                setError(data.error || "Etwas ist schiefgelaufen.");
            }
        } catch (err) {
            setError("Serverfehler, bitte später erneut versuchen.");
        }
    };

    // Hole die IBAN beim Laden der Seite
    useEffect(() => {
        fetchIban();
    }, []);

    return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-semibold mb-4">Mitgliederbereich</h2>
            <p>Exklusiver Bereich für Mitglieder.</p>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Ihre IBAN für die monatlichen Beiträge</h3>
                <form onSubmit={handleIbanSubmit} className="bg-white shadow-md p-6 rounded-lg">
                    <label className="block mb-2">IBAN:</label>
                    <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        IBAN hinzufügen
                    </button>
                </form>

                {/* Anzeige des Hakens, wenn IBAN vorhanden ist */}
                {ibanExists && (
                    <div className="mt-4 text-green-500">
                        <span>✔ IBAN wurde bereits hinzugefügt</span>
                    </div>
                )}
            </div>
        </div>
    );
}
