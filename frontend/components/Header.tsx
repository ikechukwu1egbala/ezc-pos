interface HeaderProps {
  activePage: string;
}

export default function Header({
  activePage,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-5 py-4 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">
          {activePage}
        </h2>

        <p className="text-sm text-gray-500">
          EZC Point of Sale System
        </p>
      </div>

      <div className="text-right">
        <p className="font-medium">
          Main Branch
        </p>

        <p className="text-xs text-gray-500">
          Administrator
        </p>
      </div>
    </header>
  );
}