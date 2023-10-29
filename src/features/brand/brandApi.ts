import apiSlice from "../api/apiSlice"

// Define types
export interface Brand {
  _id: string
  name: string
  description: string
  email: string
  status: string
  location: string
  __v: number
}

interface BrandResponseData {
  status: string
  data: {
    total: number
    totalPage: number | null
    brands: Brand[]
  }
}

interface BrandResponse {
  status: "success"
  data: Brand
}

const brandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrand: builder.query<BrandResponseData, void>({
      query: () => ({
        url: "/brand",
      }),
      providesTags: ["brand"],
    }),
    getSingleBrand: builder.query<BrandResponse, string>({
      query: (id) => ({
        url: `/brand/${id}`,
      }),
      providesTags: ["brand"],
    }),
    addBrand: builder.mutation({
      query: (data) => ({
        url: "/brand",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["brand"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["brand"],
    }),
    updateBrand: builder.mutation({
      query: (brand) => ({
        url: `/brand/${brand._id}`,
        method: "PUT",
        body: brand,
      }),
      invalidatesTags: ["brand"],
    }),
  }),
})

export const {
  useGetBrandQuery,
  useGetSingleBrandQuery,
  useAddBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} = brandApi
