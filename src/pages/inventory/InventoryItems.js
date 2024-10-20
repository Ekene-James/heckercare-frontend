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
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import CreateNewItemModal from "components/molecules/inventory/modalContent/overview/CreateNewItemModal";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useQueryClient } from "react-query";

import { GET_ALL_DEPARTMENT_INVENTORY } from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import AddBatchToItem from "./AddBatchToItem";
function InventoryCost({ total, PageSize }) {
  const modalRef = React.useRef(null);
  const modalRef1 = React.useRef(null);
  const newItemModalRef = React.useRef(null);

  const [search, setsearch] = React.useState("");

  const [modalView, setmodalView] = React.useState(0);

  const [requestDetails, setrequestDetails] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const queryClient = useQueryClient();

  const toggleModal1 = () => {
    modalRef1?.current?.handleToggle();
  };
  const toggleModal = (view, details) => {
    setmodalView(view);
    if (view === 1) setrequestDetails(details);
    modalRef?.current?.handleToggle();
  };

  const toggleNewItemModal = () => {
    newItemModalRef?.current?.handleToggle();
  };

  const handlePageChange = (page) => {
    // skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));
    setCurrentPage(page);
  };

  //get all inventory items
  const {
    data: inventoryItems,
    isLoading: getInventoryItemsLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_ALL_DEPARTMENT_INVENTORY,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/itemproduct/getall?page=${currentPage}`,
      method: "get",
      data: {
        search: "",
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all inventory items
  const {
    isLoading: searchInventoryItemsLoading,
    isFetching: searchInventoryItemsFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_ALL_DEPARTMENT_INVENTORY],
      {
        page: currentPage,
        search,
        limit: PageSize,
      },
    ],
    {
      url: `/itemproduct/getall?search=${search}`,
      method: "get",
      data: {
        page: currentPage,
        search,
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        // queryClient.getQueryData()
        queryClient.setQueryData(
          [
            GET_ALL_DEPARTMENT_INVENTORY,
            {
              page: currentPage,
              // search,
              limit: PageSize,
              // startDate: date ? getDate(date) : null,
            },
          ],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
      enabled: false,
    }
  );

  return (
    <>
      <Box>
        <Typography variant="displayLg">Inventory</Typography>

        <Paper sx={{ p: 2 }}>
          <Stack
            direction="column"
            spacing={2}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Stack
              direction="row"
              width={"100%"}
              justifyContent="space-between"
              alignItems={"center"}
            >
              <BackButton />
              <CustomButton
                text={"Add Batch To Item"}
                variant="outlined"
                color="secondary"
                onClick={toggleModal1}
              />
            </Stack>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
              justifyContent="space-between"
            >
              <Typography variant="displaySm">All Inventory Items</Typography>

              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="start"
                alignItems="start"
                spacing={1}
              >
                {/* <CustomMenu
                caption="Module"
                onClickItem={onClickItem}
                items={["PDF", "Word"]}
                popperPlacement="left-end"
              /> */}
                <SearchBar
                  refetch={refetchSearch}
                  search={search}
                  setsearch={setsearch}
                  placeholder="Search item name"
                  isLoading={
                    searchInventoryItemsLoading || searchInventoryItemsFetching
                  }
                />
                {/* <CustomMenu
                caption="Export"
                icon={<PrintIcon />}
                onClickItem={onClickItem}
                items={["PDF", "Word"]}
                popperPlacement="left-end"
              /> */}

                <CustomButton
                  text="Create New Item"
                  variant="contained"
                  color="secondary"
                  startIcon={<LocalPrintshopIcon />}
                  onClick={toggleNewItemModal}
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {getInventoryItemsLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {inventoryItems?.data?.allItemProduct?.length ? (
              <>
                <InventoryOverviewTable
                  data={inventoryItems?.data?.allItemProduct}
                  page={currentPage}
                  toggleModal={toggleModal}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={inventoryItems?.data?.count}
                    pageSize={PageSize}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </>
            ) : (
              <Typography>No item to display</Typography>
            )}
          </Paper>
        )}

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
      <CustomRightDrawer
        ref={newItemModalRef}
        title={"Create New Item"}
        subTitle={"Input information for new item"}
      >
        <CreateNewItemModal
          closeModal={() => newItemModalRef?.current?.handleToggle()}
        />
        ;
      </CustomRightDrawer>
      <CustomRightDrawer ref={modalRef1} title="Add Batch To Item">
        <AddBatchToItem closeModal={toggleModal1} />
      </CustomRightDrawer>
    </>
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

  PageSize: 10,
  total: 50,
};

export default InventoryCost;
