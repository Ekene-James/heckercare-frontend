import { Grid, Stack, Typography } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import GoodsReceivedTable from "components/molecules/tabels/pharmacy/GoodsReceivedTable";
import React from "react";

function GoodsReceived({ data, handleChangeDetail, handleExpiryDate }) {
  return (
    <GoodsReceivedTable
      data={data}
      handleChangeDetail={handleChangeDetail}
      handleExpiryDate={handleExpiryDate}
    />
    // <Stack width="100%">
    //   <Grid container spacing={1} backgroundColor="background.custom" p={2}>
    //     <Grid item xs={2.4}>
    //       <Typography>Drug Name</Typography>
    //     </Grid>
    //     <Grid item xs={2.4}>
    //       <Typography>Required Qty</Typography>
    //     </Grid>
    //     <Grid item xs={2.4}>
    //       <Typography>Unit</Typography>
    //     </Grid>
    //     <Grid item xs={2.4}>
    //       <Typography>Quantity Received</Typography>
    //     </Grid>
    //     <Grid item xs={2.4}>
    //       <Typography>Batch Id</Typography>
    //     </Grid>
    //   </Grid>

    //   {data.map((detail, i) => (
    //     <Grid container spacing={1} key={detail.productType} mt={3}>
    //       <Grid item xs={2.4}>
    //         <Typography fontWeight={"bold"}>{detail.productType}</Typography>
    //       </Grid>
    //       <Grid item xs={2.4}>
    //         <Typography fontWeight={"bold"}>{detail.quantity}</Typography>
    //       </Grid>
    //       <Grid item xs={2.4}>
    //         <Typography fontWeight={"bold"}>{detail.unit}</Typography>
    //       </Grid>
    //       <Grid item xs={2.4}>
    //         <CustomTextInput
    //           placeholder={"Enter quantity received"}
    //           name="quantityReceived"
    //           type="number"
    //           boxSx={{
    //             width: {
    //               xs: "70px",
    //               sm: "auto",
    //             },
    //           }}
    //           value={detail?.quantityReceived}
    //           handleChange={handleChangeDetail.bind(null, i)}
    //           inputProps={{ inputProps: { min: 0 } }}
    //         />
    //       </Grid>
    //       <Grid item xs={2.4}>
    //         <CustomTextInput
    //           placeholder={"Enter Batch ID/Number"}
    //           name="batchId"
    //           boxSx={{
    //             width: {
    //               xs: "70px",
    //               sm: "auto",
    //             },
    //           }}
    //           value={detail?.batchId}
    //           handleChange={handleChangeDetail.bind(null, i)}
    //         />
    //       </Grid>
    //     </Grid>
    //   ))}
    // </Stack>
  );
}

export default GoodsReceived;
