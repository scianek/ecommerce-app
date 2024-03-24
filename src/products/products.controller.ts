import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    getAllProducts() {
        return this.productsService.getProducts();
    }

    @Get(":id")
    getProductById(@Param("id") id: number) {
        return this.productsService.getProductById(id);
    }

    @Post()
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productsService.createProduct(createProductDto);
    }

    @Patch(":id")
    updateProduct(
        @Param("id") id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.updateProduct(id, updateProductDto);
    }

    @Delete(":id")
    deleteProduct(@Param("id") id: number) {
        return this.productsService.deleteProduct(id);
    }
}
