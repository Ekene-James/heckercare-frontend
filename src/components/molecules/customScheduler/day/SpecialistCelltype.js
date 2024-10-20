import CustomModal from "components/atoms/CustomModal";
import React from "react";
import { convertFromMilitaryTime } from "utils/convertFromMillitaryTime";

const { Paper } = require("@mui/material");
const {
  randomBorderTopColor,
  findTime,
  getCellWidth,
  findDateTime,
} = require("../util");

const SpecialistCellType = ({ interval, shifts, currentDay }) => {
  const modalRef = React.useRef(null);
  let currentShift = [];
  currentShift = findDateTime(interval, shifts, currentDay);

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      {currentShift.length ? (
        <>
          <React.Fragment>
            <Paper
              sx={{
                zIndex: 10,
                position: "absolute",
                width: getCellWidth(currentShift[0]),
                height: "100%",

                borderRadius: "3px",
                border: "1px solid rgba(0,0,0,0.3)",
                borderLeft: `5px solid ${randomBorderTopColor()}`,
                top: 0,
                left: 0,
                cursor: "pointer",
                boxShadow: "0px 4px 33px rgba(0, 0, 0, 0.09) !important",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
              onClick={toggleModal}
            >
              {currentShift.map(
                (shift, i, arr) =>
                  `${shift?.patient?.firstName} ${shift?.patient?.lastName}${
                    i === arr.length - 1 ? "" : ","
                  } `
              )}
            </Paper>
          </React.Fragment>

          <CustomModal
            ref={modalRef}
            childrenContSx={{
              p: 3,
              height: "fit-content !important",
              width: "30vw !important",
            }}
          >
            <p>
              startTime:{convertFromMilitaryTime(currentShift[0]?.startTime)}
            </p>
            <p>endTime:{convertFromMilitaryTime(currentShift[0]?.endTime)}</p>
            <p>{`Patient(s): `}</p>
            <p>
              {" "}
              {currentShift.map(
                (shift, i, arr) =>
                  `${shift?.patient?.firstName} ${shift?.patient?.lastName}${
                    i === arr.length - 1 ? "" : ","
                  } `
              )}
            </p>
          </CustomModal>
        </>
      ) : null}
    </>
  );
};

export default SpecialistCellType;
