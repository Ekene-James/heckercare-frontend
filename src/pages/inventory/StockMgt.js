import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import React from "react";

import CustomButton from "components/atoms/CustomButton";
import StockMgtCard from "components/molecules/inventory/stockMgt/StockMgtCard";
import CustomModal from "components/atoms/CustomModal";
import RecordUsageModal from "components/molecules/inventory/modalContent/stockMgt/RecordUsage";

function StockMgt({ stockMgtData }) {
  // const modalRef = React.useRef(null);
  // const toggleModal = () => {
  //   modalRef?.current?.handleToggle();
  // };
  return (
    <Box>
      <Stack
        direction={"row"}
        sx={{ width: "100%" }}
        justifyContent="space-between"
      >
        <Typography variant="displayLg">Stock Management</Typography>
        {/* <CustomButton
          text="Record Usage"
          variant="contained"
          color="success"
          onClick={toggleModal}
        /> */}
      </Stack>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={2} sx={{ mt: 1, margin: "auto" }}>
          {stockMgtData.map((item) => (
            <Grid item xs={12} sm={5} key={item.id}>
              <StockMgtCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Paper>
      {/* <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "95%",
            sm: "80%",
          },
        }}
        ariaLabel="record-usage-modal"
      >
        <RecordUsageModal />;
      </CustomModal> */}
    </Box>
  );
}
StockMgt.defaultProps = {
  stockMgtData: [
    {
      id: 1,
      title: "Laboratory",
      slug: "laboratory",
      desc: "",
    },
    {
      id: 2,
      title: "Radiology",
      slug: "radiology",
      desc: "",
    },
    // {
    //   id: 3,
    //   title: "Pharmacy",
    //   slug: "pharmacy",
    //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci tincidunt tempor metus massa a sedtincidunt tempor m",
    // },
    // {
    //   id: 4,
    //   title: "Human Resource (HR)",
    //   slug: "human-resource",
    //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci tincidunt tempor metus massa a sedtincidunt tempor m",
    // },
    // {
    //   id: 5,
    //   title: "Billing",
    //   slug: "billing",
    //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci tincidunt tempor metus massa a sedtincidunt tempor m",
    // },
    // {
    //   id: 6,
    //   title: "Nurse Station",
    //   slug: "nurse-station",
    //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci tincidunt tempor metus massa a sedtincidunt tempor m",
    // },
  ],
};
export default StockMgt;
