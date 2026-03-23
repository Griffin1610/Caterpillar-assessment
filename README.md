# Caterpillar-assessment
This is an EShop web application created with TypeScript, React, Express and SQLite3 as an assessment for the Caterpillar hiring process.

# Running Offline
This project can be run without an internet connection. The `node_modules` directories are not pushed to the repository but are included in the emailed version of the project. If running from the repository, follow the install steps below. If running from the emailed version, skip the `npm install` steps.

# Starting the Backend
```bash
cd backend
npm install
npm run dev
```
The database will be initialized and seeded automatically on the first run of the backend. It can be found in the backend directory as `eshop.db`

# Starting the Frontend
```bash
cd frontend
npm install
npm run dev
```
Start the frontend while the backend is running, and view the project at localhost:5173

# Logging in as User or Admin
You can create a new user, or log in with the email of any existing user from the database. No password is required.
The admin account is set as admin@eshop.com, which allows the admin to view and complete pending orders.

# Notes
- Estimated delivery is automatically set to 7 days from the date the order is placed
- All orders seeded from the dataset are marked as complete. Pending orders only appear after placing a new order through the app

## Database Schema

### users
| Column | Type |
|---|---|
| userId | INTEGER |
| firstName | TEXT |
| lastName | TEXT |
| email | TEXT |
| phoneNumber | TEXT |
| isAdmin | INTEGER |

### products
| Column | Type |
|---|---|
| productId | INTEGER |
| productName | TEXT |
| pricePerItem | REAL |
| manufacturedFrom | TEXT |

### orders
| Column | Type |
|---|---|
| orderId | INTEGER |
| userId | INTEGER |
| trackingNumber | TEXT |
| purchaseDate | TEXT |
| estimatedDelivery | TEXT |
| shippedFrom | TEXT |
| shippingAddress | TEXT |
| shippingCity | TEXT |
| shippingCountry | TEXT |
| billingAddress | TEXT |
| billingCity | TEXT |
| billingCountry | TEXT |
| cardNumber | TEXT |
| cardType | TEXT |
| status | TEXT |

### order_items
| Column | Type |
|---|---|
| orderItemId | INTEGER |
| orderId | INTEGER |
| productId | INTEGER |
| quantity | INTEGER |
| pricePerItem | REAL |

### cart_items
| Column | Type |
|---|---|
| userId | INTEGER |
| productId | INTEGER |
| quantity | INTEGER |

### Relationships
- `users` → `orders` — one to many
- `users` → `cart_items` — one to many
- `orders` → `order_items` — one to many
- `products` → `order_items` — one to many
- `products` → `cart_items` — one to many
