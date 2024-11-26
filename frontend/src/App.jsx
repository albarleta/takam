import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuthStore from "./store/authStore";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Food from "./pages/Food";
import PageNotFound from "./pages/PageNotFound";
import PostForm from "./components/PostForm";
import PostEditForm from "./components/PostEditForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Order from "./pages/Order";
import Cart from "./pages/Cart";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const checkAndSetUserFromToken = useAuthStore(
    (state) => state.checkAndSetUserFromToken,
  );

  useEffect(() => {
    checkAndSetUserFromToken();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route path="/profile/:username" element={<Profile />} />

            <Route
              path="/foods/create"
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/foods/:id/edit"
              element={
                <ProtectedRoute>
                  <PostEditForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/users/:username"
              element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              }
            />

            <Route path="/foods/:id" element={<Food />} />
            <Route path="/cart/users/:username" element={<Cart />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
