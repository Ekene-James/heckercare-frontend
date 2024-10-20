import { useMutation, useQueryClient } from "react-query";
import { request } from "utils/axios-utils";

export const useOptimisticUpdate = (
  requestObj = { url: "", method: "post", data: {} },
  queryObj = { queryKey: "" }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await request({ ...requestObj }),
    /**Optimistic Update Start */
    onMutate: async (newData) => {
      await queryClient.cancelQueries(queryObj.queryKey);
      const previousData = queryClient.getQueryData(queryObj.queryKey);

      queryClient.setQueryData(queryObj.queryKey, (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [
            ...oldQueryData.data,
            { id: oldQueryData?.data?.length + 1, ...newData },
          ],
        };
      });

      return { previousData };
    },
    onError: (_err, _newData, context) => {
      queryClient.setQueryData(queryObj.queryKey, context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryObj.queryKey);
    },
    /**Optimistic Update End */
  });
};
export const useCustomMutation = (
  requestObj = { url: "", method: "post", data: {} },
  queryObj = {}
) => {
  return useMutation({
    mutationFn: async (mutationData) => {
      return await request({
        ...requestObj,
        data: requestObj?.data
          ? requestObj.data
          : !mutationData || !!mutationData?._reactName
          ? null
          : mutationData, //this is used to check if data is passed through the mutation function when called or through the request object when called
      });
    },
    ...queryObj,
  });
};
