import { Chip, Stack, Typography } from "@mui/material";
import ViewReportNote from "components/molecules/patient/singlePatient/treatmentTab/assesmentLog/ViewReportNote";
import React from "react";
import CustomModal from "./CustomModal";

function DoctorsNoteCard({ item, showBoarder }) {
  const { src, doctorsName, patientName, title, body, time } = item;
  const modalRef = React.useRef(null);
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Stack
        direction="column"
        spacing={1.5}
        sx={{
          mt: 1,
          mb: 1,
          border: showBoarder ? "0.1px solid rgba(0,0,0,0.1)" : null,
          p: showBoarder ? 1 : null,
          borderRadius: showBoarder ? "5px" : null,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ backgroundColor: "background.lightBlue1", p: 1 }}
        >
          <img
            alt="dr_img"
            src="/imgs/blank-profile-picture.png"
            width={30}
            height="30"
            style={{
              borderRadius: "50%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
          <Typography variant="heading" textTransform={"capitalize"}>
            {doctorsName}
          </Typography>
        </Stack>
        <Stack direction="column" alignItems="start" spacing={1}>
          <Typography variant="heading" textTransform={"capitalize"}>
            {patientName}
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", opacity: "0.7" }}
            textTransform={"capitalize"}
          >
            {title}
          </Typography>
          <Typography sx={{ opacity: "0.7" }}>{body}</Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="small" sx={{ opacity: "0.7" }}>
            {time}
          </Typography>
          <Chip label="Read More" onClick={toggleModal} variant="outlined" />
        </Stack>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          height: "fit-content !important",
          minWidth: "30vw !important",
        }}
      >
        <ViewReportNote item={item} />
      </CustomModal>
    </>
  );
}

export default DoctorsNoteCard;
