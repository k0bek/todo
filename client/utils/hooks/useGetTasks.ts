import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../actions/getTasks";

export const useGetTasks = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks({ userId }),
  });
};
