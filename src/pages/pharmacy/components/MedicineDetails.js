import { Box, Grid, Stack, Typography } from "@mui/material";

import CustomTextInput from "components/atoms/CustomTextInput";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";
import { PrintOutlined, Search, ShortcutOutlined } from "@mui/icons-material";
import CustomAccordion from "components/atoms/CustomAccordion";
import PrescriptionDrugDetail from "./PrescriptionDrugDetail";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { currencyFormatter } from "utils/numberFormatter";

const BillSection = ({ prescription }) => {
  return (
    <Box
      component={"section"}
      aria-label="bill details"
      style={{
        border: "1px dashed #000000",
        borderRadius: "4px",
        padding: "8px",
        width: {
          xs: "100%",
          sm: "100%",
        },
      }}
    >
      <Stack
        direction="column"
        sx={{
          backgroundColor: "rgba(248, 100, 100, 0.03)",
          width: "100%",
          padding: "28px 16px",
        }}
      >
        <Stack
          direction="column"
          sx={{
            textAlign: "center",
            gap: "9px",
          }}
        >
          <Typography
            sx={{
              color: "#979797",
              fontWeight: "800",
              fontSize: "20px",
              lineHeight: "120%",
            }}
          >
            Billing Details
          </Typography>
          <Typography
            color="primary"
            sx={{ fontWeight: "700", fontSize: "1.3rem" }}
          >
            {currencyFormatter(prescription?.totalCost)}
          </Typography>
          <Typography
            color="primary"
            sx={{
              color: "#c4c4c4",
              fontWeight: "400",
              fontSize: "14px",
            }}
          >
            Payment has been made
          </Typography>
        </Stack>
        <Stack direction="column" sx={{ margin: "40px 0px", width: "100%" }}>
          <Stack
            direction={"row"}
            spacing={1}
            alignItems="center"
            justifyContent={"space-between"}
            sx={{ width: "100%" }}
          >
            <Typography>Payment Status</Typography>

            {prescription?.status === "PAID" ||
            prescription?.status === "DISPENSED" ? (
              <Stack direction={"row"} spacing={0.5} alignItems="center">
                <DoneIcon fontSize="small" color="success" />
                <Typography>Paid</Typography>
              </Stack>
            ) : (
              <Stack direction={"row"} spacing={0.5} alignItems="center">
                <DoDisturbIcon
                  fontSize="small"
                  color="error"
                  sx={{ transform: "rotate(180deg)" }}
                />
                <Typography>Unpaid</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

function MediceDetailsModal({ closeModal, details }) {
  return (
    <Stack spacing={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack
                direction={"row"}
                spacing={1}
                alignItems="center"
                width={"100%"}
              >
                <Typography variant="heading">Prescription ID</Typography>

                <CustomTextInput
                  title=""
                  value={details._id}
                  disabled="true"
                  readOnly
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                title="Issuer/Doctor/Receptionist"
                value={details?.doctor?.fullName}
                disabled="true"
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                title="Patient's Name"
                value={`${details?.patient?.firstName} ${details?.patient?.lastName}`}
                placeholder={"Name"}
                disabled="true"
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                title="pharmacist"
                value={details?.pharmacist?.fullName}
                placeholder={"Name"}
                disabled="true"
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              {details?.items.map((item, i) => (
                <CustomAccordion
                  key={i}
                  item={{
                    title: item.product?.drugName,
                    changeOnExpanded: true,
                    detailsComponent: <PrescriptionDrugDetail data={item} />,
                  }}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
          }}
        >
          <BillSection prescription={details} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default MediceDetailsModal;
