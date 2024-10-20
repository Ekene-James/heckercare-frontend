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
import BackButton from "components/atoms/BackButton";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CustomTextInput from "components/atoms/CustomTextInput";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowLeftOutlinedIcon from "@mui/icons-material/ArrowLeftOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import CustomModal from "components/atoms/CustomModal";
import DeptModalContent from "../../../components/molecules/department/modalContents/DeptModalContent";
import StaffList from "components/molecules/department/StaffList";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import CustomSelect from "components/atoms/Select";
import {
  DELETE_CLINIC,
  GET_CLINIC,
  GET_STAT_FOR_SINGLE_DEPARTMENT,
} from "utils/reactQueryKeys";

const GetUnits = ({
  deptId,
  value,
  handleChange,

  readOnly,
}) => {
  //get units of a dept
  const { data: staffs } = useCustomQuery(
    [GET_STAT_FOR_SINGLE_DEPARTMENT, deptId],
    {
      url: `/department/dept-details/${deptId}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!deptId,
      select: (data) => {
        const formartedData = data.data.staff.map((staf) => {
          return { name: staf.fullName, value: staf._id };
        });
        return formartedData;
      },
    }
  );

  return (
    <CustomSelect
      options={staffs}
      label="Head of Clinics"
      state={staffs?.length ? value : ""}
      handleChange={handleChange}
      name="headOfClinic"
      haveTopLabel={true}
      placeholder="Select"
      readOnly={readOnly}
    />
  );
};

const validate = (values) => {
  const errors = {};

  if (!values.headOfDept) {
    errors.headOfDept = "Required";
  }

  return errors;
};

const initialValues = { headOfDept: "" };

function SingleClinic({ defaultState }) {
  let { id } = useParams();
  const navigate = useNavigate();
  const modalRef = React.useRef(null);

  const [selectedItems, setselectedItems] = React.useState([]);
  const [modalMsg, setmodalMsg] = React.useState();
  const [modalType, setmodalType] = React.useState("remove");
  const [removeType, setremoveType] = React.useState("");
  const [edit, setedit] = React.useState(false);
  const [deleteSingleStaff, setdeleteSingleStaff] = React.useState(false);

  //formik state
  const { handleBlur, handleChange, values, touched, errors, setValues } =
    useFormik({
      initialValues,
      validate: (values) => validate(values),
    });

  const closeModal = () => {
    modalRef?.current?.handleToggle();
  };

  //get single unit
  const {
    isLoading,
    data: clinicData,
    refetch: refetchSingleClinic,
  } = useCustomQuery(
    [GET_CLINIC, id],
    {
      url: `/clinic/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) =>
        setValues({ headOfClinic: response?.data?.headOfClinic?._id }),
    }
  );

  //delete unit

  const { isFetching: deleteDeptLoading, refetch: handleDeleteClinic } =
    useCustomQuery(
      DELETE_CLINIC,
      {
        url: `/clinic/${id}`,
        method: "delete",
      },
      {
        enabled: false,
        onSuccess: () => {
          closeModal();
          toast.success("delete Successfully");
          navigate(-1);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );

  //delete staff

  const { mutate: handleDeleteStaffs, isLoading: deleteStaffLoading } =
    useCustomMutation(
      {
        url: `/clinic/remove-staff/${id}`,
        method: "patch",
        data: { staffId: selectedItems },
      },
      {
        onSuccess: () => {
          refetchSingleClinic();
          toast.success("Staff(s) Deleted Successfully");
          setdeleteSingleStaff(false);
        },

        onError: (error) => toast.error(error.message),
      }
    );
  //edit clinic staff

  const { mutate: handleEditClinic, isLoading: editClinicLoading } =
    useCustomMutation(
      {
        url: `/clinic/${id}`,
        method: "patch",
        data: { headOfClinic: values.headOfClinic },
      },
      {
        onSuccess: () => {
          refetchSingleClinic();
          toast.success("Success");
        },

        onError: (error) => toast.error(error.message),
      }
    );

  //handle save data
  const handleSaveData = () => {
    if (!edit) return;
    handleEditClinic();
  };

  //for stafflist check box
  const handleSelect = (id) => setselectedItems([...selectedItems, id]);
  const handleUnSelect = (id) => {
    const newState = selectedItems.filter((item) => item !== id);
    setselectedItems(newState);
  };

  React.useMemo(() => {
    if (deleteSingleStaff) handleDeleteStaffs();
  }, [deleteSingleStaff, handleDeleteStaffs]);

  const handleRemoveStaff = React.useCallback((staffId) => {
    handleSelect(staffId);
    setdeleteSingleStaff(true);
  }, []);

  const handleRemoveMultipleStaffs = () => {
    handleDeleteStaffs();
    closeModal();
  };

  const openModal = (typeOfModal, remove_type = "") => {
    if (remove_type === "remove_multiple_staffs") {
      if (!selectedItems.length) return;
      setmodalMsg(`${selectedItems.length} items`);
    } else {
      setmodalMsg(clinicData?.data?.name);
    }
    setremoveType(remove_type);
    setmodalType(typeOfModal);
    modalRef?.current?.handleToggle();
  };

  return (
    <Box>
      <Typography variant="displayLg">Clinics</Typography>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <Paper sx={{ p: 2, mt: 2 }}>
          <BackButton />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{ width: "100%" }}
          >
            <Typography variant="displaySm">
              {clinicData?.data?.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                color="secondary"
                startIcon={<DriveFileRenameOutlineOutlinedIcon />}
                sx={{
                  backgroundColor: "secondary.light",
                  fontWeight: "bold",
                  pl: 2,
                  pr: 2,
                }}
                onClick={() => setedit(true)}
              >
                Edit Data
              </Button>
              <Button
                color="error"
                variant="contained"
                startIcon={<DeleteOutlinedIcon />}
                sx={{
                  fontWeight: "bold",
                  pl: 2,
                  pr: 2,
                }}
                onClick={() => openModal("remove", "remove_dept")}
              >
                Remove
              </Button>
            </Stack>
          </Stack>
          <Grid container spacing={1} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={7}>
              <GetUnits
                deptId={clinicData?.data?.department._id}
                value={values.headOfClinic}
                handleChange={handleChange}
                handleBlur={handleBlur}
                readOnly={edit ? false : true}
              />
              {/* <CustomTextInput
                value={values.headOfClinic}
                name="headOfClinic"
                handleChange={handleChange}
                placeholder="Enter HOC Name"
                title="Head of Clinics"
                readOnly={edit ? false : true}
                {...handleErrorProps(touched.headOfClinic, errors.headOfClinic)}
                onBlur={handleBlur}
              /> */}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ width: "100%", mt: 2 }}
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
                  >
                    Remove
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={() => openModal("assign_to_clinic")}
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
                {clinicData?.data?.staff?.map((list) => (
                  <StaffList
                    list={list}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    key={list.id}
                    selectedItems={selectedItems}
                    deleteAction={handleRemoveStaff}
                    clinicData={clinicData?.data?.department}
                    deleteBtnLoading={deleteStaffLoading}
                    hideTransferStaff={true}
                  />
                ))}
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="end"
                sx={{ width: "100%" }}
              >
                <IconButton>
                  <ArrowLeftOutlinedIcon />
                </IconButton>
                <IconButton>
                  <ArrowRightOutlinedIcon />
                </IconButton>
              </Stack>

              <Button
                color="secondary"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSaveData}
                disabled={editClinicLoading}
              >
                Save data
              </Button>
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
        <DeptModalContent
          modalType={modalType}
          handleClose={closeModal}
          msg={modalMsg}
          clinic={clinicData?.data}
          handleDelete={() =>
            removeType === "remove_dept"
              ? handleDeleteClinic()
              : handleRemoveMultipleStaffs()
          }
          deleteBtnLoading={deleteDeptLoading}
          refetch={refetchSingleClinic}
        />
      </CustomModal>
    </Box>
  );
}

SingleClinic.defaultProps = {
  defaultState: {
    deptName: "",
    id: "",
    hodName: "",
    staff: "",
    staffs: [],
  },
  cardData: [
    {
      name: "Laboratory",
      id: 1,
      hodName: "Thomas Shelby",
      staffNum: 25,
      staffLists: [
        {
          name: "Isak Alex",
          position: "Senior Ward Nurse ||",
          id: "ID-647282919031",
        },
      ],
    },
  ],
};
export default SingleClinic;
