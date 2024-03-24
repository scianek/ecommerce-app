import { IsInt } from "class-validator";
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export class CoreEntity {
    @IsInt()
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;
}
