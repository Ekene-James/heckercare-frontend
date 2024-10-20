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

import {
  GET_ALL_DEPARTMENT_INVENTORY,
  GET_TRANSACTION_HISTORY,
} from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import TransactionHistoryTable from "components/molecules/tabels/inventory/TransactionHistoryTable";
import { useNavigate, useParams } from "react-router-dom";
function TransactionHistory({ total, PageSize }) {
  let { id } = useParams();
  const navigate = useNavigate();

  const modalRef = React.useRef(null);
  const newItemModalRef = React.useRef(null);

  const [search, setsearch] = React.useState("");

  const [modalView, setmodalView] = React.useState(0);

  const [requestDetails, setrequestDetails] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const queryClient = useQueryClient();

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

  const onClickItem = (item) => {};
  //get date
  const getDate = (date) => {
    if (date) {
      const newDate = new Date(date);
      const yr = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const day = newDate.getDate();
      return `${yr}-${month}-${day}`;
    }
    return "";
  };

  //get all transaction history items
  const {
    data: transactionHistory,
    isLoading: getTransactionHistoryLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_TRANSACTION_HISTORY,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/itemproduct/get-transactions-item/${id}`,
      method: "get",
      data: {
        page: currentPage,
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
      [GET_TRANSACTION_HISTORY],
      {
        search,
      },
    ],
    {
      url: `/itemproduct/get-transactions-item/${id}?search=${search}`,
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
            GET_TRANSACTION_HISTORY,
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
              <Typography variant="displaySm">Transaction History</Typography>

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
                <CustomButton
                  text="Requisition History"
                  variant="containedBrown"
                  color="secondary"
                  onClick={() =>
                    navigate(`/home/inventory-items/requisition-history/${id}`)
                  }
                />
                <SearchBar
                  refetch={refetchSearch}
                  search={search}
                  setsearch={setsearch}
                  placeholder="Search transaction ID"
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
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {getTransactionHistoryLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {transactionHistory?.data?.orders?.length ? (
              <>
                <TransactionHistoryTable
                  data={transactionHistory?.data?.orders}
                  page={currentPage}
                  toggleModal={toggleModal}
                  productId={id}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={transactionHistory?.data?.count}
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
    </>
  );
}

TransactionHistory.defaultProps = {
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

export default TransactionHistory;
