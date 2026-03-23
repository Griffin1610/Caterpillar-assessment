import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { Order, OrderItem } from "../types";

function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const fromCheckout = (location.state as { from?: string })?.from === "checkout";

    const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null);

    useEffect(() => {
        fetch(`http://localhost:4000/api/orders/${orderId}`)
            .then(res => res.json())
            .then(data => setOrder(data));
    }, [orderId]);

    if (!order) return <p>Loading...</p>;

    const total = order.items.reduce((sum, item) => sum + item.pricePerItem * item.quantity, 0);

    return (
        <div className="page">
            <button className="outline" onClick={() => fromCheckout ? navigate("/home") : navigate(-1)}>Back</button>
            <h1 style={{ marginTop: 20 }}>Order #{order.orderId}</h1>

            <h2>Tracking</h2>
            <p>Tracking Number: {order.trackingNumber}</p>
            <p>Status: {order.status}</p>
            <p>Purchase Date: {order.purchaseDate}</p>
            <p>Estimated Delivery: {order.estimatedDelivery}</p>
            {order.shippedFrom && <p>Shipped From: {order.shippedFrom}</p>}

            <h2>Shipping</h2>
            <p>{order.shippingAddress}, {order.shippingCity}, {order.shippingCountry}</p>

            <h2>Billing</h2>
            <p>{order.billingAddress}, {order.billingCity}, {order.billingCountry}</p>
            <p>{order.cardType} ending in {order.cardNumber.slice(-4)}</p>

            <h2>Items</h2>
            <div>
                {order.items.map(item => (
                    <div className="row" key={item.orderItemId}>
                        <span className="name">{item.productName}</span>
                        <span>x{item.quantity}</span>
                        <span>${item.pricePerItem.toFixed(2)} each</span>
                        <span>${(item.pricePerItem * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <p style={{ marginTop: 12, fontWeight: 600 }}>Total: ${total.toFixed(2)}</p>
        </div>
    );
}

export default OrderDetails;
