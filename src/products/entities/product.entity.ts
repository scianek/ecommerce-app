import { IsInt, IsNumber, IsString } from "class-validator";
import { CoreEntity } from "@/shared/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { OrderDetails } from "@/orders/entities/order-details.entity";

@Entity()
export class Product extends CoreEntity {
    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    description: string;

    @Column("decimal")
    @IsNumber()
    price: number;

    @Column()
    @IsInt()
    unitsInStock: number;

    @OneToMany(() => OrderDetails, orderDetail => orderDetail.product)
    orderDetails: OrderDetails[];
}
