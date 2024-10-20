import { useQuery } from "@tanstack/react-query";
import { getUser } from "../actions/getUser";

export const useGetUser = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser({ userId }),
  });
};
