import { IsString } from "class-validator";
import { CoreEntity } from "@/shared/entities/core.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Customer extends CoreEntity {
    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    email: string;

    @Column()
    @IsString()
    address: string;
}
