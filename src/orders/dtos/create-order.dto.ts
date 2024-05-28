import { IsArray, IsInt, ValidateNested } from "class-validator";
import { OrderDetailsDto } from "./order-details.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @IsInt()
    customerId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderDetailsDto)
    orderDetails: OrderDetailsDto[];
}
