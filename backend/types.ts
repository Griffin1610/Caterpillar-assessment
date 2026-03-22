export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isAdmin: number;
}

export interface Product {
    productId: number;
    productName: string;
    pricePerItem: number;
    manufacturedFrom: string;
}

export interface CartItem {
    userId: number;
    productId: number;
    quantity: number;
    productName: string;
    pricePerItem: number;
    manufacturedFrom: string;
}

export interface Order {
    orderId: number;
    userId: number;
    trackingNumber: string;
    purchaseDate: string;
    estimatedDelivery: string;
    shippedFrom: string;
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    billingAddress: string;
    billingCity: string;
    billingCountry: string;
    cardNumber: string;
    cardType: string;
    status: string;
}
