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

interface CartItem {
  product: Product;
  quantity: number;
}

type PaymentMethod = "cash" | "card" | "transfer";

const STORAGE_KEY = "ezc-products";

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");

  const [amountPaid, setAmountPaid] = useState("");

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

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(
            "You cannot sell more than the available stock."
          );

          return currentCart;
        }

        return currentCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        if (item.quantity >= item.product.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.product.id !== productId
      )
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.product.sellingPrice * item.quantity,
    0
  );

  const discountAmount = Math.min(
    Number(discount) || 0,
    subtotal
  );

  const total = subtotal - discountAmount;

  const paidAmount = Number(amountPaid) || 0;

  const change =
    paymentMethod === "cash"
      ? Math.max(paidAmount - total, 0)
      : 0;

  const canCompletePayment =
    paymentMethod === "cash"
      ? paidAmount >= total
      : true;

  const openPayment = () => {
    if (cart.length === 0) {
      return;
    }

    setAmountPaid("");
    setPaymentMethod("cash");
    setShowPayment(true);
  };

  const closePayment = () => {
    setShowPayment(false);
    setAmountPaid("");
  };

  const completePayment = () => {
    if (!canCompletePayment) {
      alert("Amount paid is less than the sale total.");
      return;
    }

    /*
     * For now this only completes the frontend payment screen.
     *
     * In the next step we will:
     * - reduce inventory
     * - create a sale record
     * - create payment record
     * - create stock movement
     * - generate receipt
     */

    alert(
      `Payment successful!\n\nMethod: ${paymentMethod}\nTotal: ₦${total.toLocaleString()}`
    );

    setCart([]);
    setDiscount("");
    setAmountPaid("");
    setShowPayment(false);
  };

  const clearSale = () => {
    setCart([]);
    setDiscount("");
    setAmountPaid("");
    setShowPayment(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-5">

        <h1 className="text-2xl font-bold text-gray-900">
          New Sale
        </h1>

        <p className="text-sm text-gray-600">
          Select products and create a customer sale.
        </p>

      </div>

      <div className="grid gap-5 lg:grid-cols-3">

        {/* Products */}
        <section className="lg:col-span-2">

          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">

            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Search Product
            </label>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, category or SKU..."
              className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
            />

          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

            {filteredProducts.length === 0 ? (

              <div className="rounded-xl bg-white p-8 text-center text-gray-500 sm:col-span-2 xl:col-span-3">
                No products available.
              </div>

            ) : (

              filteredProducts.map((product) => (

                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="rounded-xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  <div className="flex items-start justify-between gap-2">

                    <div>

                      <h2 className="font-bold text-gray-900">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.category || "No category"}
                      </p>

                    </div>

                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {product.stock} {product.unit}
                    </span>

                  </div>

                  <p className="mt-4 text-lg font-bold text-green-700">
                    ₦{product.sellingPrice.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Tap to add
                  </p>

                </button>

              ))

            )}

          </div>

        </section>

        {/* Cart */}
        <section className="rounded-xl bg-white shadow-sm">

          <div className="border-b p-5">

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold text-gray-900">
                Current Sale
              </h2>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {cart.length} item(s)
              </span>

            </div>

          </div>

          <div className="max-h-[420px] overflow-y-auto p-4">

            {cart.length === 0 ? (

              <div className="py-12 text-center text-gray-500">

                <p className="font-medium">
                  Cart is empty
                </p>

                <p className="mt-1 text-sm">
                  Tap a product to add it.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {cart.map((item) => (

                  <div
                    key={item.product.id}
                    className="rounded-lg border p-3"
                  >

                    <div className="flex justify-between gap-3">

                      <div>

                        <p className="font-semibold text-gray-900">
                          {item.product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          ₦
                          {item.product.sellingPrice.toLocaleString()}
                          {" × "}
                          {item.quantity}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.product.id)
                        }
                        className="text-sm font-medium text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <div className="flex items-center rounded-lg border">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.product.id)
                          }
                          className="px-3 py-2 font-bold text-gray-900"
                        >
                          −
                        </button>

                        <span className="px-3 py-2 font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.product.id)
                          }
                          className="px-3 py-2 font-bold text-gray-900"
                        >
                          +
                        </button>

                      </div>

                      <p className="font-bold text-gray-900">
                        ₦
                        {(
                          item.product.sellingPrice *
                          item.quantity
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Totals */}
          <div className="border-t p-5">

            <div className="space-y-3">

              <div className="flex justify-between text-sm">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  ₦{subtotal.toLocaleString()}
                </span>

              </div>

              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Discount (₦)
                </label>

                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(event) =>
                    setDiscount(event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
                />

              </div>

              <div className="flex justify-between border-t pt-3">

                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-green-700">
                  ₦{total.toLocaleString()}
                </span>

              </div>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <button
                onClick={clearSale}
                disabled={cart.length === 0}
                className="rounded-lg border px-4 py-3 font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>

              <button
                onClick={openPayment}
                disabled={cart.length === 0}
                className="rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Pay
              </button>

            </div>

          </div>

        </section>

      </div>

      {/* Payment Modal */}
      {showPayment && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">

            {/* Payment Header */}
            <div className="mb-5 flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Complete this customer payment.
                </p>

              </div>

              <button
                onClick={closePayment}
                className="text-xl text-gray-500"
              >
                ✕
              </button>

            </div>

            {/* Total */}
            <div className="mb-5 rounded-xl bg-gray-100 p-5 text-center">

              <p className="text-sm text-gray-600">
                Amount Due
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                ₦{total.toLocaleString()}
              </p>

            </div>

            {/* Payment Method */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">

                <button
                  onClick={() =>
                    setPaymentMethod("cash")
                  }
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                    paymentMethod === "cash"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Cash
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                    paymentMethod === "card"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Card
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod("transfer")
                  }
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                    paymentMethod === "transfer"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Transfer
                </button>

              </div>

            </div>

            {/* Cash Amount */}
            {paymentMethod === "cash" && (

              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Amount Received
                </label>

                <input
                  type="number"
                  min="0"
                  value={amountPaid}
                  onChange={(event) =>
                    setAmountPaid(event.target.value)
                  }
                  placeholder="Enter amount received"
                  className="w-full rounded-lg border bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
                />

                <div className="mt-3 flex justify-between rounded-lg bg-green-50 p-3">

                  <span className="text-sm font-semibold text-gray-700">
                    Change
                  </span>

                  <span className="font-bold text-green-700">
                    ₦{change.toLocaleString()}
                  </span>

                </div>

              </div>

            )}

            {/* Card / Transfer information */}
            {paymentMethod !== "cash" && (

              <div className="mb-5 rounded-lg bg-blue-50 p-4">

                <p className="text-sm font-semibold text-gray-900">
                  {paymentMethod === "card"
                    ? "Card Payment"
                    : "Bank Transfer"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Confirm that the customer has completed the payment before completing the sale.
                </p>

              </div>

            )}

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">

              <button
                onClick={closePayment}
                className="rounded-lg border px-4 py-3 font-semibold text-gray-900"
              >
                Cancel
              </button>

              <button
                onClick={completePayment}
                disabled={!canCompletePayment}
                className="rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Complete Sale
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}