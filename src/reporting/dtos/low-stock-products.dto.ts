type Product = {
    productName: string;
    unitsInStock: number;
};

export class LowStockProductsDto {
    lowStockProducts: Product[];
}
