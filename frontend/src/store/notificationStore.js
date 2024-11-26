const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { create } from "zustand";
import useAuthStore from "./authStore";

const useNotificationStore = create((set) => ({
  cartItemCount: 0,
  updateCartItemCount: async () => {
    await useNotificationStore.getState().fetchCartItems();
  },

  fetchCartItems: async () => {
    try {
      const user = await useAuthStore.getState().user;
      if (!user) return;
      const res = await fetch(`${baseUrl}/cart/users/${user?.username}`);
      if (res.ok) {
        const data = await res.json();
        set(() => ({ cartItemCount: data.length }));
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  },
}));

export default useNotificationStore;
