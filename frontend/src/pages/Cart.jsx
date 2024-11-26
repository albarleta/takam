const baseUrl = import.meta.env.VITE_API_BASE_URL;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useAuthStore from "../store/authStore.js";
import useNotificationStore from "../store/notificationStore.js";
import { MdDelete } from "react-icons/md";

function Cart() {
  const { username } = useParams();
  const { user } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [totalCartValue, setTotalCartValue] = useState(0);
  const { updateCartItemCount } = useNotificationStore();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await fetch(`${baseUrl}/cart/users/${username}`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch cart items");
        }

        const data = await response.json();
        const itemsWithTotalPrice = data.map((item) => ({
          ...item,
          totalPrice: item.foodId.price * item.quantity,
        }));

        setCartItems(itemsWithTotalPrice);
        updateTotalCartValue(itemsWithTotalPrice);
      } catch (error) {
        console.error("Fetching cart items:", error);
      }
    };

    getCartItems();
  }, [username]);

  const updateTotalCartValue = (items) => {
    const totalValue = items.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );
    setTotalCartValue(totalValue.toFixed(2));
  };

  const handleIncrement = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item._id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.foodId.price * (item.quantity + 1),
            }
          : item,
      );
      updateTotalCartValue(updatedItems);
      return updatedItems;
    });
  };

  const handleDecrement = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item._id === itemId && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: item.foodId.price * (item.quantity - 1),
            }
          : item,
      );
      updateTotalCartValue(updatedItems);
      return updatedItems;
    });
  };

  const handleRemove = async (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemId),
    );

    try {
      const response = await fetch(`${baseUrl}/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        // Revert the optimistic update if the API call fails
        const updatedCartResponse = await fetch(`${baseUrl}/cart`);
        const updatedCart = await updatedCartResponse.json();
        setCartItems(updatedCart);

        throw new Error(error.message || "Failed to delete item");
      }

      // Update the cart item count in the notification store
      updateCartItemCount(cartItems.length - 1);

      toast("Item deleted", {
        description: "The item has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast("Error", {
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = async () => {
    const order = {
      userId: user?.userId,
      items: cartItems,
      total: totalCartValue,
    };

    try {
      const response = await fetch(`${baseUrl}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      await response.json();

      await handleDeleteCartItems();
      toast("Your order has been successfully placed! ");
    } catch (error) {
      console.error("Error creating order", error);
    }
  };

  const handleDeleteCartItems = async () => {
    try {
      const response = await fetch(`${baseUrl}/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await response.json();

      setCartItems([]);
    } catch (error) {
      console.error("Error deleting cart items", error);
    }
  };

  useEffect(() => {
    updateTotalCartValue(cartItems);
  }, [cartItems]);

  useEffect(() => {
    updateCartItemCount();
  }, [cartItems]);

  return (
    <div className="mt-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-tertiary">
        Your Cart
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>FOOD</TableHead>
            <TableHead className="">QUANTITY</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="flex items-center gap-4 font-medium">
                <Link to={`/foods/${item.foodId._id}`}>
                  <img
                    src={item.foodId.image.url}
                    alt={item.foodId.name}
                    className="h-10 w-10 object-cover"
                  />
                </Link>
                <div>
                  <Link to={`/foods/${item.foodId._id}`}>
                    <p>{item.foodId.name}</p>
                  </Link>
                  <Link to={`/profile/${item.foodId.userId.username}`}>
                    <div className="flex gap-1">
                      <small>By:</small>
                      <small className="underline">
                        {item.foodId.userId.firstName}{" "}
                        {item.foodId.userId.lastName}
                      </small>
                    </div>
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center gap-6">
                  <div className="inline-flex rounded-md p-1 outline outline-1 outline-gray-200">
                    <button
                      className="h-7 w-7"
                      onClick={() => handleDecrement(item._id)}
                    >
                      -
                    </button>
                    <p className="flex h-7 w-7 items-center justify-center">
                      {item.quantity}
                    </p>
                    <button
                      className="h-7 w-7"
                      onClick={() => handleIncrement(item._id)}
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => handleRemove(item._id)}>
                    <MdDelete className="text-lg text-red-600" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                PHP {item.totalPrice.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-end gap-6 text-right text-xl font-medium">
        <p>Total: PHP {totalCartValue}</p>
        <Button onClick={handleCheckout} disabled={cartItems.length === 0}>
          Checkout
        </Button>
      </div>

      <div className="text-center"></div>
    </div>
  );
}

export default Cart;
