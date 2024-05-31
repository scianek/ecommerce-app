import { IsInt } from "class-validator";
import { Product } from "../entities/product.entity";
import { PickType } from "@nestjs/mapped-types";

export class CreateProductDto extends PickType(Product, [
    "name",
    "description",
    "price",
    "unitsInStock",
]) {
    @IsInt()
    categoryId: number;
}
