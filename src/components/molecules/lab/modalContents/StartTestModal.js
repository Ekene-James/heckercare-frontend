import { Divider, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CustomSwitch from "components/atoms/Switch";
import UploadBoard from "components/atoms/UploadBoard";
import SearchDropdown from "components/atoms/SearchDropdown";
import React from "react";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_DEPARTMENTS,
  GET_TEST_INFO,
  GET_TEST_LIST,
  SEARCH_PATIENT,
} from "utils/reactQueryKeys";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

function StartTestModal({ handleClose }) {
  const queryClient = useQueryClient();
  const [selectedTest, setSelectedTest] = React.useState("");
  const [search, setsearch] = React.useState("");
  const [onSelectPatient, setonSelectPatient] = React.useState(false);
  const [patientId, setpatientId] = React.useState("");

  const [formState, setformState] = React.useState({
    testName: "",
    note: "",
    rate: "",
    duration: "",
  });

  // handle start Test
  const { mutate: createTest, isLoading: handleCreateTestLoading } =
    useCustomMutation(
      {
        url: `/investigation`,
        method: "post",

        data: {
          patient: patientId,
          investigations: [
            {
              test: formState.testName,

              note: formState.note,
            },
          ],
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_TEST_INFO]);
          toast.success("Success");

          handleClose();
        },

        onError: (error) => toast.error(error.message),
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
      refetchOnWindowFocus: true,
      enabled: !!search && !onSelectPatient,
    }
  );

  const handleSearchPatientOnChange = (text) => {
    setonSelectPatient(false);
    setsearch(text);
  };

  const handlePatientOnselect = (res) => {
    setonSelectPatient(true);
    setpatientId(res?._id);
    setformState({
      ...formState,
      patient: search,
    });
    setsearch(`${res?.firstName} ${res?.lastName}`);
  };

  const handleChange = (e) => {
    if (e.target.name === "testName") {
      const selectedTest = testList.find(
        (test) => test.value === e.target.value
      );
      setSelectedTest(selectedTest);
      setformState({
        ...formState,
        [e.target.name]: e.target.value,
        rate: selectedTest.rate,
        duration: selectedTest.duration,
      });
    } else {
      setformState({
        ...formState,
        [e.target.name]: e.target.value,
      });
    }
  };

  //get all test

  const { data: testList } = useCustomQuery(
    [GET_TEST_LIST],
    {
      url: `/test`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) =>
        data?.data?.map((d) => {
          return {
            name: d.testName,
            value: d._id,
            rate: d.rate,
            duration: d.duration,
          };
        }),
    }
  );

  // //get depts
  // const { data: allDepartments } = useCustomQuery(
  //   GET_DEPARTMENTS,
  //   {
  //     url: `/department/get-all-departments`,
  //     method: "get",
  //     avoidCancelling: true,
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     select: (data) => {
  //       const formartedData = data.data.departments.map((dept) => {
  //         return { name: dept.name, value: dept._id };
  //       });
  //       return formartedData;
  //     },
  //   }
  // );
  const handleCreateTest = () => {
    if (!patientId) return toast.error("Please select a Patient's Name");
    if (!formState.testName) return toast.error("Please select a Test Name");
    if (!formState.note) return toast.error("Please write a note");
    createTest();
  };
  return (
    <Stack
      direction={"column"}
      sx={{ width: "100%" }}
      spacing={3}
      aria-label="create-inventory-modal-child"
    >
      <Stack direction={"column"} sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayMd">Start New Test</Typography>
      </Stack>
      <Divider />
      <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
            <Grid item xs={12}>
              <SearchDropdown
                placeholder="Search ( with “Patient name” or “Patient ID”)"
                handleOnselect={handlePatientOnselect}
                title="Patient's Name"
                boxSx={{ width: "100%" }}
                data={patients?.data?.patients}
                // defaultValue={`${prescription?.data?.patient?.firstName} ${prescription?.data?.patient?.lastName}`}
                isLoading={patientsLoading}
                search={search}
                setsearch={handleSearchPatientOnChange}
                reFetch={refetchPatients}
                setOnSelect={setonSelectPatient}
                traySx={{ minWidth: "25vw", bottom: "-125px" }}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomSelect
                options={testList}
                label="Test Name"
                state={formState.testName}
                handleChange={handleChange}
                name="testName"
                haveTopLabel={true}
                placeholder="Select Test Type"
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <CustomSelect
                options={allDepartments}
                label="Department"
                state={formState.department}
                handleChange={handleChange}
                name="department"
                haveTopLabel={true}
                placeholder="Select Department"
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Rate (₦)"
                value={formState.rate}
                name="rate"
                readOnly
                disabled={`true`}
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Type in the rate"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Estimated Duration"
                value={formState.duration}
                name="duration"
                readOnly
                disabled={`true`}
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Enter length of time"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                title="Note"
                value={formState.note}
                name="note"
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Type in note"
                multiline
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <CustomButton
                text="Start Test"
                color="secondary"
                onClick={handleCreateTest}
                disabled={handleCreateTestLoading}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <CustomButton
                text="Cancel"
                color="secondary"
                variant="outlined"
                onClick={handleClose}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default StartTestModal;
