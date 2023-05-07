import React, { useState, ChangeEvent } from "react"
import { toast } from "react-hot-toast"
import { FaSearch } from "react-icons/fa"
import AddBrandModal from "../../components/brand/AddBrandModal"
import EditBrandModal from "../../components/brand/EditBrandModal"
import SingleBrandViewModal from "../../components/brand/SingleBrandViewModal"
import DeleteModal from "../../components/common/DeleteModal"
import {
  Brand,
  useAddBrandMutation,
  useDeleteBrandMutation,
  useGetBrandQuery,
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
} from "../../features/brand/brandApi"
import Pagination from "../../components/common/Pagination"

const BrandList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState<boolean>(false)
  const [isSingleBrandModalOpen, setIsSingleBrandModalOpen] =
    useState<boolean>(false)
  const [isUpdateBrandModalOpen, setIsUpdateBrandModalOpen] =
    useState<boolean>(false)
  const [isDeleteBrandModalOpen, setIsDeleteBrandModalOpen] =
    useState<boolean>(false)

  // get query
  const { data, isLoading } = useGetBrandQuery()
  console.log(data)
  const brands = data?.data?.brands
  const total = data?.data.total ?? 0
  // post query
  const [addBrand] = useAddBrandMutation()
  // get single brand
  // const { data } = useGetSingleBrandQuery()
  // delete mutation
  const [deleteBrand] = useDeleteBrandMutation()
  // update mutation
  const [updateBrand] = useUpdateBrandMutation()

  // input
  const [displayData, setDisplayData] = useState<Brand[]>([])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase()
    const matchedResult = brands?.filter((elem) =>
      elem.name.toLowerCase().includes(searchText),
    )
    setDisplayData(matchedResult || [])
  }

  const handleAddBrand = (brand: BrandData) => {
    addBrand(brand)
  }

  const handleUpdateBrand = (brand: BrandData) => {
    updateBrand(brand)
  }

  const handleDeleteBrand = (id: string) => {
    deleteBrand(id)
  }

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsSingleBrandModalOpen(true)
  }

  const handleUpdateClick = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsUpdateBrandModalOpen(true)
  }

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteBrandModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Brand List</h1>
      {/* input and button section */}
      <div className="flex justify-between items-center my-5">
        {/* input field */}
        <div className="relative flex items-center bg-white">
          <input
            type="text"
            placeholder="Search brands"
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
            onClick={() => setIsAddBrandModalOpen(true)}
          >
            Add Brand
          </button>
        </div>
      </div>

      {/* table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayData?.map((brand) => (
                <tr key={brand._id}>
                  <td className="border px-4 py-2">{brand.name}</td>
                  <td className="border px-4 py-2">{brand.email}</td>
                  <td className="border px-4 py-2">
                    {brand.description.slice(0, 5)}
                  </td>
                  <td className="border px-4 py-2">{brand.location}</td>
                  <td className="border px-4 py-2">{brand.status}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleBrandClick(brand)}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleUpdateClick(brand)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteClick(brand)}
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
      {isSingleBrandModalOpen && (
        <SingleBrandViewModal
          onClose={() => setIsSingleBrandModalOpen(false)}
          brand={selectedBrand}
        />
      )}
      {/* add brand modal */}
      {isAddBrandModalOpen && (
        <AddBrandModal
          onClose={() => setIsAddBrandModalOpen(false)}
          onAddBrand={handleAddBrand}
        />
      )}
      {/* update and delete modal */}
      {selectedBrand && isUpdateBrandModalOpen && (
        <EditBrandModal
          onClose={() => setIsUpdateBrandModalOpen(false)}
          onUpdateBrand={handleUpdateBrand}
          brand={selectedBrand}
        />
      )}
      {selectedBrand && isDeleteBrandModalOpen && (
        <DeleteModal
          onClose={() => setIsDeleteBrandModalOpen(false)}
          onDeleteBrand={handleDeleteBrand}
          brand={selectedBrand}
        />
      )}
    </div>
  )
}

export default BrandList

/* 

<td>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleView(item)}>
                    <AiFillEye className="cursor-pointer" size={20} />
                  </button>
                  <button type="button" onClick={() => handleEdit(item)}>
                    <AiOutlineEdit className="cursor-pointer" size={20} />
                  </button>
                  <button type="button" onClick={() => handleDelete(item)}>
                    <AiFillDelete className="cursor-pointer" size={20} />
                  </button>
                </div>
              </td>

*/
