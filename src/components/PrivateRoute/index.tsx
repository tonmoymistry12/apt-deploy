import { useRouter } from "next/router";
import { useEffect, ReactNode, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false); // Start with false
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check authentication from session storage
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const userData = sessionStorage.getItem('userData');

    if (!isAuthenticated || !userData) {
      router.push("/signin");
    } else {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default PrivateRoute;
