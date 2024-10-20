import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import React from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Link } from "react-router-dom";
import CustomTextInput from "components/atoms/CustomTextInput";
function ModalContent({ handleClose, content }) {
  return (
    <Grid container spacing={2} sx={{}} aria-label="doctors-note-modal-content">
      <Grid item xs={1.5} sm={3}>
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
      <Grid item xs={11} sm={9}>
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography variant="displayMd">Doctors's Note</Typography>
        </Stack>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: "column",
            mt: 2,
            p: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "2px solid black",
              p: 1,
            }}
          >
            <>
              <PersonOutlineOutlinedIcon />
              <Typography sx={{ ml: 1, fontSize: "12px" }}>
                Doctor-in-Charge
              </Typography>
            </>
            <Link
              to={`/home/staff/${content?.noteBy?._id}`}
              style={{ marginLeft: "20px" }}
            >
              {content?.noteBy?.fullName}
            </Link>
          </Box>
          <CustomTextInput
            title="Diagnosis (Major)"
            value={content?.topic}
            name="diagnosis"
            disabled={"true"}
            sx={{ width: "100%", backgroundColor: "rgba(132, 132, 132, 0.2)" }}
            boxSx={{ width: "100%" }}
          />
          <CustomTextInput
            title="Notes"
            value={content?.note}
            name="notes"
            disabled={"true"}
            multiline={true}
            sx={{ width: "100%", backgroundColor: "rgba(132, 132, 132, 0.2)" }}
            boxSx={{ width: "100%" }}
          />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={"center"}
            mt={1}
          >
            {content?.tags?.map((tag) => (
              <Button
                variant="outlined"
                key={tag}
                sx={{
                  fontSize: "10px",
                  border: "1px solid black",
                  color: "primary.main",
                  alignSelf: "start",
                }}
              >
                {tag}
              </Button>
            ))}
          </Stack>

          <Button
            variant="outlined"
            sx={{
              mt: 2,
              alignSelf: "start",
              border: "1px solid rgba(0,0,0,0.3)",
              color: "primary.main",
              width: "30%",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ModalContent;
