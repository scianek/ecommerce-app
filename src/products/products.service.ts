import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly products: Repository<Product>,
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

    createProduct(dto: CreateProductDto) {
        return this.products.save(this.products.create(dto));
    }

    async updateProduct(id: number, dto: UpdateProductDto) {
        await this.getProductById(id);
        return this.products.update({ id }, dto);
    }

    async deleteProduct(id: number) {
        await this.getProductById(id);
        return this.products.delete({ id });
    }
}
