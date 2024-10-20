import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomLoader from "components/atoms/CustomLoader";
import SearchBar from "components/atoms/SearchBar";
import PrescriptionSubComponent from "components/molecules/patient/singlePatient/prescriptionSubComponent/PrescriptionSubComponent";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setcurrentTab } from "store/contextStore/treatmentTab/TabAction";
import { useTabCtx } from "store/contextStore/treatmentTab/TabStore";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PATIENT_PRESCRIPTIONS } from "utils/reactQueryKeys";
import CustomAccordion from "../../../../components/atoms/CustomAccordion";

function Prescriptions() {
  const { dispatch } = useTabCtx();
  const { id } = useParams();
  const navigate = useNavigate();

  //get all prescriptions
  const {
    isLoading: prescriptionsLoading,

    data: prescriptions,
    refetch: refetchPrescriptions,
  } = useCustomQuery(
    [GET_PATIENT_PRESCRIPTIONS, id],
    {
      url: `/prescription/patient/${id}/pending`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleAddprescription = () => {
    dispatch(setcurrentTab(5));
    navigate(`/home/patient/treatments/${id}`);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Prescription List
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <Button
          variant="contained"
          sx={{ fontSize: "12px", mr: 1, mb: { xs: 1, sm: 0 } }}
          color="secondary"
          onClick={handleAddprescription}
        >
          Add Prescription
        </Button>
      </Box>

      <Stack
        spacing={{ xs: 0.5, sm: 1 }}
        alignItems="flex-start"
        justifyContent={"flex-start"}
        sx={{ p: { xs: 0, sm: 2, xl: 1 }, mt: 2 }}
      >
        {prescriptionsLoading ? (
          <CustomLoader />
        ) : prescriptions?.data?.length ? (
          prescriptions?.data?.map((item, i) => (
            <Stack
              direction={"row"}
              spacing={1}
              sx={{
                // display: "flex",
                alignItems: "flex-start",
                // justifyContent: {
                //   xs: "space-around",

                //   xl: "space-between",
                // },
                width: {
                  xs: "95%",
                  sm: "96%",
                },
              }}
              key={item._id}
            >
              <Box
                sx={{
                  backgroundColor: "background.lightBlue",
                  p: 2,
                  pt: 1,
                  pb: 1,
                  borderRadius: "4px",
                  mr: 1,
                }}
              >
                {i + 1}
              </Box>

              <CustomAccordion
                item={{
                  ...item,
                  title: item.uniqueCode,

                  subtitle: moment(new Date(item.createdAt)).format(
                    "MMMM Do, YYYY"
                  ),
                  detailsComponent: <PrescriptionSubComponent data={item} />,
                }}
              />
            </Stack>
          ))
        ) : (
          "No Data Found"
        )}
        {}
      </Stack>
    </Paper>
  );
}

export default Prescriptions;
