import { Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import CustomLoader from "components/atoms/CustomLoader";
import moment from "moment";
import React from "react";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PACKAGES, GET_SAMPLE_STANDARDS } from "utils/reactQueryKeys";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CustomModal from "components/atoms/CustomModal";
import SampleStandardsModal from "./SampleStandardsModal";
import { fromCamelCase } from "utils/handleCamelse";

const Card = ({ details, openEditModal }) => {
  return (
    <>
      <Stack
        spacing={2}
        p={2}
        sx={{
          border: "0.2px solid rgba(0,0,0,0.1)",
          borderRadius: "5px",
          p: 2,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <Stack>
            <Typography
              sx={{
                fontWeight: "bold",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "200px",
                textTransform: "capitalize",
              }}
            >
              {fromCamelCase(details.name)}
            </Typography>
            <Typography sx={{ opacity: 0.7 }} variant="small">
              Last updated{" "}
              {moment(details?.dateUpdated).format("MMMM Do, YYYY")}
            </Typography>
            <Typography
              sx={{
                opacity: 0.8,
                fontWeight: "600",
                fontSize: "12px",
                lineHeight: "13.2px",
              }}
              variant="small"
            >
              Normal Range
            </Typography>
            <Stack direction={"row"} gap={2} alignItems={"center"}>
              <Typography
                sx={{
                  fontWeight: "800",
                  fontSize: "21px",
                  lineHeight: "26.36px",
                }}
                variant="h6"
              >
                {details?.normal?.min}

                <sub
                  style={{
                    color: "iherit",
                    fontSize: "8.43px",
                    lineHeight: "10.59px",
                    fontWeight: "400",
                  }}
                >
                  {details?.unit}
                </sub>
              </Typography>
              <svg
                width="38"
                height="6"
                viewBox="0 0 38 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3ZM32.3333 3C32.3333 4.47276 33.5272 5.66667 35 5.66667C36.4728 5.66667 37.6667 4.47276 37.6667 3C37.6667 1.52724 36.4728 0.333333 35 0.333333C33.5272 0.333333 32.3333 1.52724 32.3333 3ZM3 3.5H35V2.5H3V3.5Z"
                  fill="#D9D9D9"
                />
              </svg>
              <Typography
                sx={{
                  fontWeight: "800",
                  fontSize: "21px",
                  lineHeight: "26.36px",
                }}
                variant="h6"
              >
                {details?.normal?.max}
                <sub
                  style={{
                    color: "iherit",
                    fontSize: "8.43px",
                    lineHeight: "10.59px",
                    fontWeight: "400",
                  }}
                >
                  {details?.unit}
                </sub>
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={() => openEditModal(details)}>
            <BorderColorIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
};

function SampleStandards() {
  const modalRef = React.useRef(null);
  const [clickedCard, setclickedCard] = React.useState({});
  const toggleModal = (details) => {
    if (!!details) setclickedCard(details);

    modalRef?.current?.handleToggle();
  };
  //get vitals range
  const {
    data: ranges,
    isLoading: isStandardsLoading,
    isError: isStandardsError,
  } = useCustomQuery(
    [GET_SAMPLE_STANDARDS],
    {
      url: `/visit/item/vital-signs/settings`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data;
      },
    }
  );
  return (
    <>
      <Stack gap={4}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "800", fontSize: "28px", lineHeight: "42px" }}
        >
          Sample Standard
        </Typography>
        <Paper sx={{ p: 4 }}>
          {isStandardsLoading ? (
            <CustomLoader />
          ) : isStandardsError ? (
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          ) : (
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {Object.keys(ranges)?.length ? (
                Object.entries(ranges)?.map(([key, val]) =>
                  key === "_id" ||
                  key === "id" ||
                  key === "createdAt" ? null : (
                    <Grid item xs={12} sm={4} lg={3} key={key}>
                      <Card
                        details={{ ...val, name: key }}
                        openEditModal={toggleModal}
                      />
                    </Grid>
                  )
                )
              ) : (
                <Typography fontWeight={"bold"}>
                  No Sample Standard Found
                </Typography>
              )}
            </Grid>
          )}
        </Paper>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 6,
          width: {
            xs: "95%",
            sm: "40vw",
          },
        }}
        cleanUp={() => setclickedCard({})}
      >
        <SampleStandardsModal close={toggleModal} data={clickedCard} />
      </CustomModal>
    </>
  );
}

export default SampleStandards;
