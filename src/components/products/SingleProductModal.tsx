import { IoCloseOutline } from "react-icons/io5"
import { IProduct } from "../../types"

interface Props {
  onClose: () => void
  product: IProduct | null
}
const SingleProductModal = ({ onClose, product }: Props) => {
  console.log(product)
  if (!product) {
    return null
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">{product.description}</p>
        {/* {product.imageURLs && (
          <img
            src={product.imageURLs[0]}
            alt={product.name}
            className="w-full mb-4"
          />
        )} */}
        <p>
          <strong>Unit:</strong> {product.unit}
        </p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Brand:</strong> {product.brand.name}
        </p>
        {/* Render other fields */}
        {/* Add close button or other modal actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SingleProductModal
