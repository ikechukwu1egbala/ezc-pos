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

interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: "IN" | "OUT";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
}

const STORAGE_KEY = "ezc-products";
const MOVEMENT_KEY = "ezc-stock-movements";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [adjustmentType, setAdjustmentType] =
    useState<"add" | "remove">("add");

  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts([]);
    }
  };

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

  const openAdjustment = (product: Product) => {
    setSelectedProduct(product);
    setAdjustmentType("add");
    setQuantity("");
    setReason("");
  };

  const closeAdjustment = () => {
    setSelectedProduct(null);
    setQuantity("");
    setReason("");
  };

  const handleAdjustment = () => {
    if (!selectedProduct) {
      return;
    }

    const adjustmentQuantity = Number(quantity);

    if (!adjustmentQuantity || adjustmentQuantity <= 0) {
      alert("Enter a valid quantity.");
      return;
    }

    if (!reason.trim()) {
      alert("Please enter a reason for the adjustment.");
      return;
    }

    const previousStock = selectedProduct.stock;

    let newStock = previousStock;

    if (adjustmentType === "add") {
      newStock += adjustmentQuantity;
    } else {
      newStock -= adjustmentQuantity;
    }

    if (newStock < 0) {
      alert("Stock cannot be less than zero.");
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? {
            ...product,
            stock: newStock,
          }
        : product
    );

    setProducts(updatedProducts);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );

    /*
     * Create stock movement record
     */
    const savedMovements = localStorage.getItem(MOVEMENT_KEY);

    const movements: StockMovement[] = savedMovements
      ? JSON.parse(savedMovements)
      : [];

    const newMovement: StockMovement = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: adjustmentType === "add" ? "IN" : "OUT",
      quantity: adjustmentQuantity,
      previousStock,
      newStock,
      reason: reason.trim(),
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      MOVEMENT_KEY,
      JSON.stringify([newMovement, ...movements])
    );

    closeAdjustment();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Monitor and adjust your stock levels.
          </p>
        </div>

        <a
          href="/inventory/history"
          className="rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
        >
          Stock History
        </a>

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
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by product name, category or SKU..."
          className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
        />

      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] text-left">

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

                <th className="px-4 py-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>
                  <td
                    colSpan={8}
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

                    <td className="px-4 py-4">

                      <button
                        onClick={() =>
                          openAdjustment(product)
                        }
                        className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        Adjust Stock
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">

            <div className="mb-5 flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Adjust Stock
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedProduct.name}
                </p>
              </div>

              <button
                onClick={closeAdjustment}
                className="text-xl text-gray-500"
              >
                ✕
              </button>

            </div>

            <div className="mb-4 rounded-lg bg-gray-100 p-4">

              <p className="text-sm text-gray-600">
                Current Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {selectedProduct.stock}{" "}
                {selectedProduct.unit}
              </p>

            </div>

            <div className="mb-4">

              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Adjustment Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  onClick={() =>
                    setAdjustmentType("add")
                  }
                  className={`rounded-lg border px-4 py-3 font-semibold ${
                    adjustmentType === "add"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  + Add Stock
                </button>

                <button
                  onClick={() =>
                    setAdjustmentType("remove")
                  }
                  className={`rounded-lg border px-4 py-3 font-semibold ${
                    adjustmentType === "remove"
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  − Remove Stock
                </button>

              </div>

            </div>

            <div className="mb-4">

              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="Enter quantity"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />

            </div>

            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Reason
              </label>

              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="e.g. New stock received"
                rows={3}
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
              />

            </div>

            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={closeAdjustment}
                className="rounded-lg border px-4 py-3 font-semibold text-gray-900"
              >
                Cancel
              </button>

              <button
                onClick={handleAdjustment}
                className={`rounded-lg px-4 py-3 font-semibold text-white ${
                  adjustmentType === "add"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Save Adjustment
              </button>

            </div>

          </div>

        </div>
      )}

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