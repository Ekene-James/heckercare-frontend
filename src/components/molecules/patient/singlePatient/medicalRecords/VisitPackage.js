import { Box, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";
import React from "react";
import { useParams } from "react-router-dom";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PATIENT_PACKAGE } from "utils/reactQueryKeys";

const Examination = ({ name, value }) => {
  return (
    <Stack
      gap={2}
      style={{
        borderRightColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
      }}
      sx={{ border: "2px solid black", p: 2 }}
    >
      <Typography
        sx={{ fontWeight: "400", fontSize: "16px", lineHeight: "24px" }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          fontWeight: "400",
          fontSize: "16px",
          lineHeight: "24px",
          opacity: "0.5",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
};
function Package({}) {
  const { id } = useParams();
  //get recent visits
  const {
    data: patientsPackage,
    isError,
    isLoading,
  } = useCustomQuery(
    [GET_PATIENT_PACKAGE, id],
    {
      url: `/appointments/get-last-appointment-by-patient/${id}`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <Box
        sx={{
          p: 2,
          backgroundColor: "primary.gray",
          display: "flex",
          alignContent: "center",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: "800",
            fontSize: "20px",
          }}
        >
          Packages{" "}
        </Typography>
      </Box>
      {isLoading ? (
        <CustomLoader />
      ) : isError ? (
        <Paper sx={{ p: 1 }}>
          <Typography>
            Something went wrong, Couldn't get package, refresh and try again
            Later
          </Typography>
        </Paper>
      ) : patientsPackage?.data?.package &&
        Object.keys(patientsPackage?.data?.package)?.length ? (
        <Stack gap={4}>
          <Box
            sx={{
              fontWeight: "800",
              fontSize: "18px",
              textTransform: "capitalize",
              color: "blue",
            }}
          >
            {patientsPackage?.data?.package?.name}
          </Box>

          <Stack gap={3}>
            <Typography
              sx={{
                fontWeight: "700",
                fontSize: "18px",
                lineHeight: "21.6px",
              }}
            >
              Physical Examination
            </Typography>
            {patientsPackage?.data?.package?.examinations?.map((exam) => (
              <Examination
                key={exam.title}
                name={exam.title}
                value={exam.summary}
              />
            ))}
          </Stack>

          <Stack gap={3}>
            <Typography
              sx={{ fontWeight: "700", fontSize: "18px", lineHeight: "21.6px" }}
            >
              Applicable Test Type
            </Typography>
            <ul style={{ padding: "0px 5px" }}>
              {patientsPackage?.data?.package?.tests?.map((test) => (
                <li
                  key={test.id}
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  >
                    {test.testName}
                  </Typography>
                </li>
              ))}
            </ul>
          </Stack>
        </Stack>
      ) : (
        <Typography>No Package assigned</Typography>
      )}
    </>
  );
}

export default Package;
