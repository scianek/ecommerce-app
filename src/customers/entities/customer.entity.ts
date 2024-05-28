import { IsString } from "class-validator";
import { CoreEntity } from "@/shared/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Order } from "@/orders/entities/order.entity";

@Entity()
export class Customer extends CoreEntity {
    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    email: string;

    @Column()
    @IsString()
    address: string;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];
}
