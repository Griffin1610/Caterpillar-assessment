import { Router } from "express";
import { all, get, run } from "../db/helpers";
import { Order } from "../types";

const router = Router();

//GET route, retrieve all pending orders
router.get("/orders", async (_req, res) => {
    const orders = await all<Order>(
        "SELECT * FROM orders WHERE status = 'pending' ORDER BY purchaseDate ASC"
    );
    res.json(orders);
});

//PUT route, mark incomplete orders as complete by orderId
router.put("/orders/:orderId/complete", async (req, res) => {
    const order = await get<Order>(
        "SELECT * FROM orders WHERE orderId = ?",
        [req.params.orderId]
    );
    if (!order) {
        res.status(404).json({ error: "cannot find order" });
        return;
    }

    if (order.status === "complete") {
        res.status(400).json({ error: "order is already complete" });
        return;
    }

    await run("UPDATE orders SET status = 'complete' WHERE orderId = ?",[req.params.orderId]);
    const updated = await get<Order>("SELECT * FROM orders WHERE orderId = ?", [req.params.orderId]);
    res.json(updated);
});

export default router;
