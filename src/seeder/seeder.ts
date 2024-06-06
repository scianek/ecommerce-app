import { Category } from "@/categories/entities/category.entity";
import { Customer } from "@/customers/entities/customer.entity";
import { OrderDetails } from "@/orders/entities/order-details.entity";
import { Order, OrderStatus } from "@/orders/entities/order.entity";
import { Product } from "@/products/entities/product.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";

@Injectable()
export class Seeder {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetails)
        private readonly orderDetailsRepository: Repository<OrderDetails>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    public async seed() {
        const categories = await this.seedCategories();
        const products = await this.seedProducts(categories);
        const customers = await this.seedCustomers();
        await this.seedOrders(products, customers);
    }

    private async seedCategories() {
        const categories = [];
        const departmentNames = new Set<string>();
        while (departmentNames.size < 5) {
            departmentNames.add(faker.commerce.department());
        }
        for (const name of departmentNames) {
            const category = this.categoryRepository.create({ name });
            await this.categoryRepository.save(category);
            categories.push(category);
        }
        return categories;
    }

    private async seedProducts(categories: Category[]) {
        const products = [];
        for (let i = 0; i < 20; i++) {
            const product = this.productRepository.create({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: Number(faker.commerce.price({ min: 10, max: 100 })),
                unitsInStock: faker.number.int(100),
                category: faker.helpers.arrayElement(categories),
            });
            await this.productRepository.save(product);
            products.push(product);
        }
        return products;
    }

    private async seedCustomers() {
        const customers = [];
        for (let i = 0; i < 10; i++) {
            const customer = this.customerRepository.create({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                address: faker.location.streetAddress(),
            });
            await this.customerRepository.save(customer);
            customers.push(customer);
        }
        return customers;
    }

    private async seedOrders(products: Product[], customers: Customer[]) {
        for (let i = 0; i < 40; i++) {
            const customer = faker.helpers.arrayElement(customers);
            const order = this.orderRepository.create({
                customer,
                orderStatus: faker.helpers.arrayElement(
                    Object.values(OrderStatus),
                ),
            });
            await this.orderRepository.save(order);
            const orderDetails = [];
            for (let i = 0; i < 5; i++) {
                const product = faker.helpers.arrayElement(products);
                const orderDetail = this.orderDetailsRepository.create({
                    order,
                    product,
                    quantity: faker.number.int({ min: 1, max: 30 }),
                });
                await this.orderDetailsRepository.save(orderDetail);
                orderDetails.push(orderDetail);
            }
            order.orderDetails = orderDetails;
            await this.orderRepository.save(order);
        }
    }
}
