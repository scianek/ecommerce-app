import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { NotFoundException } from "@nestjs/common";
import { CategoriesService } from "@/categories/categories.service";

const mockProduct = new Product();
const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
const mockCategoriesService = {
    getCategoryById: jest.fn(),
};

describe("ProductsService", () => {
    let productsService: ProductsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
                {
                    provide: CategoriesService,
                    useValue: mockCategoriesService,
                },
            ],
        }).compile();
        productsService = module.get<ProductsService>(ProductsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(productsService).toBeDefined();
    });

    describe("getProducts", () => {
        it("should return all products", async () => {
            mockProductRepository.find.mockResolvedValue([mockProduct]);
            const products = await productsService.getProducts();
            expect(products).toEqual([mockProduct]);
            expect(mockProductRepository.find).toHaveBeenCalled();
        });
    });

    describe("getProductById", () => {
        describe("when a product with a given id exists", () => {
            it("should return the product", async () => {
                mockProductRepository.findOne.mockResolvedValue(mockProduct);
                const foundProduct = await productsService.getProductById(1);
                expect(foundProduct).toEqual(mockProduct);
                expect(mockProductRepository.findOne).toHaveBeenCalled();
            });
        });

        describe("when a product with a given id does not exist", () => {
            it("should throw a NotFoundException", async () => {
                mockProductRepository.findOne.mockResolvedValue(undefined);
                await expect(productsService.getProductById(1)).rejects.toThrow(
                    NotFoundException,
                );
            });
        });
    });

    describe("createProduct", () => {
        it("should create a product", async () => {
            mockProductRepository.create.mockReturnValue(mockProduct);
            mockProductRepository.save.mockResolvedValue(mockProduct);
            const createdProduct = await productsService.createProduct({
                ...mockProduct,
                categoryId: 1,
            });
            expect(createdProduct).toEqual(mockProduct);
            expect(mockProductRepository.create).toHaveBeenCalled();
        });
    });

    describe("updateProduct", () => {
        describe("when a product with a given id exists", () => {
            it("should update the product", async () => {
                mockProductRepository.findOne.mockResolvedValue(mockProduct);
                mockProductRepository.update.mockResolvedValue(mockProduct);
                const updatedProduct = await productsService.updateProduct(
                    1,
                    {},
                );
                expect(updatedProduct).toEqual({});
                expect(mockProductRepository.update).toHaveBeenCalled();
            });
        });

        describe("when a product with a given id does not exist", () => {
            it("should throw a NotFoundException", async () => {
                mockProductRepository.findOne.mockResolvedValue(undefined);
                await expect(productsService.getProductById(1)).rejects.toThrow(
                    NotFoundException,
                );
            });
        });
    });

    describe("deleteProduct", () => {
        describe("when a product with a given id exists", () => {
            it("should delete the product", async () => {
                mockProductRepository.findOne.mockResolvedValue(mockProduct);
                await productsService.deleteProduct(1);
                expect(mockProductRepository.delete).toHaveBeenCalled();
            });
        });

        describe("when a product with a given id does not exist", () => {
            it("should throw a NotFoundException", async () => {
                mockProductRepository.findOne.mockResolvedValue(undefined);
                await expect(productsService.getProductById(1)).rejects.toThrow(
                    NotFoundException,
                );
            });
        });
    });
});
