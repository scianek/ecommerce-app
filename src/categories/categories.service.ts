import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { UpdateCategoryDto } from "./dtos/update-category.dto";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categories: Repository<Category>,
    ) {}

    getCategories() {
        return this.categories.find();
    }

    async getCategoryById(id: number) {
        const category = await this.categories.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
    }

    createCategory(dto: CreateCategoryDto) {
        return this.categories.save(this.categories.create(dto));
    }

    async updateCategory(id: number, dto: UpdateCategoryDto) {
        await this.getCategoryById(id);
        return this.categories.update({ id }, dto);
    }

    async deleteCategory(id: number) {
        await this.getCategoryById(id);
        return this.categories.delete({ id });
    }
}
