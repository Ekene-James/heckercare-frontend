import { PrintOutlined, ShortcutOutlined } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";

import React from "react";

import DoneIcon from "@mui/icons-material/Done";
import { numberFormatter } from "utils/numberFormatter";

const BillSection = ({ details, receiptLink }) => {
  return (
    <Box
      component={"section"}
      aria-label="bill details"
      style={{
        border: "1px dashed #000000",
        borderRadius: "4px",
        padding: "20px",
        margin: "50px",
      }}
    >
      <Stack
        direction="column"
        sx={{
          backgroundColor: "rgba(248, 100, 100, 0.03)",
          width: "100%",
          padding: "28px 160px",
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
            sx={{ fontWeight: "700", fontSize: "32px", lineHeight: "150%" }}
          >
            {/* Transaction ID */}
          </Typography>
          <Typography
            color="primary"
            sx={{
              color: "#c4c4c4",
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "150%",
            }}
          >
            Transaction ID: {`${details?.uniqueCode}`}
          </Typography>
        </Stack>
        <Stack direction="column" sx={{ margin: "40px 0px", gap: "16px" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ varticalAlign: "center" }}
          >
            <Grid
              item
              sx={{
                color: "#495057",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "150%",
              }}
            >
              Payment Status
            </Grid>

            {!!details && details?.status === "PAID" ? (
              <Grid
                item
                sx={{
                  color: "green",
                  fontSize: "14px",
                  fontWeight: "800",
                  lineHeight: "150%",
                  alignItems: "center",
                  display: "flex",
                  gap: "2px",
                }}
              >
                <DoneIcon fontSize="small" />
                <span>Paid</span>
              </Grid>
            ) : (
              <Grid
                item
                sx={{
                  color: "#DB1E36",
                  fontSize: "14px",
                  fontWeight: "800",
                  lineHeight: "150%",
                  alignItems: "between",
                  display: "flex",
                  gap: "2px",
                }}
              >
                <ShortcutOutlined
                  fontSize="small"
                  sx={{ transform: "rotate(180deg)" }}
                />
                <span>Unpaid</span>
              </Grid>
            )}
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ varticalAlign: "center" }}
          >
            <Grid
              item
              sx={{
                color: "#495057",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "150%",
              }}
            >
              Amount
            </Grid>
            <Grid
              item
              sx={{
                color: "#495057",
                fontSize: "14px",
                fontWeight: "800",
                lineHeight: "150%",
              }}
            >
              {`₦${numberFormatter(details?.totalCost)}`}
            </Grid>
          </Grid>
        </Stack>
        <CustomButton
          variant="contained"
          color="success"
          text={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
              }}
            >
              <PrintOutlined />

              <a
                href={receiptLink}
                style={{ color: "white", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Receipt
              </a>
            </div>
          }
        />
      </Stack>
    </Box>
  );
};
export default BillSection;
