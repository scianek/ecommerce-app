import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dtos/create-customer.dto";
import { UpdateCustomerDto } from "./dtos/update-customer.dto";

@Controller("customers")
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Get()
    getCustomers() {
        return this.customersService.getCustomers();
    }

    @Get(":id")
    getCustomerById(@Param("id") id: number) {
        return this.customersService.getCustomerById(id);
    }

    @Post()
    createCustomer(@Body() dto: CreateCustomerDto) {
        return this.customersService.createCustomer(dto);
    }

    @Patch(":id")
    updateCustomer(@Param("id") id: number, @Body() dto: UpdateCustomerDto) {
        return this.customersService.updateCustomer(id, dto);
    }

    @Delete(":id")
    deleteCustomer(@Param("id") id: number) {
        return this.customersService.deleteCustomer(id);
    }
}
