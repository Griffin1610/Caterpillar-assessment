import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";

function ProductDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [id]);

    async function addToCart() {
        setError("");
        setAdded(false);
        const res = await fetch(`http://localhost:4000/api/cart/${user!.userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product!.productId, quantity }),
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error);
            return;
        }
        setAdded(true);
    }

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <button onClick={() => navigate("/home")}>Back</button>
            <h1>{product.productName}</h1>
            <p>Price: ${product.pricePerItem.toFixed(2)}</p>
            <p>Manufactured from: {product.manufacturedFrom}</p>
            <div>
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                />
                <button onClick={addToCart}>Add to Cart</button>
            </div>
            {error && <p>{error}</p>}
            {added && <p>Added to cart!</p>}
        </div>
    );
}

export default ProductDetails;
