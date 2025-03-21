import { useState } from "react";

export default function Veranstaltungen() {
    const [events, setEvents] = useState([
        { id: 1, title: "Sommerfest", date: "2024-06-15", description: "Ein tolles Fest für die ganze Familie!" },
        { id: 2, title: "Weihnachtsmarkt", date: "2024-12-10", description: "Glühwein und Geschenke für alle!" }
    ]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Veranstaltungen</h2>
            <ul className="space-y-4">
                {events.map(event => (
                    <li key={event.id} className="bg-white shadow-md p-4 rounded-lg">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-gray-600">{event.date}</p>
                        <p>{event.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
