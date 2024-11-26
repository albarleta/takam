const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import useNotificationStore from "../store/notificationStore";

import ProfileLink from "../components/ProfileLink";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { FaCartShopping } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";

function Food() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { updateCartItemCount } = useNotificationStore();
  const [quantity, setQuantity] = useState(0);
  const [comment, setComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["food", id],
    queryFn: () => fetchFood(id),
  });

  if (isLoading)
    return (
      <div className="mt-8 flex justify-center">
        <div className="flex flex-col justify-center gap-6 md:flex-row">
          {/* Main Food Card */}
          <Card className="max-w-md self-start overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="mt-4 flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="space-x-2">
                <Skeleton className="inline-block h-10 w-24" />
                <Skeleton className="inline-block h-10 w-24" />
              </div>
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-6">
            {/* Description Card */}
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-gray-300">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter className="flex flex-col gap-6">
                <div className="flex w-full items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-4" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full rounded-full" />
              </CardFooter>
            </Card>

            {/* Comments Card */}
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-gray-300">Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardContent className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </CardContent>
              <CardFooter>
                <ul className="flex w-full flex-col gap-4">
                  {[1, 2, 3].map((index) => (
                    <li key={index} className="w-full">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="ml-12 mt-2">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const food = data.foodItem;
  const total = food.price * quantity;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  async function fetchFood(id) {
    const response = await fetch(`${baseUrl}/foods/${id}`);
    return response.json();
  }

  const handleAddToCart = async () => {
    if (!quantity) return;

    const cartItem = {
      userId: user.userId,
      foodId: id,
      quantity,
      total,
    };

    try {
      const response = await fetch(`${baseUrl}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      await response.json();
      updateCartItemCount();
      toast("Food successfully added to your cart!");
    } catch (error) {
      console.error("Error adding item to cart", error);
    }
  };

  const handleAddComment = async () => {
    if (!comment) return;
    setIsAddingComment(true);

    try {
      const response = await fetch(`${baseUrl}/foods/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, userId: user.userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }

      await response.json();
      queryClient.invalidateQueries(["food", id]);
      setComment("");
    } catch (error) {
      toast.error(`Error adding comment: ${error.message}`);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${baseUrl}/foods/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.statusText}`);
      }

      await response.json();
      queryClient.invalidateQueries(["food", id]);
    } catch (error) {
      toast.error(`Error deleting comment: ${error.message}`);
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      const response = await fetch(`${baseUrl}/foods/${foodId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete food");
      }

      await response.json();
      toast("Post Deleted Successfully!", {
        description: "The post has been deleted and is no longer available.",
      });
      navigate("/");
    } catch (error) {
      toast.error(`Error deleting food: ${error.message}`);
    }
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex flex-col justify-center gap-6 md:flex-row">
        <Card className="max-w-md self-start overflow-hidden">
          <img
            src={food?.image?.url}
            className="aspect-video w-full object-cover"
          />
          <CardContent className="mt-4 flex justify-between">
            <p>{food.name}</p>
            <p>PHP {food.price}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <ProfileLink user={food.userId} />

            {user && user.userId === food.userId._id && (
              <div className="space-x-2">
                <Link to={`/foods/${food._id}/edit`}>
                  <Button>
                    <MdEdit /> Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <MdDelete />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteFood(food._id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{food.description}</p>
            </CardContent>
            {user && (
              <CardFooter className="flex flex-col gap-6">
                <div className="flex w-full items-center justify-between">
                  <p className="font-bold">Quantity:</p>
                  <div className="flex items-center gap-4">
                    <Button
                      className="rounded-full"
                      onClick={() => setQuantity((s) => Math.max(0, s - 1))}
                    >
                      -
                    </Button>
                    <p className="w-4 text-center text-tertiary">{quantity}</p>
                    <Button
                      className="rounded-full"
                      onClick={() => setQuantity((s) => s + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full max-w-md rounded-full bg-accent"
                  onClick={handleAddToCart}
                >
                  <FaCartShopping />
                  Add to cart - (PHP {total})
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!user}
              />
            </CardContent>
            <CardContent className="flex-end flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={!user || isAddingComment}
              >
                {isAddingComment ? "Adding..." : "Comment"}
                <FaLongArrowAltRight />
              </Button>
            </CardContent>

            <CardFooter>
              <ul className="flex flex-col gap-4">
                {food.comments?.map((comment) => (
                  <li key={comment?._id}>
                    <div className="flex items-center gap-2">
                      <ProfileLink user={comment.userId} />
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                      {user && (
                        <span
                          className="ml-4 cursor-pointer font-bold text-red-400"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <MdDelete />
                        </span>
                      )}
                    </div>
                    <p className="ml-12">{comment?.comment}</p>
                  </li>
                ))}
              </ul>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Food;
