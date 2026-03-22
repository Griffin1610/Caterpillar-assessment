import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "eshop.db");

export const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("error connecting to db:", error);
    }
});
