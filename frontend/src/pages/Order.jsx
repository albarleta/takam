const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useAuthStore from "../store/authStore";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Order() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await fetch(`${baseUrl}/orders/users/${user?.username}`);
      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      getOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [user?.username]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-tertiary">
        Your Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="space-y-4 rounded-lg bg-white p-6 shadow-md"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-gray-500">Order #{order._id}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
                <span className="font-semibold">PHP {order.total}</span>
              </div>
            </div>

            <ul className="divide-y">
              {order.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                      <img
                        src={item.foodId.image.url}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <Link to={`/foods/${item.foodId._id}`}>
                        <p className="font-medium">{item.foodId.name}</p>
                      </Link>
                      <Link to={`/profile/${item.foodId.userId.username}`}>
                        <p className="text-sm text-gray-500">
                          By:{" "}
                          <span className="underline">
                            @{item.foodId.userId.username}
                          </span>
                        </p>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">
                    PHP {(item.foodId.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-end space-x-4 pt-4">
              {/* <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                View Details
              </button> */}
              <button
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-blue-800"
                onClick={() => handleDeleteOrder(order._id)}
              >
                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order;
