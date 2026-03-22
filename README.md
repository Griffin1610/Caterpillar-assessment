# Caterpillar-assessment
This is an EShop web application created with Express and React as an assessment for the Caterpillar hiring process

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| userId | INTEGER | Primary key |
| firstName | TEXT | |
| lastName | TEXT | |
| email | TEXT | Unique |
| phoneNumber | TEXT | |
| isAdmin | INTEGER | 0 = user, 1 = admin |

### products
| Column | Type | Notes |
|---|---|---|
| productId | INTEGER | Primary key |
| productName | TEXT | Unique |
| pricePerItem | REAL | |
| manufacturedFrom | TEXT | |

### orders
| Column | Type | Notes |
|---|---|---|
| orderId | INTEGER | Primary key |
| userId | INTEGER | FK → users |
| trackingNumber | TEXT | Unique |
| purchaseDate | TEXT | |
| estimatedDelivery | TEXT | |
| shippedFrom | TEXT | |
| shippingAddress | TEXT | |
| shippingCity | TEXT | |
| shippingCountry | TEXT | |
| billingAddress | TEXT | |
| billingCity | TEXT | |
| billingCountry | TEXT | |
| cardNumber | TEXT | |
| cardType | TEXT | |
| status | TEXT | 'pending' or 'complete' |

### order_items
| Column | Type | Notes |
|---|---|---|
| orderItemId | INTEGER | Primary key |
| orderId | INTEGER | FK → orders (cascade delete) |
| productId | INTEGER | FK → products |
| quantity | INTEGER | |
| pricePerItem | REAL | Price at time of purchase |

### cart_items
| Column | Type | Notes |
|---|---|---|
| userId | INTEGER | PK (composite), FK → users |
| productId | INTEGER | PK (composite), FK → products |
| quantity | INTEGER | Must be > 0 |

### Relationships
- `users` → `orders` — one to many
- `users` → `cart_items` — one to many
- `orders` → `order_items` — one to many
- `products` → `order_items` — one to many
- `products` → `cart_items` — one to many

