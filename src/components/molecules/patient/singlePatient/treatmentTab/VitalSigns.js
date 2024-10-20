import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";

import React, { useMemo, useState } from "react";
import { toCamelCase } from "utils/handleCamelse";
import ColorCodeChip from "components/atoms/ColorCodeChip";
import { GET_SAMPLE_STANDARDS } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

const formatLocalDynamicField = (dynamicStates, dynamicFields) => {
  const result = {};
  Object.entries(dynamicStates).forEach(([key, val]) => {
    const field = dynamicFields.find((f) => f.camelCaseName === key);
    if (field) {
      result[key] = {
        value: val,
        range: {
          type: field.type,
          normal:
            field.type === "text"
              ? field.textVal
              : {
                  min: field.lower,
                  max: field.higher,
                },
        },
      };
    }
  });

  return result;
};

const ModalContent = ({ handleAddField }) => {
  const [form, setform] = useState({
    name: "",
    type: "text",
    lower: "",
    higher: "",
    textVal: "",
  });

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="displaySm">Add a custom field </Typography>
      <CustomTextInput
        title="Field Name"
        onChange={handleChange}
        value={form.name}
        name="name"
        placeholder={"Type in field name"}
      />

      <CustomSelect
        options={[
          { name: "Text", value: "text" },
          { name: "Number", value: "number" },
        ]}
        placeholder="Select Field Type"
        state={form?.type}
        handleChange={handleChange}
        label="Field Type"
        name="type"
        haveTopLabel={true}
      />
      {form.type === "number" ? (
        <Stack>
          <Stack direction={"row"} alignItems={"center"} gap={2}>
            <Typography
              variant="displaySm"
              sx={{ fontWeight: "700", fontSize: "16px", lineHeight: "24px" }}
            >
              Normal Range
            </Typography>
            <ColorCodeChip type={"normal"} />
          </Stack>
          <Typography
            variant="displaySm"
            sx={{
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "18.2px",
              opacity: "0.5",
            }}
          >
            The established physiological range for healthy individuals.
          </Typography>

          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            direction={"row"}
            gap={2}
          >
            <CustomTextInput
              title="Lower Limit"
              value={form.lower}
              name={"lower"}
              handleChange={handleChange}
              placeholder={"Enter Value"}
              variant="filled"
              type="number"
            />
            <Box sx={{ mt: 3 }}>
              <svg
                width="33"
                height="13"
                viewBox="0 0 33 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                  fill="#D9D9D9"
                />
              </svg>
            </Box>

            <CustomTextInput
              title="Higher Limit"
              value={form.higher}
              name={"higher"}
              handleChange={handleChange}
              placeholder={"Enter Value"}
              variant="filled"
              type="number"
            />
          </Stack>
        </Stack>
      ) : (
        <Stack>
          <Typography
            variant="displaySm"
            sx={{
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "18.2px",
              opacity: "0.5",
            }}
          >
            The established physiological range for healthy individuals.
          </Typography>

          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            direction={"row"}
            gap={2}
          >
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Typography
                variant="displaySm"
                sx={{ fontWeight: "700", fontSize: "16px", lineHeight: "24px" }}
              >
                Normal Range
              </Typography>
              <ColorCodeChip type={"normal"} />
            </Stack>
            <Box>
              <svg
                width="33"
                height="13"
                viewBox="0 0 33 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                  fill="#D9D9D9"
                />
              </svg>
            </Box>

            <CustomTextInput
              value={form.textVal}
              name={"textVal"}
              handleChange={handleChange}
              placeholder={"Enter text here"}
            />
          </Stack>
        </Stack>
      )}

      <CustomButton
        text={"Add"}
        onClick={handleAddField.bind(null, form)}
        color="secondary"
        disabled={
          !form.name ||
          !form.type ||
          (form.type === "text" ? !form.textVal : !form.lower || !form.higher)
        }
        sx={{ width: "50%" }}
      />
    </Stack>
  );
};
const DynamicField = ({
  handleChange,
  field,
  value,
  name,
  handleRemove,
  fromApi = false,
}) => {
  return (
    <Box sx={{ position: "relative" }}>
      {!fromApi ? (
        <IconButton
          onClick={handleRemove.bind(null, field.id)}
          sx={{ position: "absolute", top: -5, right: -10 }}
        >
          <CloseIcon sx={{ color: "red" }} />
        </IconButton>
      ) : null}

      <CustomTextInput
        title={field.name}
        onChange={handleChange}
        value={value}
        name={name}
        type={field.type}
        inputProps={{
          inputProps:
            field.type === "number"
              ? {
                  min: 0,
                }
              : {},
          endAdornment: !!value && (
            <ColorCodeChip
              type={getColorCode(
                value || 0,
                {
                  high: +field.higher,
                  low: +field.lower,
                  normal: field?.textVal,
                },
                field.type
              )}
            />
          ),
        }}
        grayBg
      />
    </Box>
  );
};

const getColorCode = (
  value,
  calibration = { high: 200, low: 10, normal: "yellow" },
  type = "number"
) => {
  let colorCode = "";
  if (type === "number") {
    if (value > calibration.high) {
      colorCode = "high";
    } else if (value < calibration.low) {
      colorCode = "low";
    } else {
      colorCode = "normal";
    }
  } else {
    if (value?.toLowerCase() === calibration?.normal?.toLowerCase()) {
      colorCode = "normal";
    } else {
      colorCode = "bad";
    }
  }
  return colorCode;
};

function VitalSigns({
  handleNext,
  handleChange,
  values,
  isLoading,
  mutate,
  isActiveVisit,
  setValues,
  setlocalDynamicFieldsState,
  localDynamicFieldsState,
  setdynamicFields,
  dynamicFields,
}) {
  const [bmi, setbmi] = React.useState(0);
  const modalRef = React.useRef(null);

  const [callMutateFn, setcallMutateFn] = useState(false);

  useMemo(() => {
    if (callMutateFn) mutate();
    return () => setcallMutateFn(false);
  }, [callMutateFn]);

  //get vitals range
  const {
    data: ranges,
    isLoading: isStandardsLoading,
    isError: isStandardsError,
    isSuccess: isRangeSuccess,
  } = useCustomQuery(
    [GET_SAMPLE_STANDARDS],
    {
      url: `/visit/item/vital-signs/settings`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data;
      },
    }
  );

  const onNext = () => {
    setValues({
      ...values,
      vitalSigns: {
        ...values.vitalSigns,
        dynamicFields: {
          ...formatLocalDynamicField(localDynamicFieldsState, dynamicFields),
        },
      },
    });
    handleNext();
  };
  const onDone = () => {
    setValues({
      ...values,
      vitalSigns: {
        ...values.vitalSigns,
        dynamicFields: {
          ...formatLocalDynamicField(localDynamicFieldsState, dynamicFields),
        },
      },
    });
    setdynamicFields([]);
    setcallMutateFn(true);
    // mutate();
  };

  //calculate bmi
  React.useMemo(() => {
    if (values?.vitalSigns?.height && values?.vitalSigns?.weight) {
      const heightInMeters = values.vitalSigns.height / 100;
      const sqrtOfHeight = Math.sqrt(heightInMeters);
      const bmi = values.vitalSigns.weight / sqrtOfHeight;
      const bmi2DP = +(Math.round(bmi + "e+2") + "e-2");
      return setbmi(bmi2DP);
    }
  }, [values?.vitalSigns?.height, values?.vitalSigns?.weight]);

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleAddField = (field) => {
    setdynamicFields((prev) => [
      ...prev,
      { ...field, id: uuidv4(), camelCaseName: toCamelCase(field.name) },
    ]);
    setlocalDynamicFieldsState((prev) => ({
      ...prev,
      [toCamelCase(field.name)]: field.type === "text" ? "" : 0,
    }));
    toggleModal();
  };
  const handleRemove = (id) => {
    const field = dynamicFields.find((f) => f.id === id);

    setlocalDynamicFieldsState((prev) => {
      delete prev[toCamelCase(field.name)];
      return prev;
    });

    setdynamicFields((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLocalDynamicFieldChange = (e) => {
    setlocalDynamicFieldsState({
      ...localDynamicFieldsState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Grid container spacing={1} sx={{ width: "100%" }}>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            grayBg
            title={`Weight (${ranges?.["weight"]?.["unit"] || "Kg"})`}
            type="number"
            inputProps={{ inputProps: { min: 0 } }}
            onChange={handleChange}
            value={values?.vitalSigns?.weight}
            name="vitalSigns.weight"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Height (${ranges?.["height"]?.["unit"] || "cm"})`}
            type="number"
            inputProps={{ inputProps: { min: 0 } }}
            onChange={handleChange}
            value={values?.vitalSigns?.height}
            name="vitalSigns.height"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`BMI (${ranges?.["bmi"]?.["unit"] || "kg/m2"})`}
            grayBg
            type="number"
            disabled="true"
            value={bmi}
            name="bmi"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.height &&
                !!values?.vitalSigns?.weight &&
                bmi &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(bmi || 0, {
                      high: ranges["bmi"]["normal"]["max"],
                      low: ranges["bmi"]["normal"]["min"],
                    })}
                  />
                ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Systolic B.P (${
              ranges?.["systolicBloodPressure"]?.["unit"] || "mmHg"
            })`}
            type="number"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.systolicBloodPressure &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(
                      values?.vitalSigns?.systolicBloodPressure || 0,
                      {
                        high: ranges["systolicBloodPressure"]["normal"]["max"],
                        low: ranges["systolicBloodPressure"]["normal"]["min"],
                      }
                    )}
                  />
                ),
            }}
            onChange={handleChange}
            value={values?.vitalSigns?.systolicBloodPressure}
            name="vitalSigns.systolicBloodPressure"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Diastolic B.P (${
              ranges?.["diastolicBloodPressure"]?.["unit"] || "mmHg"
            })`}
            type="number"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.diastolicBloodPressure &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(
                      values?.vitalSigns?.diastolicBloodPressure || 0,
                      {
                        high: ranges["diastolicBloodPressure"]["normal"]["max"],
                        low: ranges["diastolicBloodPressure"]["normal"]["min"],
                      }
                    )}
                  />
                ),
            }}
            onChange={handleChange}
            value={values?.vitalSigns?.diastolicBloodPressure}
            name="vitalSigns.diastolicBloodPressure"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Temp (${ranges?.["temperature"]?.["unit"] || "oC"})`}
            type="number"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.temperature &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(values?.vitalSigns?.temperature || 0, {
                      high: ranges["temperature"]["normal"]["max"],
                      low: ranges["temperature"]["normal"]["min"],
                    })}
                  />
                ),
            }}
            onChange={handleChange}
            value={values?.vitalSigns?.temperature}
            name="vitalSigns.temperature"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Respiratory Rate (${
              ranges?.["respiratoryRate"]?.["unit"] || "breaths/min"
            })`}
            type="number"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.respiratoryRate &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(
                      values?.vitalSigns?.respiratoryRate || 0,
                      {
                        high: ranges["respiratoryRate"]["normal"]["max"],
                        low: ranges["respiratoryRate"]["normal"]["min"],
                      }
                    )}
                  />
                ),
            }}
            onChange={handleChange}
            value={values?.vitalSigns?.respiratoryRate}
            name="vitalSigns.respiratoryRate"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Heart Rate (${ranges?.["heartRate"]?.["unit"] || "BPM"})`}
            type="number"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.heartRate &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(values?.vitalSigns?.heartRate || 0, {
                      high: ranges["heartRate"]["normal"]["max"],
                      low: ranges["heartRate"]["normal"]["min"],
                    })}
                  />
                ),
            }}
            onChange={handleChange}
            value={values?.vitalSigns?.heartRate}
            name="vitalSigns.heartRate"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Urine Output (${
              ranges?.["urineOutput"]?.["unit"] || "mL"
            })`}
            type="number"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.urineOutput &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(values?.vitalSigns?.urineOutput || 0, {
                      high: ranges["urineOutput"]["normal"]["max"],
                      low: ranges["urineOutput"]["normal"]["min"],
                    })}
                  />
                ),
            }}
            onChange={handleChange}
            value={values?.vitalSigns?.urineOutput}
            name="vitalSigns.urineOutput"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Blood Sugar (${ranges?.["glucose"]?.["unit"] || "mg/dL"})`}
            type="number"
            inputProps={{
              inputProps: { min: 0 },
              endAdornment: !!values?.vitalSigns?.glucose && isRangeSuccess && (
                <ColorCodeChip
                  type={getColorCode(values?.vitalSigns?.glucose || 0, {
                    high: ranges["glucose"]["normal"]["max"],
                    low: ranges["glucose"]["normal"]["min"],
                  })}
                />
              ),
            }}
            onChange={handleChange}
            value={values?.vitalSigns?.glucose}
            name="vitalSigns.glucose"
            grayBg
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title={`Oxygen Saturation (${
              ranges?.["oxygenSaturation"]?.["unit"] || "SpO2"
            })`}
            onChange={handleChange}
            value={values?.vitalSigns?.oxygenSaturation}
            name="vitalSigns.oxygenSaturation"
            grayBg
            inputProps={{
              endAdornment: !!values?.vitalSigns?.oxygenSaturation &&
                isRangeSuccess && (
                  <ColorCodeChip
                    type={getColorCode(
                      values?.vitalSigns?.oxygenSaturation || 0,
                      {
                        high: ranges["oxygenSaturation"]["normal"]["max"],
                        low: ranges["oxygenSaturation"]["normal"]["min"],
                      }
                    )}
                  />
                ),
            }}
          />
        </Grid>

        {
          // display and handle  dynamic fields
          dynamicFields.map((field) => (
            <Grid key={field.name} item xs={12} sm={6}>
              <DynamicField
                field={field}
                handleChange={handleLocalDynamicFieldChange}
                handleRemove={handleRemove}
                value={localDynamicFieldsState[toCamelCase(field.name)]}
                name={toCamelCase(field.name)}
                fromApi={!!field?.fromApi}
              />
            </Grid>
          ))
        }
      </Grid>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        mt={3}
        spacing={1}
      >
        <Stack direction={"row"} gap={2}>
          <CustomButton
            text={"Next"}
            onClick={onNext}
            variant="containedBrown"
            sx={{ minWidth: { xs: "48%", sm: "100%" } }}
          />
          <CustomButton
            text={"Add Field"}
            onClick={toggleModal}
            variant="secondary"
            sx={{
              minWidth: { xs: "48%", sm: "100%" },
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          />
        </Stack>

        <CustomButton
          text={"Done"}
          sx={{ minWidth: "30%" }}
          disabled={isLoading || !isActiveVisit}
          onClick={onDone}
        />
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          height: "fit-content !important",
          minWidth: "40vw !important",
          minHeight: "25vh",
        }}
      >
        <ModalContent handleAddField={handleAddField} />
      </CustomModal>
    </>
  );
}

export default VitalSigns;
