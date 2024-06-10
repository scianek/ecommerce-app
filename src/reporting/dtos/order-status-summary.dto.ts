import { type OrderStatus } from "@/orders/entities/order.entity";

export class OrderStatusSummaryDto {
    statuses: Record<OrderStatus, number>;
}
