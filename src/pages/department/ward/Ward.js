import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import BackButton from "components/atoms/BackButton";
import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchBar from "components/atoms/SearchBar";
import CustomDatePicker from "components/atoms/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import WardTable from "components/molecules/tabels/ward/WardTable";
import CustomModal from "components/atoms/CustomModal";
import ModalContent from "components/molecules/ward/modalContent/ModalContent";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useNavigate, useParams } from "react-router-dom";
import CustomLoader from "components/atoms/CustomLoader";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import ErrorComponent from "components/atoms/ErrorComponent";
import CustomButton from "components/atoms/CustomButton";
import { DELETE_WARD, GET_WARD } from "utils/reactQueryKeys";

function Ward() {
  let { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);
  const [type, settype] = React.useState("");
  const [bedDetails, setbedDetails] = React.useState({});
  const [search, setsearch] = React.useState("");

  //get ward
  const {
    isLoading: wardLoading,

    data: wardData,
    refetch: refetchWard,
    isError,
    error,
  } = useCustomQuery(
    [GET_WARD, id],
    {
      url: `/wards/get-single-ward/${id}?search=`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  //search patients in ward
  const {
    isLoading: searchLoading,
    isFetching,

    refetch: refetchSearch,
  } = useCustomQuery(
    [GET_WARD, id, search],
    {
      url: `/wards/get-single-ward/${id}?search=${search}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData([GET_WARD, id], (oldQueryData) => {
          return {
            ...response,
          };
        });
      },
      enabled: false,
    }
  );

  //delete ward

  const { isFetching: deleteWardLoading, refetch: deleteDept } = useCustomQuery(
    [DELETE_WARD, id],
    {
      url: `/wards/delete-ward/${id}`,
      method: "delete",
    },
    {
      enabled: false,
      onSuccess: () => {
        toast.success("delete Successfully");
        navigate(-1);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleOpenModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleRemovePatient = (details) => {
    settype("remove");
    setbedDetails(details);
    handleOpenModal();
  };
  const handleTransferPatient = (details) => {
    settype("transfer");
    handleOpenModal();
    setbedDetails(details);
  };

  const handleReset = () => {
    setsearch("");
    refetchWard();
  };
  if (isError) return <ErrorComponent error={error.message} />;
  return (
    <Box>
      <Typography variant="displayLg">Ward</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <BackButton />
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            disabled={deleteWardLoading}
            onClick={deleteDept}
          >
            Remove
          </Button>
        </Stack>
        {wardLoading ? (
          <CustomLoader />
        ) : (
          <>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", lg: "center" }}
              spacing={2}
            >
              <Typography variant="heading">
                {wardData.data.ward.name}
              </Typography>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", lg: "center" }}
                spacing={1}
              >
                <SearchBar
                  refetch={refetchSearch}
                  search={search}
                  setsearch={setsearch}
                  isLoading={searchLoading || isFetching}
                />
                <CustomDatePicker
                  type="date"
                  views={["year", "month", "day"]}
                  size="small"
                  lightBorder={true}
                />
                <CustomButton
                  variant="text"
                  text="Reset"
                  onClick={handleReset}
                />
              </Stack>
            </Stack>

            <WardTable
              handleRemovePatient={handleRemovePatient}
              handleTransferPatient={handleTransferPatient}
              data={wardData.data.patients}
            />
          </>
        )}
      </Paper>
      {!wardLoading && (
        <CustomModal
          ref={modalRef}
          childrenContSx={{
            p: 3,
            width: {
              xs: "90%",
              sm: "50vw",
            },
          }}
        >
          <ModalContent
            handleClose={() => modalRef?.current?.handleToggle()}
            type={type}
            bedDetails={bedDetails}
            wardDetails={wardData.data.ward}
            refetchWard={refetchWard}
          />
        </CustomModal>
      )}
    </Box>
  );
}

export default Ward;
