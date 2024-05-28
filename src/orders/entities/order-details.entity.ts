import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "@/products/entities/product.entity";
import { CoreEntity } from "@/shared/entities/core.entity";

@Entity()
export class OrderDetails extends CoreEntity {
    @Column()
    orderId: number;

    @Column()
    productId: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Order, order => order.orderDetails, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "orderId" })
    order: Order;

    @ManyToOne(() => Product, product => product.orderDetails, { eager: true })
    @JoinColumn({ name: "productId" })
    product: Product;
}
