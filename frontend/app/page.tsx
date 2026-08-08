"use client";

import { useEffect, useState } from "react";

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

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = localStorage.getItem(STORAGE_KEY);

      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts([]);
      }
    };

    loadProducts();

    window.addEventListener("storage", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
    };
  }, []);

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.lowStock
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Welcome to EZC POS. Here's an overview of your business.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Today's Sales"
          value="₦0"
          description="Total sales today"
        />

        <DashboardCard
          title="Transactions"
          value="0"
          description="Sales transactions today"
        />

        <DashboardCard
          title="Products"
          value={products.length.toString()}
          description="Products in inventory"
        />

        <DashboardCard
          title="Low Stock"
          value={lowStockProducts.length.toString()}
          description="Products needing attention"
        />

      </div>

      {/* Main Sections */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">

        {/* Recent Sales */}
        <section className="rounded-xl bg-white p-5 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Sales
            </h2>
          </div>

          <div className="py-10 text-center text-gray-500">
            <p className="font-medium">
              No sales yet
            </p>

            <p className="mt-1 text-sm">
              Completed sales will appear here.
            </p>
          </div>

        </section>

        {/* Low Stock */}
        <section className="rounded-xl bg-white p-5 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Low Stock
            </h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              <p className="font-medium">
                No low-stock products
              </p>

              <p className="mt-1 text-sm">
                Products requiring restocking will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Stock: {product.stock} {product.unit}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Low Stock
                  </span>
                </div>
              ))}
            </div>
          )}

        </section>

      </div>

      {/* Quick Actions */}
      <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">

        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <QuickAction
            title="New Sale"
            description="Start a customer sale"
          />

          <QuickAction
            title="Add Product"
            description="Add a product to inventory"
          />

          <QuickAction
            title="Inventory"
            description="Check stock levels"
          />

          <QuickAction
            title="Reports"
            description="View business reports"
          />

        </div>

      </section>

    </main>
  );
}

function DashboardCard({
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

function QuickAction({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button className="rounded-xl border p-4 text-left transition hover:bg-gray-50">
      <p className="font-bold text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </button>
  );
}