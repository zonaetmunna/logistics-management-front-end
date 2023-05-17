import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
    reducerPath: "pokemonApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api/v1",
    }),
    tagTypes: ["product", "brand", "category", "auth"],
    endpoints: (builder) => ({}),
});

export default apiSlice;