import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, Stack, Typography } from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomModal from "components/atoms/CustomModal";
import CustomButton from "components/atoms/CustomButton";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useParams } from "react-router-dom";
import { GET_PATIENT_INVESTIGATION } from "utils/reactQueryKeys";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import CustomLoader from "components/atoms/CustomLoader";

const rows = [
  {
    PreferredDate: "23/12/22",
    investigation: "HIV test",
    department: "Immunology",
    unit: "1",
    status: "pending",
  },
  {
    PreferredDate: "23/12/22",
    investigation: "Blood glucose test",
    department: "Haematology",
    unit: "2",
    status: "pending",
  },
];
const Row = ({ row, i, toggleModal }) => {
  return (
    <TableRow
      key={i}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {i + 1}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.test?.testName}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.note}
      </TableCell>

      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row?.status}
      </TableCell>
      <TableCell align="left">
        <IconButton onClick={toggleModal.bind(null, row?._id)}>
          <DeleteOutlineIcon sx={{ color: "crimson" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default function InvestigationTable() {
  const { id } = useParams();
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  const [investigationId, setinvestigationId] = React.useState();

  //get patient investigation
  const { data, isLoading: tableLoading } = useCustomQuery(
    [GET_PATIENT_INVESTIGATION, id, { testStatus: "PENDING" }],
    {
      url: `/investigation/get-patient-investigations/${id}?testStatus=PENDING`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //delete  {investigation}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/investigation/${investigationId}`,
      method: "delete",
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_PATIENT_INVESTIGATION, id]);
        toast.success("Success");
        modalRef?.current?.handleToggle();
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const toggleModal = (id) => {
    setinvestigationId(id);
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      {tableLoading ? (
        <CustomLoader />
      ) : data?.data?.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  S/N
                </TableCell>

                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Investigation
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Note
                </TableCell>

                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((row, i) => (
                <Row row={row} key={i} i={i} toggleModal={toggleModal} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "No Data"
      )}
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          height: "fit-content !important",
          minWidth: "30vw !important",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="heading">
            Are you sure you want to delete this item?
          </Typography>
          <Stack
            direction={"row"}
            width={"100%"}
            justifyContent="space-between"
          >
            <CustomButton
              color="success"
              text={"Cancel"}
              onClick={toggleModal}
            />
            <CustomButton
              color="error"
              text={"Yes"}
              onClick={mutate}
              disabled={isLoading}
            />
          </Stack>
        </Stack>
      </CustomModal>
    </>
  );
}
