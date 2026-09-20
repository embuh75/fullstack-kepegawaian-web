import { useMutation, useQuery } from "@tanstack/react-query";
import { login, me } from "../api/auth";

export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
    onError: (err) => {
      err.message = err.response?.data?.errors;
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
  };
};

export const useMe = () => {
  const meQuery = useQuery({
    queryKey: ["ME"],
    queryFn: me,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading: meQuery.isLoading,
    isError: meQuery.isError,
    error: meQuery.error,
    user: meQuery.data?.user,
  };
};
