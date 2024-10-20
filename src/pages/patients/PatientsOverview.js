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
import PatientOverviewTable from "components/molecules/tabels/patient/PatientOverviewTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import CsvDownloader from "react-csv-downloader";
import { exportToExcel } from "utils/exportToExcel";
import { useQueryClient } from "react-query";
import { GET_PATIENTS } from "utils/reactQueryKeys";
let PageSize = 10;
const columns = [
  {
    id: "admissionStatus",
    displayName: "admissionStatus",
  },
  {
    id: "dateOfBirth",
    displayName: "dateOfBirth",
  },
  {
    id: "createdAt",
    displayName: "createdAt",
  },
  {
    id: "email",
    displayName: "email",
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
    id: "religion",
    displayName: "religion",
  },
  {
    id: "_id",
    displayName: "id",
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
    id: "ID",
    displayName: "Patient-ID",
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
    id: "nextOfKinfirstName",
    displayName: "nextOfKinfirstName",
  },
  {
    id: "nextOfKinlastName",
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
    id: "payerfirstName",
    displayName: "payerfirstName",
  },
  {
    id: "payerlastName",
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
      nextOfKinMaritalStatus: d?.nextOfKin?.MaritalStatus,

      payerTelephone: d?.payerDetails?.phoneNumber,
      payerFirstName: d?.payerDetails?.firstName,
      payerLastName: d?.payerDetails?.lastName,
      payerMiddleName: d?.payerDetails?.middleName,
      payerEmail: d?.payerDetails?.email,
      payerRelationship: d?.payerDetails?.relationship,
    };
    delete formartedData.nextOfKin;
    // delete formartedData.permanentAddress;
    // delete formartedData.residentialAddress;
    delete formartedData.payerDetails;

    return formartedData;
  });
};
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
function PatientsOverview() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [search, setsearch] = React.useState("");
  const [date, setdate] = React.useState(null);

  const [status, setstatus] = React.useState("Status");

  //get patients
  const {
    data: patients,
    isLoading: getPatientsLoading,
    refetch: refetchPatients,
    isFetching,
    isError,
  } = useCustomQuery(
    [
      GET_PATIENTS,
      {
        page: currentPage,
        limit: PageSize,
        startDate: date ? getDate(date) : null,
        status: status === "Status" ? null : status,
      },
    ],
    {
      url: `/patients/get-all-patients`,
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

  //search patients
  const {
    isLoading: searchPatientsLoading,
    isFetching: searchFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      [GET_PATIENTS],
      {
        page: currentPage,
        search,
        limit: PageSize,
      },
    ],
    {
      url: `/patients/get-all-patients`,
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
        // queryClient.getQueryData()
        queryClient.setQueryData(
          [
            GET_PATIENTS,
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(formatExportData(checkBoxItems), "hms_patients_list");
    }
  };
  const handleSort = (item) => {
    setsearch("");
    return queryClient.setQueryData(
      [
        GET_PATIENTS,
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
    setCurrentPage(1);
    refetchPatients();
  };
  return (
    <Box>
      <Typography variant="displayMd">Patient List</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={8}>
            <SearchBar
              refetch={refetchSearch}
              placeholder="Search Patient Name"
              width="100% !important"
              search={search}
              setsearch={setsearch}
              isLoading={searchPatientsLoading || searchFetching}
            />
          </Grid>
          <Grid item xs={6} sm={1.5}>
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
                      filename="hms_patients_list"
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
          <Grid item xs={6} sm={4} lg={2.5}>
            <Stack
              direction={"row"}
              justifyContent="flex-end"
              sx={{ width: "100%" }}
            >
              <Button
                color="secondary"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: "100% !important" }}
                onClick={() => navigate("/home/patient/registration")}
              >
                Add Patient
              </Button>
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
                  setsearch("");
                  setdate(new Date(date));
                }}
                date={date}
                disabled={isFetching}
              />
              <CustomMenu
                caption={status}
                onClickItem={(item) => {
                  setsearch("");
                  setstatus(item);
                }}
                items={[
                  "outpatient",
                  "admitted",
                  "emergency",
                  "discharged",
                  // "others",
                  // "pending",
                  "dead",
                ]}
                disabled={isFetching}
              />
            </Stack>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={1} sx={{ display: "flex", justifyContent: "end" }}>
            <Button variant="text" onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {getPatientsLoading ? (
        <CustomLoader />
      ) : isError ? (
        <Paper sx={{ p: 1, mt: 2 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, mt: 2 }}>
          {patients?.data?.patients.length ? (
            <>
              {" "}
              <PatientOverviewTable
                data={patients?.data?.patients}
                checkBoxItems={checkBoxItems}
                setcheckBoxItems={setcheckBoxItems}
              />
              <Box sx={{ p: { xs: 0, sm: 2 } }}>
                <Pagination
                  currentPage={currentPage}
                  totalCount={patients?.data?.count}
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

export default PatientsOverview;
