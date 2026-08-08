"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();

    setError("");

    // Temporary development login.
    // Django authentication will replace this later.
    if (username === "admin" && password === "1234") {
      localStorage.setItem(
        "ezc-user",
        JSON.stringify({
          id: 1,
          username: "admin",
          name: "EZC Administrator",
          role: "ADMIN",
          branchId: 1,
          branchName: "Main Branch",
        })
      );

      router.push("/");
      return;
    }

    if (username === "cashier" && password === "1234") {
      localStorage.setItem(
        "ezc-user",
        JSON.stringify({
          id: 2,
          username: "cashier",
          name: "EZC Cashier",
          role: "CASHIER",
          branchId: 1,
          branchName: "Main Branch",
        })
      );

      router.push("/");
      return;
    }

    if (
      username === "inventory" &&
      password === "1234"
    ) {
      localStorage.setItem(
        "ezc-user",
        JSON.stringify({
          id: 3,
          username: "inventory",
          name: "EZC Inventory Officer",
          role: "INVENTORY_OFFICER",
          branchId: 1,
          branchName: "Main Branch",
        })
      );

      router.push("/");
      return;
    }

    setError("Invalid username or password.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            EZC POS
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              autoComplete="username"
              className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600"
            />

          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
          >
            Sign In
          </button>

        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-gray-600">

          <p className="font-semibold text-gray-900">
            Development accounts
          </p>

          <p className="mt-2">
            Admin: admin / 1234
          </p>

          <p>
            Cashier: cashier / 1234
          </p>

          <p>
            Inventory: inventory / 1234
          </p>

        </div>

      </div>

    </main>
  );
}