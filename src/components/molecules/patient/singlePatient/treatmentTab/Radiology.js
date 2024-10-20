import { Box, Stack, Typography } from "@mui/material";
import React from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/atoms/CustomButton";
import CustomSelect from "components/atoms/Select";
import CustomTextInput from "components/atoms/CustomTextInput";

import InvestigationTable from "components/molecules/tabels/patient/InvestigationTable";
import { v4 as uuidv4 } from "uuid";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_PENDING_TRANSACTIONS,
  GET_DEPARTMENTS,
  GET_PATIENT_INVESTIGATION,
  GET_TESTS,
} from "utils/reactQueryKeys";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import CustomDatePicker from "components/atoms/DatePicker";
import RadiologyTable from "components/molecules/tabels/patient/RadiologyTable";

const initialValues = {
  test: "",
  note: "",
  date: "",
  // time: "",
};
const removeUid = (list) => {
  if (!list.length) return;
  const investigations = list.map((a) => {
    const copy = structuredClone(a);
    delete copy.uid;
    delete copy.patient;
    return copy;
  });
  return {
    investigations,
    patient: list[0].patient,
  };
};
function Radiology({
  handleNext,
  values: stateValue,
  setValues: setStateValues,
  mutate: postVisitItem,
  isLoading: postVisitItemLoading,
  isActiveVisit,
}) {
  const { id } = useParams();
  const [list, setlist] = React.useState([]);
  const queryClient = useQueryClient();

  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });

  //get depts
  const { data: allTests } = useCustomQuery(
    [GET_TESTS, "RADIOLOGY"],
    {
      url: `/test?departmentType=RADIOLOGY`,
      method: "get",
    },
    {
      refetchOnWindowFocus: true,

      select: (data) => {
        const formartedData = data?.data?.map((test) => {
          return { name: test?.testName, value: test?._id };
        });
        return formartedData;
      },
    }
  );

  //post investigations and add to visit item array
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/investigation`,
      method: "post",

      data: removeUid(list),
    },
    {
      onSuccess: (res) => {
        const data = res.data.map((val) => val._id);
        setStateValues({
          ...stateValue,
          radiology: [...stateValue.radiology, ...data],
        });
        queryClient.invalidateQueries([GET_PATIENT_INVESTIGATION, id]);
        queryClient.invalidateQueries([GET_ALL_PENDING_TRANSACTIONS]);
        setlist([]);
        toast.success("Success");
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const handleAddToList = () => {
    if (!values.test) return;
    setlist([
      ...list,
      {
        ...values,
        patient: id,
        uid: uuidv4(),
      },
    ]);
    resetForm();
  };
  const handleDelete = (id) => {
    const newState = list.filter((investigation) => investigation.uid !== id);
    setlist(newState);
  };
  const getTestName = (testId) => {
    const test = allTests.find((test) => test.value === testId);
    return test.name;
  };
  const handleDone = () => {
    postVisitItem();
  };
  const handleSelectTime = (date, name) => {
    setValues((prev) => {
      return {
        ...prev,
        [name]: date,
      };
    });
  };
  return (
    <Box>
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "50%",
          },
          mt: 2,
        }}
      >
        <CustomSelect
          options={allTests}
          label="Test Type"
          state={values.test}
          handleChange={handleChange}
          name="test"
          haveTopLabel={true}
        />

        <Stack
          direction={{
            sm: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent="flex-start"
          alignItems={"flex-start"}
        >
          <CustomDatePicker
            title="Prefered Date"
            type="date"
            views={["year", "month", "day"]}
            datePickerRootSx={{ height: "auto" }}
            date={values?.date || null}
            setdate={handleSelectTime}
            name="date"
            disableFuture={false}
          />

          {/* <CustomDatePicker
            type="time"
            title="Time"
            placeholder="Select time"
            name="time"
            disableFuture={false}
            setdate={handleSelectTime}
            datePickerRootSx={{
              height: "auto",
            }}
            date={values?.time || null}
          /> */}
        </Stack>
        <CustomTextInput
          title="Note"
          value={values.note}
          name="note"
          handleChange={handleChange}
          placeholder="Enter remark here"
          multiline={true}
          helperText={`${values.note.length} / 200`}
          rows={10}
        />
        <CustomButton
          text="Add"
          color="secondary"
          startIcon={<AddCircleOutlineIcon fontSize="small" />}
          onClick={handleAddToList}
        />
      </Box>
      <Stack direction="column" spacing={1} sx={{ mt: 2, mb: 2 }}>
        <Typography variant="heading">Added List</Typography>
        {list.map((list, i, arr) => (
          <Stack
            sx={{
              width: {
                xs: "100%",
                sm: "80%",
              },
              p: 1,
              borderBottom: i !== arr.length - 1 && "1px solid rgba(0,0,0,0.2)",
            }}
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
            spacing={1}
            key={list.uid}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {getTestName(list.test)}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>{list.note}</Typography>
            <CustomButton
              text={"Delete"}
              color="error"
              endIcon={<DeleteIcon />}
              onClick={handleDelete.bind(this, list.uid)}
            />
          </Stack>
        ))}
      </Stack>

      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="space-between"
        sx={{ mt: 3, width: { xs: "100%" } }}
      >
        <Stack direction={"row"} spacing={1}>
          <CustomButton
            text={"Proceed"}
            sx={{ width: "100%" }}
            onClick={mutate}
            disabled={isLoading}
          />
          <CustomButton
            text={"Skip"}
            onClick={handleNext}
            variant="containedBrown"
            sx={{ width: "100%" }}
          />
        </Stack>
        <CustomButton
          text={"Done"}
          onClick={handleDone}
          disabled={postVisitItemLoading || !isActiveVisit}
        />
      </Stack>

      <Box
        sx={{
          mt: 3,
          mb: 2,
        }}
      >
        <Typography variant="heading" gutterBottom>
          Investigation Request
        </Typography>
      </Box>
      <RadiologyTable />
    </Box>
  );
}

export default Radiology;
