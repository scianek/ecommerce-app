export type ProductSales = {
    productName: string;
    unitsSold: number;
    totalRevenue: number;
};

export class SalesByProductDto {
    sales: ProductSales[];
}
