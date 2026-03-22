import cors from "cors";
import express from "express";
import { initDB } from "./db/init";
import { seedDB } from "./db/seed";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

async function main() {
    await initDB();
    await seedDB();
    app.listen(4000, () => console.log("API at http://localhost:4000"));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
