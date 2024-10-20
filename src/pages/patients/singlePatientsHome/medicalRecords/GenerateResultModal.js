import { Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import CustomLoader from "components/atoms/CustomLoader";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import { useFormik } from "formik";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { downloadOnClick } from "utils/exportToExcel";
import { handleErrorProps } from "utils/handleErrorProps";
import {
  GET_INVESTIGATION_TESTS,
  GET_PACKAGES,
  GET_PATIENT,
} from "utils/reactQueryKeys";
import { useSanitizeQueryParams } from "utils/sanitizeQuery";
const initialValues = {
  reportTitle: "",
  package: "",
  from: null,
  to: null,
  laboratory: "",
  radiology: "",
  comment: "",
  email: "",
  recentVitalResult: false,
};
const requireFields = ["reportTitle", "comment", "email"];

const ResultSummary = ({ tests, handleClickTest }) => {
  return (
    <>
      {tests?.length ? (
        <Stack
          direction={"column"}
          spacing={2}
          width={"100%"}
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <Stack
            alignItems={"center"}
            justifyContent={"space-between"}
            direction={"row"}
          >
            <Stack
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{ pl: 3 }}
              direction={"row"}
              width={"100%"}
            >
              <Typography variant="" sx={{ fontWeight: 700 }}>
                Test Type
              </Typography>
              <Typography variant="" sx={{ fontWeight: 700 }}>
                Date Performed
              </Typography>
              <div />
            </Stack>
          </Stack>
          {tests.map((test, i) => (
            <Stack
              key={i}
              alignItems={"center"}
              justifyContent={"space-between"}
              direction={"row"}
            >
              <Stack
                alignItems={"center"}
                justifyContent={"space-between"}
                sx={{
                  backgroundColor: "primary.gray",
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                }}
                direction={"row"}
                width={"100%"}
              >
                <Typography variant="" sx={{ fontWeight: 500, width: "45%" }}>
                  {test.testName}
                </Typography>
                <Typography
                  variant=""
                  sx={{ fontWeight: 500, width: "40%", textAlign: "start" }}
                >
                  {moment(test?.datePerformed).format("MMMM Do, YYYY")}
                </Typography>
                <IconButton
                  onClick={handleClickTest.bind(this, test)}
                  aria-label="check-box"
                >
                  <svg
                    width="13"
                    height="14"
                    viewBox="0 0 13 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.31076 2.57741C4.31076 2.43755 4.42116 2.32417 4.55734 2.32417H7.84501C7.98119 2.32417 8.09158 2.43755 8.09158 2.57741V3.25274C8.09158 3.3926 7.98119 3.50598 7.84501 3.50598H4.55734C4.42116 3.50598 4.31076 3.3926 4.31076 3.25274V2.57741ZM2.84879 3.50598C2.83727 3.42327 2.83131 3.33872 2.83131 3.25274V2.57741C2.83131 1.59837 3.60408 0.804688 4.55734 0.804688H7.84501C8.79826 0.804688 9.57104 1.59836 9.57104 2.57741V3.25274C9.57104 3.33872 9.56508 3.42327 9.55356 3.50598H10.1464H11.4614C11.87 3.50598 12.2012 3.84613 12.2012 4.26572C12.2012 4.68532 11.87 5.02546 11.4614 5.02546H10.8861V12.032C10.8861 13.011 10.1133 13.8047 9.16008 13.8047H3.33369C2.38857 13.8047 1.61921 13.024 1.60779 12.0534L1.52512 5.02546H0.940898C0.532359 5.02546 0.201172 4.68532 0.201172 4.26572C0.201172 3.84613 0.532359 3.50598 0.940898 3.50598H2.25597H2.84879ZM4.55734 5.02546H3.00468L3.08714 12.035C3.08877 12.1737 3.19868 12.2852 3.33369 12.2852H9.16008C9.29626 12.2852 9.40665 12.1718 9.40665 12.032V5.02546H7.84501H4.55734ZM5.62583 6.2917C5.62583 5.8721 5.29464 5.53196 4.8861 5.53196C4.47756 5.53196 4.14638 5.8721 4.14638 6.2917V10.3436C4.14638 10.7632 4.47756 11.1034 4.8861 11.1034C5.29464 11.1034 5.62583 10.7632 5.62583 10.3436V6.2917ZM7.51624 5.53196C7.92478 5.53196 8.25597 5.8721 8.25597 6.2917V10.3436C8.25597 10.7632 7.92478 11.1034 7.51624 11.1034C7.1077 11.1034 6.77651 10.7632 6.77651 10.3436V6.2917C6.77651 5.8721 7.1077 5.53196 7.51624 5.53196Z"
                      fill="#DB1E36"
                    />
                  </svg>
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Paper sx={{ p: 1 }}>
          <Typography>No Test Data Found</Typography>
        </Paper>
      )}
    </>
  );
};
const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    if (!values[field]) return (errors[field] = "Required");
  });

  return errors;
};

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
const formatDate = (date) => {
  if (!date) return null;

  const copy = new Date(date);
  return [
    copy.getFullYear(),
    padTo2Digits(copy.getMonth() + 1),
    padTo2Digits(copy.getDate()),
  ].join("-");
};
function GenerateResultModal({ toggleModal }) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    setValues,
    setFieldTouched,
  } = useFormik({
    initialValues,
    validate: (values) => validate(values),
  });

  useMemo(() => {
    const email = queryClient.getQueryData([GET_PATIENT, id]).data.email;
    setValues({
      ...values,
      email: email,
    });
  }, [id]);

  const handleSelectDate = (date, name) => {
    setValues({
      ...values,
      [name]: date,
    });
  };

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

  const {
    data: testsData,
    isLoading: isTestLoading,
    isError: isTestError,
  } = useCustomQuery(
    [
      GET_INVESTIGATION_TESTS,
      {
        patient: id,
        from: formatDate(values.from),
        to: formatDate(values.to),
        package: values.package,
      },
    ],
    {
      url: useSanitizeQueryParams(
        `/investigation/tests?patient=${id}&package=${
          values.package
        }&startDate=${formatDate(values.from)}&endDate=${formatDate(values.to)}`
      ),
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!values.package,
      select: (res) => {
        let arr = [];
        if (res?.data?.LABORATORY?.length)
          arr = [...arr, ...res?.data?.LABORATORY];
        if (res?.data?.RADIOLOGY?.length)
          arr = [...arr, ...res?.data?.RADIOLOGY];

        return arr;
      },
    }
  );

  //generate report
  const { mutate: handleGenerate, isLoading: genLoading } = useCustomMutation(
    {
      url: `/investigation/patient/report-export`,
      method: "post",
      data: {
        title: values.reportTitle,
        patient: id,
        comment: values.comment,
        email: values.email,
        includeVitals: values.recentVitalResult,
        tests: testsData?.map((t) => t._id),
      },
    },
    {
      onSuccess: (res) => {
        toast.success("Report sent to the provided email");
        toggleModal();
        // downloadOnClick(
        //   res?.resultUrl,
        //   `report_summary_${id}_${new Date().getTime()}`
        // )
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );

  const onGenerate = () => {
    let emptyRequiredFieldNumber = 0;

    requireFields.forEach((field) => {
      emptyRequiredFieldNumber =
        values[field] === ""
          ? emptyRequiredFieldNumber + 1
          : emptyRequiredFieldNumber;
      setFieldTouched(field, true, true);
    });

    if (emptyRequiredFieldNumber > 0) return;
    handleGenerate();
  };

  const handleCheck = (state) => {
    //if checked
    setValues({
      ...values,
      recentVitalResult: state,
    });
  };
  const handleClickTest = (test) => {
    queryClient.setQueryData(
      [
        GET_INVESTIGATION_TESTS,
        {
          patient: id,
          from: formatDate(values.from),
          to: formatDate(values.to),
          package: values.package,
        },
      ],
      (oldQueryData) => {
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData.data,
            [test.departmentType]: oldQueryData.data[
              test.departmentType
            ].filter((t) => t._id !== test._id),
          },
        };
      }
    );
  };

  return (
    <Grid container spacing={2} rowSpacing={3} sx={{}}>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Report Title"
          value={values.reportTitle}
          name="reportTitle"
          handleChange={handleChange}
          placeholder="Enter report title"
          {...handleErrorProps(touched.reportTitle, errors.reportTitle)}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomSelect
          options={packages}
          label="Package"
          handleChange={handleChange}
          name="package"
          haveTopLabel={true}
          placeholder="Select from list"
          disabled={isPackagesLoading}
          state={values.package}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="displaySm"
          sx={{ fontSize: "14px", lineHeight: "17.57px" }}
        >
          Time and Date
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4}>
        <CustomDatePicker
          type="date"
          views={["year", "month", "day"]}
          title=""
          placeholder="From"
          disableFuture={true}
          datePickerRootSx={{ height: "auto" }}
          datePickerSx={{ width: "100%" }}
          name="from"
          required
          setdate={handleSelectDate}
          date={values?.from}
        />
      </Grid>
      <Grid item xs={6} sm={4}>
        <CustomDatePicker
          type="date"
          views={["year", "month", "day"]}
          title=""
          placeholder="To"
          disableFuture={true}
          datePickerRootSx={{ height: "auto" }}
          datePickerSx={{ width: "100%" }}
          name="to"
          required
          setdate={handleSelectDate}
          date={values?.to}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="displaySm">Test Result Summary</Typography>
      </Grid>
      {isTestLoading ? (
        <CustomLoader />
      ) : isTestError ? (
        <Paper sx={{ p: 1 }}>
          <Typography>
            Something went wrong, refresh and try again Later
          </Typography>
        </Paper>
      ) : (
        <Grid item xs={12}>
          <ResultSummary tests={testsData} handleClickTest={handleClickTest} />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="displaySm">Recent Vital Result</Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomCheckbox
          desc={"Include Latest Vital Result in report"}
          checkColor="secondary.primary"
          onClick={handleCheck}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextInput
          title="Comment"
          value={values.comment}
          name="comment"
          handleChange={handleChange}
          placeholder="Enter comment"
          {...handleErrorProps(touched.comment, errors.comment)}
          onBlur={handleBlur}
          multiline
          rows={6}
          helperText={"0/200"}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Email Address"
          value={values.email}
          name="email"
          type="email"
          handleChange={handleChange}
          placeholder="Enter email address"
          {...handleErrorProps(touched.email, errors.email)}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12}>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <CustomButton
            text={"Generate Result"}
            color="secondary"
            onClick={onGenerate}
            disabled={genLoading}
          />
          <CustomButton
            text={"Cancel"}
            variant="containedBrown"
            onClick={toggleModal}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default GenerateResultModal;
