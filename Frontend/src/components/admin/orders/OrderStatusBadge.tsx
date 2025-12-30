interface Props {
  status: "pending" | "completed" | "cancelled";
}

function OrderStatusBadge({ status }: Props) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`rounded px-2 py-1 text-xs ${map[status]}`}>{status}</span>
  );
}

export default OrderStatusBadge;
