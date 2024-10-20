import { MoreVertOutlined, PrintOutlined } from "@mui/icons-material";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchBar from "components/atoms/SearchBar";
import SimpleTable from "components/atoms/SimpleTable";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CreateOrUpdateStockForm from "../components/CreateProduct";
import Header from "../components/Header";
import RightDrawer from "../components/RightDrawer";
import MedicineDetails from "./MedicineDetails";

function PharmacyMedicineList() {
  return (
    <Stack
      direction={{ xs: "column" }}
      sx={{
        gap: 4,
      }}
    >
      <Header title="Medicine" />
      <Table />
    </Stack>
  );
}

const Table = ({}) => {
  const [showMedicineDetail, setShowMedicineDetail] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [openStockRequest, setOpenStockRequest] = useState(false);
  const openMedicineDrawerHandler = (rowData) => () => {
    setShowMedicineDetail(true);
    setSelectedMedicine(rowData);
  };
  return (
    <>
      <Paper sx={{ p: 4, pt: 6 }}>
        <Stack direction="column" spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="displayMd" sx={{}}>
              Available List
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
            >
              <SearchBar
                handleSearch={() => {}}
                placeholder="Search Patient/Request ID"
              />
              <CustomButton
                variant="contained"
                sx={{
                  backgroundColor: "#F8F8F8",
                  "&:hover": {
                    backgroundColor: "#F8F8F8",
                  },
                }}
                text={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "14px",
                      color: "#515151",
                    }}
                  >
                    <PrintOutlined />
                    <span>Export</span>
                  </div>
                }
              />
              <CustomButton
                text={"Stock Request"}
                variant="contained"
                color="secondary"
                onClick={() => setOpenStockRequest(true)}
              />
            </Stack>
          </Stack>
          <SimpleTable
            alternate
            data={[
              {
                "s/n": 1,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 2,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 3,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 4,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 5,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 6,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 7,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 8,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 9,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
              {
                "s/n": 10,
                medicine_name: "Anzitor( 200ml )",
                manufacturers_name: "Aristropharma",
                category: "Tablet",
                shelf: "Blue",
                price: "₦6550",
                purchase_price: "₦3550",
                strength: "100ml",
              },
            ]}
            columns={[
              {
                field: "s/n",
                title: "S/N",
                headerStyle: {},
                cellStyle: {
                  backgroundColor: "white",
                },
              },
              {
                field: "medicine_name",
                title: "Medicine Name",
                headerStyle: {},
                cellStyle: {},
                renderItem: (rowData) => {
                  return (
                    <div
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={openMedicineDrawerHandler(rowData)}
                    >
                      {rowData.medicine_name}
                    </div>
                  );
                },
              },
              {
                field: "manufacturers_name",
                title: "Manufacturers Name",
                headerStyle: {},
                cellStyle: {},
              },
              {
                field: "category",
                title: "Category",
                headerStyle: {},
                cellStyle: {},
              },
              {
                field: "shelf",
                title: "Shelf",
                headerStyle: {},
                cellStyle: {},
              },
              {
                field: "price",
                title: "Price",
                headerStyle: {},
                cellStyle: {},
              },

              {
                field: "purchase_price",
                title: "Purchase Price",
                headerStyle: {},
                cellStyle: {},
              },

              {
                field: "strength",
                title: "Strength",
                headerStyle: {},
                cellStyle: {},
              },

              {
                field: "action",
                headerStyle: {},
                cellStyle: {},
                renderItem: () => {
                  return (
                    <IconButton>
                      <MoreVertOutlined fontSize="small" />
                    </IconButton>
                  );
                },
              },
            ]}
            heading
            perPage={5}
          />
        </Stack>
      </Paper>
      <RightDrawer
        title="Medicine Details"
        subTitle=""
        open={showMedicineDetail}
        setOpen={setShowMedicineDetail}
      >
        <MedicineDetails editData={selectedMedicine} />
      </RightDrawer>
      <RightDrawer
        title={"Stock Request"}
        subTitle=""
        open={openStockRequest}
        setOpen={setOpenStockRequest}
      >
        <CreateOrUpdateStockForm />
      </RightDrawer>
    </>
  );
};

export default PharmacyMedicineList;
