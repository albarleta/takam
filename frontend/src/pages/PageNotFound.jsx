import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-gray-900">404</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Page not found
          </h2>
          <p className="mt-2 text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
