const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProfileLink from "../components/ProfileLink";
import UserAvatar from "../components/UserAvatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdEdit } from "react-icons/md";
import useAuthStore from "../store/authStore";

function Profile() {
  const { setUser: setAuthUser, user: authUser } = useAuthStore();
  const { username: urlUsername } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
  });

  useEffect(() => {
    if (profileUser) {
      setFormData({
        username: profileUser.username,
        name: `${profileUser.firstName} ${profileUser.lastName}`,
      });
    }
  }, [profileUser]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${baseUrl}/users/${urlUsername}`);
        const data = await res.json();

        if (!res.ok) {
          navigate("/404");
          return;
        }

        setProfileUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/404");
      }
    };

    fetchUser();
  }, [urlUsername]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(`${baseUrl}/users/${urlUsername}/foods`);
        const data = await res.json();

        if (!res.ok) {
          return;
        }

        setFoods(data.foods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, [urlUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(" ");
      const lastName = lastNameParts.join(" ");

      const res = await fetch(`${baseUrl}/users/${urlUsername}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username: formData.username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update both states with the new user data
      setAuthUser({
        ...authUser,
        ...data.user,
      });

      setProfileUser(data.user);
      setIsOpen(false);
      toast.success("Profile updated successfully");

      if (data.user.username !== urlUsername) {
        navigate(`/profile/${data.user.username}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isOwnProfile = authUser?.userId === profileUser?._id;

  return (
    <div className="mt-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-tertiary">
        {`${profileUser?.firstName}'s Profile`}
      </h1>
      <div className="flex flex-col justify-center gap-6 md:flex-row">
        <Card className="p-6 md:self-start">
          <CardHeader className="flex items-center justify-center">
            <UserAvatar className="h-20 w-20 text-2xl" user={profileUser} />
            <CardTitle className="text-center">
              {profileUser?.firstName} {profileUser?.lastName}
            </CardTitle>
            <CardDescription>@{profileUser?.username}</CardDescription>
          </CardHeader>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              {isOwnProfile && (
                <Button variant="outline" className="flex justify-self-center">
                  <MdEdit /> Edit Profile
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      className="col-span-3"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      className="col-span-3"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Card>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {foods.map((food) => (
            <Card key={food._id} className="overflow-hidden">
              <Link to={`/foods/${food._id}`}>
                <img
                  src={food?.image?.url}
                  alt={food.name}
                  className="aspect-video w-full object-cover"
                />
              </Link>
              <CardContent className="mt-4">
                <Link to={`/foods/${food._id}`}>
                  <p>{food.name}</p>
                </Link>
              </CardContent>
              <CardFooter>
                <ProfileLink user={profileUser} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
