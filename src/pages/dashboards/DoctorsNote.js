import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomLoader from "components/atoms/CustomLoader";
import DoctorsNoteCard from "components/atoms/DoctorsNoteCard";
import React from "react";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_NURSE_DASHBOARD_ASSESSMENT_LOGS } from "utils/reactQueryKeys";

function DoctorsNote() {
  const { state } = useAuthCtx();

  //get doctors assement logs
  const { data: assessmentLogs, isLoading: assessmentLogsLoading } =
    useCustomQuery(
      [GET_NURSE_DASHBOARD_ASSESSMENT_LOGS],
      {
        url: `/admin/nurse-ward-logs/${state.user._id}`,
        method: "get",
      },
      {
        refetchOnWindowFocus: false,
        enabled: !!state.user._id,
        select: (res) => {
          const data = [];
          res.data.forEach((d) => {
            d.assessmentLog.forEach((log) => {
              if (log?.topic) {
                data.push({
                  ...log,
                  patientName: d.patientName,
                  patientId: d.patientId,
                  doctorsName: `${log.noteBy.firstName} ${log.noteBy.lastName}`,
                  body: log.note,
                  title: log?.topic || "No Title",
                  time: log?.time || "",
                });
              }
            });
          });

          return data;
        },
      }
    );

  return (
    <Stack spacing={2}>
      <Typography variant="displayLg">Doctor's Notes</Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {assessmentLogsLoading ? (
            <CustomLoader />
          ) : assessmentLogs?.length ? (
            assessmentLogs?.map((item, i) => (
              <Grid item xs={6} sm={4} key={i}>
                {" "}
                <DoctorsNoteCard item={item} showBoarder />{" "}
              </Grid>
            ))
          ) : (
            "No Log Found"
          )}
        </Grid>
      </Paper>
    </Stack>
  );
}

export default DoctorsNote;
