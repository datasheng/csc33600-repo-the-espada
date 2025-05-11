"use client";
import React, { useState, useEffect } from "react";
import { Product, fetchProducts, getFormattedProductName } from "@/app/data/stores";
import { CHAIN_TYPES, CHAIN_COLORS, GOLD_PURITIES } from "@/app/data/stores";

interface Props { storeID: number; }

export default function ProductPriceEditor({ storeID }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    chain_type: "", chain_purity: "", chain_thickness: 0, chain_length: 0, chain_color: "", chain_weight: 0, set_price: 0
  });

  useEffect(() => {
    fetchProducts(storeID)
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, [storeID]);

  const handleChange = (id: number, value: string) => {
    const price = parseFloat(value);
    setProducts(prev => prev.map(p => p.productID === id ? { ...p, set_price: price } : p));
  };

  const handleSave = async (productID: number) => {
    const product = products.find(p => p.productID === productID);
    if (!product) return;
    try {
      await fetch(`/api/products/${productID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ set_price: product.set_price }),
      });
      alert('Price updated');
    } catch (err) {
      console.error(err);
      alert('Error updating price');
    }
  };

  const handleDelete = async (productID: number) => {
    try {
      await fetch(`/api/products/${productID}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.productID !== productID));
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeID, ...newProduct })
      });
      const created: Product = await res.json();
      setProducts(prev => [...prev, created]);
      setNewProduct({ chain_type: "", chain_purity: "", chain_thickness: 0, chain_length: 0, chain_color: "", chain_weight: 0, set_price: 0 });
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Product Prices</h2>
      <div className="mb-4 grid gap-2 md:grid-cols-7">
        <select
          value={newProduct.chain_type}
          onChange={e => setNewProduct({ ...newProduct, chain_type: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">Select Type</option>
          {CHAIN_TYPES.filter(ct => ct.id).map(ct => (
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </select>
        <select
          value={newProduct.chain_purity}
          onChange={e => setNewProduct({ ...newProduct, chain_purity: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">Select Purity</option>
          {GOLD_PURITIES.filter(gp => gp.value).map(gp => (
            <option key={gp.value} value={gp.value}>{gp.label}</option>
          ))}
        </select>
        <input type="number" placeholder="Thickness" value={newProduct.chain_thickness} onChange={e => setNewProduct({ ...newProduct, chain_thickness: parseFloat(e.target.value) })} className="border p-1 rounded" />
        <input type="number" placeholder="Length" value={newProduct.chain_length} onChange={e => setNewProduct({ ...newProduct, chain_length: parseFloat(e.target.value) })} className="border p-1 rounded" />
        <select
          value={newProduct.chain_color}
          onChange={e => setNewProduct({ ...newProduct, chain_color: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">Select Color</option>
          {CHAIN_COLORS.filter(cc => cc.id).map(cc => (
            <option key={cc.id} value={cc.id}>{cc.name}</option>
          ))}
        </select>
        <input type="number" placeholder="Weight" value={newProduct.chain_weight} onChange={e => setNewProduct({ ...newProduct, chain_weight: parseFloat(e.target.value) })} className="border p-1 rounded" />
        <input type="number" step="0.01" placeholder="Price" value={newProduct.set_price} onChange={e => setNewProduct({ ...newProduct, set_price: parseFloat(e.target.value) })} className="border p-1 rounded" />
      </div>
      <button onClick={handleAdd} className="mb-4 bg-green-500 text-white px-4 py-2 rounded">Add Product</button>
      <table className="table-auto w-full">
        <thead>
          <tr><th>Product</th><th>Price</th><th colSpan={2}>Actions</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.productID} className="hover:bg-gray-100">
              <td>{getFormattedProductName(p)}</td>
              <td>
                <input type="number" step="0.01" value={p.set_price} onChange={e => handleChange(p.productID, e.target.value)} className="border p-1 w-24" />
              </td>
              <td>
                <button onClick={() => handleSave(p.productID)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Save</button>
                <button onClick={() => handleDelete(p.productID)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
