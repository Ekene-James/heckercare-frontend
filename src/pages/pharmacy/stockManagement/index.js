import { Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import CustomTab from "components/atoms/CustomTab";

import SearchBar from "components/atoms/SearchBar";

import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_PHARMACY_PRODUCTS,
  GET_PHARMACY_DISPENSE_HISTORY,
} from "utils/reactQueryKeys";

import Header from "../components/Header";

import CreateNewProductModal from "../requisitionHistory/modalContents/CreateNewProductModal";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { exportToExcel } from "utils/exportToExcel";
import CsvDownloader from "react-csv-downloader";
import CustomMenu from "components/atoms/CustomMenu";
import AvailableStockTable from "components/molecules/tabels/pharmacy/AvailableStockTable";
import DispenseHistoryTable from "components/molecules/tabels/pharmacy/DispenseHistoryTable";
import CustomLoader from "components/atoms/CustomLoader";
import { currencyFormatter, numberFormatter } from "utils/numberFormatter";
import AddBatchToProduct from "./modalContent/AddBatchToProduct";

const pageSize = 10;

const formatExportData = (data) => {
  let formatted = [];
  if (data?.length) {
    formatted = data.map((d) => {
      const copy = structuredClone(d);
      delete copy.id;
      const formartedData = {
        ...copy,
        drugType: `${copy?.drugType?.name || ""}`,
        genericName: `${copy?.genericName?.activeIngredient}`,
        availableQuantity: numberFormatter(copy?.availableQuantity || 0),
        salesPrice: currencyFormatter(copy?.salesPrice || 0),
      };
      return formartedData;
    });
  }
  return formatted;
};
const formatExportData1 = (data) => {
  let formatted = [];
  if (data?.length) {
    formatted = data.map((d) => {
      const copy = structuredClone(d);
      let item = {};
      copy.items.forEach((prod, i) => {
        item[`item_${i + 1}`] = prod?.product?.drugName;
      });

      const formartedData = {
        ...copy,
        ...item,
        pharmacistId: copy?.pharmacist?._id,
        pharmacist: copy?.pharmacist?.fullName,
        doctorId: copy?.doctor?._id,
        doctor: copy?.doctor?.fullName,
        patientName: `${copy?.patient?.firstName} ${copy?.patient?.lastName}`,
        patientId: `${copy?.patient?._id}`,

        totalCost: currencyFormatter(copy?.totalCost || 0),
      };
      delete formartedData.id;

      delete formartedData.patient;
      delete formartedData.items;
      return formartedData;
    });
  }
  return formatted;
};

function PharmacyStockManagement() {
  const modalRef1 = React.useRef(null);
  const toggleModal1 = () => {
    modalRef1?.current?.handleToggle();
  };
  return (
    <>
      <Stack
        direction={{ xs: "column" }}
        sx={{
          gap: 4,
        }}
      >
        <Stack
          direction={"row"}
          width="100%"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Header title="Overview" />

          <CustomButton
            text={"Add Batch To Product"}
            variant="contained"
            color="secondary"
            onClick={toggleModal1}
          />
        </Stack>
        <Header title="Stock Management" />
        <TabWithTables />
      </Stack>
      <CustomRightDrawer ref={modalRef1} title="Add Batch To A Product">
        <AddBatchToProduct closeModal={toggleModal1} />
      </CustomRightDrawer>
    </>
  );
}
const navItems = [
  {
    label: "Available Stock",
    id: 1,
  },
  {
    label: "Dispense History",
    id: 2,
  },
];

const TabWithTables = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const [search, setsearch] = React.useState("");
  const queryClient = useQueryClient();

  const modalRef1 = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentPage1, setCurrentPage1] = React.useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageChange1 = (page) => {
    setCurrentPage1(page);
  };

  const { isLoading: productsLoading, data: pharmacyProducts } = useCustomQuery(
    [GET_ALL_PHARMACY_PRODUCTS, currentPage1],
    {
      url: `/product/getall?page=${currentPage1}&limit=${pageSize}&search=`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //search pharmacy products
  const {
    isLoading: searchLoading,
    isFetching,
    refetch: refetchProdutcs,
  } = useCustomQuery(
    [GET_ALL_PHARMACY_PRODUCTS, search],
    {
      url: `/product/getall?search=${search}&limit=${pageSize}`,
      method: "get",
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [GET_ALL_PHARMACY_PRODUCTS, currentPage1],
          (oldQueryData) => {
            if (search) {
              return {
                ...response,
                data: {
                  count: response.data.length,
                  products: [...response.data],
                },
              };
            }
            return {
              ...response,
            };
          }
        );
      },
    }
  );

  const { isLoading: productsHistoryLoading, data: pharmacyHistory } =
    useCustomQuery(
      [
        GET_PHARMACY_DISPENSE_HISTORY,
        {
          page: currentPage,
          limit: pageSize,
        },
      ],
      {
        url: `/prescription/completed`,
        method: "post",
        data: {
          page: currentPage,
          limit: pageSize,
        },
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  //search dispense history
  const {
    isLoading: dispenseHistoryLoading,
    isFetching: dispenseHistoryRefetching,
    refetch: refetchDispenseHistory,
  } = useCustomQuery(
    [GET_PHARMACY_DISPENSE_HISTORY, search],
    {
      url: `/prescription/completed`,
      method: "post",
      data: {
        search,
      },
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_PHARMACY_DISPENSE_HISTORY,
            {
              page: currentPage,
              limit: pageSize,
            },
          ],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
    }
  );

  const handleExport = () => {
    if (currentTab === 0) {
      const data = formatExportData(pharmacyProducts?.data?.products);
      exportToExcel(data, "hms_pharmacy_available_stocks_excel");
    } else {
      const data = formatExportData1(pharmacyHistory?.data?.prescriptions);
      exportToExcel(data, "hms_pharmacy_dispense_history_excel");
    }
  };
  let tableToShow;

  switch (currentTab) {
    case 0:
      tableToShow = (
        <AvailableStockTable
          data={pharmacyProducts?.data || []}
          handlePageChange={handlePageChange1}
          currentPage={currentPage1}
        />
      );
      break;
    case 1:
      tableToShow = (
        <DispenseHistoryTable
          data={pharmacyHistory?.data || {}}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      );
      break;

    default:
      break;
  }
  const handleSetCurrentTab = (tab) => {
    setsearch("");
    setCurrentTab(tab);
  };
  const handleSearch = () => {
    if (currentTab === 0) {
      refetchProdutcs();
    } else {
      refetchDispenseHistory();
    }
  };

  return (
    <>
      <Paper sx={{ p: 4, pt: 6 }}>
        <Stack direction="column">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <CustomTab
              value={currentTab}
              setValue={handleSetCurrentTab}
              navItems={navItems}
              sx={{ width: { xs: "100%", sm: "50%" }, flexGrow: 1 }}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
            >
              <SearchBar
                search={search}
                setsearch={setsearch}
                isLoading={
                  currentTab === 0
                    ? searchLoading || isFetching
                    : dispenseHistoryLoading || dispenseHistoryRefetching
                }
                refetch={handleSearch}
                placeholder="Search"
              />
              <CustomButton
                text="Export"
                variant="outlined"
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={handleExport}
              />

              <CustomButton
                text={"Create Product"}
                variant="contained"
                color="secondary"
                onClick={() => modalRef1?.current?.handleToggle()}
              />
              {/* <CustomButton
                text={"create Requesition"}
                variant="contained"
                color="secondary"
                onClick={openDrawerHandler}
              /> */}
            </Stack>
          </Stack>
        </Stack>
        <Stack>
          {productsLoading || productsHistoryLoading ? (
            <CustomLoader />
          ) : (
            tableToShow
          )}
        </Stack>
      </Paper>

      <CustomRightDrawer
        ref={modalRef1}
        title="Create New  Product"
        subTitle=""
      >
        <CreateNewProductModal
          closeModal={() => modalRef1?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
};

export default PharmacyStockManagement;
