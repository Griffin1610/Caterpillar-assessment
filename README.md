# Caterpillar-assessment
This is an EShop web application created with Express and React as an assessment for the Caterpillar hiring process

# Starting the Backend
```bash
cd backend
npm install
npm run dev
```
The database will be initialized and seeded aoutmatically on the first run of the backend.

# Starting the Frontend
```bash
cd frontend
npm run dev
```
Start the frontend while the backend is running, and view the project at localhost:5173

# Logging in as User or Admin
You can create a new user, log in with email as that user or an existing user from the databse
The admin account is admin@eshop.com, which allows the admin to complete orders

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
