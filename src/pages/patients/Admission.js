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
import CsvDownloader from "react-csv-downloader";

import Pagination from "components/molecules/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import PatientAdmissionTable from "components/molecules/tabels/patient/PatientAdmissionTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useQueryClient } from "react-query";

import { GET_PATIENT_ADMISSION_LIST } from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import { exportToExcel } from "utils/exportToExcel";

let PageSize = 5;
let total = 50;

const columns = [
  {
    id: "_id",
    displayName: "id",
  },
  {
    id: "firstName",
    displayName: "firstName",
  },
  {
    id: "lastName",
    displayName: "lastName",
  },
  {
    id: "middleName",
    displayName: "middleName",
  },
  {
    id: "age",
    displayName: "age",
  },
  {
    id: "gender",
    displayName: "gender",
  },
  {
    id: "ward",
    displayName: "ward",
  },
  {
    id: "admissionDate",
    displayName: "admissionDate",
  },
];

function Admission() {
  const skip = React.useRef(0);
  const navigate = useNavigate();
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [date, setdate] = React.useState(null);
  const queryClient = useQueryClient();
  const [search, setsearch] = React.useState("");
  const [ward, setWard] = React.useState("Ward");

  const [status, setstatus] = React.useState("Status");
  const [currentPage, setCurrentPage] = React.useState(1);
  const onClickItem = (item) => {};
  const handlePageChange = (page) => {
    skip.current = (page - 1) * PageSize;
    //   dispatch(getMoreItems(PageSize, {}, skip.current));

    setCurrentPage(page);
  };

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

  //get patient admission list
  const {
    data: patientAdmissionList,
    isLoading: getPatientAdmissionListLoading,
    refetch: refetchPatients,
    isError,
  } = useCustomQuery(
    [
      GET_PATIENT_ADMISSION_LIST,
      {
        page: currentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
        status: status === "Status" ? null : status,
      },
    ],
    {
      url: `/patients/admission-list`,
      method: "post",
      data: {
        page: currentPage,
        search: "",
        limit: PageSize,
        startDate: date ? getDate(date) : null,
        status: status === "Status" ? null : status,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  //search emergency patients
  const {
    isLoading: searchPatientAdmissionLoading,
    isFetching: searchFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_PATIENT_ADMISSION_LIST],
      {
        page: currentPage,
        search,
        limit: PageSize,
      },
    ],
    {
      url: `/patients/admission-list`,
      method: "post",
      data: {
        page: currentPage,
        search,
        limit: PageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_PATIENT_ADMISSION_LIST,
            {
              page: currentPage,
              limit: PageSize,
              startDate: date ? getDate(date) : null,
              status: status === "Status" ? null : status,
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


  //handle Excel export
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(checkBoxItems, "hms_patients_admission_list");
    }
  };

  //handle sorting patients
  const handleSort = (item) => {
    return queryClient.setQueryData(
      [
        GET_PATIENT_ADMISSION_LIST,
        {
          page: currentPage,
          limit: PageSize,
          startDate: date ? getDate(date) : null,
          status: status === "Status" ? null : status,
        },
      ],
      (oldQueryData) => {
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData.data,
            patients: oldQueryData.data.patients.sort((a, b) => {
              const aNew = new Date(a.createdAt);
              const bNew = new Date(b.createdAt);
              if (item.value === 1) {
                return Number(aNew) - Number(bNew);
              }
              return Number(bNew) - Number(aNew);
            }),
          },
        };
      }
    );
  };

  const handleReset = () => {
    setstatus("Status");
    setsearch("");
    setdate(null);
    refetchPatients();
  };

  return (
    <Box>
      <Typography variant="displayMd">Admission</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={10}>
            <SearchBar
              refetch={refetchSearch}
              placeholder="Search Patient Name/ID"
              width="100% !important"
              search={search}
              setsearch={setsearch}
              isLoading={searchPatientAdmissionLoading || searchFetching}
            />
          </Grid>

          <Grid
            item
            xs={6}
            sm={2}
            sx={{ display: "flex", justifyContent: "end" }}
          >
            <CustomMenu
              caption="Export"
              icon={<PrintIcon />}
              onClickItem={handleExport}
              disabled={!checkBoxItems.length}
              popperPlacement="left-end"
              items={[
                {
                  name: (
                    <CsvDownloader
                      filename="hms_patients_admission_list"
                      extension=".csv"
                      columns={columns}
                      datas={checkBoxItems || []}
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
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: "rgba(132, 132, 132, 0.12)" }} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} lg={5}>
            <Stack direction="row" spacing={{ xs: 1, sm: 3 }}>
              {/* <CustomMenu
                caption={ward}
                onClickItem={(item) => setWard(item)}
                items={["A", "B", "C"]}
              /> */}
              {/* <CustomMenu
                caption="Doctors"
                onClickItem={onClickItem}
                items={["One", "Two"]}
              /> */}
              <CustomMenu
                caption="Sort"
                onClickItem={handleSort}
                popperSx={{ width: "8%" }}
                items={[
                  { name: "New-Old", value: -1 },
                  { name: "Old-New", value: 1 },
                ]}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={7} lg={4}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={3}
            >
              <Typography>Filter</Typography>
              <CustomDatePicker
                type="date"
                views={["year", "month", "day"]}
                size="small"
                lightBorder={true}
                setdate={(date) => {
                  setdate(new Date(date));
                }}
                date={date}
              />
              {/* <CustomMenu
                caption={status}
                onClickItem={(item) => setstatus(item)}
                items={[
                  "outpatient",
                  "admitted",
                  "emergency",
                  "others",
                  "discharged",
                  "pending",
                  "dead",
                ]}
              /> */}
            </Stack>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={handleReset} variant="text">
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {getPatientAdmissionListLoading ? (
        <CustomLoader />
      ) : isError ? (
        <Paper sx={{ p: 1, mt: 2 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, mt: 2 }}>
          {patientAdmissionList?.data?.patients.length ? (
            <>
              <PatientAdmissionTable
                data={patientAdmissionList?.data?.patients}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
              />
              <Box sx={{ p: { xs: 0, sm: 2 } }}>
                <Pagination
                  currentPage={currentPage}
                  totalCount={patientAdmissionList?.data?.count}
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
    </Box>
  );
}

export default Admission;
