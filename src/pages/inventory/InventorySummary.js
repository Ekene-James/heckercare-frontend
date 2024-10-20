import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

import React from "react";

import CustomButton from "components/atoms/CustomButton";

import BackButton from "components/atoms/BackButton";
import CustomModal from "components/atoms/CustomModal";

import { useParams } from "react-router-dom";

const Description = ({
  title,
  desc,
  variant = "",
  alignItems = "flex-start",
}) => {
  return (
    <Stack
      direction="column"
      spacing={1}
      justifyContent="flex-start"
      alignItems={alignItems}
      m={0}
      p={0}
    >
      <Typography sx={{ opacity: 0.5 }}>{title}</Typography>
      <Typography sx={{ fontWeight: "bold" }} variant={variant}>
        {desc}
      </Typography>
    </Stack>
  );
};

function InventorySummary({ inventoryData }) {
  const { id } = useParams();

  const modalRef = React.useRef(null);

  const [summary, setsummary] = React.useState({});

  React.useLayoutEffect(() => {
    const data = inventoryData.find((inventory) => inventory.id === String(id));
    setsummary(data);
  }, []);

  const toggleModal = (details) => {
    modalRef?.current?.handleToggle();
  };

  return (
    <Box>
      <Typography variant="displayLg">Inventory</Typography>

      <Paper sx={{ p: 2 }}>
        <Stack
          direction="column"
          spacing={2}
          justifyContent="flex-start"
          alignItems={"flex-start"}
          mb={4}
        >
          <BackButton />
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
            justifyContent="space-between"
          >
            <Typography variant="displaySm">{`Summary`}</Typography>

            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent={{
                xs: "flex-start",
                lg: "center",
              }}
              alignItems={{
                xs: "flex-start",
                lg: "center",
              }}
              spacing={1}
            >
              <Typography sx={{ opacity: 0.5 }}>Date Created</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {summary.date}
              </Typography>

              <CustomButton
                text="Transaction History"
                variant="contained"
                color="secondary"
              />
            </Stack>
          </Stack>
        </Stack>

        <Grid container spacing={{ xs: 2, sm: 4, lg: 6 }} sx={{}}>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack
              direction="column"
              spacing={3}
              justifyContent="flex-start"
              alignItems={"flex-start"}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems={"center"}
              >
                <Box
                  sx={{
                    backgroundColor: "background.lightOrange",
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src="/imgs/Drug.png" alt="capsule" />
                </Box>
                <Description
                  title="Product Name"
                  desc={summary.products}
                  variant="displaySm"
                />
              </Stack>
              <Typography sx={{ opacity: 0.5 }}>Description</Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-start"
                alignItems={"center"}
                width="fit-content"
                mt={1}
              >
                <Typography sx={{ opacity: 0.5 }}>Product Category</Typography>
                <CustomButton text={"Stimulant"} variant="containedBrown" />
              </Stack>
              <Typography variant="displaySm">Cost & Sales Value</Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems={"center"}
                width="100%"
              >
                <Description title="Total Cost" desc={summary.totalCost} />
                <Description title="Unit Cost" desc={summary.unitCost} />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems={"center"}
                width="100%"
              >
                <Description title="Sales Tax" desc={summary.salesTax} />
                <Description
                  title="Shipping Cost"
                  desc={summary.shippingCost}
                  alignItems="flex-end"
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems={"center"}
                width="100%"
              >
                <Description title="Other Cost" desc={summary.otherCost} />
                <Description
                  title="Grand Total"
                  desc={summary.grandTotal}
                  alignItems="flex-end"
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems={"flex-start"}
              spacing={3}
            >
              <Description title="Available" desc={299} />
              <Description title="Manfacture Date" desc={"23th January 2022"} />
              <Description title="Vendor" desc={"D & W Pharmaceutical Store"} />
            </Stack>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems={"flex-start"}
              spacing={2}
              mt={5}
            >
              <Typography variant="displaySm">Product Image</Typography>
              <img src="/imgs/productImg.png" alt="product_img" />

              <CustomButton text={"View Image"} color="secondary" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems={"flex-start"}
              spacing={3}
            >
              <Description title="Tracking ID" desc={"7482919391173781"} />
              <Description title="Expiry Date" desc={"23th January 2025"} />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
        }}
        ariaLabel="usage-history-modal"
      ></CustomModal>
    </Box>
  );
}

InventorySummary.defaultProps = {
  inventoryData: [
    {
      id: "123456789a",
      products: "Omnipaque",
      location: "Baruwa, Head office",
      module: "Radiology",
      quantity: "3",
      department: "Hand Gloves",
      category: "Handy Material",
      date: "Tues 23th Jan, 2022",
      totalCost: "₦10,600",
      unitCost: "₦10,600",
      salesTax: "₦10,600",
      shippingCost: "₦10,600",
      otherCost: "Null",
      grandTotal: "₦10,600",
    },
    {
      id: "123456789b",
      products: "Ciprofloxacin",
      location: "Baruwa, Head office",
      module: "Radiology",
      quantity: "3",
      department: "Hand Gloves",
      category: "Handy Material",
      date: "Tues 23th Jan, 2022",
      totalCost: "₦10,600",
      unitCost: "₦10,600",
      salesTax: "₦10,600",
      shippingCost: "₦10,600",
      otherCost: "Null",
      grandTotal: "₦10,600",
    },
    {
      id: "123456789c",
      products: "Azithromycin",
      location: "Baruwa, Head office",
      module: "Radiology",
      quantity: "3",
      department: "Hand Gloves",
      category: "Handy Material",
      date: "Tues 23th Jan, 2022",
      totalCost: "₦10,600",
      unitCost: "₦10,600",
      salesTax: "₦10,600",
      shippingCost: "₦10,600",
      otherCost: "Null",
      grandTotal: "₦10,600",
    },
  ],
};

export default InventorySummary;
