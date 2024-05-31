import { Product } from "@/products/entities/product.entity";
import { CoreEntity } from "@/shared/entities/core.entity";
import { IsString } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Category extends CoreEntity {
    @Column()
    @IsString()
    name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}

// @Entity()
// export class Product extends CoreEntity {
//     // ...existing fields...
//
//     @ManyToOne(() => Category, category => category.products)
//     @JoinColumn({ name: "categoryId" })
//     category: Category;
// }