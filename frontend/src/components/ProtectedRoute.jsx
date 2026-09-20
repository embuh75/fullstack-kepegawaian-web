import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../lib/query/useAuthQuery";
import Loading from "./ui/Loading";

export default function ProtectedRoute() {
  const { user, isLoading, isError } = useMe();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
