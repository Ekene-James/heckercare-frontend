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
import { red } from "@mui/material/colors";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
const initialState = {
  test: "",
  note: "",
  date: "",
  files: [],
};
const formatData = (data) => {
  if (!Object.keys(data).length) return;
  const formData = new FormData();

  formData.append("test", data.test);
  // formData.append("resultFiles", data.files);
  formData.append("note", data.note);
  formData.append("datePaid", data.date);
  formData.append("departmentType", "RADIOLOGY");
  formData.append("patient", data.patient);
  data.files.forEach((file) => formData.append("resultFiles", file));
  return formData;
};
function UploadResultModal({ closeModal, testId = "" }) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [state, setstate] = React.useState(initialState);

  //get depts
  const { data: allTests, isLoading: testLoading } = useCustomQuery(
    [GET_TESTS, "RADIOLOGY"],
    {
      url: `/test?departmentType=RADIOLOGY`,
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
  const handleFileChange = (files) => {
    setstate((prev) => {
      return {
        ...prev,
        files: [...prev.files, ...Array.from(files)],
      };
    });
  };

  const handleDeleteFile = (fileName) => {
    setstate((prev) => {
      const data = prev.files.filter((file) => file.name !== fileName);
      return {
        ...prev,
        files: data,
      };
    });
  };

  const handleSubmit = () => {
    if (!state.test) return toast.error("Please select a test type");
    if (!state.date) return toast.error("Please add a date");
    if (!state.note) return toast.error("Please add a note");
    if (!state.files) return toast.error("Please add a test file");
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

      <Stack gap={2} p={4}>
        <Typography
          sx={{ fontSize: "12px", fontWeight: "700", lineHeight: "16px" }}
        >
          File Document{" "}
        </Typography>
        {state?.files?.map((file) => (
          <Stack
            key={file.name}
            direction={"row"}
            gap={1}
            alignItems={"center"}
          >
            <Typography>{file.name} </Typography>
            <IconButton
              onClick={handleDeleteFile.bind(null, file.name)}
              size="small"
            >
              <CancelIcon sx={{ color: red[500], fontSize: "17px" }} />
            </IconButton>
          </Stack>
        ))}
        <FileUploadButton
          accept="*"
          multiple={true}
          CustomButton={
            <CustomButton
              variant="containedBrown"
              text={"Add New Document"}
              startIcon={<AddCircleIcon color="primary" />}
            />
          }
          onFileChange={handleFileChange}
        />
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
