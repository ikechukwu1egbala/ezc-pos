"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText) ||
        product.sku.toLowerCase().includes(searchText)
    );
  }, [products, search]);

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.lowStock
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Monitor your stock levels and inventory status.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          title="Products"
          value={totalProducts.toString()}
          description="Total products"
        />

        <SummaryCard
          title="Units in Stock"
          value={totalUnits.toLocaleString()}
          description="Total available units"
        />

        <SummaryCard
          title="Low Stock"
          value={lowStockProducts.length.toString()}
          description="Needs attention"
        />

        <SummaryCard
          title="Out of Stock"
          value={outOfStockProducts.length.toString()}
          description="Currently unavailable"
        />

      </div>

      {/* Search */}
      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">

        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Search Inventory
        </label>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by product name, category or SKU..."
          className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
        />

      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left">

            <thead className="border-b bg-gray-50">

              <tr className="text-sm text-gray-900">

                <th className="px-4 py-4">
                  Product
                </th>

                <th className="px-4 py-4">
                  Category
                </th>

                <th className="px-4 py-4">
                  SKU
                </th>

                <th className="px-4 py-4">
                  Unit
                </th>

                <th className="px-4 py-4">
                  Stock
                </th>

                <th className="px-4 py-4">
                  Alert Level
                </th>

                <th className="px-4 py-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No inventory items found.
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

                    <td className="px-4 py-4">
                      {product.unit}
                    </td>

                    <td className="px-4 py-4 font-bold">
                      {product.stock}
                    </td>

                    <td className="px-4 py-4">
                      {product.lowStock}
                    </td>

                    <td className="px-4 py-4">

                      {product.stock <= 0 ? (

                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Out of Stock
                        </span>

                      ) : product.stock <= product.lowStock ? (

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
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

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">

      <p className="text-sm font-semibold text-gray-600">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
}