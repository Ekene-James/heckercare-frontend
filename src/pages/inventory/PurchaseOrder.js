import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SearchBar from "components/atoms/SearchBar";
import PrintIcon from "@mui/icons-material/Print";
import CustomMenu from "components/atoms/CustomMenu";
import AddIcon from "@mui/icons-material/Add";
import CustomDatePicker from "components/atoms/DatePicker";

import Pagination from "components/molecules/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import CustomButton from "components/atoms/CustomButton";
import PurchaseOrderTable from "components/molecules/tabels/inventory/PurchaseOrderTable";
import CustomModal from "components/atoms/CustomModal";
import PurchaseOrderModal from "components/molecules/inventory/modalContent/purchaseOrder/PurchaseOrderModal";
let PageSize = 5;
let total = 50;
function PurchaseOrder() {
  const skip = React.useRef(0);

  const modalRef = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const onClickItem = (item) => {};
  const handlePageChange = (page) => {
    skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));

    setCurrentPage(page);
  };
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  return (
    <Box>
      <Typography variant="displayLg">Purchase Order</Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={8}>
            <SearchBar
              handleSearch={() => {}}
              placeholder="Search Patient Name/ID"
              width="100% !important"
            />
          </Grid>
          <Grid item xs={6} md={2} lg={1.6}>
            <CustomMenu
              caption="Print All"
              icon={<PrintIcon />}
              onClickItem={onClickItem}
              items={["PDF", "Word"]}
              popperPlacement="left-end"
            />
          </Grid>
          <Grid item xs={8} sm={6} lg={2.4}>
            <Stack
              direction={"row"}
              justifyContent="flex-end"
              sx={{ width: "100%" }}
            >
              <CustomButton
                color="secondary"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: "100% !important" }}
                onClick={toggleModal}
                text="Create Purchase Order"
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ borderColor: "rgba(132, 132, 132, 0.12)" }} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} lg={5}>
            <Stack direction="row" spacing={{ xs: 1, sm: 3 }}>
              <CustomMenu
                caption="Status"
                onClickItem={onClickItem}
                items={["One", "Two"]}
              />
              <CustomMenu
                caption="Module"
                onClickItem={onClickItem}
                items={["One", "Two"]}
              />
              <CustomMenu
                caption="Location"
                onClickItem={onClickItem}
                items={["One", "Two"]}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={9} lg={5}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={{ xs: 0.5, md: 3 }}
            >
              <Typography sx={{}}>Filter</Typography>
              <CustomDatePicker
                type="date"
                views={["year", "month", "day"]}
                size="small"
                lightBorder={true}
                placeholder="Select Date"
              />
              <CustomMenu
                caption="Show All"
                onClickItem={onClickItem}
                items={["InPatient", "Outpatient", "Emergency"]}
              />
            </Stack>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "end" }}>
            <Button variant="text">Reset</Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 1, mt: 2 }}>
        <PurchaseOrderTable />
        <Box sx={{ p: { xs: 0, sm: 2 } }}>
          <Pagination
            currentPage={currentPage}
            totalCount={total || 5}
            pageSize={PageSize}
            onPageChange={handlePageChange}
          />
        </Box>
      </Paper>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
        }}
        ariaLabel="usage-history-modal"
      >
        <PurchaseOrderModal />
      </CustomModal>
    </Box>
  );
}

export default PurchaseOrder;
