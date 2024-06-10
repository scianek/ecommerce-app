import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { UpdateOrderDto } from "./dtos/update-order.dto";

@Controller("orders")
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    getOrders() {
        return this.ordersService.getOrders();
    }

    @Get(":id")
    getOrderById(@Param("id") id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Post()
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(createOrderDto);
    }

    @Patch(":id")
    updateOrder(
        @Param("id") id: number,
        @Body() createOrderDto: UpdateOrderDto,
    ) {
        return this.ordersService.updateOrder(id, createOrderDto);
    }

    @Delete(":id")
    deleteOrder(@Param("id") id: number) {
        return this.ordersService.deleteOrder(id);
    }
}
