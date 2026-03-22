import { Router } from "express";
import { all, get } from "../db/helpers";
import { Product } from "../types";

const router = Router();

//GET route, retrieve paginated products with optional name search
router.get("/", async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const search = (req.query.search as string || "").trim();
    const limit = 25;
    const offset = (page - 1) * limit;

    const searchParam = search ? `%${search}%` : "%";

    const products = await all<Product>(
        "SELECT * FROM products WHERE productName LIKE ? LIMIT ? OFFSET ?",
        [searchParam, limit, offset]
    );

    const countRow = await get<{ total: number }>(
        "SELECT COUNT(*) AS total FROM products WHERE productName LIKE ?",
        [searchParam]
    );

    res.json({
        products,
        total: countRow?.total ?? 0,
        page,
        totalPages: Math.ceil((countRow?.total ?? 0) / limit),
    });
});

//GET route, retrieve a single product by productId
router.get("/:id", async (req, res) => {
    const product = await get<Product>(
        "SELECT * FROM products WHERE productId = ?",
        [req.params.id]
    );
    if (!product) {
        res.status(404).json({ error: "product not found" });
        return;
    }
    res.json(product);
});

export default router;
