import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import CsvDownloader from "react-csv-downloader";
import { exportToExcel } from "utils/exportToExcel";

import SearchBar from "components/atoms/SearchBar";
import PrintIcon from "@mui/icons-material/Print";
import Pagination from "components/molecules/pagination/Pagination";

import CustomModal from "components/atoms/CustomModal";
import OverviewModalContainer from "components/molecules/inventory/modalContent/overview/OverviewModalContainer";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import CreateNewItemModal from "components/molecules/inventory/modalContent/overview/CreateNewItemModal";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useQueryClient } from "react-query";

import {
  GET_ALL_DEPARTMENT_INVENTORY,
  GET_ALL_DISPUTES,
} from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import DisputeListTable from "components/molecules/tabels/accounting/DisputeListTable";
const columns = [
  {
    id: "uniqueCode",
    displayName: "Dispute ID",
  },
  {
    id: "patientFirstname",
    displayName: "Patient Firstname",
  },
  {
    id: "patientLastName",
    displayName: "Patient Lastname",
  },
  {
    id: "status",
    displayName: "Dispute Status",
  },
  {
    id: "amount",
    displayName: "Dispute Amount",
  },
  {
    id: "isApproved",
    displayName: "isApproved",
  },
  {
    id: "isRejected",
    displayName: "isRejected",
  },
  {
    id: "reason",
    displayName: "reason",
  },
  {
    id: "createdAt",
    displayName: "Created On",
  },
  {
    id: "comment",
    displayName: "Comment",
  },
  {
    id: "dateResolved",
    displayName: "Date Resolved",
  },
];

const formatExportData = (data) => {
  return data.map((d) => {
    const formattedData = {
      ...d,
      patientFirstname: d?.patient?.firstName,
      patientLastName: d?.patient?.lastName,
    };
    return formattedData;
  });
};

function DisputeList({ total, PageSize }) {
  const skip = React.useRef(0);
  const modalRef = React.useRef(null);
  const newItemModalRef = React.useRef(null);
  const [date, setdate] = React.useState(null);
  const [search, setsearch] = React.useState("");
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [status, setstatus] = React.useState("ALL DISPUTES");

  const [modalView, setmodalView] = React.useState(0);

  const [requestDetails, setrequestDetails] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const queryClient = useQueryClient();

  const toggleModal = (view, details) => {
    setmodalView(view);
    if (view === 1) setrequestDetails(details);
    modalRef?.current?.handleToggle();
  };

  const handlePageChange = (page) => {
    // skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));
    setCurrentPage(page);
  };

  const onClickItem = (item) => {};
  //get date

  //get all inventory items
  const {
    data: disputeList,
    isLoading: getDisputeListLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_ALL_DISPUTES,
      {
        page: currentPage,
        status: status === "ALL DISPUTES" ? null : status,
      },
    ],
    {
      url: `/accounting/get-all-disputes?page=${currentPage}&limit=${PageSize}`,
      method: "post",
      data: {
        status: status === "ALL DISPUTES" ? null : status,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all dispute list
  const {
    isLoading: searchDisputeListLoading,
    isFetching: searchDisputeListFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_ALL_DISPUTES],
      {
        page: currentPage,
        status: status === "ALL DISPUTES" ? null : status,
      },
    ],
    {
      url: `/accounting/get-all-disputes?search=${search}&page=${currentPage}&limit=${PageSize}`,
      method: "post",
      data: {
        status: status === "ALL DISPUTES" ? null : status,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_ALL_DISPUTES,
            {
              page: currentPage,
              status: status === "ALL DISPUTES" ? null : status,
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

  //handle export
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(formatExportData(checkBoxItems), "hms_dispute_list");
    }
  };

  return (
    <>
      <Box>
        <Typography variant="displayLg">Dispute List</Typography>

        <Paper sx={{ p: 2 }}>
          <Stack
            direction="column"
            spacing={2}
            justifyContent="flex-start"
            alignItems={"flex-start"}
          >
            {/* <BackButton /> */}
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
              justifyContent="space-between"
            >
              <CustomMenu
                caption={status}
                onClickItem={(item) => setstatus(item)}
                items={["ALL DISPUTES", "PENDING", "RESOLVED"]}
              />
              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="start"
                alignItems="start"
                spacing={1}
              >
                <SearchBar
                  refetch={refetchSearch}
                  search={search}
                  setsearch={setsearch}
                  placeholder="Search Patient ID"
                  isLoading={
                    searchDisputeListLoading || searchDisputeListFetching
                  }
                />

                <CustomMenu
                  caption="Export"
                  icon={<PrintIcon />}
                  onClickItem={handleExport}
                  popperSx={{ width: "12%" }}
                  disabled={!checkBoxItems.length}
                  items={[
                    {
                      name: (
                        <CsvDownloader
                          filename="hms_dispute_list"
                          extension=".csv"
                          columns={columns}
                          datas={formatExportData(checkBoxItems) || []}
                          style={{ width: "100%" }}
                        >
                          <Typography>CSV</Typography>
                        </CsvDownloader>
                      ),
                    },
                    {
                      name: "Excel",
                    },
                  ]}
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {getDisputeListLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {disputeList?.data?.disputes?.length ? (
              <>
                <DisputeListTable
                  data={disputeList?.data?.disputes}
                  page={currentPage}
                  refetch={refetchRequest}
                  checkBoxItems={checkBoxItems}
                  setcheckBoxItems={setcheckBoxItems}
                  toggleModal={toggleModal}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={disputeList?.data?.count}
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

DisputeList.defaultProps = {
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

export default DisputeList;
