import { useState } from "react";

export default function Kommentare() {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [userName, setUserName] = useState("Max Mustermann"); // Hier den tatsächlichen Namen des angemeldeten Mitglieds verwenden

    // Funktion zum Hinzufügen eines Kommentars
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!comment) {
            alert("Bitte geben Sie einen Kommentar ein.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: userName, comment }),
            });

            const data = await response.json();
            if (data.success) {
                setComments([...comments, { name: userName, comment }]);
                setComment(""); // Leeren des Kommentar-Feldes
            } else {
                alert("Fehler beim Absenden des Kommentars");
            }
        } catch (err) {
            console.error("Fehler beim Senden des Kommentars", err);
        }
    };

    return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-semibold mb-4">Kommentare</h2>
            <p>Hier können Mitglieder Kommentare hinterlassen.</p>

            <div className="mt-6">
                <textarea
                    className="p-2 w-full max-w-lg mb-4"
                    placeholder="Schreiben Sie hier Ihren Kommentar..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                ></textarea>

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleCommentSubmit}
                >
                    Kommentar absenden
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Kommentare:</h3>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="border-b py-4">
                            <p className="font-bold">{comment.name}</p>
                            <p>{comment.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>Noch keine Kommentare vorhanden.</p>
                )}
            </div>
        </div>
    );
}
