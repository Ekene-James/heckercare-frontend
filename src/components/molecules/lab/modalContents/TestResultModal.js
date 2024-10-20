import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import CustomTextInput from "components/atoms/CustomTextInput";
import { exportToExcel } from "utils/exportToExcel";
import CustomModal from "components/atoms/CustomModal";
import TestResultUsageTable from "components/molecules/tabels/lab/TestResultUsageTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_LAB_EXPORT_DATA } from "utils/reactQueryKeys";
import ColorCodeChip from "components/atoms/ColorCodeChip";

const Details = ({ title, desc }) => {
  return (
    <Stack
      direction={"column"}
      spacing={1}
      alignItems={"flex-start"}
      justifyContent="center"
    >
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {title}
      </Typography>
      <Typography variant="body1">{desc}</Typography>
    </Stack>
  );
};
function TestResultModal({ handleClose, data, showStockComponent = true }) {
  const modalRef = React.useRef(null);

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  const handleExport = () => {
    window.open(data?.resultUrl, "_blank", "noreferrer");
  };

  let result = [];
  if (data?.result) {
    if (Object.keys(data?.result?.dynamicFields).length) {
      Object.entries(data?.result?.dynamicFields).forEach(
        ([fieldName, fieldObj]) => {
          result.push({
            name: fieldName,
            value: fieldObj?.value,
            type: fieldObj?.range?.type === "digit" ? "number" : "text",
            textVal:
              fieldObj?.range?.type === "text" ? fieldObj?.range?.normal : "",
            higher:
              fieldObj?.range?.type === "digit"
                ? fieldObj?.range?.normal.max
                : 0,
            lower:
              fieldObj?.range?.type === "digit"
                ? fieldObj?.range?.normal.min
                : 0,
          });
        }
      );
    }
  }
  // if (data?.result) {
  //   if (!Array.isArray(data?.result)) {
  //     Object.keys(data?.result).forEach((key) => {
  //       const obj = {
  //         name: key,
  //         value: data?.result[key],
  //       };

  //       result.push(obj);
  //     });
  //   } else {
  //     result = data?.result?.result;
  //   }
  // }

  return (
    <Stack p={5}>
      <Stack
        direction={"column"}
        spacing={3}
        sx={{ width: "100%", mt: 3, p: 2 }}
      >
        <Stack
          direction={"row"}
          sx={{ width: "100%" }}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Stack direction={"column"} spacing={1}>
            <Typography variant="displayMd">Test Result</Typography>

            <Typography>{data?.test?.testName}</Typography>
          </Stack>
          <CustomButton
            text={"Export Result"}
            variant="outlined"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handleExport}
            disabled={!data?.resultUrl}
          />
        </Stack>
        <Divider />
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={"center"}
          justifyContent="space-between"
          sx={{
            p: 2,
            borderRadius: "10px",
            backgroundColor: "background.gray3",

            width: "100%",
            border: "1px dashed rgba(0,0,0,0.5)",
          }}
        >
          <Stack direction={"row"} spacing={2}>
            <Details
              title="PATIENT NAME"
              desc={`${data?.patient?.firstName} ${data?.patient?.lastName}`}
            />
            <Details
              title="AGE/Gender"
              desc={`${data?.patient?.age}/${data?.patient?.gender}`}
            />
            <Details title="Unique id" desc={data?.uniqueCode} />
          </Stack>
          <CustomButton
            text={"View Note"}
            variant="outlined"
            color="primary"
            onClick={toggleModal}
          />
        </Stack>

        <Grid container spacing={4} rowGap={2} sx={{ mt: 2, width: "100%" }}>
          {result.map((res, i) => (
            <Grid key={i} item xs={12} sm={6}>
              <Stack>
                <CustomTextInput
                  title={res.name}
                  value={res.value}
                  disabled="true"
                  readOnly
                />
                {res?.type && (
                  <>
                    {res?.type === "number" ? (
                      <Stack mt={2}>
                        <Stack direction={"row"} alignItems={"center"} gap={2}>
                          <Typography
                            variant="displaySm"
                            sx={{
                              fontWeight: "700",
                              fontSize: "13px",
                            }}
                          >
                            Normal Range
                          </Typography>
                          <ColorCodeChip
                            type={"normal"}
                            style={{ height: "20px", width: "50px" }}
                          />
                        </Stack>
                        <Typography
                          variant="displaySm"
                          sx={{
                            fontWeight: "400",
                            fontSize: "10px",
                            opacity: "0.5",
                          }}
                        >
                          The established physiological range for healthy
                          individuals.
                        </Typography>

                        <Stack
                          alignItems={"center"}
                          justifyContent={"center"}
                          direction={"row"}
                          gap={2}
                        >
                          <CustomTextInput
                            title="Lower Limit"
                            value={res.lower}
                            name={"lower"}
                            type="number"
                            disabled="true"
                            readOnly
                          />
                          <Box sx={{ mt: 3 }}>
                            <svg
                              width="33"
                              height="13"
                              viewBox="0 0 33 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                                fill="#D9D9D9"
                              />
                            </svg>
                          </Box>

                          <CustomTextInput
                            title="Higher Limit"
                            value={res.higher}
                            name={"higher"}
                            type="number"
                            disabled="true"
                            readOnly
                          />
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack mt={4.5}>
                        <Typography
                          variant="displaySm"
                          sx={{
                            fontWeight: "400",
                            fontSize: "10px",
                            opacity: "0.5",
                          }}
                        >
                          The established physiological range for healthy
                          individuals.
                        </Typography>

                        <Stack
                          alignItems={"center"}
                          justifyContent={"center"}
                          direction={"row"}
                          gap={2}
                          mt={3}
                        >
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Typography
                              variant="displaySm"
                              sx={{
                                fontWeight: "700",
                                fontSize: "13px",
                                textWrap: "nowrap",
                              }}
                            >
                              Normal Range
                            </Typography>
                            <ColorCodeChip
                              type={"normal"}
                              style={{ height: "40px", width: "50px" }}
                            />
                          </Stack>
                          <Box>
                            <svg
                              width="33"
                              height="13"
                              viewBox="0 0 33 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                                fill="#D9D9D9"
                              />
                            </svg>
                          </Box>
                          <CustomTextInput
                            value={res.textVal}
                            name={"textVal"}
                            disabled="true"
                            readOnly
                          />
                        </Stack>
                      </Stack>
                    )}
                  </>
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
        {showStockComponent && data?.stockUsage?.length ? (
          <Stack spacing={2} mt={2}>
            <Typography variant="heading">Stock Usage</Typography>
            <TestResultUsageTable
              rows={data?.stockUsage?.map((stock) => {
                if (!stock?.item?.itemName) return {};
                return {
                  [stock?.item?.itemName]: stock.quantity,
                };
              })}
            />
          </Stack>
        ) : null}

        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <CustomButton
            text={"Export Result"}
            variant="outlined"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handleExport}
            disabled={!data?.resultUrl}
          />
          <CustomButton
            text={"Exit"}
            variant="text"
            color="primary"
            onClick={handleClose}
          />
        </Stack>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 2,
          width: {
            xs: "60vw",
            sm: "30vw",
          },
        }}
      >
        <Stack spacing={2} padding={5}>
          <Typography variant="heading">Doctor's Note</Typography>
          <Typography>{data?.note}</Typography>
        </Stack>
      </CustomModal>
    </Stack>
  );
}

export default TestResultModal;
