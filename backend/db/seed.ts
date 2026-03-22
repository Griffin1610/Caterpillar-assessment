import path from "path";
import * as XLSX from "xlsx";
import { db } from "./database";

//allows us to use await on sqlite3 callbacks
const run = (sql: string, params: unknown[] = []) =>
    new Promise<void>((res, rej) =>
        db.run(sql, params, (e: Error | null) => (e ? rej(e) : res()))
    );

const get = <T>(sql: string, params: unknown[] = []) =>
    new Promise<T>((res, rej) =>
        db.get(sql, params, (e: Error | null, row: unknown) => (e ? rej(e) : res(row as T)))
    );


function parsePrice(v: unknown): number {
    return Number(String(v).replace(/[^0-9.-]/g, ""));
}

export async function seedDB(): Promise<void> {
    const { n } = await get<{ n: number }>("SELECT COUNT(*) AS n FROM orders");
    if (n > 0) return; //returns early if the database is already seeded

    const workbook = XLSX.readFile(path.join(process.cwd(), "db", "EShopDataset.xlsx"));
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[workbook.SheetNames[0]!]!
    );

    await run("BEGIN IMMEDIATE");
    try {
        for (const row of rows) {
        const email = String(row["Email"]).trim();

        await run(
            `INSERT OR IGNORE INTO users (firstName, lastName, email, phoneNumber, isAdmin)
            VALUES (?, ?, ?, ?, 0)`,
            [row["FirstName"], row["LastName"], email, row["Phone#"]]
        );

        const { userId } = await get<{ userId: number }>(
            "SELECT userId FROM users WHERE email = ?",
            [email]
        );

        await run(
            `INSERT INTO orders (
            userId, trackingNumber, purchaseDate, estimatedDelivery, shippedFrom,
            shippingAddress, shippingCity, shippingCountry,
            billingAddress, billingCity, billingCountry,
            cardNumber, cardType, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'complete')`,
            [
            userId,
            row["Tracking#"],
            row["PurchaseDate"],
            row["EstimatedDelivery"],
            row["ShippedFrom"],
            row["ShippingAddress"],
            row["ShippingCity"],
            row["ShippingCountry"],
            row["BillingAddress"],
            row["BillingCity"],
            row["BillingCountry"],
            row["Card#"],
            row["CardType"],
            ]
        );

        const { id: orderId } = await get<{ id: number }>("SELECT last_insert_rowid() AS id");

        await run(
            `INSERT OR IGNORE INTO products (productName, pricePerItem, manufacturedFrom)
            VALUES (?, ?, ?)`,
            [row["ItemName"], parsePrice(row["PricePerItem"]), row["ManufacturedFrom"]]
        );

        const { productId } = await get<{ productId: number }>(
            "SELECT productId FROM products WHERE productName = ?",
            [row["ItemName"]]
        );

        await run(
            `INSERT INTO order_items (orderId, productId, quantity, pricePerItem)
            VALUES (?, ?, ?, ?)`,
            [orderId, productId, Number(row["ItemAmount"]), parsePrice(row["PricePerItem"])]
        );
        }
        await run("COMMIT"); //if loop completes with no error, write everything to disk at once
    } catch (error) {
        await run("ROLLBACK").catch(() => {}); //discards all changes, throws error for debugging help
        throw error;
    }
    }
