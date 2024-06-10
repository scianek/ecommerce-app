import { ProductSales } from "./sales-by-product.dto";

type CustomerSales = {
    customerName: string;
    productSales: ProductSales[];
};

export class SalesByCustomerDto {
    sales: CustomerSales[];
}
