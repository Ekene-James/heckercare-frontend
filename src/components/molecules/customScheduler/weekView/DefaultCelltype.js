import CustomModal from "components/atoms/CustomModal";
import React from "react";
import { cellHeight } from "../staticData";
import { convertFromMilitaryTime } from "utils/convertFromMillitaryTime";

const { Box, Typography, Paper, Stack } = require("@mui/material");
const {
  findDay,
  isCurrentYear,
  isCurrentMonth,
  getCellHeight,
  randomBorderTopColor,
} = require("../util");

const ImageContainer = ({ data }) => {
  const slicedData = data.slice(0, 4);
  let more = 0;
  if (data.length > 4) more = data.length - 4;

  return (
    <Stack direction={"row"} spacing={0}>
      {slicedData.map((d, i) => (
        <img
          key={i}
          alt="profile_img"
          src={d.staffDetails.img || "/imgs/blank-profile-picture.png"}
          width={15}
          height="15"
          style={{
            borderRadius: "50%",
            objectFit: "contain",
            objectPosition: "center",
            marginBottom: "5px",
            marginTop: "4px",
            marginLeft: "-7px",
          }}
        />
      ))}
      {more ? (
        <Typography
          variant="small"
          sx={{ marginBottom: "5px", marginTop: "4px" }}
        >{`+${more} more`}</Typography>
      ) : null}
    </Stack>
  );
};

const DefaultCelltype = ({ weekDay, time, apiData }) => {
  const modalRef = React.useRef(null);
  const cellDay = findDay(apiData, weekDay.getDate());

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  const currentMonth = weekDay.getMonth() + 1;
  const currentYr = weekDay.getFullYear();

  // currentDay === new Date(day.fullDate).getDate()
  return (
    <>
      {cellDay.length
        ? cellDay.map((day, i) =>
            day?.startTime === time.militaryTime &&
            isCurrentYear(currentYr, day.fullDate) &&
            isCurrentMonth(currentMonth, day.fullDate) ? (
              <React.Fragment key={i}>
                <Paper
                  sx={{
                    zIndex: 10,
                    position: "absolute",
                    height: getCellHeight(day),
                    width: "100%",

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
                  <ImageContainer data={day.staffDetails} />
                  <Stack
                    direction={"column"}
                    spacing={0.5}
                    sx={{ maxHeight: "85%", overflowY: "auto" }}
                  >
                    {day.staffDetails.map((dayDetails, i) => (
                      <Typography key={i} variant="small">
                        {dayDetails?.staffDetails?.fullName}
                      </Typography>
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
                  <p>Date : {day.fullDate.split("T")[0]}</p>
                  <p>Start Time:{convertFromMilitaryTime(day?.startTime)}</p>
                  <p>End Time:{convertFromMilitaryTime(day.endTime)}</p>
                  <p>Shift Name:{day.shiftName}</p>
                </CustomModal>
              </React.Fragment>
            ) : null
          )
        : null}
    </>
  );
};

export default DefaultCelltype;
