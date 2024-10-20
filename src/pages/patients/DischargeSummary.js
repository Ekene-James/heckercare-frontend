import React from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import SearchBar from "components/atoms/SearchBar";

import CustomDatePicker from "components/atoms/DatePicker";
import CsvDownloader from "react-csv-downloader";

import PrintIcon from "@mui/icons-material/Print";
import Pagination from "components/molecules/pagination/Pagination";
import { useNavigate } from "react-router-dom";

import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import CustomTextInput from "components/atoms/CustomTextInput";
import DischargeRecordsTable from "components/molecules/tabels/patient/DischargeRecordsTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_PATIENTS_DISCHARGE_LIST,
  SEARCH_PATIENT,
} from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import CustomMenu from "components/atoms/CustomMenu";
import { exportToExcel } from "utils/exportToExcel";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

const PageSize = 10;
const columns = [
  {
    id: "_id",
    displayName: "id",
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
    id: "religion",
    displayName: "religion",
  },
  {
    id: "occupation",
    displayName: "occupation",
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
    id: "admissionStatus",
    displayName: "admissionStatus",
  },
  {
    id: "gender",
    displayName: "gender",
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
    id: "phoneNumber",
    displayName: "phoneNumber",
  },
  {
    id: "maritalStatus",
    displayName: "maritalStatus",
  },
  {
    id: "ward",
    displayName: "ward",
  },
  {
    id: "bedNumber",
    displayName: "bedNumber",
  },
  {
    id: "admissionDate",
    displayName: "admissionDate",
  },
  {
    id: "age",
    displayName: "age",
  },
  {
    id: "ID",
    displayName: "ID",
  },
];
const formatExportData = (data) => {
  if (!data || !data?.length) return;

  const formartted = data.map((d) => {
    const copy = structuredClone(d);
    delete copy.residentialAddress;
    delete copy.permanentAddress;
    delete copy.nextOfKin;
    delete copy.payerDetails;
    delete copy.id;
    delete copy.medicalRecords;
    return {
      ...copy,
    };
  });
  return formartted;
};

function DischargeSummary() {
  const navigate = useNavigate();
  const [date, setdate] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");
  const [searchDischargeList, setsearchDischargeList] = React.useState("");
  const [onSelectPatient, setonSelectPatient] = React.useState(false);
  const [patientId, setpatientId] = React.useState("");
  const queryClient = useQueryClient();

  //get patients discharge summary
  const { data: list, isLoading: getPatientsLoading } = useCustomQuery(
    [
      GET_PATIENTS_DISCHARGE_LIST,
      {
        page: currentPage,
        limit: PageSize,
      },
    ],
    {
      url: `/patients/get-discharge-list?page=${currentPage}&limit=${PageSize}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  //search patients discharge summary
  const {
    isLoading: searchPatientsLoading,
    isFetching,
    refetch: searchPatientDischargeList,
  } = useCustomQuery(
    [
      GET_PATIENTS_DISCHARGE_LIST,
      {
        search: searchDischargeList,
      },
    ],
    {
      url: `/patients/get-discharge-list?search=${searchDischargeList}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onSuccess: (response) => {
        // queryClient.getQueryData()
        queryClient.setQueryData(
          [
            GET_PATIENTS_DISCHARGE_LIST,
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

  //discharge patient
  const { mutate: dischargePatient, isLoading: dischargePatientLoading } =
    useCustomMutation(
      {
        url: `/patients/discharge-patient/${patientId}`,
        method: "patch",
        avoidCancelling: true,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            GET_PATIENTS_DISCHARGE_LIST,
            {
              page: currentPage,
              limit: PageSize,
            },
          ]);
          setdate(null);
          setsearch("");
          setpatientId("");
          toast.success("Success");
        },

        onError: (error) => {
          toast.error(error.message[0]);
        },
      }
    );
  //schedule discharge patient
  const {
    mutate: scheduleDischargePatient,
    isLoading: scheduleDischargePatientLoading,
  } = useCustomMutation(
    {
      url: `/patients/schedule-discharge/${patientId}`,
      method: "patch",
      avoidCancelling: true,
      data: {
        dischargeDate: date,
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          GET_PATIENTS_DISCHARGE_LIST,
          {
            page: currentPage,
            limit: PageSize,
          },
        ]);
        setdate(null);
        setsearch("");
        setpatientId("");
        toast.success("Success");
      },

      onError: (error) => {
        toast.error(error.message[0]);
      },
    }
  );

  //search patients
  const {
    isLoading: patientsLoading,

    data: patients,
    refetch: refetchPatients,
  } = useCustomQuery(
    [SEARCH_PATIENT, search],
    {
      url: `/patients/get-all-patients`,
      data: {
        search,
      },
      method: "post",
      avoidCancelling: false,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!search && !onSelectPatient,
    }
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(
        formatExportData(list?.data?.patients),
        `discharge_sumary_${new Date()}`
      );
    }
  };

  const handlePatientOnselect = (res) => {
    setonSelectPatient(true);
    setpatientId(res._id);
    setsearch(`${res.firstName} ${res.lastName}`);
  };
  const handleDischarge = () => {
    if (!patientId) return toast.error("Please select a patient");
    if (!date) {
      dischargePatient();
    } else {
      scheduleDischargePatient();
    }
  };
  const handleSearch = () => {
    setCurrentPage(1);
    searchPatientDischargeList();
  };
  return (
    <Box>
      <Typography variant="displayMd">Patient Discharge</Typography>
      {/* <Paper sx={{ p: 3, pt: 3, mt: 3 }}>
        <Typography variant="displaySm">Discharge Details</Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={8}>
            <SearchDropdown
              placeholder="Search ( with “Patient name” or “Patient ID”)"
              handleOnselect={handlePatientOnselect}
              title="Patients's Information"
              createBtnTxt="Create New Patient"
              traySx={{ minWidth: "30vw" }}
              boxSx={{ width: "100%" }}
              data={patients?.data?.patients}
              isLoading={patientsLoading}
              search={search}
              setsearch={setsearch}
              reFetch={refetchPatients}
              setOnSelect={setonSelectPatient}
              createBtnAction={() => navigate(`/home/patient/registration`)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomDatePicker
              title="Date"
              type="date"
              datePickerRootSx={{ height: "auto" }}
              datePickerSx={{ width: "100%" }}
              views={["year", "month", "day"]}
              date={date}
              setdate={setdate}
              placeholder="Schedule discharge date"
              disableFuture={false}
            />
          </Grid>
        </Grid>
        <Button
          color="secondary"
          variant="contained"
          sx={{ p: 3, pt: 1, pb: 1, mt: 2 }}
          onClick={handleDischarge}
          disabled={dischargePatientLoading || scheduleDischargePatientLoading}
        >
          {date ? "Schedule Discharge" : "Discharge"}
        </Button>
      </Paper> */}
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="displaySm">Discharge Records</Typography>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <SearchBar
            refetch={searchPatientDischargeList}
            placeholder="Search Patient Name"
            search={searchDischargeList}
            setsearch={setsearchDischargeList}
            isLoading={searchPatientsLoading || isFetching}
            icnBtnSx={{ pt: 0.7, pb: 0.7 }}
          />

          <CustomMenu
            caption="Export"
            icon={<PrintIcon />}
            onClickItem={handleExport}
            popperSx={{ width: "12%" }}
            disabled={!list?.data?.patients?.length}
            items={[
              {
                name: (
                  <CsvDownloader
                    filename={`discharge_sumary_${new Date()}`}
                    extension=".csv"
                    columns={columns}
                    datas={formatExportData(list?.data?.patients) || []}
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
        </Box>
        {getPatientsLoading ? (
          <CustomLoader />
        ) : list?.data?.patients?.length ? (
          <>
            <DischargeRecordsTable
              data={list?.data?.patients}
              currentPage={currentPage}
            />
            <Box sx={{ p: { xs: 0, sm: 2 } }}>
              <Pagination
                currentPage={currentPage}
                totalCount={list?.data?.count || 20}
                pageSize={PageSize}
                onPageChange={handlePageChange}
              />
            </Box>
          </>
        ) : (
          "No data found"
        )}
      </Paper>
    </Box>
  );
}

export default React.memo(DischargeSummary);
