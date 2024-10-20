import { Divider, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import CustomTextInput from "components/atoms/CustomTextInput";
import { exportToExcel } from "utils/exportToExcel";
import CustomModal from "components/atoms/CustomModal";
import TestResultUsageTable from "components/molecules/tabels/lab/TestResultUsageTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_LAB_EXPORT_DATA } from "utils/reactQueryKeys";

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
          });
        }
      );
    }
  }

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
            <Grid key={i} item xs={12} sm={4}>
              <CustomTextInput
                title={res.name}
                value={res.value}
                disabled="true"
                readOnly
              />
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

        <Stack width={"80%"}>
          <CustomTextInput
            title={"Result Summary"}
            value={data?.resultSummary}
            disabled="true"
            readOnly
            multiline
          />
        </Stack>

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
