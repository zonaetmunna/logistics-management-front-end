import apiSlice from "../api/apiSlice"

// Define types
export interface Product {
    otherImages: [];
    imageURLs: [];
    unit: string;
    _id: string;
    name: string;
    category: string;
    brand: {
        id: string;
        name: "string"
    };
    description: string;
    __v: number;
}

interface ProductResponseData {
    status: string;
    data: {
        total: number;
        totalPage: number | null;
        products: Product[];
    };
}

interface SingleBrandResponse {
    status: "success";
    data: Product;
}


const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductResponseData, void>({
            query: () => ({
                url: "/product",
            }),
            providesTags: ["product"],
        }),
        getSingleProduct: builder.query<SingleBrandResponse, string>({
            query: (id) => ({
                url: `/products/${id}`,
            }),
            providesTags: ["product"],
        }),
        addProduct: builder.mutation({
            query: (data) => ({
                url: "/product",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),
        removeProduct: builder.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: "DELETE",
                body: id,
            }),
            invalidatesTags: ["product"],
        }),
        updateProduct: builder.mutation({
            query: (product) => ({
                url: `/product/${product._id}`,
                method: "PUT",
                body: product,
            }),
            invalidatesTags: ["product"],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetSingleProductQuery,
    useAddProductMutation,
    useRemoveProductMutation,
    useUpdateProductMutation
} = productApi
