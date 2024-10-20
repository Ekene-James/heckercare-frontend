import { Box, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import { useFormik } from "formik";
import React, { useRef } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PATIENT_RECENT_VISIT } from "utils/reactQueryKeys";

const initialValues = {
  topic: "",
  note: "",
  tags: [],
};

const getSelectedTags = (chipState) => {
  const selectedTags = [];
  for (const key in chipState) {
    if (chipState[key] === true) selectedTags.push(key);
  }

  return selectedTags;
};
const data = ["Vitals", "Allergies", "Investigations", "Prescription"];
function DoctorsNote({ handleNext }) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { handleChange, values } = useFormik({
    initialValues,
  });

  const [chipState, setchipState] = React.useState({
    Vitals: false,
    Allergies: false,
    Investigations: false,
    Prescription: false,
  });

  //get recent visits
  const { data: recentVisit } = useCustomQuery(
    [GET_PATIENT_RECENT_VISIT, id],
    {
      url: `/visit/recent/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //patch visit {assesmentlog}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/visit/${recentVisit?.data?._id}`,
      method: "patch",
      data: {
        assessmentLog: [{ ...values, tags: getSelectedTags(chipState) }],
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_PATIENT_RECENT_VISIT, id]);
        toast.success("Success");
        handleNext();
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const handleClickChip = (item) => {
    setchipState({
      ...chipState,
      [item]: !chipState[item],
    });
  };

  return (
    <Box>
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
            lg: "50%",
          },
          mt: 2,
        }}
      >
        <CustomTextInput
          title="Diagnosis (Major)"
          value={values.topic}
          name="topic"
          handleChange={handleChange}
          placeholder="Enter your text here"
        />
        <CustomTextInput
          title="Notes"
          value={values.note}
          name="note"
          handleChange={handleChange}
          placeholder="Start typing here"
          multiline={true}
          rows={15}
          helperText={`${values.note.length} / 2000`}
        />
        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography variant="heading">Tags</Typography>
        </Box>
        <Stack direction={"row"} spacing={1} sx={{ width: "100%" }}>
          {data.map((item, i) => (
            <CustomButton
              text={item}
              key={i}
              onClick={() => handleClickChip(item)}
              variant={chipState[item] ? "contained" : "outlined"}
              color={chipState[item] ? "secondary" : "primary"}
              sx={{
                border: !chipState[item] ? "1px solid black" : "",
                color: !chipState[item] ? "primary.main" : "",
              }}
            />
          ))}
        </Stack>
      </Box>
      <Stack direction={"row"} justifyContent="space-between" mt={3}>
        <CustomButton
          text={"Next"}
          onClick={handleNext}
          variant="containedBrown"
          sx={{ minWidth: "30%" }}
        />
        <CustomButton
          text={"Add"}
          sx={{ minWidth: "30%" }}
          disabled={isLoading}
          onClick={mutate}
        />
      </Stack>
    </Box>
  );
}

export default DoctorsNote;
