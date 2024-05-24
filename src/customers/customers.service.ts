import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dtos/create-customer.dto";
import { UpdateCustomerDto } from "./dtos/update-customer.dto";

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customers: Repository<Customer>,
    ) {}

    getCustomers() {
        return this.customers.find();
    }

    async getCustomerById(id: number) {
        const result = await this.customers.findOne({ where: { id } });
        if (!result) {
            throw new NotFoundException(`Customer with id ${id} not found`);
        }
        return result;
    }

    createCustomer(dto: CreateCustomerDto) {
        return this.customers.save(this.customers.create(dto));
    }

    async updateCustomer(id: number, dto: UpdateCustomerDto) {
        await this.getCustomerById(id);
        return this.customers.update({ id }, dto);
    }

    async deleteCustomer(id: number) {
        await this.getCustomerById(id);
        return this.customers.delete({ id });
    }
}
