import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../types";

function Admin() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:4000/api/admin/orders")
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);

    async function markComplete(orderId: number) {
        setError("");
        const res = await fetch(`http://localhost:4000/api/admin/orders/${orderId}/complete`, {
            method: "PUT",
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error);
            return;
        }
        setOrders(prev => prev.filter(o => o.orderId !== orderId));
    }

    return (
        <div>
            <button onClick={() => navigate("/home")}>Back</button>
            <h1>Admin — Pending Orders</h1>

            {error && <p>{error}</p>}

            {orders.length === 0 ? (
                <p>No pending orders.</p>
            ) : (
                <div>
                    {orders.map(order => (
                        <div key={order.orderId}>
                            <span>Order #{order.orderId}</span>
                            <span>Tracking: {order.trackingNumber}</span>
                            <span>User: {order.userId}</span>
                            <span>Date: {order.purchaseDate}</span>
                            <span
                                onClick={() => navigate(`/orders/${order.orderId}`)}
                                style={{ cursor: "pointer" }}
                            >
                                View Details
                            </span>
                            <button onClick={() => markComplete(order.orderId)}>Mark Complete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Admin;
