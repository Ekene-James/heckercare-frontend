import { Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";
import CustomModal from "components/atoms/CustomModal";
import CustomTab from "components/atoms/CustomTab";

import StockRequestModal from "components/molecules/lab/modalContents/StockRequestModal";

import AllStockTable from "components/molecules/tabels/lab/AllStockTable";
import RequestHistoryTable from "components/molecules/tabels/lab/RequestHistoryTable";
import React from "react";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_ALL_STOCKS, GET_REQUEST_HISTORY } from "utils/reactQueryKeys";

function StockManagement({ navItems, PageSize, total }) {
  const [value, setvalue] = React.useState(0);
  const modalRef = React.useRef(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentPage1, setCurrentPage1] = React.useState(1);

  const toggleModal = () => modalRef?.current?.handleToggle();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page) => {
    setCurrentPage1(page);
  };

  const { data: stockData, isLoading: stockLoading } = useCustomQuery(
    [GET_ALL_STOCKS, currentPage],
    {
      url: `/lab-stock/?page=${currentPage}&limit=10&search=`,
      method: "get",
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  const { data: history, isLoading } = useCustomQuery(
    [GET_REQUEST_HISTORY, currentPage1],
    {
      url: `/lab-stock/order-history`,
      method: "post",
      data: {
        limit: 10,
        page: currentPage1,
      },
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  const { data: orders } = history ? history : [];

  const navigationItems = [
    {
      label: "All Stock",
      id: 0,
      count: stockData?.data?.count,
    },
    {
      label: "Request History",
      id: 1,
      count: orders?.count,
    },
  ];

  let view;
  switch (value) {
    case 0:
      view = (
        <AllStockTable
          currentPage={currentPage}
          data={stockData?.data || {}}
          handlePageChange={handlePageChange}
        />
      );

      break;
    case 1:
      view = (
        <RequestHistoryTable
          currentPage={currentPage1}
          data={orders || []}
          handlePageChange={handlePageChange1}
        />
      );

      break;

    default:
      break;
  }

  return (
    <>
      <Stack direction={"column"} sx={{ width: "100%" }} spacing={2}>
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems={"center"}
          sx={{ width: "100%" }}
        >
          <Typography variant="displayMd">Stock Management</Typography>
          <CustomButton
            text={"Stock Request"}
            variant="contained"
            color="secondary"
            onClick={toggleModal}
          />
        </Stack>
        <Paper sx={{ p: 2 }}>
          <CustomTab
            navItems={navigationItems}
            value={value}
            setValue={setvalue}
          />
          {stockLoading || isLoading ? <CustomLoader /> : view}
        </Paper>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 4,
          width: {
            xs: "90%",
            sm: "60vw",
          },
        }}
        ariaLabel="stock-request-modal"
      >
        <StockRequestModal handleClose={toggleModal} />
      </CustomModal>
    </>
  );
}

StockManagement.defaultProps = {
  navItems: [
    {
      label: "All Stock",
      id: 0,
      count: 0,
    },
    {
      label: "Request History",
      id: 1,
      count: 0,
    },
  ],
  PageSize: 5,
  total: 50,
};
export default StockManagement;
