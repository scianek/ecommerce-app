import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";
import { ProductsModule } from "./products/products.module";
import { Product } from "./products/entities/product.entity";
import { CustomersModule } from "./customers/customers.module";
import { Customer } from "./customers/entities/customer.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
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
            synchronize: process.env.NODE_ENV !== "prod",
            entities: [Product, Customer],
        }),
        ProductsModule,
        CustomersModule,
    ],
})
export class AppModule {}
