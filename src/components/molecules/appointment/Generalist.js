import { Button, Grid, Stack } from "@mui/material";

import React from "react";

import ScheduleAppointmentTable from "../tabels/appointment/ScheduleAppointmentTable";
import RadioBtnWithDescription from "components/atoms/RadioBtnWithDescription";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import {
  GET_ALL_PENDING_TRANSACTIONS,
  GET_GENERALIST_APPOINTMENTS,
  GET_PACKAGES,
  SEARCH_PATIENT,
} from "utils/reactQueryKeys";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import CustomSelect from "components/atoms/Select";
import CustomButton from "components/atoms/CustomButton";

function Generalist() {
  const queryClient = useQueryClient();
  const [search, setsearch] = React.useState("");
  const [patientId, setpatientId] = React.useState("");
  const [otherFormState, setotherFormState] = React.useState({
    package: "",
  });
  const [onSelectPatient, setonSelectPatient] = React.useState(false);
  const navigate = useNavigate();
  //get all appointments by doctorId
  const {
    data: generalistData,
    isLoading,
    refetch,
  } = useCustomQuery(
    GET_GENERALIST_APPOINTMENTS,
    {
      url: `/appointments/get-generalist-appointments`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //get patients
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

  //add patient to a generalist appointment
  const { mutate, isLoading: createAppointmentLoading } = useCustomMutation(
    {
      url: `/appointments/create-generalist-appointment`,
      method: "post",
      data: { patient: patientId, package: otherFormState.package },
    },
    {
      onSuccess: () => {
        refetch();
        queryClient.invalidateQueries([GET_ALL_PENDING_TRANSACTIONS]);
        setsearch("");
        setpatientId("");
        setotherFormState({ package: "" });
        toast.success("Success");
      },

      onError: (error) => {
        if (typeof error.message === "object") {
          return error.message.map((msg) => toast.error(msg));
        }
        toast.error(error.message);
      },
    }
  );
  //get packages
  const {
    data: packages,
    isPackagesLoading,
    isPackagesError,
  } = useCustomQuery(
    [GET_PACKAGES],
    {
      url: `/package`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data.packages.map((pkg) => ({
          name: pkg.name,
          value: pkg._id,
        }));
      },
    }
  );

  const handlePatientOnselect = (res) => {
    setonSelectPatient(true);
    setpatientId(res._id);
    setsearch(`${res.firstName} ${res.lastName}`);
  };

  const handleChange = (e) => {
    setotherFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Grid container spacing={1} sx={{ marginTop: 2, width: "100%" }}>
      <Grid item xs={12} sm={8}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
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

          <Grid item xs={12}>
            <CustomSelect
              options={packages}
              label="Package"
              handleChange={handleChange}
              name="package"
              haveTopLabel={true}
              placeholder="Select from list"
              disabled={isPackagesLoading}
              state={otherFormState.package}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              text={"Save"}
              color="secondary"
              sx={{ width: "200px" }}
              onClick={mutate}
              disabled={createAppointmentLoading}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {isLoading ? (
          <CustomLoader />
        ) : (
          <ScheduleAppointmentTable
            data={generalistData?.data?.appointments}
            refetch={refetch}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default Generalist;
