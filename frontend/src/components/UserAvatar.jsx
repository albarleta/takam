import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

function UserAvatar({ user, className }) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(user?.firstName?.[0] + user?.lastName?.[0] || "");
  }, [user]);
  return (
    <Avatar className={className}>
      <AvatarImage />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
