import { Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";
import CustomTextInput from "components/atoms/CustomTextInput";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { handleErrorProps } from "utils/handleErrorProps";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  GET_ALL_PENDING_TRANSACTIONS,
  GET_RADIOLOGY_TEST_INFO,
} from "utils/reactQueryKeys";

const initialValues = {
  testName: "",
  testType: "",
  testCode: "",
  rate: "",
  duration: "",
};
const requireFields = ["testName", "testType", "testCode", "rate", "duration"];
const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    if (!values[field]) return (errors[field] = "Required");
  });

  return errors;
};

function CreateTestModal({ refetchTests, handleClose }) {
  const queryClient = useQueryClient();

  const [modalFormsState, setmodalFormsState] = React.useState("");
  const [rows, setrows] = React.useState([]);

  const modalRef = React.useRef(null);

  const {
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    setValues,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues,
    validate: (values) => validate(values),
  });

  // handle Create Test
  const { mutate: handleCreateTest, isLoading: handleCreateTestLoading } =
    useCustomMutation(
      {
        url: `/test`,
        method: "post",
        data: {
          ...values,
          departmentType: "RADIOLOGY",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_RADIOLOGY_TEST_INFO]);
          queryClient.invalidateQueries([GET_ALL_PENDING_TRANSACTIONS]);
          toast.success("Success");
          refetchTests();
          resetForm();
          handleClose();
        },

        onError: (error) => toast.error(error.message),
      }
    );

  const onClickSave = () => {
    let emptyRequiredFieldNumber = 0;

    requireFields.forEach((field) => {
      emptyRequiredFieldNumber =
        values[field] === ""
          ? emptyRequiredFieldNumber + 1
          : emptyRequiredFieldNumber;
      setFieldTouched(field, true, true);
    });

    if (emptyRequiredFieldNumber > 0) return;
    if (!rows.length) return toast.error("Please add a result field");
    handleCreateTest();
  };
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleAddField = () => {
    if (!modalFormsState) return;
    const trimed = modalFormsState.replace(/\s+/g, "");
    //it already exists
    if (trimed in values) return;

    const newForm = {
      id: uuidv4(),
      name: modalFormsState,
    };

    setrows((prev) => [...prev, newForm]);
    setValues({ ...values, otherFields: [...rows, newForm] });
    setmodalFormsState("");

    toggleModal();
  };

  const handleRemove = (detail) => {
    const newRow = rows.filter((row) => row.id !== detail.id);

    setValues((prev) => ({
      ...prev,
      otherFields: newRow,
    }));
    setrows(newRow);
  };

  return (
    <>
      <Stack
        direction={"column"}
        sx={{ width: "100%" }}
        spacing={2}
        aria-label="create-new-test-modal-content"
      >
        <Stack direction={"column"} sx={{ width: "100%" }}>
          <Typography variant="displayMd">Create New Test</Typography>
        </Stack>
        <Divider />
        <Grid container spacing={2} sx={{}}>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2} sx={{}}>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Test Name"
                  value={values.testName}
                  name="testName"
                  handleChange={handleChange}
                  boxSx={{ width: "100%" }}
                  placeholder="Test Name"
                  {...handleErrorProps(touched.testName, errors.testName)}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Test Type"
                  value={values.testType}
                  handleChange={handleChange}
                  name="testType"
                  placeholder="Test Type"
                  {...handleErrorProps(touched.testType, errors.testType)}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Test Code"
                  value={values.testCode}
                  handleChange={handleChange}
                  name="testCode"
                  placeholder="Test Code"
                  {...handleErrorProps(touched.testCode, errors.testCode)}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Rate"
                  value={values.rate}
                  name="rate"
                  handleChange={handleChange}
                  boxSx={{ width: "100%" }}
                  placeholder="Rate"
                  {...handleErrorProps(touched.rate, errors.rate)}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Estimated Duration"
                  value={values.duration}
                  name="duration"
                  handleChange={handleChange}
                  boxSx={{ width: "100%" }}
                  placeholder="Estimated Duration"
                  {...handleErrorProps(touched.duration, errors.duration)}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Stack
          direction={"column"}
          spacing={2}
          alignItems={"flex-start"}
          justifyContent="center"
          sx={{
            width: {
              xs: "100%",
            },
            p: 2,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"100%"}
            gap={2}
          >
            <Typography variant="heading">Other Fields</Typography>
            <CustomButton
              text={"Add Fields"}
              variant="text"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={toggleModal}
            />
          </Stack>
          <Grid container spacing={1} sx={{ width: "100%" }}>
            {rows.map((row) => (
              <Grid item xs={12} sm={6} key={row.id}>
                <Stack direction={"row"} gap={1} alignItems={"center"}>
                  <CustomTextInput
                    value={""}
                    title={row.name}
                    handleChange={handleChange}
                    variant="outlined"
                    sx={{
                      borderRadius: "5px",
                    }}
                    disabled={"true"}
                    readOnly={true}
                  />
                  <IconButton
                    aria-label={`delete ${row.name} button`}
                    color="error"
                    onClick={handleRemove.bind(this, row)}
                    sx={{ mt: 2 }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>

        <Stack direction={"row"} spacing={1} sx={{ width: "40%" }}>
          <CustomButton
            text={"Save"}
            variant="contained"
            color="secondary"
            disabled={handleCreateTestLoading}
            onClick={onClickSave}
          />
          <CustomButton
            variant="lightSecondary"
            text={"Cancel"}
            color="secondary"
            onClick={handleClose}
          />
        </Stack>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          minWidth: "30vw !important",
        }}
      >
        <Stack spacing={2}>
          <CustomTextInput
            title="Field Name"
            value={modalFormsState}
            name={modalFormsState}
            handleChange={(e) => setmodalFormsState(e.target.value)}
            boxSx={{ width: "100%" }}
            placeholder="Input field name"
          />

          <CustomButton
            text={"Add"}
            onClick={handleAddField}
            variant="contained"
            color="secondary"
          />
        </Stack>
      </CustomModal>
    </>
  );
}

export default CreateTestModal;
