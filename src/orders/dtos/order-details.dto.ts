import { IsInt } from "class-validator";

export class OrderDetailsDto {
    @IsInt()
    productId: number;

    @IsInt()
    quantity: number;
}
