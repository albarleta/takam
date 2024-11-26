const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAuthStore from "../store/authStore.js";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).nonempty(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function LoginForm() {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setErrorMessage("");
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();

      login(data);

      navigate("/");
      toast("Welcome back!", {
        description: "You've successfully logged in to your account.",
      });
    } catch (err) {
      setErrorMessage("Incorrect email or password");
      console.error("Error submitting form:", err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 rounded-lg bg-primary p-4"
      >
        <h2 className="text-center font-bold text-white">Log in</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button
          type="submit"
          className="ml-auto rounded-full bg-accent px-8 hover:bg-accent"
        >
          Continue
        </Button>

        <div className="flex justify-end gap-2 text-sm">
          <p className="text-white">New user?</p>
          <Link to="/signup" className="font-bold text-accent underline">
            Create an account
          </Link>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
