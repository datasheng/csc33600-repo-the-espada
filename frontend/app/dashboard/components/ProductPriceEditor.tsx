"use client";
import React, { useState, useEffect } from "react";
import { Product, fetchProducts, getFormattedProductName } from "@/app/data/stores";
import { CHAIN_TYPES, CHAIN_COLORS, GOLD_PURITIES } from "@/app/data/stores";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import axios from "axios";


interface Props { storeID: number; }

export default function ProductPriceEditor({ storeID }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    chain_type: "", chain_purity: "", chain_thickness: 0, chain_length: 0, chain_color: "", chain_weight: 0, set_price: 0
  });

  useEffect(() => {
    setLoading(true);
    fetchProducts(storeID)
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [storeID]);

  const handleChange = (id: number, value: string) => {
    const price = parseFloat(value);
    setProducts(prev => prev.map(p => p.productID === id ? { ...p, set_price: price } : p));
  };

  const handleSave = async (productID: number) => {
    setSaving(productID);
    try {
      const product = products.find(p => p.productID === productID);
      if (!product) return;
      
      await axios.put(`/api/products/${productID}`, {
        set_price: product.set_price
      });
      alert('Price updated');
    } catch (err) {
      console.error(err);
      alert('Error updating price');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (productID: number) => {
    setDeleting(productID);
    try {
      await axios.delete(`/api/products/${productID}`);
      setProducts(prev => prev.filter(p => p.productID !== productID));
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    } finally {
      setDeleting(null);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post('/api/products', { storeID, ...newProduct });
      const created: Product = res.data;
      setProducts(prev => [...prev, created]);
      setNewProduct({ chain_type: "", chain_purity: "", chain_thickness: 0, chain_length: 0, chain_color: "", chain_weight: 0, set_price: 0 });
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newProduct.chain_type}
                onChange={e => setNewProduct({ ...newProduct, chain_type: e.target.value })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                required
              >
                <option value="">Select Type</option>
                {CHAIN_TYPES.filter(ct => ct.id).map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
              <select
                value={newProduct.chain_purity}
                onChange={e => setNewProduct({ ...newProduct, chain_purity: e.target.value })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                required
              >
                <option value="">Select Purity</option>
                {GOLD_PURITIES.filter(gp => gp.value).map(gp => (
                  <option key={gp.value} value={gp.value}>{gp.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select
                value={newProduct.chain_color}
                onChange={e => setNewProduct({ ...newProduct, chain_color: e.target.value })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                required
              >
                <option value="">Select Color</option>
                {CHAIN_COLORS.filter(cc => cc.id).map(cc => (
                  <option key={cc.id} value={cc.id}>{cc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thickness (mm)</label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={newProduct.chain_thickness}
                onChange={e => setNewProduct({ ...newProduct, chain_thickness: parseFloat(e.target.value) })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (in)</label>
              <input
                type="number"
                placeholder="e.g. 18"
                value={newProduct.chain_length}
                onChange={e => setNewProduct({ ...newProduct, chain_length: parseFloat(e.target.value) })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={newProduct.chain_weight}
                onChange={e => setNewProduct({ ...newProduct, chain_weight: parseFloat(e.target.value) })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 199.99"
                value={newProduct.set_price}
                onChange={e => setNewProduct({ ...newProduct, set_price: parseFloat(e.target.value) })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                min={0}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.productID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFormattedProductName(p)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    step="0.01"
                    value={p.set_price}
                    onChange={e => handleChange(p.productID, e.target.value)}
                    className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleSave(p.productID)}
                    disabled={saving === p.productID}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving === p.productID ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(p.productID)}
                    disabled={deleting === p.productID}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === p.productID ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
