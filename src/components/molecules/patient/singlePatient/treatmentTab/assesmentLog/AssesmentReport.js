import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import CustomModal from "components/atoms/CustomModal";

import React from "react";

import { v4 as uuidv4 } from "uuid";
import ViewReportNote from "./ViewReportNote";

const AssesmentReport = ({ item }) => {
  const modalRef = React.useRef(null);
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          p: 2,
          backgroundColor: "rgba(105, 86, 229, 0.05)",
          width: {
            xs: "60vw",
            sm: "25vw",
          },
        }}
      >
        <Typography
          sx={{ fontWeight: "bold", mb: 1, color: "secondary.main" }}
          className="assesment_report_title"
          id={uuidv4()}
        >
          {item.topic}
        </Typography>
        <Box
          sx={{
            backgroundColor: "rgba(105, 86, 229, 0.1)",
            p: 2,
            fontSize: "12px",
          }}
          className="assesment_report_message"
          id={uuidv4()}
        >
          {item.note}
        </Box>
        <Box
          sx={{
            mt: 1,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction={"row"} spacing={1}>
            {item.tags.map((tag, i, arr) =>
              i <= 1 ? (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: {
                      xs: "0.5em",
                      sm: "0.7em",
                    },
                  }}
                  className="assesment_report_tag"
                  id={uuidv4()}
                />
              ) : (
                <Chip
                  key={tag}
                  label={`+${arr.length - 2}more`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: {
                      xs: "0.5em",
                      sm: "0.7em",
                    },
                  }}
                />
              )
            )}
          </Stack>

          <Button
            variant="outlined"
            color="secondary"
            sx={{
              fontSize: {
                xs: "0.5em",
                sm: "0.7em",
              },
            }}
            onClick={toggleModal}
          >
            View
          </Button>
        </Box>
      </Box>

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
};
export default AssesmentReport;
