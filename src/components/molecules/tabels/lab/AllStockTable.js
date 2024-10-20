import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { Stack } from "@mui/system";
import SearchBar from "components/atoms/SearchBar";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_ALL_STOCKS } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import Pagination from "components/molecules/pagination/Pagination";

const Row = ({ row, i }) => {
  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left">{i + 1}</TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.itemName}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.unitOfItem}
      </TableCell>

      {row.totalQuantity === 0 ? (
        <TableCell align="left" sx={{ color: "red" }}>
          Out of Stock
        </TableCell>
      ) : (
        <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
          {row.totalQuantity}
        </TableCell>
      )}

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {moment(row?.dateLastRestocked).format("M/D/Y")}
      </TableCell>
    </TableRow>
  );
};

export default function AllStockTable({ data, currentPage, handlePageChange }) {
  const [search, setSearch] = React.useState("");

  const queryClient = useQueryClient();
  const {
    isLoading: searchLoading,
    isFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [GET_ALL_STOCKS, search],
    {
      url: `/lab-stock/?search=${search}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [GET_ALL_STOCKS, currentPage],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
      enabled: false,
    }
  );
  return (
    <Stack direction={"column"} sx={{ width: "100%" }} spacing={2}>
      <Stack
        direction={"row"}
        sx={{ width: "100%", justifyContent: "flex-end" }}
      >
        <SearchBar
          refetch={refetchSearch}
          search={search}
          isLoading={searchLoading || isFetching}
          setsearch={setSearch}
        />
      </Stack>
      {data?.labStock?.length ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="all-stock-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "bold" }} />
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Items
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Unit
                  </TableCell>

                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Available Quantity
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Date Last Restocked
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.labStock?.map((row, i) => (
                  <Row key={i} row={row} i={i} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack sx={{ p: { xs: 0, sm: 2 }, width: "90%" }}>
            <Pagination
              currentPage={currentPage}
              totalCount={data?.count || 5}
              pageSize={10}
              onPageChange={handlePageChange}
            />
          </Stack>
        </>
      ) : (
        "No Data Found"
      )}
    </Stack>
  );
}
