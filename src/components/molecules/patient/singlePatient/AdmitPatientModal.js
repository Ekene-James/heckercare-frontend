import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import React from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PATIENT, GET_WARDS } from "utils/reactQueryKeys";

const AdmitPatientModal = ({ onClose }) => {
  const { id } = useParams();
  const [ward, setward] = React.useState("");
  const queryClient = useQueryClient();
  const patient = queryClient.getQueryData([GET_PATIENT, id]);

  //get all wards
  const { data: wardData } = useCustomQuery(
    GET_WARDS,
    {
      url: `/wards/get-all-wards`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) =>
        data?.data?.wards.map((d) => {
          return {
            name: d.name,
            value: d._id,
          };
        }),
    }
  );

  //admit patient to ward
  const { mutate: admitPatient, isLoading: admitPatientLoading } =
    useCustomMutation(
      {
        url: `/wards/admit-patient-to-ward/${ward}/${id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_PATIENT, id]);
          toast.success("Success");
          onClose();
        },

        onError: (error) => {
          toast.error(error.message);
          // if (error.message.length) {
          //   error.message.map((msg) => toast.error(msg));
          // } else {
          // }
        },
      }
    );
  return (
    <Box
      sx={{
        width: { sm: "100%", xs: "90%" },

        overflowY: "auto",
        margin: "auto",
      }}
    >
      <Paper
        sx={{
          p: 2,
          width: "100%",
          minHeight: "100%",
          margin: "auto",
          minWidth: {
            xs: "90%",
            sm: "90%",
          },
          borderRadius: "4px",
          position: "relative",
        }}
      >
        <Stack
          direction="column"
          gap={2}
          alignItems="center"
          sx={{
            width: "70%",
            margin: "auto",
            my: "22px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div>
          <Typography variant="displayMd">Admit Patient to Ward</Typography>
          <Typography color="gray" textAlign={"center"}>
            Select the ward to admit patient toast
          </Typography>
          <CustomTextInput
            title="Patient Name"
            value={`${patient?.data?.firstName} ${patient?.data?.lastName}`}
            placeholder={"Enter Name"}
            readOnly={true}
            disabled="true"
            boxSx={{ width: "100%" }}
          />

          <CustomSelect
            options={wardData}
            label="Wards"
            state={ward}
            handleChange={(e) => setward(e.target.value)}
            haveTopLabel={true}
            placeholder="Select Ward"
          />

          <Grid item xs={12} sm={12}>
            <CustomButton
              sx={{ marginRight: "8px" }}
              color="primary"
              variant="outlined"
              text={"Cancel"}
              onClick={onClose}
            />
            <CustomButton
              sx={{ marginLeft: "8px" }}
              color="secondary"
              variant="contained"
              text={"Admit"}
              onClick={admitPatient}
              disabled={admitPatientLoading}
            />
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};
export default React.memo(AdmitPatientModal);
