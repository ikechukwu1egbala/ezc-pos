"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "New Sale",
      path: "/sales",
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Inventory",
      path: "/inventory",
    },
    {
      name: "Customers",
      path: "/customers",
    },
    {
      name: "Expenses",
      path: "/expenses",
    },
    {
      name: "Sales History",
      path: "/sales/history",
    },
    {
      name: "Reports",
      path: "/reports",
    },
  ];

  const handleNavigation = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-green-600 px-3 py-2 text-xl text-white shadow-md md:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white shadow-md transition-transform duration-200 ${
          open
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-start justify-between border-b px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-green-700">
              EZC POS
            </h1>

            <p className="text-sm text-gray-500">
              EZECHIKECHI GLOBAL ENTERPRISE
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-xl text-gray-500 md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>

        </div>

        {/* Navigation */}
        <nav className="p-4">

          {menuItems.map((item) => {
            const active =
              pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() =>
                  handleNavigation(item.path)
                }
                className={`mb-2 w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            );
          })}

        </nav>
      </aside>
    </>
  );
}