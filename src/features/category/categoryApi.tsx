import {
  ITotalCategoryData,
  ITotalSingleCategory,
  QueryParams,
} from "../../types"
import apiSlice from "../api/apiSlice"

const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query<ITotalCategoryData, QueryParams>({
      query: (params) => {
        console.log(params)
        const { category, search, page, limit, ...restParams } = params || {}
        const query: QueryParams = {}

        if (category) {
          query.category = category
        }

        if (search) {
          query.search = search
        }

        if (page && limit) {
          query.page = page
          query.limit = limit
        }

        console.log(query)

        return {
          url: "/category",
          params: {
            ...query,
            ...restParams,
          },
        }
      },
      providesTags: ["category"],
    }),
    getSingleCategory: builder.query<ITotalSingleCategory, string>({
      query: (id) => ({
        url: `/category/${id}`,
      }),
      providesTags: ["category"],
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["category"],
    }),
    updateCategory: builder.mutation({
      query: (category) => ({
        url: `/category/${category._id}`,
        method: "PUT",
        body: category,
      }),
      invalidatesTags: ["category"],
    }),
  }),
})

export const {
  useGetCategoryQuery,
  useGetSingleCategoryQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = productApi
