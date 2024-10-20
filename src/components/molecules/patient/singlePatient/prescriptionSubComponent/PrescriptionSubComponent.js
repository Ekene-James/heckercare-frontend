import { Box, Button, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import React from "react";
import CsvDownloader from "react-csv-downloader";

import PrintIcon from "@mui/icons-material/Print";
import AccordionPrescriptionTable from "components/molecules/tabels/patient/AccordionPrescriptionTable";
import { exportToExcel } from "utils/exportToExcel";
import { useParams } from "react-router-dom";
const columns = [
  {
    id: "product",
    displayName: "product",
  },
  {
    id: "notes",
    displayName: "notes",
  },
  {
    id: "frequency",
    displayName: "frequency",
  },
  {
    id: "routeOfAdmin",
    displayName: "Route Of Admin",
  },
  {
    id: "duration",
    displayName: "duration",
  },
  {
    id: "amount",
    displayName: "amount",
  },
  {
    id: "foodRelation",
    displayName: "foodRelation",
  },
  {
    id: "doctorInCharge",
    displayName: "doctorInCharge",
  },
];
const formatExportData = (data, doctorInCharge) => {
  if (!data || !data?.length) return;

  const formartted = data.map((d) => {
    return {
      ...d,
      doctorInCharge,
      product: d.product.drugName,
    };
  });
  return formartted;
};
function PrescriptionSubComponent({ data }) {
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(
        formatExportData(data.items, data.doctor.fullName),
        `prescription_report_${data.uniqueCode}_${data.createdAt}`
      );
    }
  };

  return (
    <Box
      sx={{
        boxShadow: "0px 4px 33px rgba(0, 0, 0, 0.1)",
        p: { xs: 1, sm: 2 },
        width: "100%",
      }}
    >
      <Stack
        direction={"row"}
        spacing={1}
        sx={{ width: "100%", mb: 2 }}
        justifyContent="flex-end"
      >
        {/* <CustomButton
          text="View Payment Receipt"
          variant="text"
          color="secondary"
        /> */}
        <CustomMenu
          caption="Export"
          icon={<PrintIcon />}
          onClickItem={handleExport}
          popperSx={{ width: "12%" }}
          disabled={!data?.items?.length}
          items={[
            {
              name: (
                <CsvDownloader
                  filename={`prescription_report_${data.uniqueCode}_${data.createdAt}`}
                  extension=".csv"
                  columns={columns}
                  datas={
                    formatExportData(data.items, data?.doctor?.fullName) || []
                  }
                  style={{ width: "100%" }}
                >
                  <Typography>CSV</Typography>
                </CsvDownloader>
              ),
            },
            {
              name: "Excel",
            },
          ]}
        />
      </Stack>
      <AccordionPrescriptionTable data={data} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mt: 2,
        }}
      ></Box>
    </Box>
  );
}

export default PrescriptionSubComponent;
