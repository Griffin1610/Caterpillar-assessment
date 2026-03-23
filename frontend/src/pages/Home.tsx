import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";

function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`http://localhost:4000/api/products?page=${page}&search=${encodeURIComponent(searchQuery)}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setTotalPages(data.totalPages);
            });
    }, [page, searchQuery]);

    function handleSearch(e: { preventDefault: () => void }) {
        e.preventDefault();
        setPage(1);
        setSearchQuery(searchInput);
    }

    async function addToCart(productId: number) {
        setError("");
        const res = await fetch(`http://localhost:4000/api/cart/${user!.userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: 1 }),
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error);
        }
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div>
            <div>
                <span>Welcome, {user!.firstName}</span>
                <button onClick={() => navigate("/profile")}>My Profile</button>
                <button onClick={() => navigate("/checkout")}>Checkout</button>
                {user!.isAdmin === 1 && <button onClick={() => navigate("/admin")}>Admin</button>}
                <button onClick={handleLogout}>Logout</button>
            </div>

            <h1>Products</h1>

            <form onSubmit={handleSearch}>
                <input
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {error && <p>{error}</p>}

            <div>
                {products.map(product => (
                    <div key={product.productId}>
                        <button onClick={() => navigate(`/products/${product.productId}`)}>
                            {product.productName}
                        </button>
                        <span>${product.pricePerItem.toFixed(2)}</span>
                        <button onClick={() => addToCart(product.productId)}>Add to Cart</button>
                    </div>
                ))}
            </div>

            <div>
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default Home;
