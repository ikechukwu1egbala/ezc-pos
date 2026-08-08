"use client";

import { FormEvent, useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  unit: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  lowStock: number;
}

const STORAGE_KEY = "ezc-products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("piece");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStock, setLowStock] = useState("10");

  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!sellingPrice) {
      alert("Please enter a selling price.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      sku: sku.trim(),
      unit,
      buyingPrice: Number(buyingPrice) || 0,
      sellingPrice: Number(sellingPrice),
      stock: Number(stock) || 0,
      lowStock: Number(lowStock) || 0,
    };

    saveProducts([...products, newProduct]);

    setName("");
    setCategory("");
    setSku("");
    setUnit("piece");
    setBuyingPrice("");
    setSellingPrice("");
    setStock("");
    setLowStock("10");

    setShowForm(false);
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.sku.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="text-sm text-gray-600">
            Manage your EZC products and prices.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-green-700"
        >
          {showForm ? "Close Form" : "+ Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl bg-white p-5 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Add New Product
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <FormField
              label="Product Name"
              value={name}
              onChange={setName}
              placeholder="e.g. Golden Penny Rice"
            />

            <FormField
              label="Category"
              value={category}
              onChange={setCategory}
              placeholder="e.g. Food"
            />

            <FormField
              label="SKU / Barcode"
              value={sku}
              onChange={setSku}
              placeholder="Enter barcode"
            />

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Unit
              </label>

              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
              >
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="litre">Litre</option>
                <option value="pack">Pack</option>
                <option value="bag">Bag</option>
                <option value="box">Box</option>
              </select>
            </div>

            <NumberField
              label="Buying Price (₦)"
              value={buyingPrice}
              onChange={setBuyingPrice}
              placeholder="0.00"
            />

            <NumberField
              label="Selling Price (₦)"
              value={sellingPrice}
              onChange={setSellingPrice}
              placeholder="0.00"
            />

            <NumberField
              label="Opening Stock"
              value={stock}
              onChange={setStock}
              placeholder="0"
            />

            <NumberField
              label="Low Stock Alert"
              value={lowStock}
              onChange={setLowStock}
              placeholder="10"
            />

          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Save Product
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
        />
      </div>

      {/* Product List */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="border-b bg-gray-50">
              <tr className="text-sm text-gray-900">
                <th className="px-4 py-4">Product</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">SKU</th>
                <th className="px-4 py-4">Selling Price</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b text-sm text-gray-900"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {product.name}
                    </td>

                    <td className="px-4 py-4">
                      {product.category || "-"}
                    </td>

                    <td className="px-4 py-4">
                      {product.sku || "-"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      ₦{product.sellingPrice.toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      {product.stock}
                    </td>

                    <td className="px-4 py-4">
                      {product.stock <= product.lowStock ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Low Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-900">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-900">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min="0"
        className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
      />
    </div>
  );
}