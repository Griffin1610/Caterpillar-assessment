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
        <div className="page">
            <button className="outline" onClick={() => navigate("/home")}>Back</button>
            <h1 style={{ marginTop: 20 }}>My Profile</h1>

            <h2>Account Information</h2>
            <p>Name: {user!.firstName} {user!.lastName}</p>
            <p>Email: {user!.email}</p>
            <p>Phone: {user!.phoneNumber}</p>

            <h2>Order Details</h2>
            {orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Tracking Number</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId} onClick={() => navigate(`/orders/${order.orderId}`)} style={{ cursor: "pointer" }}>
                                <td>{order.orderId}</td>
                                <td>{order.trackingNumber}</td>
                                <td>{order.purchaseDate}</td>
                                <td style={{ textTransform: "capitalize" }}>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button onClick={handleLogout} style={{ marginTop: 32 }}>Logout</button>
        </div>
    );
}

export default UserProfile;
