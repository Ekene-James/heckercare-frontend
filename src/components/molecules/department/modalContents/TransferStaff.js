import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import StaffList from "components/molecules/department/StaffList";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomButton from "components/atoms/CustomButton";
import CustomSelect from "components/atoms/Select";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  GET_DEPARTMENT,
  GET_DEPARTMENTS,
  GET_STAT_FOR_SINGLE_DEPARTMENT,
  TRANSFER_STAFF,
} from "utils/reactQueryKeys";
const GetSearch = ({ deptId, dataType, label, state, handleChange, name }) => {
  const { data } = useCustomQuery(
    [GET_STAT_FOR_SINGLE_DEPARTMENT, deptId],
    {
      url: `/department/dept-details/${deptId}`,
      method: "get",
    },
    {
      enabled: !!deptId,
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data[dataType].map((d) => {
          return { name: d.name, value: d._id };
        });
        return formartedData;
      },
    }
  );

  return (
    <CustomSelect
      options={data}
      label={label}
      state={data?.length ? state : ""}
      handleChange={handleChange}
      name={name}
      haveTopLabel={true}
      placeholder="Select"
    />
  );
};

const initialValues = { department: "", unit: "", clinic: "" };

const TransferStaff = ({ handleClose, staffData, deptData }) => {
  let { id } = useParams();
  //formik state
  const { handleChange, values } = useFormik({
    initialValues,
  });

  //get departments
  const { refetch: refetchDept } = useCustomQuery(
    [GET_DEPARTMENT, id],
    {
      url: `/department/get-department-by-id/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  //transfer staff
  const { isFetching: transferStaffLoading, refetch: handleTransferStaff } =
    useCustomQuery(
      TRANSFER_STAFF,
      {
        url: `/department/transfer-staff/${deptData._id}`,
        method: "patch",
        data: {
          staffId: staffData._id,
          newDeptId: values.department,
        },
      },
      {
        enabled: false,
        onSuccess: () => {
          refetchDept();
          handleClose();
          toast.success("Staff transfered Successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );

  const { isLoading, data: allDepartments } = useCustomQuery(
    GET_DEPARTMENTS,
    {
      url: `/department/get-all-departments`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.departments.map((dept) => {
          return { name: dept.name, value: dept._id };
        });
        return formartedData;
      },
    }
  );
  const change = (e) => {};

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
          <Typography variant="displayMd">Transfer Staff </Typography>
        </Stack>

        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%", mb: 2 }}
        >
          <CustomTextInput
            title="Staff "
            value={staffData.fullName}
            name="staff"
            readOnly={true}
            boxSx={{ width: "100%" }}
          />

          <CustomSelect
            options={allDepartments}
            label="Department"
            state={values.department}
            handleChange={handleChange}
            name="department"
            haveTopLabel={true}
            placeholder="Select"
          />
          <GetSearch
            label="Clinic"
            state={values.clinic}
            handleChange={handleChange}
            name="clinic"
            deptId={values.department}
            dataType="clinics"
          />
          <GetSearch
            label="Units"
            state={values.unit}
            handleChange={handleChange}
            name="unit"
            deptId={values.department}
            dataType="units"
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="start"
          spacing={1}
          sx={{ mt: 2, width: "fit-content" }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{}}
            onClick={handleTransferStaff}
            disabled={transferStaffLoading}
          >
            Save
          </Button>
          <CustomButton
            variant="containedBrown"
            onClick={handleClose}
            text="Cancel"
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TransferStaff;
