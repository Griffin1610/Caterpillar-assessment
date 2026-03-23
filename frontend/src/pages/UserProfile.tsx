import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../types";

function UserProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch(`http://localhost:4000/api/orders/user/${user!.userId}`)
            .then(res => res.json())
            .then(data => setOrders(data));
    }, [user]);

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div>
            <button onClick={() => navigate("/home")}>Back</button>
            <h1>My Profile</h1>

            <h2>Account Information</h2>
            <p>Name: {user!.firstName} {user!.lastName}</p>
            <p>Email: {user!.email}</p>
            <p>Phone: {user!.phoneNumber}</p>

            <h2>Order Details</h2>
            {orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                <div>
                    {orders.map(order => (
                        <div key={order.orderId} onClick={() => navigate(`/orders/${order.orderId}`)} style={{ cursor: "pointer" }}>
                            <span>Order #{order.orderId}</span>
                            <span>Tracking: {order.trackingNumber}</span>
                            <span>Date: {order.purchaseDate}</span>
                            <span>Status: {order.status}</span>
                        </div>
                    ))}
                </div>
            )}

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default UserProfile;
