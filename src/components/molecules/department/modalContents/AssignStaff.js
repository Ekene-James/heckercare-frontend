import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import StaffList from "components/molecules/department/StaffList";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { GET_STAFFS_WITHOUT_DEPT } from "utils/reactQueryKeys";
import { useNavigate } from "react-router-dom";

const AssignStaff = ({ handleClose, department, refetch }) => {
  const navigate = useNavigate();
  const [selectedItems, setselectedItems] = React.useState([]);
  const [selectedStaffs, setselectedStaffs] = React.useState([]);

  const [search, setsearch] = React.useState("");

  const {
    isLoading,
    isFetching,
    data: staffsData,
    refetch: refetchStaffs,
  } = useCustomQuery(
    [GET_STAFFS_WITHOUT_DEPT, search],
    {
      url: `/department/staff-not-in-dept?search=${search}&limit=1000`,
      method: "get",
      avoidCancelling: false,
    },
    {
      enabled: !!search,
      refetchOnWindowFocus: false,
    }
  );

  const returnStaffIds = (data) => {
    const arr = data.map((staff) => staff._id);
    return [...new Set(arr)];
  };
  //save added staffs
  const { mutate: handleSave, isLoading: addStaffLoading } = useCustomMutation(
    {
      url: `/department/update-department/${department?.department?._id}`,
      method: "patch",
      data: {
        staff: [...returnStaffIds([...selectedStaffs, ...department.staff])],
      },
    },
    {
      onSuccess: () => {
        toast.success("Staff(s) Added Successfully");
        refetch();
        setselectedStaffs([]);
        setselectedItems([]);
        handleClose();
      },

      onError: (error) => toast.error(error.message),
    }
  );

  const handleSelect = (id) => setselectedItems([...selectedItems, id]);
  const handleUnSelect = (id) => {
    const newState = selectedItems.filter((item) => item !== id);
    setselectedItems(newState);
  };

  const deleteStaff = (id) => {
    const data = selectedStaffs.filter((staff) => staff._id !== id);
    setselectedStaffs(data);
  };

  const handleOnselect = (item) => {
    //check if staff exists before adding

    setselectedStaffs((prev) => {
      const selected = prev.find((data) => data._id === item._id);
      if (!selected?._id) return [item, ...prev];
      return prev;
    });
  };

  return (
    <Grid container spacing={3} sx={{ p: 3 }} aria-label="assign-staff-modal">
      <Grid item xs={2.5}>
        <Box
          sx={{
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            p: 3,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 35px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            alt="folder_icon"
            src="/imgs/Note.png"
            height="50px"
            width="50px"
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={9.5}>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography variant="displayMd">Assign Staff </Typography>
        </Stack>

        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%", mb: 2 }}
        >
          <CustomTextInput
            title="Department"
            value={department?.department?.name}
            name="department"
            readOnly={true}
            boxSx={{ width: "100%" }}
          />
          <SearchDropdown
            placeholder="Search ( with “Staff name” or “Staff ID”)"
            handleOnselect={handleOnselect}
            title="Staff"
            createBtnTxt="Create New Staff"
            createBtnAction={() => navigate("/home/staff/registration")}
            boxSx={{ width: "100%" }}
            data={staffsData?.data}
            isLoading={isLoading}
            search={search}
            setsearch={setsearch}
            reFetch={refetchStaffs}
          />
        </Stack>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Added Staffs
        </Typography>
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
          {selectedStaffs.map((list, i) => (
            <StaffList
              list={list}
              handleSelect={handleSelect}
              handleUnSelect={handleUnSelect}
              key={i}
              selectedItems={selectedItems}
              deleteAction={deleteStaff}
              showDotMenu={false}
            />
          ))}
        </Stack>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "secondary.light",
            color: "secondary.main",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "secondary.light",
              color: "secondary.main",
              opacity: 0.8,
            },
          }}
          onClick={handleSave}
          disabled={addStaffLoading}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default AssignStaff;
