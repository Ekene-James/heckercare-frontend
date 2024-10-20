import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import React from "react";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { useNavigate } from "react-router-dom";
import CustomModal from "components/atoms/CustomModal";
import CreateDeptModalContent from "../../../components/molecules/department/modalContents/CreateDeptModalContent";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { GET_DEPARTMENTS } from "utils/reactQueryKeys";
import Pagination from "components/molecules/pagination/Pagination";
const pageSize = 12;
const OverviewCard = ({
  card: { id, name, headOfDept = "No HOD name", staff = [] },
  i,
}) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="column"
      alignItems="start"
      justifyContent="start"
      spacing={2}
      sx={{
        border: "2px solid rgba(245, 245, 245, 1)",
        borderRadius: "3px",
        p: 2,
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        alignItems="start"
        justifyContent="space-between"
        spacing={2}
        sx={{ width: "100%" }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            p: 1,
            pt: 0.3,
            pb: 0.3,
            borderRadius: "4px",
            backgroundColor: "background.gray3",
            color: "background.gray4",
          }}
        >
          {i}
        </Typography>
        <IconButton
          size="small"
          onClick={() => navigate(`/home/department/dept/${id}`)}
          sx={{
            border: "2px solid rgba(245, 245, 245, 1)",
            borderRadius: "4px",
          }}
        >
          <DriveFileRenameOutlineOutlinedIcon />
        </IconButton>
      </Stack>
      <Typography
        sx={{
          fontWeight: "bold",
        }}
      >
        {name}
      </Typography>

      <Stack
        direction="column"
        alignItems="start"
        justifyContent="start"
        spacing={0.5}
      >
        <Typography sx={{ color: "primary.lightGrey" }}>
          Head of Department
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          {headOfDept?.fullName || "-"}
        </Typography>
      </Stack>
      <Stack
        direction="column"
        alignItems="start"
        justifyContent="start"
        spacing={0.5}
      >
        <Typography sx={{ color: "primary.lightGrey" }}>
          Number of Assigned Staff
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>{staff.length}</Typography>
      </Stack>
    </Stack>
  );
};
function Departments() {
  const modalRef = React.useRef(null);

  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const { isLoading, data, refetch } = useCustomQuery(
    GET_DEPARTMENTS,
    {
      url: `/department/get-all-departments?limit=${pageSize}&page=${currentPage}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const closeModal = (willRefetch) => {
    if (willRefetch) refetch();

    modalRef?.current?.handleToggle();
  };
  return (
    <Box>
      <Typography variant="displayLg">Departments</Typography>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <Typography>Total Number of Department</Typography>
                <Typography variant="displayLg">{data?.data?.count}</Typography>
                <Button
                  color="secondary"
                  size="big"
                  sx={{
                    backgroundColor: "#ECF0FF",
                    fontWeight: "bold",
                    pl: 2,
                    pr: 2,
                  }}
                  onClick={() => modalRef?.current?.handleToggle()}
                >
                  Create New
                </Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} lg={9}>
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="column"
                alignItems="start"
                justifyContent="start"
                spacing={0.5}
              >
                <Typography variant="displayMd">Department Overview</Typography>
              </Stack>
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {data?.data?.departments?.map((card, i) => (
                  <Grid key={card.id} item xs={12} sm={4}>
                    <OverviewCard card={card} i={i + 1} />
                  </Grid>
                ))}
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={data?.data?.count || 5}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            xl: "50vw",
          },
        }}
        ariaLabel="create-dept-modal"
      >
        <CreateDeptModalContent handleClose={closeModal} />
      </CustomModal>
    </Box>
  );
}

export default Departments;
