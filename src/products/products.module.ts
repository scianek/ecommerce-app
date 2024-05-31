import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product } from "./entities/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesModule } from "@/categories/categories.module";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), CategoriesModule],
    exports: [ProductsService],
    providers: [ProductsService],
    controllers: [ProductsController],
})
export class ProductsModule {}
