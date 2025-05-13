'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch products from API
    // This is a placeholder for demonstration
    setProducts([
      { id: '1', name: 'Product 1', price: 9.99, category: 'Category 1' },
      { id: '2', name: 'Product 2', price: 19.99, category: 'Category 2' },
    ]);
    setLoading(false);
  }, []);

  const handlePriceChange = (productId: string, newPrice: number) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, price: newPrice } : product
    ));
  };

  const handleSave = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      // TODO: Implement API call to update product price
      console.log('Saving product:', product);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  if (loading) {
    return <div className="text-[#FFD700]">Loading products...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#FFD700]/30">
        <thead className="bg-black/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#FFD700] uppercase tracking-wider">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#FFD700] uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#FFD700] uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#FFD700] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-black/30 divide-y divide-[#FFD700]/30">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-black/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#FFD700]">
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value))}
                    className="w-24 px-2 py-1 bg-black/50 border border-[#FFD700]/30 rounded text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  `$${product.price.toFixed(2)}`
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {editingProduct?.id === product.id ? (
                  <button
                    onClick={() => handleSave(product.id)}
                    className="text-[#FFD700] hover:text-white mr-4 transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-[#FFD700] hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 