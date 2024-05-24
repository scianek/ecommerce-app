import { Test, TestingModule } from "@nestjs/testing";
import { CustomersService } from "./customers.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { NotFoundException } from "@nestjs/common";

const mockCustomer = new Customer();
const mockCustomerRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("CustomersService", () => {
    let customersService: CustomersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomersService,
                {
                    provide: getRepositoryToken(Customer),
                    useValue: mockCustomerRepository,
                },
            ],
        }).compile();
        customersService = module.get<CustomersService>(CustomersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(customersService).toBeDefined();
    });

    describe("getCustomers", () => {
        it("should return all customers", async () => {
            mockCustomerRepository.find.mockResolvedValue([mockCustomer]);
            const customers = await customersService.getCustomers();
            expect(customers).toEqual([mockCustomer]);
            expect(mockCustomerRepository.find).toHaveBeenCalled();
        });
    });

    describe("getCustomerById", () => {
        describe("when a customer with a given id exists", () => {
            it("should return the customer", async () => {
                mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
                const foundCustomer = await customersService.getCustomerById(1);
                expect(foundCustomer).toEqual(mockCustomer);
                expect(mockCustomerRepository.findOne).toHaveBeenCalled();
            });
        });

        describe("when a customer with a given id does not exist", () => {
            it("should throw a NotFoundException", async () => {
                mockCustomerRepository.findOne.mockResolvedValue(undefined);
                await expect(
                    customersService.getCustomerById(1),
                ).rejects.toThrow(NotFoundException);
            });
        });
    });

    describe("createCustomer", () => {
        it("should create a customer", async () => {
            mockCustomerRepository.create.mockReturnValue(mockCustomer);
            mockCustomerRepository.save.mockResolvedValue(mockCustomer);
            const createdCustomer =
                await customersService.createCustomer(mockCustomer);
            expect(createdCustomer).toEqual(mockCustomer);
            expect(mockCustomerRepository.create).toHaveBeenCalled();
            expect(mockCustomerRepository.save).toHaveBeenCalled();
        });
    });

    describe("updateCustomer", () => {
        describe("when a customer with a given id exists", () => {
            it("should update the customer", async () => {
                mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
                mockCustomerRepository.update.mockResolvedValue(mockCustomer);
                const updatedCustomer = await customersService.updateCustomer(
                    1,
                    {},
                );
                expect(updatedCustomer).toEqual({});
                expect(mockCustomerRepository.update).toHaveBeenCalled();
            });
        });

        describe("when a customer with a given id does not exist", () => {
            it("should throw a NotFoundException", async () => {
                mockCustomerRepository.findOne.mockResolvedValue(undefined);
                await expect(
                    customersService.getCustomerById(1),
                ).rejects.toThrow(NotFoundException);
            });
        });
    });

    describe("deleteCustomer", () => {
        describe("when a customer with a given id exists", () => {
            it("should delete the customer", async () => {
                mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
                await customersService.deleteCustomer(1);
                expect(mockCustomerRepository.delete).toHaveBeenCalled();
            });
        });

        describe("when a customer with a given id does not exist", () => {
            it("should throw a NotFoundException", async () => {
                mockCustomerRepository.findOne.mockResolvedValue(undefined);
                await expect(
                    customersService.deleteCustomer(1),
                ).rejects.toThrow(NotFoundException);
            });
        });
    });
});
