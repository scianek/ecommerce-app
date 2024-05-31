import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    getAllCategorys() {
        return this.categoriesService.getCategories();
    }

    @Get(":id")
    getCategoryById(@Param("id") id: number) {
        return this.categoriesService.getCategoryById(id);
    }

    @Post()
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.createCategory(dto);
    }

    @Patch(":id")
    updateCategory(@Param("id") id: number, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.updateCategory(id, dto);
    }

    @Delete(":id")
    deleteCategory(@Param("id") id: number) {
        return this.categoriesService.deleteCategory(id);
    }
}
