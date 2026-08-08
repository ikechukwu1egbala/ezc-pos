"use client";
"use client";

import { useState } from "react";

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Products
          </h1>

          <p className="text-sm text-gray-500">
            Manage your EZC products and prices.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-green-700"
        >
          {showForm ? "Close Form" : "+ Add Product"}
        </button>

      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Add New Product
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Product Name
              </label>

              <input
                type="text"
                placeholder="e.g. Rice"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Category
              </label>

              <input
                type="text"
                placeholder="e.g. Food"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                SKU / Barcode
              </label>

              <input
                type="text"
                placeholder="Enter barcode"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Unit
              </label>

              <select className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600">
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="litre">Litre</option>
                <option value="pack">Pack</option>
                <option value="bag">Bag</option>
                <option value="box">Box</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Buying Price (₦)
              </label>

              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Selling Price (₦)
              </label>

              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Opening Stock
              </label>

              <input
                type="number"
                placeholder="0"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Low Stock Alert
              </label>

              <input
                type="number"
                placeholder="10"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />
            </div>

          </div>

          <div className="mt-5 flex justify-end">
            <button
              className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
            >
              Save Product
            </button>
          </div>

        </div>
      )}

      {/* Product Search */}
      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">

        <input
          type="search"
          placeholder="Search products..."
          className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
        />

      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left">

            <thead className="border-b bg-gray-50 text-sm">
              <tr>
                <th className="px-4 py-4">Product</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Selling Price</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No products yet.
                </td>
              </tr>
            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}