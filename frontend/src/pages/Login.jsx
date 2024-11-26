import LoginForm from "../components/LoginForm";
import { useLocation } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const location = useLocation();
  const data = location.state;
  return (
    <div>
      {data && (
        <Alert>
          <AlertTitle>{data.title}</AlertTitle>
          <AlertDescription>{data.message}</AlertDescription>
        </Alert>
      )}

      <div className="m-auto mt-8 max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
