import cors from "cors";
import express from "express";
import { initDB } from "./db/init";
import { seedDB } from "./db/seed";
import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import cartRouter from "./routes/cart";
import ordersRouter from "./routes/orders";
import adminRouter from "./routes/admin";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

//global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "server error" });
});

async function main() {
    await initDB();
    await seedDB();
    app.listen(4000, () => console.log("API at http://localhost:4000"));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
