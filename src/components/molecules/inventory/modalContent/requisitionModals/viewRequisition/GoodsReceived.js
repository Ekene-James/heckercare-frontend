import GoodsReceivedTable from "components/molecules/tabels/inventory/GoodsReceivedTable";
import React from "react";

function GoodsReceived({ data, handleChangeDetail, handleExpiryDate }) {
  return (
    <GoodsReceivedTable
      data={data}
      handleChangeDetail={handleChangeDetail}
      handleExpiryDate={handleExpiryDate}
    />
  );
}

export default GoodsReceived;
