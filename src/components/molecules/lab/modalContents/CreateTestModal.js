import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";
import CustomTextInput from "components/atoms/CustomTextInput";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useFormik } from "formik";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { handleErrorProps } from "utils/handleErrorProps";
import {
  GET_ALL_PENDING_TRANSACTIONS,
  GET_TEST_INFO,
} from "utils/reactQueryKeys";
import { v4 as uuidv4 } from "uuid";
import ColorCodeChip from "components/atoms/ColorCodeChip";
import CustomSelect from "components/atoms/Select";
import { red } from "@mui/material/colors";
const initialValues = {
  testName: "",
  testType: "",
  testCode: "",
  rate: "",
  duration: "",
  unit: "",
};
const initialModalValues = {
  name: "",
  type: "text",
  lower: "",
  higher: "",
  textVal: "",
};
const requireFields = [
  "testName",
  "testType",
  "testCode",
  "rate",
  "duration",
  "unit",
];
const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    if (!values[field]) return (errors[field] = "Required");
  });

  return errors;
};

function CreateTestModal({ refetchTests, handleClose }) {
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);
  const [testResultFields, settestResultFields] = React.useState([]);
  const [modalFormsState, setmodalFormsState] =
    React.useState(initialModalValues);

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
  const {
    mutate: handleCreateTest,
    isLoading: handleCreateTestLoading,
    refetch: refetchTestList,
  } = useCustomMutation(
    {
      url: `/test`,
      method: "post",
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_TEST_INFO]);
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
    if (!testResultFields.length)
      return toast.error("Please add a test result field");
    let otherFields = [];
    if (testResultFields.length) {
      otherFields = testResultFields.map((field) => ({
        [field.name]: {
          value: "",
          range: {
            type: field.type === "text" ? "text" : "digit",
            normal:
              field.type === "text"
                ? field.textVal
                : {
                    min: field.lower,
                    max: field.higher,
                  },
          },
        },
      }));
    }
    const data = {
      ...values,
      otherFields,
    };
    handleCreateTest(data);
  };

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleModalFormChange = (e) => {
    setmodalFormsState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddNewField = () => {
    if (!modalFormsState.name) return toast.error("Fill all fields");
    if (modalFormsState.type === "text" && !modalFormsState.textVal)
      return toast.error("Fill all fields");
    if (
      modalFormsState.type === "number" &&
      (!modalFormsState.higher || !modalFormsState.lower)
    )
      return toast.error("Fill all fields");

    const newRow = {
      id: uuidv4(),
      value: "",
      ...modalFormsState,
    };
    settestResultFields((prev) => {
      return [...prev, newRow];
    });
    setmodalFormsState(initialModalValues);
    toggleModal();
  };

  const handleDeleteTestResultField = (id) => {
    settestResultFields(() => {
      const data = testResultFields.filter((result) => result.id !== id);
      return data;
    });
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
                  title="Test Unit"
                  value={values.unit}
                  name="unit"
                  handleChange={handleChange}
                  boxSx={{ width: "100%" }}
                  placeholder="Test Unit"
                  {...handleErrorProps(touched.unit, errors.unit)}
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

          <Grid container spacing={4} rowGap={2} sx={{ mt: 1, width: "100%" }}>
            {testResultFields.map((field, i) => (
              <Grid key={field.id} item xs={12} sm={6}>
                <Stack>
                  <Stack
                    direction={"row"}
                    alignItems="center"
                    justifyContent={"center"}
                    width="100%"
                    gap={0.5}
                  >
                    <CustomTextInput
                      title={field.name}
                      placeholder="Input value"
                      boxSx={{ width: "100% !important" }}
                      disabled={"true"}
                      readOnly={true}
                    />

                    <IconButton
                      onClick={handleDeleteTestResultField.bind(null, field.id)}
                      size="small"
                      sx={{ mt: "10px !important" }}
                    >
                      <CancelIcon sx={{ color: red[500], fontSize: "18px" }} />
                    </IconButton>
                  </Stack>
                  {field?.type && (
                    <>
                      {field?.type === "number" ? (
                        <Stack mt={2}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Typography
                              variant="displaySm"
                              sx={{
                                fontWeight: "700",
                                fontSize: "13px",
                              }}
                            >
                              Normal Range
                            </Typography>
                            <ColorCodeChip
                              type={"normal"}
                              style={{ height: "20px", width: "50px" }}
                            />
                          </Stack>
                          <Typography
                            variant="displaySm"
                            sx={{
                              fontWeight: "400",
                              fontSize: "10px",
                              opacity: "0.5",
                            }}
                          >
                            The established physiological range for healthy
                            individuals.
                          </Typography>

                          <Stack
                            alignItems={"center"}
                            justifyContent={"center"}
                            direction={"row"}
                            gap={2}
                          >
                            <CustomTextInput
                              title="Lower Limit"
                              value={field.lower}
                              name={"lower"}
                              type="number"
                              disabled="true"
                              readOnly
                            />
                            <Box sx={{ mt: 3 }}>
                              <svg
                                width="33"
                                height="13"
                                viewBox="0 0 33 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                                  fill="#D9D9D9"
                                />
                              </svg>
                            </Box>

                            <CustomTextInput
                              title="Higher Limit"
                              value={field.higher}
                              name={"higher"}
                              type="number"
                              disabled="true"
                              readOnly
                            />
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack mt={4.5}>
                          <Typography
                            variant="displaySm"
                            sx={{
                              fontWeight: "400",
                              fontSize: "10px",
                              opacity: "0.5",
                            }}
                          >
                            The established physiological range for healthy
                            individuals.
                          </Typography>

                          <Stack
                            alignItems={"center"}
                            justifyContent={"center"}
                            direction={"row"}
                            gap={2}
                            mt={3}
                          >
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              gap={2}
                            >
                              <Typography
                                variant="displaySm"
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "13px",
                                  textWrap: "nowrap",
                                }}
                              >
                                Normal Range
                              </Typography>
                              <ColorCodeChip
                                type={"normal"}
                                style={{ height: "40px", width: "50px" }}
                              />
                            </Stack>
                            <Box>
                              <svg
                                width="33"
                                height="13"
                                viewBox="0 0 33 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                                  fill="#D9D9D9"
                                />
                              </svg>
                            </Box>
                            <CustomTextInput
                              value={field.textVal}
                              name={"textVal"}
                              disabled="true"
                              readOnly
                            />
                          </Stack>
                        </Stack>
                      )}
                    </>
                  )}
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
          pt: 5,
          height: "fit-content !important",
          minWidth: "45vw !important",
        }}
      >
        <Stack spacing={2}>
          <CustomTextInput
            title="Field Name"
            value={modalFormsState.name}
            name={"name"}
            handleChange={handleModalFormChange}
            boxSx={{ width: "100%" }}
            placeholder="Input field name"
          />
          <CustomSelect
            options={[
              { name: "Text", value: "text" },
              { name: "Number", value: "number" },
            ]}
            placeholder="Select Field Type"
            state={modalFormsState?.type}
            handleChange={handleModalFormChange}
            label="Field Type"
            name="type"
            haveTopLabel={true}
          />

          {modalFormsState.type === "number" ? (
            <Stack>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <Typography
                  variant="displaySm"
                  sx={{
                    fontWeight: "700",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  Normal Range
                </Typography>
                <ColorCodeChip type={"normal"} />
              </Stack>
              <Typography
                variant="displaySm"
                sx={{
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "18.2px",
                  opacity: "0.5",
                }}
              >
                The established physiological range for healthy individuals.
              </Typography>

              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                direction={"row"}
                gap={2}
              >
                <CustomTextInput
                  title="Lower Limit"
                  value={modalFormsState.lower}
                  name={"lower"}
                  handleChange={handleModalFormChange}
                  placeholder={"Enter Value"}
                  variant="filled"
                  type="number"
                />
                <Box sx={{ mt: 3 }}>
                  <svg
                    width="33"
                    height="13"
                    viewBox="0 0 33 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                </Box>

                <CustomTextInput
                  title="Higher Limit"
                  value={modalFormsState.higher}
                  name={"higher"}
                  handleChange={handleModalFormChange}
                  placeholder={"Enter Value"}
                  variant="filled"
                  type="number"
                />
              </Stack>
            </Stack>
          ) : (
            <Stack>
              <Typography
                variant="displaySm"
                sx={{
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "18.2px",
                  opacity: "0.5",
                }}
              >
                The established physiological range for healthy individuals.
              </Typography>

              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                direction={"row"}
                gap={2}
              >
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <Typography
                    variant="displaySm"
                    sx={{
                      fontWeight: "700",
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  >
                    Normal Range
                  </Typography>
                  <ColorCodeChip type={"normal"} />
                </Stack>
                <Box>
                  <svg
                    width="33"
                    height="13"
                    viewBox="0 0 33 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                </Box>
                <CustomTextInput
                  value={modalFormsState.textVal}
                  name={"textVal"}
                  handleChange={handleModalFormChange}
                  placeholder={"Enter text here"}
                />
              </Stack>
            </Stack>
          )}
          <Box>
            <CustomButton
              text={"Add"}
              onClick={handleAddNewField}
              variant="contained"
              color="secondary"
            />
          </Box>
        </Stack>
      </CustomModal>
    </>
  );
}

export default CreateTestModal;
