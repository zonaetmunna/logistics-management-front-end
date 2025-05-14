import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import inventoryData from '../data/inventory.json';
import suppliersData from '../data/suppliers.json';

// Define types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subCategory: string;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  unitCost: number;
  sellingPrice: number;
  location: {
    warehouse: string;
    aisle: string;
    rack: string;
    bin: string;
  };
  supplier: string;
  supplierId: string;
  lastRestocked: string;
  tags: string[];
  imageUrl: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  barcode: string;
  status: string;
}

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

// Mock stock history data - in a real app, this would come from an API
interface StockHistoryItem {
  date: string;
  quantity: number;
  type: 'in' | 'out';
  reference: string;
}

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  useEffect(() => {
    // Fetch product data - in a real app, this would be an API call
    setLoading(true);
    
    // Find the product in our data
    const foundProduct = (inventoryData as any).products.find((p: Product) => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find supplier
      const foundSupplier = (suppliersData as any).suppliers.find(
        (s: Supplier) => s.id === foundProduct.supplierId
      );
      setSupplier(foundSupplier || null);
      
      // Get related products (same category)
      const related = (inventoryData as any).products
        .filter((p: Product) => 
          p.id !== id && 
          (p.category === foundProduct.category || p.subCategory === foundProduct.subCategory)
        )
        .slice(0, 4); // Get up to 4 related products
      setRelatedProducts(related);
      
      // Generate mock stock history - in a real app this would come from the API
      const mockHistory: StockHistoryItem[] = [
        {
          date: new Date(foundProduct.lastRestocked).toLocaleDateString(),
          quantity: 50,
          type: 'in',
          reference: 'PO-2023-089'
        },
        {
          date: new Date(new Date(foundProduct.lastRestocked).getTime() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          quantity: 10,
          type: 'out',
          reference: 'ORD-2023-156'
        },
        {
          date: new Date(new Date(foundProduct.lastRestocked).getTime() - 18 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          quantity: 5,
          type: 'out',
          reference: 'ORD-2023-142'
        },
        {
          date: new Date(new Date(foundProduct.lastRestocked).getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          quantity: 40,
          type: 'in',
          reference: 'PO-2023-075'
        },
        {
          date: new Date(new Date(foundProduct.lastRestocked).getTime() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          quantity: 15,
          type: 'out',
          reference: 'ORD-2023-098'
        }
      ];
      
      setStockHistory(mockHistory);
    }
    
    setLoading(false);
  }, [id]);

  // Get stock status class
  const getStockStatusClass = (product: Product) => {
    if (product.currentStock === 0) {
      return 'bg-red-100 text-red-800';
    } else if (product.currentStock < product.minimumStock) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-center">
          <div className="rounded-full bg-slate-200 h-10 w-10 mb-4 mx-auto"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mb-2 mx-auto"></div>
          <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
          <div className="mt-6 text-gray-500">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Product not found. The product may have been removed or the ID is incorrect.
              </p>
            </div>
          </div>
        </div>
        <Link to="/inventory" className="text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
            <Link to="/inventory" className="ml-2 text-gray-500 hover:text-gray-700">Inventory</Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
            <span className="ml-2 text-gray-900" aria-current="page">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Header section with title and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-1 text-sm text-gray-500">SKU: {product.sku} | ID: {product.id}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap space-x-3">
          {hasPermission('edit_inventory') && (
            <Link
              to={`/inventory/${product.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </Link>
          )}
          {hasPermission('restock_inventory') && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              Restock
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Product details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product information card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Product Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and specifications</p>
              </div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusClass(product)}`}>
                {product.status}
              </span>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.category} / {product.subCategory}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Barcode</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.barcode}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="font-medium">{product.currentStock}</span>
                    <span className="ml-2 text-gray-500">(Minimum: {product.minimumStock}, Reorder at: {product.reorderPoint})</span>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="font-medium">${product.sellingPrice.toFixed(2)}</span>
                    <span className="ml-2 text-gray-500">(Cost: ${product.unitCost.toFixed(2)})</span>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.weight.value} {product.weight.unit}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.location.warehouse} Warehouse, Aisle {product.location.aisle}, 
                    Rack {product.location.rack}, Bin {product.location.bin}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Restocked</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(product.lastRestocked).toLocaleDateString()}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Stock History */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Stock History</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent inventory changes</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockHistory.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.type === 'in' ? 'Stock In' : 'Stock Out'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                          <Link to={`/${item.type === 'in' ? 'purchases' : 'orders'}/${item.reference}`}>
                            {item.reference}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Supplier and Related Products */}
        <div className="space-y-6">
          {/* Supplier information card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Supplier Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              {supplier ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">{supplier.name}</h4>
                      <p className="text-sm text-gray-500">ID: {supplier.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-500">Contact: </span>
                      {supplier.contactName}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-500">Email: </span>
                      <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:text-blue-800">
                        {supplier.email}
                      </a>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-500">Phone: </span>
                      <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:text-blue-800">
                        {supplier.phone}
                      </a>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-500">Address: </span>
                      <address className="inline not-italic">
                        {supplier.address.street}, {supplier.address.city}, {supplier.address.state} {supplier.address.zip}, {supplier.address.country}
                      </address>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Link
                      to={`/suppliers/${supplier.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View Supplier Details &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Supplier information not available</div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Related Products</h3>
            </div>
            <div className="border-t border-gray-200">
              {relatedProducts.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {relatedProducts.map((relatedProduct) => (
                    <li key={relatedProduct.id} className="px-4 py-4 hover:bg-gray-50">
                      <Link to={`/inventory/${relatedProduct.id}`} className="block">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{relatedProduct.name}</div>
                            <div className="text-sm text-gray-500">
                              {relatedProduct.category} / {relatedProduct.subCategory}
                            </div>
                          </div>
                          <div className="ml-auto flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusClass(relatedProduct)}`}>
                              {relatedProduct.currentStock} in stock
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 text-sm text-gray-500">No related products found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail; 