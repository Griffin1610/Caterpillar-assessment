import { Router } from "express";
import { all, get, run } from "../db/helpers";
import { Order } from "../types";

const router = Router();

interface CartItem {
    productId: number;
    quantity: number;
    pricePerItem: number;
}

//generates needed tracking number
function generateTrackingNumber(countryCode: string): string {
    const digits = Math.floor(Math.random() * 1_000_000_000)
        .toString()
        .padStart(9, "0");
    return `Unq${digits}${countryCode.toUpperCase().slice(0, 2)}`;
}

//POST route, place an order using the users cart
router.post("/", async (req, res, next) => {
    const {
        userId,
        shippedFrom,
        estimatedDelivery,
        shippingAddress, shippingCity, shippingCountry,
        billingAddress, billingCity, billingCountry,
        cardNumber, cardType,
    } = req.body;

    if (!userId || !estimatedDelivery || !shippingAddress || !shippingCity || !shippingCountry ||
        !billingAddress || !billingCity || !billingCountry || !cardNumber || !cardType) {
        res.status(400).json({ error: "shipping, billing, and card fields are all required" });
        return;
    }

    const cartItems = await all<CartItem>(
        `SELECT c.productId, c.quantity, p.pricePerItem
         FROM cart_items c
         JOIN products p ON c.productId = p.productId
         WHERE c.userId = ?`,
        [userId]
    );

    if (cartItems.length === 0) {
        res.status(400).json({ error: "Cart is empty" });
        return;
    }

    const trackingNumber = generateTrackingNumber(shippingCountry);
    const purchaseDate = new Date().toISOString().split("T")[0]!;

    await run("BEGIN IMMEDIATE");
    try {
        await run(
            `INSERT INTO orders (
                userId, trackingNumber, purchaseDate, estimatedDelivery, shippedFrom,
                shippingAddress, shippingCity, shippingCountry,
                billingAddress, billingCity, billingCountry,
                cardNumber, cardType, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                userId, trackingNumber, purchaseDate, estimatedDelivery, shippedFrom || null,
                shippingAddress, shippingCity, shippingCountry,
                billingAddress, billingCity, billingCountry,
                cardNumber, cardType,
            ]
        );

        const newOrder = await get<{ id: number }>("SELECT last_insert_rowid() AS id");
        const orderId = newOrder!.id;

        for (const item of cartItems) {
            await run(
                "INSERT INTO order_items (orderId, productId, quantity, pricePerItem) VALUES (?, ?, ?, ?)",
                [orderId, item.productId, item.quantity, item.pricePerItem]
            );
        }

        await run("DELETE FROM cart_items WHERE userId = ?", [userId]);
        await run("COMMIT");

        const order = await get<Order>("SELECT * FROM orders WHERE orderId = ?", [orderId]);
        res.status(201).json(order);
    } catch (error) {
        await run("ROLLBACK").catch(() => {});
        next(error);
    }
});

//GET route, retrieve all orders for a user by userId
router.get("/user/:userId", async (req, res) => {
    const orders = await all<Order>(
        "SELECT * FROM orders WHERE userId = ? ORDER BY purchaseDate DESC",
        [req.params.userId]
    );
    res.json(orders);
});

//GET route, retrieve a single order with its items by orderId
router.get("/:orderId", async (req, res) => {
    const order = await get<Order>(
        "SELECT * FROM orders WHERE orderId = ?",
        [req.params.orderId]
    );
    if (!order) {
        res.status(404).json({ error: "order not found" });
        return;
    }

    const items = await all(
        `SELECT oi.orderItemId, oi.quantity, oi.pricePerItem,
                p.productId, p.productName, p.manufacturedFrom
         FROM order_items oi
         JOIN products p ON oi.productId = p.productId
         WHERE oi.orderId = ?`,
        [req.params.orderId]
    );

    res.json({ ...order, items });
});

export default router;
