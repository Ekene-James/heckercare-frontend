import { Box, Button, Stack } from "@mui/material";
import React from "react";

import RadioBtnWithDescription from "components/atoms/RadioBtnWithDescription";

import CustomTextInput from "components/atoms/CustomTextInput";

import CustomButton from "components/atoms/CustomButton";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_PATIENT_RECENT_VISIT } from "utils/reactQueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { toast } from "react-toastify";

const cardItems = [
  {
    header: "To Doctors/Hospitals",
    desc: "Refer a patient  to a doctor, department outside the hospital",
    value: "ANOTHER",
  },
  {
    header: "To Ward",
    desc: "Refer patient to ward (male, female ) for admission",
    value: "WARD",
  },
];

function Referal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formsState, setformsState] = React.useState({
    speciality: "",
    doctor: "",
    hospital: "",
    remark: "",
    type: "ANOTHER",
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

  //patch visit {recommendation}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/visit/${recentVisit?.data?._id}`,
      method: "patch",
      data: {
        recommendation: [formsState],
      },
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries([GET_PATIENT_RECENT_VISIT, id]);
        setformsState({
          speciality: "",
          doctor: "",
          hospital: "",
          remark: "",
          type: "ANOTHER",
        });
        toast.success("Success");
        navigate(`/home/patient/basic-information/${id}`);
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const handleClicked = (to) => {
    setformsState({
      ...formsState,
      type: to,
    });
  };
  const handleChange = (e) => {
    setformsState({
      ...formsState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Box
        sx={{
          width: {
            xs: "100%",

            lg: "70%",
          },
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          {cardItems.map((item, i) => (
            <RadioBtnWithDescription
              key={i}
              item={item}
              handleClicked={handleClicked}
              clicked={formsState.type}
              sx={{
                height: {
                  xs: "120px",
                  md: "150px",
                },
              }}
            />
          ))}
        </Box>
        {formsState.type === "ANOTHER" ? (
          <>
            <CustomTextInput
              title="Speciality"
              value={formsState.speciality}
              name="speciality"
              handleChange={handleChange}
              placeholder="Enter your text here"
            />
            <CustomTextInput
              title="Doctor/Clinician"
              value={formsState.doctor}
              name="doctor"
              handleChange={handleChange}
              placeholder="Enter your text here"
            />
            <CustomTextInput
              title="Hospital"
              value={formsState.hospital}
              name="hospital"
              handleChange={handleChange}
              placeholder="Enter your text here"
            />
          </>
        ) : null}

        <CustomTextInput
          title="Remark"
          value={formsState.remark}
          name="remark"
          handleChange={handleChange}
          placeholder="Start typing here"
          multiline={true}
          helperText={`${formsState.remark.length} / 2000`}
        />
      </Box>
      <Stack
        direction={"row"}
        spacing={1}
        sx={{ mt: 3, width: { xs: "50%", sm: "40%" } }}
      >
        <CustomButton
          text={"Send Referral"}
          color="secondary"
          sx={{ width: "100%" }}
          onClick={mutate}
          disabled={isLoading}
        />
      </Stack>
    </Box>
  );
}

export default Referal;
