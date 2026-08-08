"use client";

import { useEffect, useState } from "react";

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

const MOVEMENT_KEY = "ezc-stock-movements";

export default function StockHistoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    const savedMovements =
      localStorage.getItem(MOVEMENT_KEY);

    if (savedMovements) {
      setMovements(JSON.parse(savedMovements));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          Stock Movement History
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Track every stock adjustment made in the system.
        </p>

      </div>

      <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">

        <p className="text-sm text-gray-600">
          Total movements
        </p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {movements.length}
        </p>

      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] text-left">

            <thead className="border-b bg-gray-50">

              <tr className="text-sm font-semibold text-gray-900">

                <th className="px-4 py-4">
                  Date
                </th>

                <th className="px-4 py-4">
                  Product
                </th>

                <th className="px-4 py-4">
                  Type
                </th>

                <th className="px-4 py-4">
                  Quantity
                </th>

                <th className="px-4 py-4">
                  Previous
                </th>

                <th className="px-4 py-4">
                  New Stock
                </th>

                <th className="px-4 py-4">
                  Reason
                </th>

              </tr>

            </thead>

            <tbody>

              {movements.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No stock movements recorded yet.
                  </td>

                </tr>

              ) : (

                movements.map((movement) => (

                  <tr
                    key={movement.id}
                    className="border-b text-sm text-gray-900"
                  >

                    <td className="px-4 py-4">
                      {new Date(
                        movement.date
                      ).toLocaleString()}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {movement.productName}
                    </td>

                    <td className="px-4 py-4">

                      {movement.type === "IN" ? (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          STOCK IN
                        </span>

                      ) : (

                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          STOCK OUT
                        </span>

                      )}

                    </td>

                    <td
                      className={`px-4 py-4 font-bold ${
                        movement.type === "IN"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {movement.type === "IN"
                        ? "+"
                        : "-"}
                      {movement.quantity}
                    </td>

                    <td className="px-4 py-4">
                      {movement.previousStock}
                    </td>

                    <td className="px-4 py-4 font-bold">
                      {movement.newStock}
                    </td>

                    <td className="px-4 py-4">
                      {movement.reason}
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