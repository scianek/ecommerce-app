import { Module } from "@nestjs/common";
import { Seeder } from "./seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "@/products/entities/product.entity";
import { Customer } from "@/customers/entities/customer.entity";
import { Order } from "@/orders/entities/order.entity";
import { OrderDetails } from "@/orders/entities/order-details.entity";
import { Category } from "@/categories/entities/category.entity";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

@Module({
    providers: [Seeder],
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().port().required(),
                DB_USER: Joi.string().required(),
                DB_PASS: Joi.string().required(),
                DB_NAME: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            synchronize: true,
            entities: [Product, Customer, Order, OrderDetails, Category],
        }),
        TypeOrmModule.forFeature([
            Product,
            Customer,
            Order,
            OrderDetails,
            Category,
        ]),
    ],
})
export class SeederModule {}
