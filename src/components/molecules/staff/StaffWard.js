import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import CustomModal from "components/atoms/CustomModal";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { toast } from "react-toastify";

import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_STAFS_IN_A_WARD } from "utils/reactQueryKeys";

import StaffWardModalParent from "components/molecules/staff/modalContent/StaffWardModalParent";
import DeleteStaffsFromWard from "./modalContent/DeleteStaffsFromWard";
import StaffList from "./modalContent/StaffList";

function StaffWard({ wardId: id }) {
  const modalRef = React.useRef(null);

  const [selectedItems, setselectedItems] = React.useState([]);
  const [modalMsg, setmodalMsg] = React.useState();
  const [modalType, setmodalType] = React.useState("remove");

  const [deleteSingleStaff, setdeleteSingleStaff] = React.useState(false);

  const closeModal = () => {
    modalRef?.current?.handleToggle();
  };

  //get single ward
  const {
    isLoading,
    data: wardData,
    refetch: refetchSingleWard,
  } = useCustomQuery(
    [GET_STAFS_IN_A_WARD, id],
    {
      url: `/wards/get-staff-in-single-ward/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const returnStaffIds = (selected, fromApi) => {
    const arr = [...fromApi];
    selected.forEach((select) => {
      const idx = arr.findIndex((api) => api._id === select);
      if (idx > -1) arr.splice(idx, 1);
    });

    const onlyIds = arr.map((staff) => staff._id);
    return [...new Set(onlyIds)];
  };

  //delete staff

  const { mutate: handleDeleteStaffs, isLoading: deleteStaffLoading } =
    useCustomMutation(
      {
        url: `/wards/edit-ward/${id}`,
        method: "patch",
        data: {
          staff: [
            ...returnStaffIds(selectedItems, wardData?.data?.staff || []),
          ],
        },
      },
      {
        onSuccess: () => {
          refetchSingleWard();
          toast.success("Staff(s) Deleted Successfully");
          setdeleteSingleStaff(false);
          closeModal();
        },

        onError: (error) => toast.error(error.message),
      }
    );

  //for stafflist check box
  const handleSelect = (id) => setselectedItems([...selectedItems, id]);
  const handleUnSelect = (id) => {
    const newState = selectedItems.filter((item) => item !== id);
    setselectedItems(newState);
  };

  const handleRemoveMultipleStaffs = () => {
    handleDeleteStaffs();
  };

  const openModal = (typeOfModal, remove_type = "") => {
    if (remove_type === "remove_multiple_staffs") {
      if (!selectedItems.length) return;
      setmodalMsg(`${selectedItems.length} items`);
    }

    setmodalType(typeOfModal);
    modalRef?.current?.handleToggle();
  };

  return (
    <Box>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <Paper sx={{}}>
          <Grid container spacing={1} sx={{}}>
            <Grid item xs={12} sm={7}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ width: "100%" }}
              >
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Assigned Staffs
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    color="error"
                    startIcon={<DeleteOutlinedIcon />}
                    sx={{}}
                    onClick={() =>
                      openModal("remove", "remove_multiple_staffs")
                    }
                    aria-label="remove-multiple-staffs-btn"
                    disabled={deleteStaffLoading}
                  >
                    Remove
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={() => openModal("assign")}
                  >
                    Assign
                  </Button>
                </Stack>
              </Stack>
              <Stack
                direction="column"
                sx={{
                  p: 1,
                  pr: { xs: 1, sm: 3 },
                  width: "100%",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderLeft: "none",
                  borderRight: "none",
                  mt: 2,
                  mb: 2,
                }}
                spacing={1}
              >
                {wardData?.data?.staff?.map((list, i, arr) => (
                  <StaffList
                    list={list}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    key={list.id}
                    selectedItems={selectedItems}
                    handleDelete={handleDeleteStaffs}
                    deleteBtnLoading={deleteStaffLoading}
                    useDeleteSingleModal
                    lists={arr}
                    refetch={refetchSingleWard}
                    wardId={id}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      )}

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            lg: "60%",
          },
        }}
      >
        <StaffWardModalParent
          modalType={modalType}
          handleClose={closeModal}
          msg={modalMsg}
          wardId={id}
          staffs={wardData?.data?.staff}
          handleDelete={handleRemoveMultipleStaffs}
          refetch={refetchSingleWard}
          deleteBtnLoading={deleteStaffLoading}
        />
      </CustomModal>
    </Box>
  );
}

export default StaffWard;
