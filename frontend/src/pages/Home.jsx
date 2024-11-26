import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ProfileLink from "../components/ProfileLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["foods"],
    queryFn: fetchFoods,
  });

  const handleSearchClick = () => {
    refetch();
  };

  async function fetchFoods() {
    const response = await fetch(`${baseUrl}/foods?search=${searchQuery}`);
    return response.json();
  }
  useEffect(() => {
    if (location.pathname === "/") {
      setSearchQuery("");
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [location]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="m-auto mb-8 mt-4 flex w-full max-w-sm space-x-2">
        <Input
          type="email"
          placeholder="Search"
          className="rounded-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button className="h-10 w-10 rounded-full" onClick={handleSearchClick}>
          <FaSearch />
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {isLoading
          ? Array(6)
              .fill()
              .map((_, index) => (
                <Card className="overflow-hidden" key={index}>
                  <div>
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <CardContent className="mt-4 flex justify-between">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </CardFooter>
                  </div>
                </Card>
              ))
          : data.map((food) => (
              <Card className="overflow-hidden" key={food._id}>
                <Link to={`/foods/${food._id}`}>
                  <img
                    src={food?.image?.url}
                    className="aspect-video w-full object-cover"
                  />
                </Link>

                <CardContent className="mt-4 flex justify-between">
                  <Link to={`/foods/${food._id}`}>
                    <p>{food?.name}</p>
                  </Link>
                  <p>PHP {food?.price}</p>
                </CardContent>
                <CardFooter>
                  <ProfileLink user={food?.userId} />
                </CardFooter>
              </Card>
            ))}
      </div>
    </>
  );
}

export default Home;
