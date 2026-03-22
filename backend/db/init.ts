import { db } from "./database";

//database schema
const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    email TEXT UNIQUE,
    phoneNumber TEXT,
    isAdmin INTEGER NOT NULL DEFAULT 0 CHECK (isAdmin IN (0, 1)));

CREATE TABLE IF NOT EXISTS products (
    productId INTEGER PRIMARY KEY AUTOINCREMENT,
    productName TEXT UNIQUE,
    pricePerItem REAL,
    manufacturedFrom TEXT);

CREATE TABLE IF NOT EXISTS orders (
    orderId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    trackingNumber TEXT NOT NULL UNIQUE,
    purchaseDate TEXT,
    estimatedDelivery TEXT,
    shippedFrom TEXT,
    shippingAddress TEXT,
    shippingCity TEXT,
    shippingCountry TEXT,
    billingAddress TEXT,
    billingCity TEXT,
    billingCountry TEXT,
    cardNumber TEXT,
    cardType TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (userId) REFERENCES users (userId));

CREATE TABLE IF NOT EXISTS order_items (
    orderItemId INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    pricePerItem REAL NOT NULL,
    UNIQUE (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES orders (orderId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products (productId));

CREATE TABLE IF NOT EXISTS cart_items (
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (userId, productId),
    FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products (productId) ON DELETE CASCADE);`;

//initalize database
export function initDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(SCHEMA, (error: Error | null) => (error ? reject(error) : resolve()));
  });
}
