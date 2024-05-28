import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { Order } from "./entities/order.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersModule } from "@/customers/customers.module";
import { ProductsModule } from "@/products/products.module";
import { SharedModule } from "@/shared/shared.module";
import { OrderDetails } from "./entities/order-details.entity";

@Module({
    controllers: [OrdersController],
    providers: [OrdersService],
    imports: [
        TypeOrmModule.forFeature([Order, OrderDetails]),
        CustomersModule,
        ProductsModule,
        SharedModule,
    ],
})
export class OrdersModule {}
