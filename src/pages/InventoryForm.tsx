import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  tags: string[];
  status: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: string[];
}

interface Supplier {
  id: string;
  name: string;
}

const InventoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: '',
    subCategory: '',
    currentStock: 0,
    minimumStock: 0,
    reorderPoint: 0,
    unitCost: 0,
    sellingPrice: 0,
    location: {
      warehouse: 'Main',
      aisle: '',
      rack: '',
      bin: ''
    },
    supplierId: '',
    tags: [],
    status: 'Active'
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load categories, suppliers, and product data if in edit mode
  useEffect(() => {
    // In a real app, these would be API calls
    
    // Load categories
    const data = inventoryData as any;
    setCategories(data.categories);
    
    // Load suppliers
    const suppData = suppliersData as any;
    setSuppliers(suppData.suppliers.map((s: any) => ({ id: s.id, name: s.name })));
    
    // If in edit mode, load product data
    if (isEditMode && id) {
      const product = data.products.find((p: Product) => p.id === id);
      if (product) {
        setFormData({
          ...product,
          // Ensure all required fields are present
          location: product.location || {
            warehouse: 'Main',
            aisle: '',
            rack: '',
            bin: ''
          }
        });
        
        // Load sub-categories for the selected category
        const category = data.categories.find((c: Category) => c.name === product.category);
        if (category) {
          setSubCategories(category.subCategories);
        }
      }
    }
    
    setLoading(false);
  }, [id, isEditMode]);
  
  // Update sub-categories when category changes
  useEffect(() => {
    if (formData.category) {
      const category = categories.find(c => c.name === formData.category);
      if (category) {
        setSubCategories(category.subCategories);
        // Reset sub-category if it's not in the new list
        if (!category.subCategories.includes(formData.subCategory || '')) {
          setFormData(prev => ({
            ...prev,
            subCategory: category.subCategories[0] || ''
          }));
        }
      }
    }
  }, [formData.category, categories]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties (e.g., location.warehouse)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Product] as any),
          [child]: value
        }
      }));
    } else {
      // Handle numeric fields
      if (['currentStock', 'minimumStock', 'reorderPoint', 'unitCost', 'sellingPrice'].includes(name)) {
        setFormData(prev => ({
          ...prev,
          [name]: parseFloat(value) || 0
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    
    if (formData.currentStock < 0) {
      newErrors.currentStock = 'Current stock cannot be negative';
    }
    
    if (formData.minimumStock < 0) {
      newErrors.minimumStock = 'Minimum stock cannot be negative';
    }
    
    if (formData.unitCost <= 0) {
      newErrors.unitCost = 'Unit cost must be greater than zero';
    }
    
    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Selling price must be greater than zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would be an API call
    if (isEditMode) {
      console.log('Updating product:', formData);
      // Simulate successful update
      alert('Product updated successfully!');
    } else {
      // Generate a new ID for a new product
      const newProduct = {
        ...formData,
        id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        // Add the supplier name based on the ID
        supplier: suppliers.find(s => s.id === formData.supplierId)?.name || ''
      };
      console.log('Creating new product:', newProduct);
      // Simulate successful creation
      alert('Product created successfully!');
    }
    
    // Navigate back to inventory
    navigate('/inventory');
  };
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-center">
          <div className="h-4 bg-slate-200 rounded w-32 mb-2 mx-auto"></div>
          <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
          <div className="mt-6 text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? 'Update product information in the inventory system'
            : 'Create a new product in the inventory system'}
        </p>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Product details and attributes</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Product Name */}
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>
              
              {/* SKU */}
              <div className="sm:col-span-3">
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                  SKU*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    value={formData.sku || ''}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.sku ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.sku && (
                    <p className="mt-2 text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>
              </div>
              
              {/* Category */}
              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category*
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.category ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
              </div>
              
              {/* Sub-Category */}
              <div className="sm:col-span-3">
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                  Sub-Category
                </label>
                <div className="mt-1">
                  <select
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled={!formData.category}
                  >
                    <option value="">Select a sub-category</option>
                    {subCategories.map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Supplier */}
              <div className="sm:col-span-3">
                <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
                  Supplier*
                </label>
                <div className="mt-1">
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId || ''}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.supplierId ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {errors.supplierId && (
                    <p className="mt-2 text-sm text-red-600">{errors.supplierId}</p>
                  )}
                </div>
              </div>
              
              {/* Status */}
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={formData.status || 'Active'}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stock and Pricing */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Stock and Pricing</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Inventory levels and price points</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Current Stock */}
              <div className="sm:col-span-2">
                <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700">
                  Current Stock
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="currentStock"
                    id="currentStock"
                    min="0"
                    step="1"
                    value={formData.currentStock || 0}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.currentStock ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.currentStock && (
                    <p className="mt-2 text-sm text-red-600">{errors.currentStock}</p>
                  )}
                </div>
              </div>
              
              {/* Minimum Stock */}
              <div className="sm:col-span-2">
                <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700">
                  Minimum Stock
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="minimumStock"
                    id="minimumStock"
                    min="0"
                    step="1"
                    value={formData.minimumStock || 0}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.minimumStock ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.minimumStock && (
                    <p className="mt-2 text-sm text-red-600">{errors.minimumStock}</p>
                  )}
                </div>
              </div>
              
              {/* Reorder Point */}
              <div className="sm:col-span-2">
                <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
                  Reorder Point
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="reorderPoint"
                    id="reorderPoint"
                    min="0"
                    step="1"
                    value={formData.reorderPoint || 0}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Unit Cost */}
              <div className="sm:col-span-3">
                <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700">
                  Unit Cost ($)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="unitCost"
                    id="unitCost"
                    min="0.01"
                    step="0.01"
                    value={formData.unitCost || ''}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.unitCost ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.unitCost && (
                    <p className="mt-2 text-sm text-red-600">{errors.unitCost}</p>
                  )}
                </div>
              </div>
              
              {/* Selling Price */}
              <div className="sm:col-span-3">
                <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
                  Selling Price ($)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="sellingPrice"
                    id="sellingPrice"
                    min="0.01"
                    step="0.01"
                    value={formData.sellingPrice || ''}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.sellingPrice ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.sellingPrice && (
                    <p className="mt-2 text-sm text-red-600">{errors.sellingPrice}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Warehouse Location</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Storage information</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-8">
              {/* Warehouse */}
              <div className="sm:col-span-2">
                <label htmlFor="location.warehouse" className="block text-sm font-medium text-gray-700">
                  Warehouse
                </label>
                <div className="mt-1">
                  <select
                    id="location.warehouse"
                    name="location.warehouse"
                    value={formData.location?.warehouse || 'Main'}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="Main">Main</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Distribution">Distribution Center</option>
                  </select>
                </div>
              </div>
              
              {/* Aisle */}
              <div className="sm:col-span-2">
                <label htmlFor="location.aisle" className="block text-sm font-medium text-gray-700">
                  Aisle
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location.aisle"
                    id="location.aisle"
                    value={formData.location?.aisle || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Rack */}
              <div className="sm:col-span-2">
                <label htmlFor="location.rack" className="block text-sm font-medium text-gray-700">
                  Rack
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location.rack"
                    id="location.rack"
                    value={formData.location?.rack || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Bin */}
              <div className="sm:col-span-2">
                <label htmlFor="location.bin" className="block text-sm font-medium text-gray-700">
                  Bin
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location.bin"
                    id="location.bin"
                    value={formData.location?.bin || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tags</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Keywords to help with searching</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag and press Enter"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                    >
                      <span className="sr-only">Remove {tag} tag</span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to={isEditMode ? `/inventory/${id}` : '/inventory'}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm; 