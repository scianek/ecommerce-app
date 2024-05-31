import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { CreateProductDto } from "@/products/dtos/create-product.dto";
import { CreateCategoryDto } from "@/categories/dtos/create-category.dto";
import { CreateCustomerDto } from "@/customers/dtos/create-customer.dto";
import { CreateOrderDto } from "@/orders/dtos/create-order.dto";
import TestAgent from "supertest/lib/agent";
import { Order } from "@/orders/entities/order.entity";

const createCustomerDto: CreateCustomerDto = {
    name: "Customer 1",
    email: "test@test.com",
    address: "123 Test St",
};
const createCategoryDto: CreateCategoryDto = {
    name: "Category 1",
};
const createProductDto: CreateProductDto = {
    name: "Product 1",
    description: "Just a test product",
    price: 29.99,
    unitsInStock: 50,
    categoryId: 1,
};
const createOrderDto: CreateOrderDto = {
    customerId: 1,
    orderDetails: [
        {
            productId: 1,
            quantity: 10,
        },
    ],
};

describe("App (e2e)", () => {
    let app: INestApplication;
    let api: TestAgent<request.Test>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        api = request(app.getHttpServer());
        await api.post("/customers").send(createCustomerDto).expect(201);
        await api.post("/categories").send(createCategoryDto).expect(201);
        await api.post("/products").send(createProductDto).expect(201);
        await api.post("/orders").send(createOrderDto).expect(201);
    });

    afterAll(async () => await app.close());

    const fetch = async <T>(endpoint: string) =>
        (await api.get(endpoint).expect(200)).body as T;

    describe("when requesting a change of product quantity in an order", () => {
        it("should apply the change if there is enough products in stock", async () => {
            await api
                .patch("/orders/1")
                .send({
                    orderDetails: [
                        {
                            productId: 1,
                            quantity: 50,
                        },
                    ],
                })
                .expect(200);
            (await fetch<Order>("/orders/1")).orderDetails
                .filter(({ productId }) => productId === 1)
                .forEach(({ quantity }) => expect(quantity).toBe(50));
        });
        it("should fail if the requested quantity exceeds the number in stock", async () => {
            await api
                .patch("/orders/1")
                .send({
                    orderDetails: [
                        {
                            productId: 1,
                            quantity: 60,
                        },
                    ],
                })
                .expect(422);
            (await fetch<Order>("/orders/1")).orderDetails
                .filter(({ productId }) => productId === 1)
                .forEach(({ quantity }) => expect(quantity).toBe(50));
        });
    });
});
