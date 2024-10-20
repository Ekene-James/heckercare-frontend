import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import React from "react";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import CustomButton from "components/atoms/CustomButton";
import { SEARCH_PATIENT } from "utils/reactQueryKeys";

const InviteMobilePatient = ({ handleClose }) => {
  const [search, setsearch] = React.useState("");
  const [onSelectPatient, setonSelectPatient] = React.useState(false);

  const [formsState, setformsState] = React.useState({
    patient: "",
    email: "",
  });

  //get patients
  const {
    isLoading,

    data: patients,
    refetch: refetchPatients,
  } = useCustomQuery(
    [SEARCH_PATIENT, search],
    {
      url: `/patients/get-all-patients`,
      data: {
        search,
      },
      method: "post",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!search && !onSelectPatient,
    }
  );

  // send login details
  const { mutate: handleSendPassword, isLoading: createPasswordLoading } =
    useCustomMutation(
      {
        url: `/patients/create-login-credentials`,
        method: "post",
        data: {
          email: formsState?.email,
          id: formsState?.patient,
        },
      },
      {
        onSuccess: () => {
          toast.success("Success");
          handleClose(true);
        },

        onError: (error) => toast.error(error.message),
      }
    );

  const handlePatientsOnselect = (patientDetails) => {
    setonSelectPatient(true);
    setsearch(`${patientDetails.firstName} ${patientDetails.lastName}`);
    setformsState({
      ...formsState,
      patient: patientDetails._id,
    });
  };

  const handleChange = (e) => {
    setformsState({
      ...formsState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container spacing={3} sx={{ p: 3 }} aria-label="assign-staff-modal">
      <Grid item xs={12}>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography variant="displayMd">Invite Patients </Typography>
          <Typography>Select patient and type in email to invite</Typography>
        </Stack>

        <Stack
          direction="column"
          alignItems="start"
          justifyContent="start"
          spacing={3}
          sx={{ width: "100%", mb: 2 }}
        >
          <SearchDropdown
            placeholder="Search ( with “Patient name” or “Patient ID”)"
            handleOnselect={handlePatientsOnselect}
            title="Patients's Information"
            createBtnTxt="Create New Patient"
            traySx={{ minWidth: "30vw" }}
            boxSx={{ width: "100%" }}
            data={patients?.data?.patients}
            isLoading={isLoading}
            search={search}
            setsearch={setsearch}
            reFetch={refetchPatients}
            setOnSelect={setonSelectPatient}
          />
          <CustomTextInput
            title="Email Address"
            value={formsState.email}
            name="email"
            placeholder={"Enter email address"}
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="start"
          spacing={1}
          sx={{ mt: 2, width: "100%" }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{}}
            disabled={createPasswordLoading}
            onClick={handleSendPassword}
          >
            Send Invite
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

export default InviteMobilePatient;
