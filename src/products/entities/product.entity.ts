import { IsInt, IsNumber, IsString } from "class-validator";
import { CoreEntity } from "@/shared/entities/core.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Product extends CoreEntity {
    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    description: string;

    @Column("decimal")
    @IsNumber()
    price: number;

    @Column()
    @IsInt()
    unitsInStock: number;
}
