import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../api/userApi";

export const useUserDetails = (userId: string, token: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(userId, token),
    enabled: !!userId,
    initialData: null,
  });
};
