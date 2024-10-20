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
  GET_REQUISITION_HISTORY,
  GET_TRANSACTION_HISTORY,
} from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import TransactionHistoryTable from "components/molecules/tabels/inventory/TransactionHistoryTable";
import { useNavigate, useParams } from "react-router-dom";
import ItemRequisitionTable from "components/molecules/tabels/inventory/ItemRequisitionTable";
function ItemRequisitionHistory({ total, PageSize }) {
  let { id } = useParams();
  const navigate = useNavigate();

  const skip = React.useRef(0);
  const modalRef = React.useRef(null);
  const newItemModalRef = React.useRef(null);
  const [date, setdate] = React.useState(null);
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
    data: requisitionHistory,
    isLoading: getRequisitionHistoryLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_REQUISITION_HISTORY,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/itemproduct/get-item-batches/${id}?page=${currentPage}&limit=${PageSize}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all inventory items
  const {
    isLoading: searchRequisitionHistoryLoading,
    isFetching: searchRequisitionHistoryFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_REQUISITION_HISTORY],
      {
        search,
      },
    ],
    {
      url: `/itemproduct/get-item-batches/${id}?search=${search}&limit=100`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        // queryClient.getQueryData()
        queryClient.setQueryData(
          [
            GET_REQUISITION_HISTORY,
            {
              page: currentPage,
              limit: PageSize,
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
              <Typography variant="displaySm">Requisition History</Typography>

              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="start"
                alignItems="center"
                spacing={1}
              >
                {requisitionHistory?.data?.batches?.length ? (
                  <Typography
                    variant="displaySm"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {requisitionHistory?.data?.batches[0]?.product?.itemName}
                  </Typography>
                ) : null}
                <SearchBar
                  refetch={refetchSearch}
                  search={search}
                  setsearch={setsearch}
                  placeholder="Search Batch ID"
                  isLoading={
                    searchRequisitionHistoryLoading ||
                    searchRequisitionHistoryFetching
                  }
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {getRequisitionHistoryLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {requisitionHistory?.data?.batches?.length ? (
              <>
                <ItemRequisitionTable
                  data={requisitionHistory?.data?.batches}
                  page={currentPage}
                  toggleModal={toggleModal}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={requisitionHistory?.data?.count}
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

ItemRequisitionHistory.defaultProps = {
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

export default ItemRequisitionHistory;
