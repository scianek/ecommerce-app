import { Controller, Get, Query } from "@nestjs/common";
import { ReportingService } from "./reporting.service";

@Controller("reporting")
export class ReportingController {
    constructor(private readonly reportingService: ReportingService) {}

    @Get("sales-by-product")
    getSalesByProduct() {
        return this.reportingService.getSalesByProduct();
    }

    @Get("sales-by-customer")
    getSalesByCustomer() {
        return this.reportingService.getSalesByCustomer();
    }

    @Get("sales-by-category")
    getSalesByCategory() {
        return this.reportingService.getSalesByCategory();
    }

    @Get("low-stock-products")
    getLowStockProducts(@Query("threshold") threshold: number) {
        return this.reportingService.getLowStockProducts(threshold);
    }

    @Get("order-status-summary")
    getOrderStatusSummary() {
        return this.reportingService.getOrderStatusSummary();
    }
}
