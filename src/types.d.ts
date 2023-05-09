// product interface
interface IProduct {
    _id?: string;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    store: string;
}

// BrandData
interface BrandData {
    name: string
    email: string
    description: string
    location: string
    status: string
}
// product data
interface ProductData {
    name: string;
    description: string;
    productImage: string;
    otherImages: string;
    unit: string;
    category: string;
    brandName: string;
    brandID: string;

}
