import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import FileUploadButton from "components/atoms/FileUploadButton";
import React from "react";
import CustomSelect from "components/atoms/Select";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PATIENT_INVESTIGATION, GET_TESTS } from "utils/reactQueryKeys";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
const initialState = {
  test: "",
  department: "",
  note: "",
  date: "",
  time: "",
  file: null,
};
const formatData = (data) => {
  if (!Object.keys(data).length) return;
  const formData = new FormData();

  formData.append("test", data.test);
  formData.append("resultFiles", data.file);
  formData.append("note", data.note);
  formData.append("datePaid", data.time);
  formData.append("department", data.department);
  // formData.append("departmentType", "LABORATORY");
  formData.append("patient", data.patient);
  return formData;
};
function UploadResultModal({ closeModal, testId = "" }) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [state, setstate] = React.useState(initialState);

  //get depts
  const { data: allTests, isLoading: testLoading } = useCustomQuery(
    GET_TESTS,
    {
      url: `/test`,
      method: "get",
    },
    {
      refetchOnWindowFocus: true,

      select: (data) => {
        const formartedData = data?.data?.map((test) => {
          return { name: test?.testName, value: test?._id };
        });
        return formartedData;
      },
    }
  );

  //post visit {investigations}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/investigation/external`,
      method: "post",
      data: formatData({ ...state, patient: id }),
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries([GET_PATIENT_INVESTIGATION, id]);
        closeModal();

        toast.success("Success");
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const handleChange = (e) =>
    setstate({
      ...state,
      [e.target.name]: e.target.value,
    });

  const handleSelectTime = (date, name) => {
    setstate((prev) => {
      return {
        ...prev,
        [name]: date,
      };
    });
  };
  const handleFileChange = (file) => {
    setstate((prev) => {
      return {
        ...prev,
        file: file,
      };
    });
  };

  const handleSubmit = () => {
    if (!state.test) return toast.error("Please select a test type");
    if (!state.department) return toast.error("Please add a department");
    if (!state.date) return toast.error("Please add a date");
    if (!state.time) return toast.error("Please add a time");
    if (!state.note) return toast.error("Please add a note");
    if (!state.file) return toast.error("Please add a test file");
    mutate();
  };

  return (
    <Stack
      direction={"column"}
      spacing={1}
      justifyContent="flex-start"
      alignItems={"flex-start"}
      width="100%"
    >
      <Box
        width="100%"
        sx={{ backgroundColor: "background.custom", padding: 4 }}
      >
        <Typography variant="heading" sx={{ fontSize: "21px" }}>
          Add Result
        </Typography>
      </Box>
      <Box
        px={4}
        sx={{
          width: {
            sm: "100%",
            md: "70%",
          },
        }}
      >
        <CustomSelect
          options={allTests}
          label="Test Type"
          state={allTests?.length ? state.test || testId : state.test}
          handleChange={handleChange}
          name="test"
          haveTopLabel={true}
          disabled={testLoading}
        />
      </Box>
      <Box
        px={4}
        sx={{
          width: {
            sm: "100%",
            md: "70%",
          },
        }}
      >
        <CustomTextInput
          value={state.department}
          name="department"
          handleChange={handleChange}
          placeholder="Enter department"
          title="Department"
          type="text"
        />
      </Box>
      <Stack
        direction={{
          sm: "column",
          md: "row",
        }}
        spacing={2}
        justifyContent="flex-start"
        alignItems={"flex-start"}
        width="70%"
        px={4}
      >
        <CustomDatePicker
          title="Date"
          type="date"
          views={["year", "month", "day"]}
          datePickerRootSx={{ height: "auto" }}
          date={state?.date || null}
          setdate={handleSelectTime}
          name="date"
        />

        <CustomDatePicker
          type="time"
          title="Time"
          placeholder="Select time"
          name="time"
          disableFuture={false}
          setdate={handleSelectTime}
          datePickerRootSx={{
            height: "auto",
            width: {
              sm: "100%",
              md: "80%",
            },
          }}
          date={state?.time || null}
        />
      </Stack>

      <Box
        px={4}
        sx={{
          width: {
            sm: "100%",
            md: "70%",
          },
        }}
      >
        <CustomTextInput
          title="Note"
          value={state.note}
          name="note"
          handleChange={handleChange}
          boxSx={{ width: "100%" }}
          placeholder="Enter  remark here"
          multiline
          helperText={`${state?.note?.length || 0} / 200`}
          rows={8}
        />
      </Box>

      <Stack direction={"row"} spacing={1} px={4} alignItems={"center"}>
        <FileUploadButton
          CustomButton={
            <CustomButton variant="containedBrown" text={"Add Investigation"} />
          }
          onFileChange={handleFileChange}
        />
        <Typography variant="body1">{state?.file?.name}</Typography>
        {state?.file?.name && (
          <IconButton
            onClick={() => setstate((prev) => ({ ...prev, file: "" }))}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <Box p={4}>
        <CustomButton
          color="secondary"
          text={"Save & Continue"}
          onClick={handleSubmit}
          disabled={isLoading}
        />
      </Box>
    </Stack>
  );
}

export default UploadResultModal;
