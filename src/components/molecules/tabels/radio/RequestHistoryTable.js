import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_DEPARTMENT_INVENTORY,
  GET_RADIOLOGY_STOCKS,
  RADIOLOGY_HISTORY,
  RADIOLOGY_STOCK_HISTORY,
} from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import SearchBar from "components/atoms/SearchBar";
import CustomModal from "components/atoms/CustomModal";
// import StatusUpdateModal from "./StatusUpdateModal";

import CustomButton from "components/atoms/CustomButton";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import Pagination from "components/molecules/pagination/Pagination";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row({ row, toggleModal }) {
  const [open, setOpen] = React.useState(false);

  let status;
  if (row.approval === "APPROVED") {
    status = (
      <Stack
        direction="row"
        spacing={1}
        sx={{ color: "blue" }}
        alignItems="center"
      >
        <CheckCircleOutlinedIcon sx={{ fontSize: "18px" }} />
        {row.approval}
      </Stack>
    );
  } else if (row.approval === "FULFILLED") {
    status = (
      <Stack direction="row" spacing={1} sx={{ color: "primary.success" }}>
        <DoneOutlinedIcon sx={{ fontSize: "18px" }} />
        {row.approval}
      </Stack>
    );
  } else if (row.approval === "REJECTED") {
    status = (
      <Stack direction="row" spacing={1} sx={{ color: "primary.error" }}>
        <CloseOutlinedIcon sx={{ fontSize: "18px" }} />
        {row.approval}
      </Stack>
    );
  } else {
    status = (
      <Stack direction="row" spacing={1} sx={{ color: "secondary.main" }}>
        <CheckCircleOutlinedIcon sx={{ fontSize: "18px" }} />
        PENDING
      </Stack>
    );
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{
          // "&:last-child td, &:last-child th": { border: 0 },
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
          {row?.uniqueCode}
        </TableCell>

        <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
          {row?.createdBy?.fullName}
        </TableCell>
        <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
          {status}
        </TableCell>
        <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
          <CustomButton
            text="View"
            color="secondary"
            onClick={() => toggleModal(row)}
            variant="text"
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>

                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Unit Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Requested Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.items?.map((item, i) => (
                    <TableRow key={item?.batchId || i}>
                      <TableCell
                        align="left"
                        scope="row"
                        sx={{ color: "primary.darkGrey" }}
                      >
                        {item?.item?.itemName}
                      </TableCell>

                      <TableCell sx={{ color: "primary.darkGrey" }}>
                        {item?.item?.unitType}
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.darkGrey" }}
                        align="left"
                      >
                        {item?.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const ModalContent = ({ selectedRow, closeModal }) => {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isLoading } = useCustomMutation(
    {
      url: `/radiology-stock/fulfill-approved-order/${selectedRow?.id}`,
      method: "patch",
      data: {
        approval: "FULFILLED",
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(RADIOLOGY_STOCK_HISTORY);
        queryClient.invalidateQueries(RADIOLOGY_HISTORY);
        queryClient.invalidateQueries(GET_RADIOLOGY_STOCKS);
        queryClient.invalidateQueries(GET_ALL_DEPARTMENT_INVENTORY);

        toast.success("Success");
        closeModal();
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );

  return (
    <Stack
      direction={"column"}
      sx={{ width: "100%", overflowY: "hidden", height: "auto" }}
      spacing={3}
    >
      <Stack direction={"column"} sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayMd">Status Update</Typography>
      </Stack>
      <Divider />
      <Stack direction={"row"} alignItems="center" spacing={1}>
        <Typography variant="h6">Requested by: </Typography>{" "}
        <Typography fontSize={"1rem"} textTransform="capitalize">
          {" "}
          {`${selectedRow?.createdBy?.fullName}`}
        </Typography>
      </Stack>
      {selectedRow?.approval === "REJECTED" ? (
        <Stack direction={"row"} alignItems="center" spacing={1}>
          <Typography variant="h6">Reason for decline: </Typography>{" "}
          <Typography fontSize={"1rem"} textTransform="capitalize">
            {" "}
            {`${selectedRow?.reasonForDecline}`}
          </Typography>
        </Stack>
      ) : null}
      <Stack
        direction={"column"}
        sx={{
          width: "100%",
          height: "45vh",

          overflow: "auto",
        }}
        spacing={3}
      >
        {selectedRow?.items?.map((item, i) => (
          <Stack
            xs={12}
            sm={8}
            key={i}
            sx={{ backgroundColor: "background.custom", p: 3 }}
          >
            <Stack direction={"column"} sx={{ width: "100%" }} spacing={1}>
              <Typography variant="heading">
                {`${item?.item?.itemName || ""}`}
              </Typography>
              <Stack>
                <Typography variant="p">
                  <Typography variant="p" fontWeight={"bold"}>
                    Quanity:{" "}
                  </Typography>{" "}
                  {`${item?.quantity}`} pieces
                </Typography>

                <Typography>
                  <Typography variant="p" fontWeight={"bold"}>
                    Note:{" "}
                  </Typography>
                  {`${item?.note || ""}`}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Stack direction={"row"} xs={6} sm={3} spacing={1}>
        <CustomButton
          text="Fulfill"
          color="secondary"
          disabled={
            isLoading ||
            selectedRow?.approval === "FULFILLED" ||
            selectedRow?.approval === "REJECTED" ||
            selectedRow?.approval === "DECLINED"
          }
          onClick={() => {
            updateStatus();
          }}
        />
        <CustomButton
          variant="lightSecondary"
          text="Cancel"
          color="secondary"
          onClick={closeModal}
        />
      </Stack>
    </Stack>
  );
};

export default function RequestHistoryTable({
  data,
  currentPage,
  handlePageChange,
}) {
  const rows = data?.orders;

  const [selectedRow, setSelectedRow] = React.useState(null);

  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);
  const [search, setSearch] = React.useState("");

  const { isLoading: searchLoad, refetch: refetchSearch } = useCustomQuery(
    [RADIOLOGY_STOCK_HISTORY, currentPage, search],
    {
      url: `radiology-stock/order-history`,
      method: "post",
      data: {
        search,
        page: currentPage,
        // departmentType: "RADIOLOGY",
      },
    },
    {
      refetchOnWindowFocus: true,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [RADIOLOGY_STOCK_HISTORY, currentPage],
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

  const toggleModal = (row) => {
    setSelectedRow(row);
    modalRef?.current?.handleToggle();
  };

  return (
    <Stack>
      <Stack
        direction={"row"}
        sx={{ width: "100%", justifyContent: "flex-end" }}
      >
        <SearchBar
          refetch={refetchSearch}
          search={search}
          isLoading={searchLoad}
          setsearch={setSearch}
          placeholder="Search by requester"
        />
      </Stack>
      {rows?.length ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="request-history-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "bold" }} />
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Unique Code
                  </TableCell>

                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Requested By
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <Row key={i} row={row} i={i} toggleModal={toggleModal} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack sx={{ p: { xs: 0, sm: 2 }, width: "100%" }}>
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
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 4,
          // height: "100vh !important",

          width: {
            xs: "100%",
            sm: "50vw",
          },
        }}
      >
        <ModalContent
          selectedRow={selectedRow}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomModal>
    </Stack>
  );
}
