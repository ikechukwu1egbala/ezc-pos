"use client";

import { useEffect, useState } from "react";

interface SaleItem {
  productId: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer";
  amountPaid: number;
  change: number;
  status: string;
}

const SALES_STORAGE_KEY = "ezc-sales";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const savedSales =
      localStorage.getItem(SALES_STORAGE_KEY);

    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  const totalSales = sales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Sales History
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          View completed customer sales and payments.
        </p>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">
            Total Sales
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {sales.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">
            Total Revenue
          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">
            ₦{totalSales.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="border-b bg-gray-50">
              <tr className="text-sm font-semibold text-gray-900">
                <th className="px-4 py-4">
                  Sale ID
                </th>

                <th className="px-4 py-4">
                  Date
                </th>

                <th className="px-4 py-4">
                  Items
                </th>

                <th className="px-4 py-4">
                  Payment
                </th>

                <th className="px-4 py-4">
                  Subtotal
                </th>

                <th className="px-4 py-4">
                  Discount
                </th>

                <th className="px-4 py-4">
                  Total
                </th>

                <th className="px-4 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No completed sales yet.
                  </td>
                </tr>
              ) : (
                [...sales].reverse().map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b text-sm text-gray-900"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {sale.id}
                    </td>

                    <td className="px-4 py-4">
                      {new Date(
                        sale.date
                      ).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {sale.items.map((item) => (
                          <div key={item.productId}>
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4 capitalize">
                      {sale.paymentMethod}
                    </td>

                    <td className="px-4 py-4">
                      ₦{sale.subtotal.toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      ₦{sale.discount.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 font-bold">
                      ₦{sale.total.toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {sale.status}
                      </span>
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