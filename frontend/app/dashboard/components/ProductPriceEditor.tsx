"use client";
import React, { useState, useEffect } from "react";
import { Product, fetchProducts, getFormattedProductName } from "@/app/data/stores";
import { CHAIN_TYPES, CHAIN_COLORS, GOLD_PURITIES } from "@/app/data/stores";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";

interface Props { storeID: number; }
interface EditingProduct extends Product {
  isEditing: boolean;
}

export default function ProductPriceEditor({ storeID }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    chain_type: "",
    chain_purity: "",
    chain_thickness: undefined,
    chain_length: undefined,
    chain_color: "",
    chain_weight: undefined,
    set_price: undefined
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);

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
      const product = editingProduct || products.find(p => p.productID === productID);
      if (!product) return;
      
      const response = await fetch(`http://localhost:5000/api/products/${productID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chain_type: product.chain_type,
          chain_purity: product.chain_purity,
          chain_thickness: product.chain_thickness,
          chain_length: product.chain_length,
          chain_color: product.chain_color,
          chain_weight: product.chain_weight,
          set_price: product.set_price
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      setProducts(prev => prev.map(p => 
        p.productID === productID ? {...product} : p
      ));
      setEditingProduct(null);
      alert('Product updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating product');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (productID: number) => {
    setDeleting(productID);
    try {
        const response = await fetch(`http://localhost:5000/api/products/${productID}`, { 
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

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
        // Validate inputs
        const thickness = newProduct.chain_thickness ? parseFloat(String(newProduct.chain_thickness)) : 0;
        const length = newProduct.chain_length ? parseFloat(String(newProduct.chain_length)) : 0;
        const weight = newProduct.chain_weight ? parseFloat(String(newProduct.chain_weight)) : 0;
        const price = newProduct.set_price ? parseFloat(String(newProduct.set_price)) : 0;

        if (!newProduct.chain_type || 
            !newProduct.chain_purity || 
            !newProduct.chain_color || 
            !thickness || thickness <= 0 ||
            !length || length <= 0 ||
            !weight || weight <= 0 ||
            !price || price <= 0) {
            alert('Please fill in all product fields with valid numbers');
            return;
        }

        const res = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storeID,
                chain_type: newProduct.chain_type,
                chain_purity: newProduct.chain_purity,
                chain_thickness: thickness,
                chain_length: length,
                chain_color: newProduct.chain_color,
                chain_weight: weight,
                set_price: price
            })
        });

        if (!res.ok) {
            throw new Error('Failed to create product');
        }

        const created = await res.json();
        setProducts(prev => [...prev, created]);

        // Reset form
        setNewProduct({
            chain_type: "",
            chain_purity: "",
            chain_thickness: undefined,
            chain_length: undefined,
            chain_color: "",
            chain_weight: undefined,
            set_price: undefined
        });

    } catch (err) {
        console.error('Error adding product:', err);
        alert('Error adding product');
    }
};

  const handleSpecChange = (field: keyof Product, value: string | number) => {
    if (!editingProduct) return;
    
    // Handle numeric fields
    if (field === 'chain_thickness' || field === 'chain_length' || 
        field === 'chain_weight' || field === 'set_price') {
        // Convert empty string to undefined, otherwise parse as number
        const numValue = value === "" ? undefined : Number(value);
        setEditingProduct({
            ...editingProduct,
            [field]: numValue
        });
    } else {
        setEditingProduct({
            ...editingProduct,
            [field]: value
        });
    }
  };

  const renderProductRow = (p: Product) => (
    <React.Fragment key={p.productID}>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4">
          {editingProduct?.productID === p.productID ? (
            <div className="grid grid-cols-4 gap-4">
              {/* Type, Purity, Color */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select
                  value={editingProduct.chain_type}
                  onChange={e => handleSpecChange('chain_type', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {CHAIN_TYPES.filter(ct => ct.id).map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Purity</label>
                <select
                  value={editingProduct.chain_purity}
                  onChange={e => handleSpecChange('chain_purity', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {GOLD_PURITIES.filter(gp => gp.value).map(gp => (
                    <option key={gp.value} value={gp.value}>{gp.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Color</label>
                <select
                  value={editingProduct.chain_color}
                  onChange={e => handleSpecChange('chain_color', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {CHAIN_COLORS.filter(cc => cc.id).map(cc => (
                    <option key={cc.id} value={cc.id}>{cc.name}</option>
                  ))}
                </select>
              </div>
              {/* Thickness, Length, Weight, Price */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Thickness (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingProduct.chain_thickness ?? ""}
                  onChange={e => handleSpecChange('chain_thickness', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Length (in)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingProduct.chain_length ?? ""}
                  onChange={e => handleSpecChange('chain_length', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Weight (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingProduct.chain_weight ?? ""}
                  onChange={e => handleSpecChange('chain_weight', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.set_price ?? ""}
                  onChange={e => handleSpecChange('set_price', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              {/* Action Buttons */}
              <div className="col-span-4 flex justify-end gap-2 mt-2">
                <button
                  onClick={() => handleSave(p.productID)}
                  disabled={saving === p.productID}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {saving === p.productID ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Save
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div 
                className="cursor-pointer flex-grow"
                onClick={() => setEditingProduct({...p, isEditing: true})}
              >
                {getFormattedProductName(p)} - ${typeof p.set_price === 'number' ? p.set_price.toFixed(2) : Number(p.set_price).toFixed(2)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProduct({...p, isEditing: true})}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.productID)}
                  disabled={deleting === p.productID}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  {deleting === p.productID ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </td>
      </tr>
    </React.Fragment>
  );

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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h2>
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
                value={newProduct.chain_thickness ?? ""}
                onChange={e => setNewProduct({ 
                    ...newProduct, 
                    chain_thickness: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (in)</label>
              <input
                type="number"
                placeholder="e.g. 18"
                value={newProduct.chain_length ?? ""}
                onChange={e => setNewProduct({ 
                    ...newProduct, 
                    chain_length: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={newProduct.chain_weight ?? ""}
                onChange={e => setNewProduct({ 
                    ...newProduct, 
                    chain_weight: e.target.value ? parseFloat(e.target.value) : undefined
                })}
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
                value={newProduct.set_price ?? ""}
                onChange={e => setNewProduct({ 
                    ...newProduct, 
                    set_price: e.target.value ? parseFloat(e.target.value) : undefined
                })}
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

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Store Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-200">
              {products.map(p => renderProductRow(p))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
