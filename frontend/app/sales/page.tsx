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


type PaymentMethod =
  | "cash"
  | "card"
  | "transfer"
  | "split";

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

  // Split payment amounts
  const [cashAmount, setCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [transferAmount, setTransferAmount] =
    useState("");

  useEffect(() => {
    const savedProducts =
      localStorage.getItem(STORAGE_KEY);

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
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText) ||
        product.sku
          .toLowerCase()
          .includes(searchText)
    );
  }, [products, search]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) =>
          item.product.id === product.id
      );

      if (existing) {
        if (
          existing.quantity >=
          product.stock
        ) {
          alert(
            "You cannot sell more than the available stock."
          );

          return currentCart;
        }

        return currentCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
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

  const increaseQuantity = (
    productId: number
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.product.id !== productId
        ) {
          return item;
        }

        if (
          item.quantity >=
          item.product.stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (
    productId: number
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  const removeFromCart = (
    productId: number
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.product.id !== productId
      )
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.product.sellingPrice *
        item.quantity,
    0
  );

  const discountAmount = Math.min(
    Number(discount) || 0,
    subtotal
  );

  const total =
    subtotal - discountAmount;

  // Normal payment
  const paidAmount =
    Number(amountPaid) || 0;

  // Split payment
  const splitCash =
    Number(cashAmount) || 0;

  const splitCard =
    Number(cardAmount) || 0;

  const splitTransfer =
    Number(transferAmount) || 0;

  const splitTotal =
    splitCash +
    splitCard +
    splitTransfer;

  const splitRemaining =
    total - splitTotal;

  const change =
    paymentMethod === "cash"
      ? Math.max(
          paidAmount - total,
          0
        )
      : 0;

  const canCompletePayment =
    paymentMethod === "cash"
      ? paidAmount >= total
      : paymentMethod === "split"
        ? splitTotal === total
        : true;

  const openPayment = () => {
    if (cart.length === 0) {
      return;
    }

    setAmountPaid("");
    setCashAmount("");
    setCardAmount("");
    setTransferAmount("");
    setPaymentMethod("cash");
    setShowPayment(true);
  };

  const closePayment = () => {
    setShowPayment(false);
    setAmountPaid("");
    setCashAmount("");
    setCardAmount("");
    setTransferAmount("");
  };


  const completePayment = () => {
    if (!canCompletePayment) {
      if (paymentMethod === "split") {
        alert(
          "Split payment must equal the sale total."
        );
      } else {
        alert(
          "Amount paid is less than the sale total."
        );
      }
      return;
    }
  
    let paymentDescription = "";
  
    if (paymentMethod === "split") {
      paymentDescription =
        `Split Payment\nCash: ₦${splitCash.toLocaleString()}\nCard: ₦${splitCard.toLocaleString()}\nTransfer: ₦${splitTransfer.toLocaleString()}`;
    } else {
      paymentDescription =
        paymentMethod === "cash"
          ? `Cash: ₦${cashAmount.toLocaleString()}`
          : paymentMethod === "card"
          ? `Card: ₦${cardAmount.toLocaleString()}`
          : `Transfer: ₦${transferAmount.toLocaleString()}`;
    }
  
    /*
     * For now this only completes
     * the frontend payment screen.
     *
     * In the next backend step we will:
     * - reduce inventory
     * - create sale record
     * - create payment records
     * - create stock movement
     * - generate receipt
     */
  
    alert(
      `Payment successful!\n\nMethod: ${paymentDescription}\nTotal: ₦${total.toLocaleString()}`
    );
  
    setCart([]);
    setDiscount("");
    setAmountPaid("");
    setCashAmount("");
    setCardAmount("");
    setTransferAmount("");
    setShowPayment(false);
  };


  const clearSale = () => {
    setCart([]);
    setDiscount("");
    setAmountPaid("");
    setCashAmount("");
    setCardAmount("");
    setTransferAmount("");
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
                setSearch(
                  event.target.value
                )
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

              filteredProducts.map(
                (product) => (

                  <button
                    key={product.id}
                    onClick={() =>
                      addToCart(product)
                    }
                    className="rounded-xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    <div className="flex items-start justify-between gap-2">

                      <div>

                        <h2 className="font-bold text-gray-900">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.category ||
                            "No category"}
                        </p>

                      </div>

                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {product.stock}{" "}
                        {product.unit}
                      </span>

                    </div>

                    <p className="mt-4 text-lg font-bold text-green-700">
                      ₦
                      {product.sellingPrice.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Tap to add
                    </p>

                  </button>
                )
              )
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
                          removeFromCart(
                            item.product.id
                          )
                        }
                        className="text-sm font-medium text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border">
                        
                          {/* Minus */}
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.product.id)
                            }
                            className="px-3 py-2 text-lg font-bold text-gray-900 hover:bg-gray-100"
                          >
                            −
                          </button>
                        
                          {/* Quantity input */}
                          <input
                            type="number"
                            min="1"
                            max={item.product.stock}
                            value={item.quantity}
                            onChange={(event) => {
                              const value = Number(event.target.value);
                        
                              if (!Number.isFinite(value)) {
                                return;
                              }
                        
                              if (value <= 0) {
                                removeFromCart(item.product.id);
                                return;
                              }
                        
                              if (value > item.product.stock) {
                                return;
                              }
                        
                              setCart((currentCart) =>
                                currentCart.map((cartItem) =>
                                  cartItem.product.id === item.product.id
                                    ? {
                                        ...cartItem,
                                        quantity: value,
                                      }
                                    : cartItem
                                )
                              );
                            }}
                            className="w-16 border-x px-2 py-2 text-center font-semibold text-gray-900 outline-none focus:border-green-600"
                          />
                        
                          {/* Plus */}
                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.product.id)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="px-3 py-2 text-lg font-bold text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        
                        </div>

                      <p className="font-bold text-gray-900">
                        ₦
                        {(
                          item.product
                            .sellingPrice *
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
                  ₦
                  {subtotal.toLocaleString()}
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
                    setDiscount(
                      event.target.value
                    )
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
                  ₦
                  {total.toLocaleString()}
                </span>

              </div>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <button
                onClick={clearSale}
                disabled={
                  cart.length === 0
                }
                className="rounded-lg border px-4 py-3 font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>

              <button
                onClick={openPayment}
                disabled={
                  cart.length === 0
                }
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
                ₦
                {total.toLocaleString()}
              </p>

            </div>

            {/* Payment Method */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Payment Method
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                {/* Cash */}
                <button
                  onClick={() =>
                    setPaymentMethod(
                      "cash"
                    )
                  }
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                    paymentMethod ===
                    "cash"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Cash
                </button>

                {/* Card */}
                <button
                  onClick={() =>
                    setPaymentMethod(
                      "card"
                    )
                  }
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                    paymentMethod ===
                    "card"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Card
                </button>

                {/* Transfer */}
                <button
                  onClick={() =>
                    setPaymentMethod(
                      "transfer"
                    )
                  }
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                    paymentMethod ===
                    "transfer"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Transfer
                </button>

                {/* Split */}
                <button
                  onClick={() =>
                    setPaymentMethod(
                      "split"
                    )
                  }
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                    paymentMethod ===
                    "split"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Split
                </button>

              </div>

            </div>

            {/* Cash Payment */}
            {paymentMethod ===
              "cash" && (

              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Amount Received
                </label>

                <input
                  type="number"
                  min="0"
                  value={amountPaid}
                  onChange={(event) =>
                    setAmountPaid(
                      event.target.value
                    )
                  }
                  placeholder="Enter amount received"
                  className="w-full rounded-lg border bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
                />

                <div className="mt-3 flex justify-between rounded-lg bg-green-50 p-3">

                  <span className="text-sm font-semibold text-gray-700">
                    Change
                  </span>

                  <span className="font-bold text-green-700">
                    ₦
                    {change.toLocaleString()}
                  </span>

                </div>

              </div>
            )}

            {/* Split Payment */}
            {paymentMethod ===
              "split" && (

              <div className="mb-5 space-y-4">

                {/* Cash */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Cash Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={cashAmount}
                    onChange={(event) =>
                      setCashAmount(
                        event.target.value
                      )
                    }
                    placeholder="₦0"
                    className="w-full rounded-lg border bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
                  />

                </div>

                {/* Card */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Card Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={cardAmount}
                    onChange={(event) =>
                      setCardAmount(
                        event.target.value
                      )
                    }
                    placeholder="₦0"
                    className="w-full rounded-lg border bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
                  />

                </div>

                {/* Transfer */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Transfer Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={transferAmount}
                    onChange={(event) =>
                      setTransferAmount(
                        event.target.value
                      )
                    }
                    placeholder="₦0"
                    className="w-full rounded-lg border bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
                  />

                </div>

                {/* Split Summary */}
                <div className="rounded-lg bg-gray-100 p-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-600">
                      Split Payment Total
                    </span>

                    <span className="font-bold text-gray-900">
                      ₦
                      {splitTotal.toLocaleString()}
                    </span>

                  </div>

                  <div className="mt-2 flex justify-between text-sm">

                    <span className="text-gray-600">
                      Amount Due
                    </span>

                    <span className="font-bold text-gray-900">
                      ₦
                      {total.toLocaleString()}
                    </span>

                  </div>

                  <div className="mt-3 border-t pt-3">

                    <p
                      className={`text-sm font-semibold ${
                        splitTotal ===
                        total
                          ? "text-green-700"
                          : splitTotal >
                              total
                            ? "text-red-700"
                            : "text-orange-600"
                      }`}
                    >
                      {splitTotal ===
                      total
                        ? "Payment amount is correct."
                        : splitTotal >
                            total
                          ? "Payment is greater than the amount due."
                          : `₦${Math.abs(
                              splitRemaining
                            ).toLocaleString()} remaining`}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* Card / Transfer Information */}
            {paymentMethod !==
              "cash" &&
              paymentMethod !==
                "split" && (

              <div className="mb-5 rounded-lg bg-blue-50 p-4">

                <p className="text-sm font-semibold text-gray-900">

                  {paymentMethod ===
                  "card"
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
                onClick={
                  completePayment
                }
                disabled={
                  !canCompletePayment
                }
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