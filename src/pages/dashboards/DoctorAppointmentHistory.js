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
  GET_APPOINTMENT_HISTORY,
} from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import DisputeListTable from "components/molecules/tabels/accounting/DisputeListTable";
import DoctorAppointmentHistoryTable from "components/molecules/tabels/dashboard/DoctorAppointmentHistoryTable";
import BackButton from "components/atoms/BackButton";
const columns = [
  {
    id: "ID",
    displayName: "Patient ID",
  },
  {
    id: "patientFirstName",
    displayName: "Patient Firstname",
  },
  {
    id: "patientLastName",
    displayName: "Patient Lastname",
  },
  {
    id: "startDate",
    displayName: "startDate",
  },
  {
    id: "startTime",
    displayName: "startTime",
  },
  {
    id: "doctorFirstName",
    displayName: "Doctor FirstName",
  },
  {
    id: "doctorLastName",
    displayName: "Doctor LastName",
  },
];

const formatExportData = (data) => {
  return data.map((d) => {
    const formattedData = {
      ...d,
      ID: d?.patient?.ID,
      patientFirstName: d?.patient?.firstName,
      patientLastName: d?.patient?.lastName,
      startDate: d?.startDate,
      startTime: d?.startTime,
      doctorFirstName: d?.doctor?.firstName,
      doctorLastName: d?.doctor?.lastName,
    };
    return formattedData;
  });
};

function DoctorAppointmentHistory({ total, PageSize }) {
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

  //get all appointment history
  const {
    data: appointmentHistory,
    isLoading: getAppointmentHistoryLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_APPOINTMENT_HISTORY,
      {
        page: currentPage,
        searchTerm: search,
        limit: PageSize,
      },
    ],
    {
      url: `/appointments/history-appointments-of-doctor`,
      method: "post",
      data: {
        page: currentPage,
        searchTerm: search,
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search all dispute list
  const {
    isLoading: searchAppointmentHistoryLoading,
    isFetching: searchAppointmentHistoryFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_APPOINTMENT_HISTORY],
      {
        page: currentPage,
        searchTerm: search,
        limit: PageSize,
      },
    ],
    {
      url: `/appointments/history-appointments-of-doctor`,
      method: "post",
      data: {
        page: currentPage,
        searchTerm: search,
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_APPOINTMENT_HISTORY,
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

  //handle export
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(
        formatExportData(checkBoxItems),
        "hms_doc_appointment_history"
      );
    }
  };

  return (
    <>
      <Box>
        <Typography variant="displayLg">Appointment History</Typography>

        <Paper sx={{ p: 2 }}>
          <Stack
            direction="column"
            spacing={2}
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
              justifyContent="space-between"
            >
              {" "}
              <BackButton />
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
                  placeholder="Search Patient Name"
                  isLoading={
                    searchAppointmentHistoryLoading ||
                    searchAppointmentHistoryFetching
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
                          filename="hms_doc_appointment_history"
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

        {getAppointmentHistoryLoading ? (
          <CustomLoader />
        ) : isError ? (
          <Paper sx={{ p: 1 }}>
            <Typography>
              Something went wrong, refresh and try again Later
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {appointmentHistory?.data?.appointments?.length ? (
              <>
                <DoctorAppointmentHistoryTable
                  data={appointmentHistory?.data?.appointments}
                  page={currentPage}
                  refetch={refetchRequest}
                  checkBoxItems={checkBoxItems}
                  setcheckBoxItems={setcheckBoxItems}
                  toggleModal={toggleModal}
                />
                <Box sx={{ p: { xs: 0, sm: 2 } }}>
                  <Pagination
                    currentPage={currentPage}
                    totalCount={appointmentHistory?.data?.count}
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

DoctorAppointmentHistory.defaultProps = {
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

export default DoctorAppointmentHistory;
