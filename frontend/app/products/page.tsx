"use client";

import { useEffect, useMemo, useState } from "react";

type InventoryType =
  | "simple"
  | "conversion"
  | "variant"
  | "bundle";

interface ProductUnit {
  id: string;
  name: string;
  abbreviation: string;
  conversionToBase: number;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  sellable: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  conversionToBase: number;
  stock: number;
  buyingPrice: number;
  sellingPrice: number;
  sellable: boolean;
}

interface BundleComponent {
  productId: number;
  productName: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;

  inventoryType: InventoryType;

  baseUnit: string;

  buyingPrice: number;
  sellingPrice: number;

  stock: number;
  lowStock: number;

  units: ProductUnit[];
  variants: ProductVariant[];
  components: BundleComponent[];
}

const STORAGE_KEY = "ezc-products";

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");

  const [inventoryType, setInventoryType] =
    useState<InventoryType>("simple");

  const [baseUnit, setBaseUnit] = useState("");

  const [buyingPrice, setBuyingPrice] =
    useState("");

  const [sellingPrice, setSellingPrice] =
    useState("");

  const [openingStock, setOpeningStock] =
    useState("");

  const [lowStock, setLowStock] =
    useState("10");

  /*
   * Conversion unit
   */
  const [unitName, setUnitName] =
    useState("");

  const [unitAbbreviation, setUnitAbbreviation] =
    useState("");

  const [conversionValue, setConversionValue] =
    useState("");

  const [unitQuantity, setUnitQuantity] =
    useState("");

  const [unitBuyingPrice, setUnitBuyingPrice] =
    useState("");

  const [unitSellingPrice, setUnitSellingPrice] =
    useState("");

  const [units, setUnits] =
    useState<ProductUnit[]>([]);

  /*
   * Variant
   */
  const [variantName, setVariantName] =
    useState("");

  const [variantSku, setVariantSku] =
    useState("");

  const [variantConversion, setVariantConversion] =
    useState("");

  const [variantStock, setVariantStock] =
    useState("");

  const [variantBuyingPrice, setVariantBuyingPrice] =
    useState("");

  const [variantSellingPrice, setVariantSellingPrice] =
    useState("");

  const [variants, setVariants] =
    useState<ProductVariant[]>([]);

  /*
   * Bundle
   */
  const [componentProductId, setComponentProductId] =
    useState("");

  const [componentQuantity, setComponentQuantity] =
    useState("1");

  const [components, setComponents] =
    useState<BundleComponent[]>([]);

  /*
   * Load products
   */
  useEffect(() => {
    const savedProducts =
      localStorage.getItem(STORAGE_KEY);

    if (!savedProducts) {
      return;
    }

    try {
      setProducts(JSON.parse(savedProducts));
    } catch {
      console.error(
        "Unable to read saved products."
      );
    }
  }, []);

  /*
   * Save products
   */
  const saveProducts = (
    updatedProducts: Product[]
  ) => {
    setProducts(updatedProducts);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );
  };

  /*
   * Add conversion unit
   */
  const addUnit = () => {
    const conversion =
      Number(conversionValue);

    const quantity =
      Number(unitQuantity);

    const buying =
      Number(unitBuyingPrice);

    const selling =
      Number(unitSellingPrice);

    if (!unitName.trim()) {
      alert("Enter the unit name.");
      return;
    }

    if (
      !Number.isFinite(conversion) ||
      conversion <= 0
    ) {
      alert(
        "Enter a valid conversion value."
      );
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      alert(
        "Enter a valid stock quantity."
      );
      return;
    }

    if (
      !Number.isFinite(buying) ||
      buying < 0
    ) {
      alert(
        "Enter a valid buying price."
      );
      return;
    }

    if (selling < buying) {
      alert(
        "Selling price cannot be below cost price."
      );
      return;
    }

    const newUnit: ProductUnit = {
      id: crypto.randomUUID(),
      name: unitName.trim(),
      abbreviation:
        unitAbbreviation.trim(),
      conversionToBase: conversion,
      quantity,
      buyingPrice: buying,
      sellingPrice: selling,
      sellable: true,
    };

    setUnits((current) => [
      ...current,
      newUnit,
    ]);

    setUnitName("");
    setUnitAbbreviation("");
    setConversionValue("");
    setUnitQuantity("");
    setUnitBuyingPrice("");
    setUnitSellingPrice("");
  };

  /*
   * Add variant
   */
  const addVariant = () => {
    const conversion =
      Number(variantConversion);

    const stock =
      Number(variantStock);

    const buying =
      Number(variantBuyingPrice);

    const selling =
      Number(variantSellingPrice);

    if (!variantName.trim()) {
      alert("Enter the variant name.");
      return;
    }

    if (
      !Number.isFinite(conversion) ||
      conversion <= 0
    ) {
      alert(
        "Enter a valid conversion value."
      );
      return;
    }

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      alert(
        "Enter a valid stock quantity."
      );
      return;
    }

    if (selling < buying) {
      alert(
        "Selling price cannot be below cost price."
      );
      return;
    }

    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      name: variantName.trim(),
      sku: variantSku.trim(),
      conversionToBase: conversion,
      stock,
      buyingPrice: buying,
      sellingPrice: selling,
      sellable: true,
    };

    setVariants((current) => [
      ...current,
      newVariant,
    ]);

    setVariantName("");
    setVariantSku("");
    setVariantConversion("");
    setVariantStock("");
    setVariantBuyingPrice("");
    setVariantSellingPrice("");
  };

  /*
   * Add bundle component
   */
  const addComponent = () => {
    const product =
      products.find(
        (item) =>
          item.id.toString() ===
          componentProductId
      );

    const quantity =
      Number(componentQuantity);

    if (!product) {
      alert(
        "Select a component product."
      );
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      alert(
        "Enter a valid component quantity."
      );
      return;
    }

    setComponents((current) => [
      ...current,
      {
        productId: product.id,
        productName: product.name,
        quantity,
      },
    ]);

    setComponentProductId("");
    setComponentQuantity("1");
  };

  /*
   * Remove conversion unit
   */
  const removeUnit = (id: string) => {
    setUnits((current) =>
      current.filter(
        (unit) => unit.id !== id
      )
    );
  };

  /*
   * Remove variant
   */
  const removeVariant = (id: string) => {
    setVariants((current) =>
      current.filter(
        (variant) =>
          variant.id !== id
      )
    );
  };

  /*
   * Remove bundle component
   */
  const removeComponent = (
    productId: number
  ) => {
    setComponents((current) =>
      current.filter(
        (component) =>
          component.productId !==
          productId
      )
    );
  };

  /*
   * Reset form
   */
  const resetForm = () => {
    setName("");
    setCategory("");
    setSku("");
    setInventoryType("simple");
    setBaseUnit("");
    setBuyingPrice("");
    setSellingPrice("");
    setOpeningStock("");
    setLowStock("10");

    setUnitName("");
    setUnitAbbreviation("");
    setConversionValue("");
    setUnitQuantity("");
    setUnitBuyingPrice("");
    setUnitSellingPrice("");
    setUnits([]);

    setVariantName("");
    setVariantSku("");
    setVariantConversion("");
    setVariantStock("");
    setVariantBuyingPrice("");
    setVariantSellingPrice("");
    setVariants([]);

    setComponentProductId("");
    setComponentQuantity("1");
    setComponents([]);
  };

  /*
   * Save product
   */
  const saveProduct = () => {
    const price =
      Number(sellingPrice);

    const cost =
      Number(buyingPrice);

    const stock =
      Number(openingStock);

    const low =
      Number(lowStock);

    if (!name.trim()) {
      alert("Enter the product name.");
      return;
    }

    if (!baseUnit.trim()) {
      alert(
        "Enter the base inventory unit."
      );
      return;
    }

    if (
      !Number.isFinite(cost) ||
      cost < 0
    ) {
      alert(
        "Enter a valid buying price."
      );
      return;
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      alert(
        "Enter a valid selling price."
      );
      return;
    }

    if (price < cost) {
      alert(
        "Selling price cannot be below cost price."
      );
      return;
    }

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      alert(
        "Enter a valid opening stock."
      );
      return;
    }

    if (
      inventoryType === "conversion" &&
      units.length === 0
    ) {
      alert(
        "Add at least one conversion unit."
      );
      return;
    }

    if (
      inventoryType === "variant" &&
      variants.length === 0
    ) {
      alert(
        "Add at least one product variant."
      );
      return;
    }

    if (
      inventoryType === "bundle" &&
      components.length === 0
    ) {
      alert(
        "Add at least one bundle component."
      );
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      sku: sku.trim(),

      inventoryType,

      baseUnit:
        baseUnit.trim(),

      buyingPrice: cost,
      sellingPrice: price,

      stock,
      lowStock: low,

      units,
      variants,
      components,
    };

    saveProducts([
      ...products,
      newProduct,
    ]);

    alert(
      "Product saved successfully."
    );

    resetForm();
    setShowForm(false);
  };

  /*
   * Search
   */
  const filteredProducts =
    useMemo(() => {
      const text =
        search
          .toLowerCase()
          .trim();

      if (!text) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(text) ||
          product.category
            .toLowerCase()
            .includes(text) ||
          product.sku
            .toLowerCase()
            .includes(text)
      );
    }, [products, search]);

  /*
   * Display inventory
   */
  const getStockDisplay = (
    product: Product
  ) => {
    if (
      product.inventoryType ===
      "conversion"
    ) {
      return `${product.stock} ${product.baseUnit}`;
    }

    if (
      product.inventoryType ===
      "variant"
    ) {
      return `${product.variants.length} size(s)`;
    }

    if (
      product.inventoryType ===
      "bundle"
    ) {
      return `${product.components.length} component(s)`;
    }

    return `${product.stock} ${product.baseUnit}`;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="text-sm text-gray-500">
            Manage products, units, sizes,
            bundles and inventory conventions.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            }

            setShowForm(
              !showForm
            );
          }}
          className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-green-700"
        >
          {showForm
            ? "Close Form"
            : "+ Add Product"}
        </button>

      </div>

      {/* Add Product */}
      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Add New Product
          </h2>

          {/* Basic information */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Product Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="e.g. Vegetable Oil"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Category
              </label>

              <input
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                placeholder="e.g. Food"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                SKU / Barcode
              </label>

              <input
                value={sku}
                onChange={(e) =>
                  setSku(
                    e.target.value
                  )
                }
                placeholder="Enter barcode"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Inventory Type
              </label>

              <select
                value={inventoryType}
                onChange={(e) =>
                  setInventoryType(
                    e.target
                      .value as InventoryType
                  )
                }
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
              >
                <option value="simple">
                  Simple Product
                </option>

                <option value="conversion">
                  Unit Conversion
                </option>

                <option value="variant">
                  Different Sizes
                </option>

                <option value="bundle">
                  Bundle / Assembly
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Base Inventory Unit
              </label>

              <input
                value={baseUnit}
                onChange={(e) =>
                  setBaseUnit(
                    e.target.value
                  )
                }
                placeholder="e.g. litre, kg, piece, sachet"
                className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
              />
            </div>

          </div>

          {/* Prices */}
          <div className="mt-6 border-t pt-5">

            <h3 className="mb-4 font-semibold text-gray-900">
              Base Price & Stock
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Buying Price (₦)
                </label>

                <input
                  type="number"
                  min="0"
                  value={buyingPrice}
                  onChange={(e) =>
                    setBuyingPrice(
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full rounded-lg border px-4 py-3 text-gray-900 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Selling Price (₦)
                </label>

                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) =>
                    setSellingPrice(
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full rounded-lg border px-4 py-3 text-gray-900 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Opening Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={openingStock}
                  onChange={(e) =>
                    setOpeningStock(
                      e.target.value
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-lg border px-4 py-3 text-gray-900 outline-none focus:border-green-600"
                />
              </div>

            </div>

            <div className="mt-4 max-w-md">

              <label className="mb-1 block text-sm font-semibold text-gray-900">
                Low Stock Alert
              </label>

              <input
                type="number"
                min="0"
                value={lowStock}
                onChange={(e) =>
                  setLowStock(
                    e.target.value
                  )
                }
                placeholder="10"
                className="w-full rounded-lg border px-4 py-3 text-gray-900 outline-none focus:border-green-600"
              />

            </div>

          </div>

          {/* Conversion */}
          {inventoryType ===
            "conversion" && (
            <div className="mt-6 rounded-xl border bg-gray-50 p-5">

              <h3 className="font-semibold text-gray-900">
                Unit Conversions
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Define how each selling unit
                relates to the base unit.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-6">

                <input
                  value={unitName}
                  onChange={(e) =>
                    setUnitName(
                      e.target.value
                    )
                  }
                  placeholder="Unit name"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  value={unitAbbreviation}
                  onChange={(e) =>
                    setUnitAbbreviation(
                      e.target.value
                    )
                  }
                  placeholder="Short name"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={conversionValue}
                  onChange={(e) =>
                    setConversionValue(
                      e.target.value
                    )
                  }
                  placeholder="Base units"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={unitQuantity}
                  onChange={(e) =>
                    setUnitQuantity(
                      e.target.value
                    )
                  }
                  placeholder="Stock"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={unitBuyingPrice}
                  onChange={(e) =>
                    setUnitBuyingPrice(
                      e.target.value
                    )
                  }
                  placeholder="Cost ₦"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={unitSellingPrice}
                  onChange={(e) =>
                    setUnitSellingPrice(
                      e.target.value
                    )
                  }
                  placeholder="Sell ₦"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

              </div>

              <button
                type="button"
                onClick={addUnit}
                className="mt-3 rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white"
              >
                + Add Unit
              </button>

              {units.length > 0 && (
                <div className="mt-4 overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead>
                      <tr className="border-b text-left">
                        <th className="p-2">
                          Unit
                        </th>

                        <th className="p-2">
                          Equals
                        </th>

                        <th className="p-2">
                          Stock
                        </th>

                        <th className="p-2">
                          Sell
                        </th>

                        <th className="p-2">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {units.map(
                        (unit) => (
                          <tr
                            key={unit.id}
                            className="border-b"
                          >
                            <td className="p-2 font-semibold">
                              {unit.name}
                            </td>

                            <td className="p-2">
                              {unit.conversionToBase}{" "}
                              {baseUnit}
                            </td>

                            <td className="p-2">
                              {unit.quantity}
                            </td>

                            <td className="p-2">
                              ₦
                              {unit.sellingPrice.toLocaleString()}
                            </td>

                            <td className="p-2">
                              <button
                                type="button"
                                onClick={() =>
                                  removeUnit(
                                    unit.id
                                  )
                                }
                                className="text-red-600"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

          {/* Variants */}
          {inventoryType ===
            "variant" && (
            <div className="mt-6 rounded-xl border bg-gray-50 p-5">

              <h3 className="font-semibold text-gray-900">
                Product Sizes / Variants
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Use this when the same product
                has different physical sizes.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">

                <input
                  value={variantName}
                  onChange={(e) =>
                    setVariantName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Small Keg"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  value={variantSku}
                  onChange={(e) =>
                    setVariantSku(
                      e.target.value
                    )
                  }
                  placeholder="SKU"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={variantConversion}
                  onChange={(e) =>
                    setVariantConversion(
                      e.target.value
                    )
                  }
                  placeholder={`Base ${baseUnit || "units"}`}
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={variantStock}
                  onChange={(e) =>
                    setVariantStock(
                      e.target.value
                    )
                  }
                  placeholder="Stock"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={variantBuyingPrice}
                  onChange={(e) =>
                    setVariantBuyingPrice(
                      e.target.value
                    )
                  }
                  placeholder="Cost ₦"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

                <input
                  type="number"
                  min="0"
                  value={variantSellingPrice}
                  onChange={(e) =>
                    setVariantSellingPrice(
                      e.target.value
                    )
                  }
                  placeholder="Sell ₦"
                  className="rounded-lg border px-3 py-3 text-gray-900"
                />

              </div>

              <button
                type="button"
                onClick={addVariant}
                className="mt-3 rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white"
              >
                + Add Size
              </button>

              {variants.length > 0 && (
                <div className="mt-4 space-y-2">

                  {variants.map(
                    (variant) => (
                      <div
                        key={variant.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-3"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {variant.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            1 ={" "}
                            {
                              variant.conversionToBase
                            }{" "}
                            {baseUnit}
                            {" • "}
                            Stock:{" "}
                            {
                              variant.stock
                            }
                          </p>
                        </div>

                        <div className="flex items-center gap-4">

                          <span className="font-semibold text-green-700">
                            ₦
                            {variant.sellingPrice.toLocaleString()}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeVariant(
                                variant.id
                              )
                            }
                            className="text-red-600"
                          >
                            Remove
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          )}

          {/* Bundle */}
          {inventoryType ===
            "bundle" && (
            <div className="mt-6 rounded-xl border bg-gray-50 p-5">

              <h3 className="font-semibold text-gray-900">
                Bundle / Assembly
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Define the products required to
                make one complete bundle.
              </p>

              {products.length === 0 ? (
                <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                  Save the component products
                  first before creating a
                  bundle.
                </p>
              ) : (
                <>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                    <select
                      value={
                        componentProductId
                      }
                      onChange={(e) =>
                        setComponentProductId(
                          e.target.value
                        )
                      }
                      className="flex-1 rounded-lg border px-3 py-3 text-gray-900"
                    >
                      <option value="">
                        Select component
                      </option>

                      {products.map(
                        (product) => (
                          <option
                            key={
                              product.id
                            }
                            value={
                              product.id
                            }
                          >
                            {product.name}
                          </option>
                        )
                      )}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={
                        componentQuantity
                      }
                      onChange={(e) =>
                        setComponentQuantity(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border px-3 py-3 text-gray-900 sm:w-32"
                    />

                    <button
                      type="button"
                      onClick={
                        addComponent
                      }
                      className="rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white"
                    >
                      + Add
                    </button>

                  </div>

                  {components.length >
                    0 && (
                    <div className="mt-4 space-y-2">

                      {components.map(
                        (component) => (
                          <div
                            key={
                              component.productId
                            }
                            className="flex items-center justify-between rounded-lg bg-white p-3"
                          >
                            <span className="font-semibold text-gray-900">
                              {
                                component.productName
                              }{" "}
                              ×{" "}
                              {
                                component.quantity
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeComponent(
                                  component.productId
                                )
                              }
                              className="text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}

                    </div>
                  )}

                </>
              )}

            </div>
          )}

          {/* Save */}
          <div className="mt-6 flex justify-end">

            <button
              type="button"
              onClick={saveProduct}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Save Product
            </button>

          </div>

        </div>
      )}

      {/* Search */}
      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">

        <input
          type="search"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search products..."
          className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
        />

      </div>

      {/* Products */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="border-b bg-gray-50 text-sm">

              <tr>

                <th className="px-4 py-4">
                  Product
                </th>

                <th className="px-4 py-4">
                  Category
                </th>

                <th className="px-4 py-4">
                  Type
                </th>

                <th className="px-4 py-4">
                  Selling Price
                </th>

                <th className="px-4 py-4">
                  Stock
                </th>

                <th className="px-4 py-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length ===
              0 ? (
                <tr>

                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No products yet.
                  </td>

                </tr>
              ) : (
                filteredProducts.map(
                  (product) => {

                    const isLow =
                      product.stock <=
                      product.lowStock;

                    return (
                      <tr
                        key={
                          product.id
                        }
                        className="border-b text-sm"
                      >

                        <td className="px-4 py-4">

                          <p className="font-semibold text-gray-900">
                            {
                              product.name
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            {
                              product.sku ||
                              "No SKU"
                            }
                          </p>

                        </td>

                        <td className="px-4 py-4 text-gray-700">
                          {
                            product.category ||
                            "—"
                          }
                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                            {
                              product.inventoryType
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4 font-semibold text-green-700">
                          ₦
                          {product.sellingPrice.toLocaleString()}
                        </td>

                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {getStockDisplay(
                            product
                          )}
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isLow
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isLow
                              ? "Low Stock"
                              : "In Stock"}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}