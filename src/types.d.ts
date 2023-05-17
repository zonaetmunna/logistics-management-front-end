// product interface

interface IProduct {
    _id: string;
    name: string;
    description: string;
    imageURLs: [];
    otherImages: [];
    unit: string;
    category: string;
    brand: {
        id: string;
        name: "string"
    };
    __v: number;
}

interface ITotalProductData {
    status: string;
    data: {
        total: number;
        totalPage: number | null;
        products: IProduct[];
    };
}

interface ITotalSingleProductData {
    status: "success";
    data: IProduct;
}

interface QueryParams {
    category?: Category | string;
    search?: string;
    page?: number;
    limit?: number;
}

interface IPostProductData {
    name: string;
    description: string;
    productImage: string;
    otherImages: string;
    unit: string;
    category: string;
    brandName: string;
    brandID: string;
}

// BrandData
interface BrandData {
    name: string
    email: string
    description: string
    location: string
    status: string
}
// category data

interface ICategory {
    _id?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    createdBy?: string;
}

interface ITotalCategoryData {
    status: string;
    data: {
        total: number;
        totalPage: number | null;
        category: ICategory[];
    };
}

interface ITotalSingleCategory {
    status: "success";
    data: ICategory;
}

export interface CategoryOption {
    label: string;
    value: string;
}

