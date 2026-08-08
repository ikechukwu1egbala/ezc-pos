"use client";

export default function DashboardPage() {
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
          value="0"
          description="Products in inventory"
        />

        <DashboardCard
          title="Low Stock"
          value="0"
          description="Products needing attention"
        />

      </div>

      {/* Main Sections */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">

        {/* Recent Sales */}
        <section className="rounded-xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Sales
            </h2>

            <button className="text-sm font-semibold text-green-700">
              View All
            </button>
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

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Low Stock
            </h2>

            <button className="text-sm font-semibold text-green-700">
              View Inventory
            </button>
          </div>

          <div className="py-10 text-center text-gray-500">
            <p className="font-medium">
              No low-stock products
            </p>

            <p className="mt-1 text-sm">
              Products requiring restocking will appear here.
            </p>
          </div>

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