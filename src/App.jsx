import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import MitgliederLogin from "./pages/MitgliederLogin";
import Kommentare from "./pages/Kommentare";
import Kontakt from "./pages/Kontakt";
import Spenden from "./pages/Spenden";
import Mitglieder from "./pages/Mitglieder";
import Veranstaltungen from "./pages/Veranstaltungen";
import AdminLogin from "./pages/AdminLogin";
import Verwaltung from "./pages/Verwaltung";
import StorePage from "./pages/StorePage";
import './styles.css'; // Externe CSS-Datei einbinden

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Navigation am rechten Rand */}
            <nav className="navbar">
                <ul className="nav-links">
                    <li>
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    {!isLoggedIn ? (
                        <li>
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/mitglieder" className="nav-link">Mitglieder</Link>
                        </li>
                    )}
                    <li>
                        <Link to="/veranstaltungen" className="nav-link">Veranstaltungen</Link>
                    </li>
                    <li>
                        <Link to="/kommentare" className="nav-link">Kommentare</Link>
                    </li>
                    <li>
                        <Link to="/kontakt" className="nav-link">Kontakt</Link>
                    </li>
                    <li>
                        <Link to="/spenden" className="nav-link">Spenden</Link>
                    </li>
                    <li>
                        <Link to="/store" className="nav-link">Store</Link>
                    </li>
                    {isAdmin && (
                        <li>
                            <Link to="/verwaltung" className="nav-link">Verwaltung</Link>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center py-12 bg-gray-800">
                <div className="text-center max-w-3xl mx-auto px-6 text-white">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<MitgliederLogin setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/veranstaltungen" element={<Veranstaltungen />} />
                        <Route path="/kommentare" element={<Kommentare />} />
                        <Route path="/kontakt" element={<Kontakt />} />
                        <Route path="/spenden" element={<Spenden />} />
                        <Route path="/store" element={<StorePage />} />
                        <Route path="/mitglieder" element={<Mitglieder />} />
                        <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
                        {isAdmin && <Route path="/verwaltung" element={<Verwaltung />} />}
                    </Routes>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black text-white py-6 w-full">
                <div className="max-w-7xl mx-auto text-center">
                    <p>&copy; 2025 Verein e.V. Alle Rechte vorbehalten.</p>
                </div>
            </footer>
        </div>
    );
}
