import { useQuery } from "react-query";
import { request } from "utils/axios-utils";

// const { isLoading, data, isError, error, refetch } = useSuperHeroesData(
//     onSuccess,
//     onError
//   )

// const queryObjExample = {
//   //select is used  to transform data
//   select: (data) => {
//     const superHeroNames = data.data.map((hero) => hero.name);
//     return superHeroNames;
//   },
//   onSuccess: () => {},
//   onError: () => {},
//   enabled: true || false, //used to not call on load,
//   keepPreviousData: true, // for pagination
// };

export const useCustomQuery = (
  queryKey,
  requestObj = { url: "", method: "get", data: {} },
  queryObj = {}
) => {
  return useQuery(
    queryKey,
    () => request({ ...requestObj, avoidCancelling: true }),
    {
      ...queryObj,
    }
  );
};

// export const useQueries = (queries) => {
//   return useQueries({
//     queries:queries.map((query) => {
//       return {
//         queryKey:query.queryKey,
//         queryFn:() =>  request({ ...query.requestObj }),
//         ...query
//       }
//     })
//   })
// }
