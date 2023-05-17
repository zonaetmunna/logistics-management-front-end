import { ITotalProductData, ITotalSingleProductData, QueryParams } from "../../types";
import apiSlice from "../api/apiSlice"


const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ITotalProductData, QueryParams>({
            query: (params) => {
                console.log(params);
                const { category, search, page, limit, ...restParams } = params || {};
                const query: QueryParams = {};

                if (category) {
                    query.category = category;
                }

                if (search) {
                    query.search = search;
                }

                if (page && limit) {
                    query.page = page;
                    query.limit = limit;
                }

                console.log(query);

                return {
                    url: "/product",
                    params: {
                        ...query,
                        ...restParams,
                    },
                };
            },
            providesTags: ["product"],
        }),
        getSingleProduct: builder.query<ITotalSingleProductData, string>({
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
