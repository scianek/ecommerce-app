import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Order, OrderStatus } from "./entities/order.entity";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { CustomersService } from "@/customers/customers.service";
import { ProductsService } from "@/products/products.service";
import { OrderDetailsDto } from "./dtos/order-details.dto";
import { Product } from "@/products/entities/product.entity";
import { SharedService } from "@/shared/shared.service";
import { OrderDetails } from "./entities/order-details.entity";
import { UpdateOrderDto } from "./dtos/update-order.dto";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        private readonly customersService: CustomersService,
        private readonly productsService: ProductsService,
        private readonly sharedService: SharedService,
    ) {}

    getOrders() {
        return this.orders.find();
    }

    async getOrderById(id: number) {
        const order = await this.orders.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
        return order;
    }

    async createOrder({ customerId, orderDetails }: CreateOrderDto) {
        return this.sharedService.makeTransaction(async ({ manager }) => {
            const orders = manager.getRepository(Order);
            const order = await orders.save(
                orders.create({
                    customer:
                        await this.customersService.getCustomerById(customerId),
                    orderDetails: [],
                    orderStatus: OrderStatus.PROCESSING,
                }),
            );
            await this.updateOrderDetails(order.id, orderDetails, manager);
            return order;
        });
    }

    async updateOrder(id: number, { orderDetails }: UpdateOrderDto) {
        return this.sharedService.makeTransaction(async ({ manager }) => {
            await this.updateOrderDetails(id, orderDetails, manager);
        });
    }

    async deleteOrder(id: number) {
        return this.sharedService.makeTransaction(async ({ manager }) => {
            const order = await this.getOrderById(id);
            const subtractOrderDetails = order.orderDetails.map(
                ({ product, quantity }) => ({
                    productId: product.id,
                    quantity: -quantity,
                }),
            );
            await this.updateOrderDetails(id, subtractOrderDetails, manager);
            return await manager.getRepository(Order).delete({ id });
        });
    }

    private async updateOrderDetails(
        orderId: number,
        orderDetails: OrderDetailsDto[],
        manager: EntityManager,
    ) {
        const productsRepository = manager.getRepository(Product);
        const orderDetailsRepository = manager.getRepository(OrderDetails);
        for (const orderDetail of orderDetails) {
            const existingOrderDetail = await orderDetailsRepository.findOne({
                where: { orderId, productId: orderDetail.productId },
            });
            const product = await this.productsService.getProductById(
                orderDetail.productId,
            );

            if (existingOrderDetail) {
                const increase =
                    orderDetail.quantity - existingOrderDetail.quantity;
                if (product.unitsInStock < increase) {
                    throw new UnprocessableEntityException(
                        `Not enough units in stock for product ${product.name}, requested an increase by ${increase}, available: ${product.unitsInStock}`,
                    );
                }
                product.unitsInStock -= increase;
                existingOrderDetail.quantity = orderDetail.quantity;
                await orderDetailsRepository.save(existingOrderDetail);
            } else {
                if (product.unitsInStock < orderDetail.quantity) {
                    throw new UnprocessableEntityException(
                        `Not enough units in stock for product ${product.name}, requested: ${orderDetail.quantity}, available: ${product.unitsInStock}`,
                    );
                }
                product.unitsInStock -= orderDetail.quantity;
                const newOrderDetail = orderDetailsRepository.create({
                    orderId,
                    productId: orderDetail.productId,
                    quantity: orderDetail.quantity,
                });
                await orderDetailsRepository.save(newOrderDetail);
            }
            await productsRepository.save(product);
        }
    }
}
