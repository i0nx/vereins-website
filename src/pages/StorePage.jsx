import { useState } from "react";

// Beispielprodukte
const products = [
    {
        id: 1,
        name: "Hut",
        description: "Ein Hut.",
        price: 999.99,
        image: "https://via.placeholder.com/300x200?text=Hut",
    },
    {
        id: 2,
        name: "T-Shirt",
        description: "Ein T-Shirt.",
        price: 799.99,
        image: "https://via.placeholder.com/300x200?text=T-Shirt",
    },
    {
        id: 3,
        name: "Hose",
        description: "Eine Hose.",
        price: 199.99,
        image: "https://via.placeholder.com/300x200?text=Hose",
    },
    {
        id: 4,
        name: "Tröte",
        description: "Eine Tröte.",
        price: 129.99,
        image: "https://via.placeholder.com/300x200?text=Tröte",
    },
];

export default function StorePage() {
    const [cart, setCart] = useState([]);

    // Funktion, um ein Produkt zum Warenkorb hinzuzufügen
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // Funktion, um die Gesamtzahl der Artikel im Warenkorb zu berechnen
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Funktion, um den Gesamtpreis des Warenkorbs zu berechnen
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Willkommen im Online-Shop</h1>

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold">Unsere Produkte</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-md"
                        />
                        <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
                        <p className="text-gray-700 mt-2">{product.description}</p>
                        <p className="text-xl font-bold mt-2">${product.price.toFixed(2)}</p>

                        <button
                            className="bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-700 transition-colors"
                            onClick={() => addToCart(product)}
                        >
                            In den Warenkorb
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t pt-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Warenkorb</h2>
                {cart.length > 0 ? (
                    <div className="text-center">
                        <ul className="space-y-4">
                            {cart.map((item) => (
                                <li key={item.id} className="flex justify-between">
                                    <span>
                                        {item.name} (x{item.quantity})
                                    </span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 text-xl font-semibold">
                            <p>Gesamtartikel: {getTotalItems()}</p>
                            <p>Gesamtpreis: ${getTotalPrice()}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Der Warenkorb ist leer.</p>
                )}
            </div>
        </div>
    );
}
