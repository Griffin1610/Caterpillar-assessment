import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { CartItem } from "../types";

function Checkout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [error, setError] = useState("");
    const [cartError, setCartError] = useState("");

    const [shippingAddress, setShippingAddress] = useState("");
    const [shippingCity, setShippingCity] = useState("");
    const [shippingCountry, setShippingCountry] = useState("");
    const [billingAddress, setBillingAddress] = useState("");
    const [billingCity, setBillingCity] = useState("");
    const [billingCountry, setBillingCountry] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardType, setCardType] = useState("");
    const estimatedDelivery = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split("T")[0];
    })();

    useEffect(() => {
        fetch(`http://localhost:4000/api/cart/${user!.userId}`)
            .then(res => res.json())
            .then(data => {
                setCart(data);
                const initial: Record<number, number> = {};
                data.forEach((item: CartItem) => { initial[item.productId] = item.quantity; });
                setQuantities(initial);
            });
    }, [user]);

    async function updateQuantity(productId: number, quantity: number) {
        setCartError("");
        const res = await fetch(`http://localhost:4000/api/cart/${user!.userId}/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
        });
        if (!res.ok) {
            const data = await res.json();
            setCartError(data.error);
            return;
        }
        const data = await res.json();
        setCart(data);
    }

    async function removeItem(productId: number) {
        const res = await fetch(`http://localhost:4000/api/cart/${user!.userId}/${productId}`, {
            method: "DELETE",
        });
        const data = await res.json();
        setCart(data);
    }

    async function placeOrder(e: { preventDefault: () => void }) {
        e.preventDefault();
        setError("");
        const res = await fetch("http://localhost:4000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user!.userId,
                estimatedDelivery,
                shippingAddress, shippingCity, shippingCountry,
                billingAddress, billingCity, billingCountry,
                cardNumber, cardType,
            }),
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error);
            return;
        }
        const order = await res.json();
        navigate(`/orders/${order.orderId}`);
    }

    const total = cart.reduce((sum, item) => sum + item.pricePerItem * item.quantity, 0);

    return (
        <div>
            <button onClick={() => navigate("/home")}>Back</button>
            <h1>Checkout</h1>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div>
                        {cartError && <p>{cartError}</p>}
                        {cart.map(item => (
                            <div key={item.productId}>
                                <span>{item.productName}</span>
                                <span>${item.pricePerItem.toFixed(2)} each</span>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantities[item.productId] ?? item.quantity}
                                    onChange={e => setQuantities(prev => ({ ...prev, [item.productId]: Number(e.target.value) }))}
                                    onBlur={e => updateQuantity(item.productId, Number(e.target.value))}
                                />
                                <span>${(item.pricePerItem * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeItem(item.productId)}>Remove</button>
                            </div>
                        ))}
                        <p>Total: ${total.toFixed(2)}</p>
                    </div>

                    <form onSubmit={placeOrder}>
                        <h2>Shipping</h2>
                        <input placeholder="Address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} required />
                        <input placeholder="City" value={shippingCity} onChange={e => setShippingCity(e.target.value)} required />
                        <input placeholder="Country" value={shippingCountry} onChange={e => setShippingCountry(e.target.value)} required />

                        <h2>Billing</h2>
                        <input placeholder="Address" value={billingAddress} onChange={e => setBillingAddress(e.target.value)} required />
                        <input placeholder="City" value={billingCity} onChange={e => setBillingCity(e.target.value)} required />
                        <input placeholder="Country" value={billingCountry} onChange={e => setBillingCountry(e.target.value)} required />

                        <h2>Payment</h2>
                        <input placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
                        <input placeholder="Card Type (e.g. Visa)" value={cardType} onChange={e => setCardType(e.target.value)} required />

{error && <p>{error}</p>}
                        <button type="submit">Place Order</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Checkout;
