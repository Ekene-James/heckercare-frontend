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
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import Pagination from "components/molecules/pagination/Pagination";
import CsvDownloader from "react-csv-downloader";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import EmergencyPatientsTable from "components/molecules/tabels/patient/EmergencyTable/EmergencyPatientsTable";
import { GET_EMERGENCY_PATIENTS } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import CustomLoader from "components/atoms/CustomLoader";

import { exportToExcel } from "utils/exportToExcel";

let PageSize = 5;

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
    id: "gender",
    displayName: "gender",
  },
  {
    id: "language",
    displayName: "language",
  },
  {
    id: "occupation",
    displayName: "occupation",
  },
  {
    id: "phoneNumber",
    displayName: "phoneNumber",
  },
  {
    id: "nationality",
    displayName: "nationality",
  },
  {
    id: "dateOfBirth",
    displayName: "dateOfBirth",
  },
  {
    id: "genotype",
    displayName: "genotype",
  },
  {
    id: "bloodGroup",
    displayName: "bloodGroup",
  },
  {
    id: "maritalStatus",
    displayName: "maritalStatus",
  },
  {
    id: "residentialAddress",
    displayName: "residentialAddress",
  },
  {
    id: "residentialCity",
    displayName: "residentialCity",
  },
  {
    id: "residentialState",
    displayName: "residentialState",
  },
  {
    id: "residentialCountry",
    displayName: "residentialCountry",
  },
  {
    id: "residentialZipCode",
    displayName: "residentialZipCode",
  },
  {
    id: "residentialTelephone",
    displayName: "residentialTelephone",
  },
  {
    id: "permanentAddress",
    displayName: "permanentAddress",
  },
  {
    id: "permanentCity",
    displayName: "permanentCity",
  },
  {
    id: "permanentState",
    displayName: "permanentState",
  },
  {
    id: "permanentCountry",
    displayName: "permanentCountry",
  },
  {
    id: "permanentZipCode",
    displayName: "permanentZipCode",
  },
  {
    id: "permanentTelephone",
    displayName: "permanentTelephone",
  },
  {
    id: "nextOfKinAddress",
    displayName: "nextOfKinAddress",
  },
  {
    id: "nextOfKinCity",
    displayName: "nextOfKinCity",
  },
  {
    id: "nextOfKinState",
    displayName: "nextOfKinState",
  },
  {
    id: "nextOfKinCountry",
    displayName: "nextOfKinCountry",
  },
  {
    id: "nextOfKinZipCode",
    displayName: "nextOfKinZipCode",
  },
  {
    id: "nextOfKinPhoneNumber",
    displayName: "nextOfKinPhoneNumber",
  },
  {
    id: "nextOfKinFirstName",
    displayName: "nextOfKinfirstName",
  },
  {
    id: "nextOfKinLastName",
    displayName: "nextOfKinlastName",
  },
  {
    id: "nextOfKinMiddleName",
    displayName: "nextOfKinMiddleName",
  },
  {
    id: "nextOfKinEmail",
    displayName: "nextOfKinEmail",
  },
  {
    id: "nextOfKinRelationship",
    displayName: "nextOfKinRelationship",
  },
  {
    id: "nextOfKinMaritalStatus",
    displayName: "nextOfKinMaritalStatus",
  },

  {
    id: "payerPhoneNumber",
    displayName: "payerPhoneNumber",
  },
  {
    id: "payerFirstName",
    displayName: "payerfirstName",
  },
  {
    id: "payerLastName",
    displayName: "payerlastName",
  },
  {
    id: "payerMiddleName",
    displayName: "payerMiddleName",
  },
  {
    id: "payerEmail",
    displayName: "payerEmail",
  },
  {
    id: "payerRelationship",
    displayName: "payerRelationship",
  },
  {
    id: "payerAddress",
    displayName: "payerAddress",
  },
];

const formatExportData = (data) => {
  return data.map((d) => {
    const formartedData = {
      ...d,
      residentialAddress: d?.residentialAddress?.address,
      residentialCity: d?.residentialAddress?.city,
      residentialState: d?.residentialAddress?.state,
      residentialCountry: d?.residentialAddress?.country,
      residentialZipCode: d?.residentialAddress?.zipCode,
      residentialTelephone: d?.residentialAddress?.telephone,

      permanentAddress: d?.permanentAddress?.address,
      permanentCity: d?.permanentAddress?.city,
      permanentState: d?.permanentAddress?.state,
      permanentCountry: d?.permanentAddress?.country,
      permanentZipCode: d?.permanentAddress?.zipCode,
      permanentTelephone: d?.permanentAddress?.telephone,

      nextOfKinAddress: d?.nextOfKin?.address,
      nextOfKinCity: d?.nextOfKin?.city,
      nextOfKinState: d?.nextOfKin?.state,
      nextOfKinCountry: d?.nextOfKin?.country,
      nextOfKinZipCode: d?.nextOfKin?.zipCode,
      nextOfKinPhoneNumber: d?.nextOfKin?.phoneNumber,
      nextOfKinFirstName: d?.nextOfKin?.firstName,
      nextOfKinLastName: d?.nextOfKin?.lastName,
      nextOfKinMiddleName: d?.nextOfKin?.middleName,
      nextOfKinEmail: d?.nextOfKin?.email,
      nextOfKinRelationship: d?.nextOfKin?.relationship,
      nextOfKinMaritalStatus: d?.nextOfKin?.maritalStatus,

      payerPhoneNumber: d?.payerDetails?.phoneNumber,
      payerFirstName: d?.payerDetails?.firstName,
      payerLastName: d?.payerDetails?.lastName,
      payerMiddleName: d?.payerDetails?.middleName,
      payerEmail: d?.payerDetails?.email,
      payerAddress: d?.payerDetails?.address,
      payerRelationship: d?.payerDetails?.relationship,
    };
    delete formartedData.nextOfKin;
    delete formartedData.payerDetails;

    return formartedData;
  });
};

function EmergencyPatients() {
  const [date, setdate] = React.useState(null);
  const [status, setstatus] = React.useState("Status");
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");

  const handlePageChange = (page) => {
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

  //get emergency patients
  const {
    data: emergencyPatients,
    isLoading: getEmergencyPatientsLoading,
    refetch: refetchPatients,
    isError,
  } = useCustomQuery(
    [
      GET_EMERGENCY_PATIENTS,
      {
        page: currentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
        status: status === "Status" ? null : status,
      },
    ],
    {
      url: `/patients/get-emergency-list`,
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
    isLoading: searchEmergencyPatientsLoading,
    isFetching: searchFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_EMERGENCY_PATIENTS],
      {
        page: currentPage,
        search,
        limit: PageSize,
      },
    ],
    {
      url: `/patients/get-emergency-list`,
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
            GET_EMERGENCY_PATIENTS,
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

  //handle export
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(formatExportData(checkBoxItems), "hms_patients_list");
    }
  };

  //handle sorting patients
  const handleSort = (item) => {
    return queryClient.setQueryData(
      [
        GET_EMERGENCY_PATIENTS,
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
      <Typography variant="displayMd">Emergency Patient</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={8}>
            <SearchBar
              // handleSearch={() => {}}
              refetch={refetchSearch}
              placeholder="Search Patient Name/ID"
              width="100% !important"
              search={search}
              setsearch={setsearch}
              isLoading={searchEmergencyPatientsLoading || searchFetching}
            />
          </Grid>
          <Grid item xs={6} sm={1.5}>
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
                      filename="hms_emergency_patients_list"
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
          </Grid>
          <Grid item xs={8} sm={5} lg={2.5}>
            <Stack
              direction={"row"}
              justifyContent="flex-end"
              sx={{ width: "100%" }}
            >
              <Button
                color="secondary"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ width: "100%", fontSize: "12px", pt: 1, pb: 1 }}
                onClick={() => navigate("/home/emergency-patient-registration")}
              >
                Add Emergency Patient
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ borderColor: "rgba(132, 132, 132, 0.12)" }} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} lg={5}>
            <Stack direction="row" spacing={{ xs: 0.5, md: 3 }}>
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
              <Typography sx={{}}>Filter</Typography>
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
      {getEmergencyPatientsLoading ? (
        <CustomLoader />
      ) : isError ? (
        <Paper sx={{ p: 1, mt: 2 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, mt: 2 }}>
          {emergencyPatients?.data?.patients.length ? (
            <>
              <EmergencyPatientsTable
                refetch={refetchSearch}
                page={currentPage}
                data={emergencyPatients?.data?.patients}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
              />
              <Box sx={{ p: { xs: 0, sm: 2 } }}>
                <Pagination
                  currentPage={currentPage}
                  totalCount={emergencyPatients?.data?.count}
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

export default EmergencyPatients;
