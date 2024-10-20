import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import React from "react";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomButton from "components/atoms/CustomButton";
import { Link } from "react-router-dom";
function DocsNoteModal({ handleClose, data }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{ p: 4 }}
      aria-label="doctors-note-modal-content"
    >
      <Grid item xs={1.5} sm={2}>
        <Box
          sx={{
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            p: 3,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 35px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            alt="folder_icon"
            src="/imgs/Note.png"
            height="50px"
            width="50px"
          />
        </Box>
      </Grid>
      <Grid item xs={11} sm={10} lg={9}>
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography variant="displayMd">Doctors's Note</Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "flex-start", sm: "space-between" }}
            alignItems={"flex-start"}
            sx={{
              width: "100%",
              p: 2,
              mt: 2,
              mb: 2,
              border: "0.5px dotted black",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <PersonOutlinedIcon />
              <Typography>Doctor-in-Charge</Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Link
                to={`/home/staff/${data?.doctor?._id}`}
                style={{ textTransform: "capitalize" }}
              >
                {data?.doctor?.fullName}
              </Link>
              <ArrowCircleUpOutlinedIcon />
            </Stack>
          </Stack>

          <CustomTextInput
            title="Notes "
            value={data?.note}
            name="notes"
            boxSx={{ width: "100%" }}
            placeholder="Note"
            readOnly={true}
            multiline
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
          sx={{ mt: 2, width: "100%" }}
        >
          <CustomButton variant="outlined" onClick={handleClose} text="Close" />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default DocsNoteModal;
