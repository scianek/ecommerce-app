import { Module } from "@nestjs/common";
import { ReportingController } from "./reporting.controller";
import { ReportingService } from "./reporting.service";
import { OrdersModule } from "@/orders/orders.module";
import { ProductsModule } from "@/products/products.module";

@Module({
    controllers: [ReportingController],
    providers: [ReportingService],
    imports: [OrdersModule, ProductsModule],
})
export class ReportingModule {}
