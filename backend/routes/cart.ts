import { Router } from "express";
import { all, run } from "../db/helpers";
import { CartItem } from "../types";

const router = Router();

const cartQuery = `
    SELECT c.userId, c.productId, c.quantity,
    p.productName, p.pricePerItem, p.manufacturedFrom
    FROM cart_items c
    JOIN products p ON c.productId = p.productId
    WHERE c.userId = ?
`;

//GET route, retrieve all cart items for a user
router.get("/:userId", async (req, res) => {
    const items = await all<CartItem>(cartQuery, [req.params.userId]);
    res.json(items);
});

//POST route, add a product to the cart, or increment its quantity if already present
router.post("/:userId", async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
        res.status(400).json({ error: "productId and quantity are required" });
        return;
    }

    await run(
        `INSERT INTO cart_items (userId, productId, quantity)
         VALUES (?, ?, ?)
         ON CONFLICT(userId, productId) DO UPDATE SET quantity = quantity + excluded.quantity`,
        [req.params.userId, productId, quantity]
    );

    const items = await all<CartItem>(cartQuery, [req.params.userId]);
    res.status(201).json(items);
});

//PUT route, update the quantity of a cart item by userId and productId
router.put("/:userId/:productId", async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
        res.status(400).json({ error: "quantity > 0 is required" });
        return;
    }

    await run(
        "UPDATE cart_items SET quantity = ? WHERE userId = ? AND productId = ?",
        [quantity, req.params.userId, req.params.productId]
    );

    const items = await all<CartItem>(cartQuery, [req.params.userId]);
    res.json(items);
});

//DELETE route, remove a specific product from the cart by userId and productId
router.delete("/:userId/:productId", async (req, res) => {
    await run(
        "DELETE FROM cart_items WHERE userId = ? AND productId = ?",
        [req.params.userId, req.params.productId]
    );
    const items = await all<CartItem>(cartQuery, [req.params.userId]);
    res.json(items);
});

//DELETE route, clear all items from a user's cart
router.delete("/:userId", async (req, res) => {
    await run("DELETE FROM cart_items WHERE userId = ?", [req.params.userId]);
    res.json([]);
});

export default router;
