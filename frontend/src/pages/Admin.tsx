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
        <div className="page">
            <button className="outline" onClick={() => navigate("/home")}>Back</button>
            <h1 style={{ marginTop: 20 }}>Admin — Pending Orders</h1>

            {error && <p className="error">{error}</p>}

            {orders.length === 0 ? (
                <p>No pending orders.</p>
            ) : (
                <div>
                    {orders.map(order => (
                        <div className="row" key={order.orderId}>
                            <span className="name">Order #{order.orderId}</span>
                            <span>{order.trackingNumber}</span>
                            <span>{order.purchaseDate}</span>
                            <button className="outline" onClick={() => navigate(`/orders/${order.orderId}`)}>View</button>
                            <button onClick={() => markComplete(order.orderId)}>Mark Complete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Admin;
