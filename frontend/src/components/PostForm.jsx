const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  description: z.string().min(8, {
    message: "Description must be at least 8 characters long.",
  }),
  price: z.string().min(1, {
    message: "Price must be at least 1.",
  }),
  image: z.any().refine((val) => val && val.length > 0, {
    message: "Please provide a valid photo.",
  }),
});

function PostForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: null,
      price: "",
    },
  });

  const onSubmit = async (values) => {
    setErrorMessage("");

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("userId", user.userId);

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/foods`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();

      setIsLoading(false);

      navigate(`/foods/${data.food._id}`);

      toast("Post Published Successfully!", {
        description:
          "Your content is now live and ready for your audience to see.",
      });
    } catch (err) {
      setErrorMessage(err.message);
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="m-auto mt-8 max-w-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-tertiary">
        Create a post
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8 rounded-lg bg-primary p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl className="max-w-xs">
                  <Input
                    className="cursor-pointer"
                    placeholder="Image"
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <div className="ml-auto space-x-4">
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button
              type="submit"
              className="ml-auto rounded-full bg-accent px-8 hover:bg-accent"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PostForm;
