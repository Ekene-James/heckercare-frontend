import CustomModal from "components/atoms/CustomModal";
import React from "react";
import { cellHeight } from "../staticData";
import { convertFromMilitaryTime } from "utils/convertFromMillitaryTime";

const { Box, Typography, Paper, Stack } = require("@mui/material");
const {
  findDay,

  getCellHeight,
  randomBorderTopColor,
  findDayInMonth,
} = require("../util");

const CellComponent = ({ weekDay, apiData }) => {
  const modalRef = React.useRef(null);
  const cellDays = findDayInMonth(apiData, weekDay);

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      {cellDays.length ? (
        <React.Fragment>
          <Paper
            sx={{
              zIndex: 10,

              height: cellHeight - 20,
              width: "auto",

              marginBottom: "2px",
              borderRadius: "5px",
              border: "1px solid rgba(0,0,0,0.3)",
              borderTop: `5px solid ${randomBorderTopColor()}`,
              top: 0,
              left: 0,
              cursor: "pointer",
              boxShadow: "0px 4px 33px rgba(0, 0, 0, 0.09) !important",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: "4px",
            }}
            onClick={toggleModal}
          >
            <Stack
              direction={"column"}
              spacing={0.5}
              sx={{ maxHeight: "85%", overflowY: "auto" }}
            >
              <Typography variant="small" fontWeight={"bold"}>
                Appointments
              </Typography>
              {cellDays.map((dayDetails, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                >
                  <img
                    alt="profile_img"
                    src={
                      dayDetails?.doctor?.img ||
                      "/imgs/blank-profile-picture.png"
                    }
                    width={15}
                    height="15"
                    style={{
                      borderRadius: "50%",
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                  />

                  <Typography
                    variant="small"
                    sx={{
                      width: "85%",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {`${dayDetails?.patient?.firstName} ${dayDetails?.patient?.lastName}`}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
          <CustomModal
            ref={modalRef}
            childrenContSx={{
              p: 3,
              height: "fit-content !important",
              width: "30vw !important",
            }}
          >
            {cellDays.map((dayDetails, i) => (
              <Stack key={i} direction="column" spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" sx={{ mr: 1 }}>
                    {i + 1}
                  </Typography>
                  <img
                    alt="profile_img"
                    src={
                      dayDetails?.doctor?.img ||
                      "/imgs/blank-profile-picture.png"
                    }
                    width={30}
                    height="30"
                    style={{
                      borderRadius: "50%",
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                  />

                  <Typography variant="caption" sx={{}}>
                    {`${dayDetails?.patient?.firstName} ${dayDetails?.patient?.lastName}`}
                  </Typography>
                </Stack>
                <Typography variant="heading" sx={{ mt: 3, mb: 1 }}>
                  {" "}
                  Appointment With:
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <img
                    alt="profile_img"
                    src={
                      dayDetails?.doctor?.img ||
                      "/imgs/blank-profile-picture.png"
                    }
                    width={30}
                    height="30"
                    style={{
                      borderRadius: "50%",
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                  />
                  <Typography variant="caption" sx={{}}>
                    {`${dayDetails?.doctor?.fullName}`}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{}}>
                  {`Time: ${convertFromMilitaryTime(
                    dayDetails?.startTime
                  )} - ${convertFromMilitaryTime(dayDetails?.endTime)}`}
                </Typography>
              </Stack>
            ))}
          </CustomModal>
        </React.Fragment>
      ) : null}
    </>
  );
};

export default CellComponent;
