import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  accessToken: localStorage.getItem("accessToken") || null,

  login: (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    set({
      accessToken: data.accessToken,
      isAuthenticated: true,
      user: data.user,
    });
  },

  setUser: (userData) => {
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      accessToken: null,
      isAuthenticated: false,
      user: null,
    });
  },

  checkAndSetUserFromToken: () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken) {
          set({ user: decodedToken });
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  },
}));

export default useAuthStore;
