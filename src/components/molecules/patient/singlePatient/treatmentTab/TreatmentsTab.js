import { Box, Button, Paper } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setcurrentTab } from "store/contextStore/treatmentTab/TabAction";
import { useTabCtx } from "store/contextStore/treatmentTab/TabStore";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_PATIENT_RECENT_VISIT,
  GET_PATIENT_RECENT_VISIT_ITEM,
} from "utils/reactQueryKeys";
import Allergies from "./Allergies";
import AssesmentLog from "./assesmentLog/AssesmentLog";
import DoctorsNote from "./DoctorsNote";
import Investigations from "./Investigations";
import NurseAssesment from "./NurseAssesment";
import Prescription from "./Prescription";
import Referal from "./Referal";
import VitalSigns from "./VitalSigns";
import Radiology from "./Radiology";
import Package from "./Package";
import { fromCamelCase } from "utils/handleCamelse";

const data = [
  {
    title: "Vital Signs",
    id: 1,
  },
  {
    title: "Allergies",
    id: 2,
  },
  {
    title: "Package",
    id: 3,
  },
  {
    title: "Investigations",
    id: 4,
  },
  {
    title: "Prescription",
    id: 5,
  },
  {
    title: "Radiology",
    id: 6,
  },
  {
    title: `Doctor's Note`,
    id: 7,
  },
  {
    title: "Assesment Log",
    id: 8,
  },

  {
    title: "Recommendation",
    id: 9,
  },
];
const TabHeader = ({ item, handleClick, currentTab }) => {
  return (
    <Paper
      sx={{
        backgroundColor: `${currentTab !== item.id ? "background.light" : ""}`,
        fontSize: "9px",
        maxHeight: "30px",

        ml: 0.2,
        mr: 0.2,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <Button
        variant="text"
        sx={{
          fontSize: "11px",
          fontWeight: "bold",
          color: `${currentTab !== item.id ? "text.custom" : "text.primary"}`,
        }}
        onClick={() => handleClick(item.id)}
      >
        {item.title}
      </Button>
    </Paper>
  );
};

const initialValues = {
  vitalSigns: {
    urineOutput: 0,
    diastolicBloodPressure: 0,
    systolicBloodPressure: 0,
    temperature: 0,
    weight: 0,
    height: 0,
    respiratoryRate: 0,
    heartRate: 0,
    glucose: 0,
    oxygenSaturation: "",
    dynamicFields: {},
  },
  allergies: [],
  investigation: [],
  prescription: [],
  radiology: [],
};

function TreatmentsTab() {
  const { state, dispatch } = useTabCtx();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [dynamicFields, setdynamicFields] = useState([]);
  const [localDynamicFieldsState, setlocalDynamicFieldsState] = useState({});
  const { handleChange, values, setValues } = useFormik({
    initialValues,
  });
  const handleClick = (tab) => {
    dispatch(setcurrentTab(tab));
    // setcurrentTab(tab);
  };
  const handleNext = () => {
    dispatch(setcurrentTab(state.currentTab + 1));
    // setcurrentTab(currentTab + 1);
  };

  //get recent visit item
  const { data: visitItem } = useCustomQuery(
    [GET_PATIENT_RECENT_VISIT_ITEM, id],
    {
      url: `/visit/recent/item/${id}`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (typeof res.data !== "string" && Object.keys(res.data)) {
          setValues({
            ...values,
            vitalSigns:
              res?.data?.visitItem?.vitalSigns || initialValues.vitalSigns,
            allergies: res?.data?.visitItem?.allergies || [],
          });
          if (res?.data?.visitItem?.vitalSigns?.dynamicFields) {
            const formatData = Object.entries(
              res?.data?.visitItem?.vitalSigns?.dynamicFields
            ).map(([key, val]) => ({
              fromApi: true,
              name: fromCamelCase(key),
              camelCaseName: key,
              type: val["range"]["type"],
              higher:
                val["range"]["type"] === "number"
                  ? val["range"]["normal"]["max"]
                  : 0,
              lower:
                val["range"]["type"] === "number"
                  ? val["range"]["normal"]["min"]
                  : 0,
              textVal:
                val["range"]["type"] === "text" ? val["range"]["normal"] : "",
            }));

            setdynamicFields(formatData);
            const localState = {};
            Object.entries(
              res?.data?.visitItem?.vitalSigns?.dynamicFields
            ).forEach(([key, val]) => (localState[key] = val["value"]));
            setlocalDynamicFieldsState(localState);
          }
        }
      },
    }
  );
  //get recent visits
  const { data: recentVisit } = useCustomQuery(
    [GET_PATIENT_RECENT_VISIT, id],
    {
      url: `/visit/recent/${id}`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //patch visit {vital signs}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/visit/${recentVisit?.data?._id}`,
      method: "patch",
      data: values,
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_PATIENT_RECENT_VISIT, id]);
        queryClient.invalidateQueries([GET_PATIENT_RECENT_VISIT_ITEM, id]);
        toast.success("Success");
        handleNext();
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const handlePostItem = () => {
    if (!recentVisit)
      return toast.error(
        "Error getting recent visit, please make sure to start a visit"
      );
    mutate();
  };

  let tab;

  switch (state.currentTab) {
    case 1:
      tab = (
        <VitalSigns
          handleNext={handleNext}
          handleChange={handleChange}
          values={values}
          isLoading={isLoading}
          mutate={handlePostItem}
          setValues={setValues}
          isActiveVisit={recentVisit?.data?.status === "ACTIVE"}
          dynamicFields={dynamicFields}
          setdynamicFields={setdynamicFields}
          localDynamicFieldsState={localDynamicFieldsState}
          setlocalDynamicFieldsState={setlocalDynamicFieldsState}
        />
      );
      break;
    case 2:
      tab = (
        <Allergies
          handleNext={handleNext}
          handleChange={handleChange}
          values={values}
          isLoading={isLoading}
          mutate={handlePostItem}
          setValues={setValues}
          visitItem={visitItem}
          isActiveVisit={recentVisit?.data?.status === "ACTIVE"}
        />
      );
      break;

    case 3:
      tab = <Package handleNext={handleNext} Package={{}} />;
      break;
    case 4:
      tab = (
        <Investigations
          handleNext={handleNext}
          values={values}
          setValues={setValues}
          mutate={handlePostItem}
          isLoading={isLoading}
          isActiveVisit={recentVisit?.data?.status === "ACTIVE"}
        />
      );
      break;
    case 5:
      tab = (
        <Prescription
          handleNext={handleNext}
          values={values}
          mutate={handlePostItem}
          setValues={setValues}
          isLoading={isLoading}
          isActiveVisit={recentVisit?.data?.status === "ACTIVE"}
        />
      );
      break;
    case 6:
      tab = (
        <Radiology
          handleNext={handleNext}
          values={values}
          mutate={handlePostItem}
          setValues={setValues}
          isLoading={isLoading}
          isActiveVisit={recentVisit?.data?.status === "ACTIVE"}
        />
      );
      break;
    case 7:
      tab = <DoctorsNote handleNext={handleNext} />;
      break;
    case 8:
      tab = (
        <AssesmentLog
          handleNext={handleNext}
          visitId={recentVisit?.data?._id}
          assesmentLogs={recentVisit?.data?.assessmentLog}
        />
      );
      break;

    case 9:
      tab = <Referal />;
      break;

    default:
      break;
  }

  return (
    <Box sx={{}}>
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          maxWidth: "95%",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {data.map((item) => (
          <TabHeader
            item={item}
            currentTab={state.currentTab}
            handleClick={handleClick}
            key={item.title}
          />
        ))}
      </Box>
      <Paper sx={{ p: 2 }}>{tab}</Paper>
    </Box>
  );
}

export default TreatmentsTab;
