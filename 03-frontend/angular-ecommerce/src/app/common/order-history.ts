import { OrderItem } from "./order-item";

export class OrderHistory {
    orderId: number;
    orderTrackingNumber: string;
    totalPrice: number;
    totalQuantity: number;
    dateCreated: Date;
}
