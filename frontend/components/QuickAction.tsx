interface QuickActionProps {
  title: string;
  onClick: () => void;
}

export default function QuickAction({
  title,
  onClick,
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border px-4 py-4 text-left font-medium transition hover:bg-gray-50"
    >
      {title}
    </button>
  );
}