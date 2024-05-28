import { CoreEntity } from "@/shared/entities/core.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Customer } from "@/customers/entities/customer.entity";
import { OrderDetails } from "./order-details.entity";

export const OrderStatus = {
    PROCESSING: "Processing",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
} as const;

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

@Entity()
export class Order extends CoreEntity {
    @ManyToOne(() => Customer, customer => customer.orders)
    @JoinColumn({ name: "customerId" })
    customer: Customer;

    @OneToMany(() => OrderDetails, orderDetail => orderDetail.order, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    orderDetails: OrderDetails[];

    @Column()
    orderStatus: OrderStatus;
}
