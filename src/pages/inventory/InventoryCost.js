import { Box, Paper, Stack, Typography } from "@mui/material";

import React from "react";

import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";

import SearchBar from "components/atoms/SearchBar";
import PrintIcon from "@mui/icons-material/Print";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import Pagination from "components/molecules/pagination/Pagination";

import InventoryOverviewTable from "components/molecules/tabels/inventory/InventoryOverviewTable";
import BackButton from "components/atoms/BackButton";
import CustomModal from "components/atoms/CustomModal";
import CreateInventory from "components/molecules/inventory/modalContent/overview/CreateInventory";
import OverviewModalContainer from "components/molecules/inventory/modalContent/overview/OverviewModalContainer";
function InventoryCost({ total, PageSize }) {
  const skip = React.useRef(0);
  const modalRef = React.useRef(null);

  const [modalView, setmodalView] = React.useState(0);

  const [requestDetails, setrequestDetails] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);

  const toggleModal = (view, details) => {
    setmodalView(view);
    if (view === 1) setrequestDetails(details);
    modalRef?.current?.handleToggle();
  };

  const handlePageChange = (page) => {
    skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));
    setCurrentPage(page);
  };

  const onClickItem = (item) => {};

  return (
    <Box>
      <Typography variant="displayLg">Inventory</Typography>

      <Paper sx={{ p: 2 }}>
        <Stack
          direction="column"
          spacing={2}
          justifyContent="flex-start"
          alignItems={"flex-start"}
        >
          <BackButton />
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
            justifyContent="space-between"
          >
            <Typography variant="displaySm">Inventory Cost</Typography>

            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="start"
              alignItems="start"
              spacing={1}
            >
              <CustomMenu
                caption="Module"
                onClickItem={onClickItem}
                items={["PDF", "Word"]}
                popperPlacement="left-end"
              />
              <SearchBar handleSearch={() => {}} />
              <CustomMenu
                caption="Export"
                icon={<PrintIcon />}
                onClickItem={onClickItem}
                items={["PDF", "Word"]}
                popperPlacement="left-end"
              />

              <CustomButton
                text="Add Inventory"
                variant="contained"
                color="secondary"
                startIcon={<LocalPrintshopIcon />}
                onClick={toggleModal.bind(this, 0)}
              />
            </Stack>
          </Stack>
          <InventoryOverviewTable toggleModal={toggleModal} />
          <Pagination
            currentPage={currentPage}
            totalCount={total || 5}
            pageSize={PageSize}
            onPageChange={handlePageChange}
          />
        </Stack>
      </Paper>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "95%",
            sm: "80%",
          },
        }}
        ariaLabel="inventory-overview-modal"
      >
        <OverviewModalContainer
          modalView={modalView}
          requestDetails={requestDetails}
        />
        ;
      </CustomModal>
    </Box>
  );
}

InventoryCost.defaultProps = {
  dropDownContent: [
    {
      name: "Daily",
      value: "Day",
    },
    {
      name: "Weekly",
      value: "Week",
    },
    {
      name: "Monthly",
      value: "Month",
    },
  ],

  PageSize: 5,
  total: 50,
};

export default InventoryCost;
