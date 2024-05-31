import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { CategoriesService } from "@/categories/categories.service";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly products: Repository<Product>,
        private readonly categoriesService: CategoriesService,
    ) {}

    getProducts() {
        return this.products.find();
    }

    async getProductById(id: number) {
        const product = await this.products.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async createProduct(dto: CreateProductDto) {
        const category = await this.categoriesService.getCategoryById(
            dto.categoryId,
        );
        return this.products.save(this.products.create({ ...dto, category }));
    }

    async updateProduct(
        id: number,
        { categoryId, ...productProps }: UpdateProductDto,
    ) {
        await this.getProductById(id);
        if (categoryId) {
            const category =
                await this.categoriesService.getCategoryById(categoryId);
            return this.products.update({ id }, { ...productProps, category });
        }
        return this.products.update({ id }, productProps);
    }

    async deleteProduct(id: number) {
        await this.getProductById(id);
        return this.products.delete({ id });
    }
}
