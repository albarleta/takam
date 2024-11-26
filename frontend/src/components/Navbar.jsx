const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import useNotificationStore from "../store/notificationStore.js";
import UserAvatar from "./UserAvatar.jsx";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { FaCartShopping } from "react-icons/fa6";
import { IoAddCircle } from "react-icons/io5";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { cartItemCount, updateCartItemCount } = useNotificationStore();
  const prevCartItemCountRef = useRef(cartItemCount);
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      const response = await fetch(`${baseUrl}/auth/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ refreshToken: refreshToken }),
      });

      if (response.ok) {
        console.log("Logged out successfully");
        logout();

        navigate("/");
      } else {
        console.error("Logout failed", await response.text());
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      toast("Successfully Logged Out", {
        description:
          "Thank you for visiting. You've been safely logged out of your account.",
      });
    }
  };

  useEffect(() => {
    if (cartItemCount !== prevCartItemCountRef.current) {
      updateCartItemCount();
    }
  }, [cartItemCount, updateCartItemCount]);

  return (
    <nav className="flex w-full items-center justify-between bg-secondary p-4">
      <Link to="/">
        <p className="text-lg font-bold text-tertiary">TAKAM</p>
      </Link>

      {!isAuthenticated && (
        <div className="space-x-2">
          <Link to="/login">
            <Button className="text-accent hover:no-underline" variant="link">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="rounded-full bg-accent">Sign up</Button>
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          {/* Create Post */}
          <Link to="/foods/create">
            <Button className="h-9 w-9 rounded-full">
              <IoAddCircle />
            </Button>
          </Link>

          {/* Cart */}
          <Link to={`/cart/users/${user?.username}`}>
            <div className="relative">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <FaCartShopping className="text-white" />
              </button>
              {cartItemCount > 0 && (
                <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </div>
              )}
            </div>
          </Link>

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>@{user && user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/profile/${user && user.username}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/orders/users/${user?.username}`}>Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
