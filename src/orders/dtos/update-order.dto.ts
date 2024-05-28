import { PickType } from "@nestjs/mapped-types";
import { CreateOrderDto } from "./create-order.dto";

export class UpdateOrderDto extends PickType(CreateOrderDto, [
    "orderDetails",
]) {}
