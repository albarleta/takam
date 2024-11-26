import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";

function ProfileLink({ user }) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={user} />
      <Link to={`/profile/${user?.username}`} className="flex underline">
        <p>
          {user?.firstName} {user?.lastName}
        </p>
      </Link>
    </div>
  );
}

export default ProfileLink;
