import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { Customer } from "./entities/customer.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersController } from "./customers.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    providers: [CustomersService],
    controllers: [CustomersController],
})
export class CustomersModule {}
