import { OrdersService } from "@/orders/orders.service";
import { Injectable } from "@nestjs/common";
import { SalesByProductDto } from "./dtos/sales-by-product.dto";
import { SalesByCustomerDto } from "./dtos/sales-by-customer.dto";
import { LowStockProductsDto } from "./dtos/low-stock-products.dto";
import { ProductsService } from "@/products/products.service";
import { SalesByCategoryDto } from "./dtos/sales-by-category";
import { OrderStatusSummaryDto } from "./dtos/order-status-summary.dto";

@Injectable()
export class ReportingService {
    constructor(
        private readonly orderService: OrdersService,
        private readonly productService: ProductsService,
    ) {}

    async getSalesByProduct(): Promise<SalesByProductDto> {
        const orders = await this.orderService.getOrders();
        const sales = {};
        for (const order of orders) {
            for (const orderDetail of order.orderDetails) {
                if (sales[orderDetail.product.name]) {
                    sales[orderDetail.product.name].unitsSold +=
                        orderDetail.quantity;
                    sales[orderDetail.product.name].totalRevenue +=
                        orderDetail.quantity * orderDetail.product.price;
                } else {
                    sales[orderDetail.product.name] = {
                        productName: orderDetail.product.name,
                        unitsSold: orderDetail.quantity,
                        totalRevenue:
                            orderDetail.quantity * orderDetail.product.price,
                    };
                }
            }
        }
        return { sales: Object.values(sales) };
    }

    async getSalesByCustomer(): Promise<SalesByCustomerDto> {
        const orders = await this.orderService.getOrders();
        const sales = {} as Record<string, any>;
        for (const order of orders) {
            if (sales[order.customer.name]) {
                for (const orderDetail of order.orderDetails) {
                    if (
                        sales[order.customer.name].productSales[
                            orderDetail.product.name
                        ]
                    ) {
                        sales[order.customer.name].productSales[
                            orderDetail.product.name
                        ].unitsSold += orderDetail.quantity;
                        sales[order.customer.name].productSales[
                            orderDetail.product.name
                        ].totalRevenue +=
                            orderDetail.quantity * orderDetail.product.price;
                    } else {
                        sales[order.customer.name].productSales[
                            orderDetail.product.name
                        ] = {
                            productName: orderDetail.product.name,
                            unitsSold: orderDetail.quantity,
                            totalRevenue:
                                orderDetail.quantity *
                                orderDetail.product.price,
                        };
                    }
                }
            } else {
                sales[order.customer.name] = {
                    customerName: order.customer.name,
                    productSales: {},
                };
                for (const orderDetail of order.orderDetails) {
                    sales[order.customer.name].productSales[
                        orderDetail.product.name
                    ] = {
                        productName: orderDetail.product.name,
                        unitsSold: orderDetail.quantity,
                        totalRevenue:
                            orderDetail.quantity * orderDetail.product.price,
                    };
                }
            }
        }
        return {
            sales: Object.values(sales).map(s => ({
                ...s,
                productSales: Object.values(s.productSales) as any,
            })),
        };
    }

    async getSalesByCategory(): Promise<SalesByCategoryDto> {
        const orders = await this.orderService.getOrders();
        const sales = {} as Record<string, any>;
        for (const order of orders) {
            for (const orderDetail of order.orderDetails) {
                if (sales[orderDetail.product.category.name]) {
                    sales[orderDetail.product.category.name].unitsSold +=
                        orderDetail.quantity;
                    sales[orderDetail.product.category.name].totalRevenue +=
                        orderDetail.quantity * orderDetail.product.price;
                } else {
                    sales[orderDetail.product.category.name] = {
                        categoryName: orderDetail.product.category.name,
                        unitsSold: orderDetail.quantity,
                        totalRevenue:
                            orderDetail.quantity * orderDetail.product.price,
                    };
                }
            }
        }
        return { sales: Object.values(sales) };
    }

    async getLowStockProducts(threshold: number): Promise<LowStockProductsDto> {
        const products = await this.productService.getProducts();
        return {
            lowStockProducts: products
                .filter(p => p.unitsInStock < threshold)
                .map(
                    ({ name, unitsInStock }) => ({ name, unitsInStock }) as any,
                ),
        };
    }

    async getOrderStatusSummary(): Promise<OrderStatusSummaryDto> {
        const orders = await this.orderService.getOrders();
        const statuses = {} as Record<string, number>;
        for (const order of orders) {
            if (statuses[order.orderStatus]) {
                statuses[order.orderStatus] += 1;
            } else {
                statuses[order.orderStatus] = 1;
            }
        }
        return { statuses };
    }
}
