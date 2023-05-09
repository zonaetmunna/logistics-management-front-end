import React, { ChangeEvent, useState } from "react"
import {
  Product,
  useAddProductMutation,
  useGetProductsQuery,
  useRemoveProductMutation,
  useUpdateProductMutation,
} from "../../features/products/productApi"
import { FaSearch } from "react-icons/fa"
import Pagination from "../../components/common/Pagination"
import UpdateProductModal from "../../components/products/UpdateProductModal"
import DeleteModal from "../../components/common/DeleteModal"
import DeleteProductModal from "../../components/products/DeleteProductModal"
import AddProductModal from "../../components/products/AddProductModal"

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddProductModalOpe, setIsAddProductModalOpen] =
    useState<boolean>(false)
  const [isSingleProductModalOpen, setIsSingleProductModalOpen] =
    useState<boolean>(false)
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState<boolean>(false)
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState<boolean>(false)

  // get query
  const { data, isError, isLoading } = useGetProductsQuery()
  const products = data?.data?.products
  const total = data?.data.total ?? 0
  // post query
  const [addProduct] = useAddProductMutation()
  // get single brand
  //   const { data } = useGetProductsQuery()
  // delete mutation
  const [deleteProduct] = useRemoveProductMutation()
  // update mutation
  const [updateProduct] = useUpdateProductMutation()

  // input
  const [displayData, setDisplayData] = useState<Product[]>([])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase()
    const matchedResult = products?.filter((elem) =>
      elem.name.toLowerCase().includes(searchText),
    )
    setDisplayData(matchedResult || [])
  }

  const handleAddBrand = (brand: ProductData) => {
    addProduct(brand)
  }

  const handleUpdateBrand = (brand: ProductData) => {
    updateProduct(brand)
  }

  const handleDeleteBrand = (id: string) => {
    deleteProduct(id)
  }

  const handleBrandClick = (product: Product) => {
    setSelectedProduct(product)
    setIsSingleProductModalOpen(true)
  }

  const handleUpdateClick = (product: Product) => {
    setSelectedProduct(product)
    setIsUpdateProductModalOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteProductModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product-List</h1>
      {/* input and button section */}
      <div className="flex justify-between items-center my-5">
        {/* input field */}
        <div className="relative flex items-center bg-white">
          <input
            type="text"
            placeholder="Search Products"
            className="py-2 pl-10 pr-4 block w-full rounded-md bg-white text-gray-800 border-gray-300 focus:outline-none  focus:border-gray-500"
            onChange={(e) => handleSearch(e)}
          />
          <span className="absolute left-3 top-2">
            <FaSearch className="text-gray-600 w-5 h-5" />
          </span>
        </div>
        {/* add brand */}
        <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 flex items-center ">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsAddProductModalOpen(true)}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* otherImages: [];
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
    __v: number; */}

      {/* table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">category</th>
                <th className="px-4 py-2">brand</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">unit</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayData?.map((product) => (
                <tr key={product._id}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.category}</td>
                  <td className="border px-4 py-2">
                    {product.description.slice(0, 5)}
                  </td>
                  <td className="border px-4 py-2">{product?.brand.name}</td>
                  <td className="border px-4 py-2">{product.unit}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleBrandClick(product)}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleUpdateClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* pagination */}
      <Pagination
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      {/* view modal */}
      {/* {isSingleProductModalOpen && (
        <SingleBrandViewModal
          onClose={() => setIsSingleProductModalOpen(false)}
          brand={selectedProduct}
        />
      )} */}
      {/* add brand modal */}
      {isAddProductModalOpe && (
        <AddProductModal
          onClose={() => setIsAddProductModalOpen(false)}
          onAddProduct={handleAddBrand}
        />
      )}
      {/* update and delete modal */}
      {selectedProduct && isUpdateProductModalOpen && (
        <UpdateProductModal
          onClose={() => setIsUpdateProductModalOpen(false)}
          onUpdateProduct={handleUpdateBrand}
          product={selectedProduct}
        />
      )}
      {selectedProduct && isDeleteProductModalOpen && (
        <DeleteProductModal
          onClose={() => setIsDeleteProductModalOpen(false)}
          onDeleteBrand={handleDeleteBrand}
          product={selectedProduct}
        />
      )}
    </div>
  )
}

export default ProductList
