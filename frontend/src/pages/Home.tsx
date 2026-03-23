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
    const [cartSuccess, setCartSuccess] = useState(false);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/api/products?page=${page}&search=${encodeURIComponent(searchQuery)}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setTotalPages(data.totalPages);
            });
    }, [page, searchQuery]);

    function fetchSuggestions(value: string) {
        if (!value.trim()) {
            setSuggestions([]);
            return;
        }
        fetch(`http://localhost:4000/api/products?page=1&search=${encodeURIComponent(value)}`)
            .then(res => res.json())
            .then(data => setSuggestions(data.products.slice(0, 6)));
    }

    function handleSearch(e: { preventDefault: () => void }) {
        e.preventDefault();
        setPage(1);
        setSearchQuery(searchInput);
        setShowSuggestions(false);
    }

    function handleClear() {
        setSearchInput("");
        setSearchQuery("");
        setSuggestions([]);
        setPage(1);
    }

    function handleSuggestionClick(product: Product) {
        setShowSuggestions(false);
        navigate(`/products/${product.productId}`);
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
        } else {
            setCartSuccess(true);
            setTimeout(() => setCartSuccess(false), 1000);
        }
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div className="page">
            <div className="nav">
                <span className="welcome">Welcome, {user!.firstName}</span>
                <button className="outline" onClick={() => navigate("/profile")}>My Profile</button>
                <button className="outline" onClick={() => navigate("/checkout")}>Checkout</button>
                {user!.isAdmin === 1 && <button className="outline" onClick={() => navigate("/admin")}>Admin</button>}
                <button onClick={handleLogout}>Logout</button>
            </div>

            <h1>Products</h1>

            <form className="search" onSubmit={handleSearch}>
                <div className="search-wrap">
                    <input
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={e => { setSearchInput(e.target.value); setShowSuggestions(true); fetchSuggestions(e.target.value); }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="suggestions">
                            {suggestions.map(p => (
                                <div key={p.productId} className="suggestion-item" onMouseDown={() => handleSuggestionClick(p)}>
                                    {p.productName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit">Search</button>
                {searchQuery && <button type="button" className="outline" onClick={handleClear}>Clear</button>}
            </form>

            {error && <p className="error">{error}</p>}
            {cartSuccess && <p className="success">Item added to cart.</p>}


            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productId}>
                            <td>
                                <button className="link" onClick={() => navigate(`/products/${product.productId}`)}>
                                    {product.productName}
                                </button>
                            </td>
                            <td>${product.pricePerItem.toFixed(2)}</td>
                            <td><button onClick={() => addToCart(product.productId)}>Add to Cart</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button className="outline" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button className="outline" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default Home;
