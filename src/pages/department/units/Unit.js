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
  DELETE_UNIT,
  GET_STAT_FOR_SINGLE_DEPARTMENT,
  GET_UNIT,
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
      label="Head of Units"
      state={staffs?.length ? value : ""}
      handleChange={handleChange}
      name="headOfUnit"
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

function SingleUnit({ defaultState }) {
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
    data: unitData,
    refetch: refetchUnit,
  } = useCustomQuery(
    [GET_UNIT, id],
    {
      url: `/unit/get-unit-by-id/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) =>
        setValues({ headOfUnit: response?.data?.headOfUnit?._id }),
    }
  );

  //delete unit

  const { isFetching: deleteDeptLoading, refetch: handleDeleteUnit } =
    useCustomQuery(
      DELETE_UNIT,
      {
        url: `/unit/delete-unit/${id}`,
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
        url: `/unit/remove-staff/${id}`,
        method: "patch",
        data: { staffId: selectedItems },
      },
      {
        onSuccess: () => {
          refetchUnit();
          toast.success("Staff(s) Deleted Successfully");
          setdeleteSingleStaff(false);
        },

        onError: (error) => toast.error(error.message),
      }
    );

  //edit unit

  const { mutate: handleEditUnit, isLoading: editUnitLoading } =
    useCustomMutation(
      {
        url: `/unit/update-unit/${id}`,
        method: "patch",
        data: { headOfUnit: values.headOfUnit },
      },
      {
        onSuccess: () => {
          refetchUnit();
          toast.success("Success");
        },

        onError: (error) => toast.error(error.message),
      }
    );

  //handle save data
  const handleSaveData = () => {
    if (!edit) return;
    handleEditUnit();
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
      setmodalMsg(unitData?.data?.name);
    }
    setremoveType(remove_type);
    setmodalType(typeOfModal);
    modalRef?.current?.handleToggle();
  };

  return (
    <Box>
      <Typography variant="displayLg">Units</Typography>
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
            <Typography variant="displaySm">{unitData?.data?.name}</Typography>
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
                deptId={unitData?.data?.department._id}
                value={values.headOfUnit}
                handleChange={handleChange}
                readOnly={edit ? false : true}
              />

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
                    onClick={() => openModal("assign_to_unit")}
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
                {unitData?.data?.staff?.map((list) => (
                  <StaffList
                    list={list}
                    handleSelect={handleSelect}
                    handleUnSelect={handleUnSelect}
                    key={list.id}
                    selectedItems={selectedItems}
                    deleteAction={handleRemoveStaff}
                    unitData={unitData?.data?.department}
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
                disabled={editUnitLoading}
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
          unit={unitData?.data}
          handleDelete={() =>
            removeType === "remove_dept"
              ? handleDeleteUnit()
              : handleRemoveMultipleStaffs()
          }
          deleteBtnLoading={deleteDeptLoading}
          refetch={refetchUnit}
        />
      </CustomModal>
    </Box>
  );
}

SingleUnit.defaultProps = {
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
export default SingleUnit;
