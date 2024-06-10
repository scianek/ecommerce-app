class CategorySales {
    categoryName: string;
    unitsSold: number;
    totalRevenue: number;
}

export class SalesByCategoryDto {
    sales: CategorySales[];
}
