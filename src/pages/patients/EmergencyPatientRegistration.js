import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import { country_list, Nigeria_states } from "utils/locationData";

import CustomButton from "components/atoms/CustomButton";
import { useNavigate } from "react-router-dom/dist";
import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import ImageUpload from "components/atoms/ImageUpload";

const initialValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  religion: "",
  middleName: "",
  language: "",
  occupation: "",
  nationality: "Nigeria",
  gender: "",
  genotype: "",
  bloodGroup: "",
  maritalStatus: "",

  phoneNumber: "",
  residentialAddress: {
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    zipCode: "",
    telephone: "",
  },
  permanentAddress: {
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    zipCode: "",
    telephone: "",
  },
  nextOfKin: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: "",
    state: "",
    country: "Nigeria",
    maritalStatus: "",
    relationship: "",
    middleName: "",
    dateOfBirth: "",
  },
  payerDetails: {
    firstName: "",
    lastName: "",
    email: "",
    middleName: "",
    relationship: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    zipCode: "",
  },
  // doctorInCharge: "",
  // clinic: "",
  // healthRecords: {
  //   heartRate: 0,
  //   bloodPressure: "",
  //   temperature: 0,
  //   weight: 0,
  //   height: 0,
  //   respiratoryRate: 0,
  //   glucose: 0,
  //   diagnosis: "",
  //   note: "",
  //   treatment: "",
  //   genotype: "",
  //   bloodGroup: "",
  // },
};

const requireFields = [
  "firstName",
  "middleName",
  "lastName",
  "phoneNumber",
  "dateOfBirth",

  "residentialAddress.address",
  "residentialAddress.city",
  "residentialAddress.state",
  "residentialAddress.country",
  "residentialAddress.zipCode",
  "residentialAddress.telephone",

  "permanentAddress.address",
  "permanentAddress.city",
  "permanentAddress.state",
  "permanentAddress.country",
  "permanentAddress.zipCode",
  "permanentAddress.telephone",

  "nextOfKin.firstName",
  "nextOfKin.lastName",
  "nextOfKin.email",
  "nextOfKin.address",
  "nextOfKin.city",
  "nextOfKin.state",
  "nextOfKin.country",
  "nextOfKin.zipCode",
  "nextOfKin.phoneNumber",
  "nextOfKin.maritalStatus",
  "nextOfKin.relationship",
  "nextOfKin.middleName",
  "nextOfKin.dateOfBirth",

  "payerDetails.firstName",
  "payerDetails.lastName",
  "payerDetails.email",
  "payerDetails.address",
  "payerDetails.city",
  "payerDetails.state",
  "payerDetails.country",
  "payerDetails.zipCode",
  "payerDetails.phoneNumber",
  "payerDetails.relationship",
  "payerDetails.middleName",
  // "payerDetails.dateOfBirth",
];
const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    const fieldNames = field.split(".");
    const first = fieldNames[0];
    const second = fieldNames[1];

    //check if its a nested field: 'residentialAddress.address'
    if (second) {
      if (!values[first][second]) {
        return (errors[first] = {
          ...errors[first],
          [second]: "Required",
        });
      }
    } else {
      if (!values[first]) return (errors[first] = "Required");
    }
  });

  return errors;
};

function EmergencyPatientsRegistration() {
  const navigate = useNavigate();
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

  //create emmergency patient
  const { mutate: handleSave, isLoading } = useCustomMutation(
    {
      url: `/patients/create-emergency-patient`,
      method: "post",
      data: values,
    },
    {
      onSuccess: () => {
        toast.success("Success");
        navigate(-1);
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );
  const handleSelectDate = (date, name) => {
    // console.log(name, typeof name);
    const nameArr = name?.split(".") || [];
    const key1 = nameArr[0];
    if (nameArr.length === 1) {
      //if its  nested like values?.dateOfBirth
      setValues({
        ...values,
        [key1]: date,
      });
    } else {
      //if its  nested like values?.payerDetails?.dateOfBirth
      const key2 = nameArr[1];
      setValues({
        ...values,
        [key1]: {
          ...values[key1],
          [key2]: date,
        },
      });
    }
  };
  const dateBlur = (name) => {
    const e = {
      target: {
        name,
      },
    };
    handleBlur(e);
  };
  const onClickSave = () => {
    let emptyRequiredFieldNumber = 0;

    requireFields.forEach((field) => {
      const nameArr = field.split(".");
      const key1 = nameArr[0];
      const key2 = nameArr[1];

      if (key2) {
        //if its  nested like values?.payerDetails.dateOfBirth
        emptyRequiredFieldNumber =
          values[key1][key2] === ""
            ? emptyRequiredFieldNumber + 1
            : emptyRequiredFieldNumber;
      } else {
        emptyRequiredFieldNumber =
          values[key1] === ""
            ? emptyRequiredFieldNumber + 1
            : emptyRequiredFieldNumber;
      }

      setFieldTouched(field, true, true);
    });

    if (emptyRequiredFieldNumber > 0) return;
    handleSave();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "fit-content",
        }}
      >
        <Typography variant="displayLg" sx={{ ml: 1 }}>
          Emmergency Patient Registration
        </Typography>
      </Box>
      <Paper sx={{ p: 3, mt: 2 }}>
        <ImageUpload />
        <Typography variant="displaySm">Personal Details</Typography>

        <Grid
          container
          spacing={1}
          sx={{
            mt: 2,
            width: {
              xs: "100%",
              lg: "70%",
            },
          }}
        >
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="First Name"
              value={values.firstName}
              name="firstName"
              handleChange={handleChange}
              placeholder="Enter first name"
              {...handleErrorProps(touched.firstName, errors.firstName)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Middle Name"
              value={values.middleName}
              name="middleName"
              handleChange={handleChange}
              placeholder="Enter middle name"
              {...handleErrorProps(touched.middleName, errors.middleName)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Last Name"
              value={values.lastName}
              name="lastName"
              handleChange={handleChange}
              placeholder="Enter last name"
              {...handleErrorProps(touched.lastName, errors.lastName)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              title="Date of Birth"
              placeholder="D.O.B"
              size="large"
              disableFuture={true}
              datePickerRootSx={{ height: "auto" }}
              datePickerSx={{ width: "100%" }}
              name="dateOfBirth"
              required
              setdate={handleSelectDate}
              date={values?.dateOfBirth}
              {...handleErrorProps(touched.dateOfBirth, errors.dateOfBirth)}
              onOpen={dateBlur.bind(this, "dateOfBirth")}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Email Address"
              value={values.email}
              name="email"
              handleChange={handleChange}
              placeholder="Enter Email Address"
              type="email"
              {...handleErrorProps(touched.email, errors.email)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Phone Number"
              value={values.phoneNumber}
              name="phoneNumber"
              handleChange={handleChange}
              placeholder="Enter Phone Number"
              {...handleErrorProps(touched.phoneNumber, errors.phoneNumber)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={["Male", "Female", "Other"]}
              label="Gender"
              state={values.gender}
              handleChange={handleChange}
              name="gender"
              haveTopLabel={true}
              placeholder="Select gender"
              {...handleErrorProps(touched.gender, errors.gender)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={[
                "single",
                "married",
                "divorced",
                "widowed",
                "separated",
                "other",
              ]}
              label="Marital Status"
              state={values.maritalStatus}
              handleChange={handleChange}
              name="maritalStatus"
              haveTopLabel={true}
              {...handleErrorProps(touched.maritalStatus, errors.maritalStatus)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Occupation"
              value={values.occupation}
              name="occupation"
              handleChange={handleChange}
              placeholder="Enter Occupation"
              {...handleErrorProps(touched.occupation, errors.occupation)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={["English", "Yoruba", "Hausa", "Igbo"]}
              label="Language"
              state={values.language}
              handleChange={handleChange}
              name="language"
              haveTopLabel={true}
              placeholder="Select your language"
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={[
                "Christian",
                "Muslim",
                "African Tradition Worship",
                "Aethist",
                "Others",
              ]}
              label="Religion"
              state={values.religion}
              handleChange={handleChange}
              name="religion"
              haveTopLabel={true}
              placeholder="Select religion"
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={country_list}
              label="Nationality"
              state={values.nationality}
              handleChange={handleChange}
              name="nationality"
              haveTopLabel={true}
              placeholder="Select your nationality"
            />
          </Grid>

          {/* <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Identity Number"
              value={values.idNumber}
              name="idNumber"
              handleChange={handleChange}
              // name="genotype"
              haveTopLabel={true}
              placeholder="Select"
            />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
              label="Blood Group"
              state={values.bloodGroup}
              handleChange={handleChange}
              name="bloodGroup"
              haveTopLabel={true}
              placeholder="Select"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={["AA", "AS", "SS", "SC", "CC", "AC"]}
              label="Genotype"
              state={values.genotype}
              handleChange={handleChange}
              name="genotype"
              haveTopLabel={true}
              placeholder="Select"
            />
          </Grid>

          {/* Residential Address  */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="displaySm">Residential Address</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Street Address"
              value={values.residentialAddress.address}
              name="residentialAddress.address"
              handleChange={handleChange}
              placeholder="Enter Address"
              id="residentialAddress_address"
              {...handleErrorProps(
                touched?.residentialAddress?.address,
                errors?.residentialAddress?.address
              )}
              onBlur={handleBlur}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Town/City"
              value={values.residentialAddress.city}
              name="residentialAddress.city"
              handleChange={handleChange}
              placeholder="Enter town/city"
              id="residentialAddress_city"
              {...handleErrorProps(
                touched?.residentialAddress?.city,
                errors?.residentialAddress?.city
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={Nigeria_states}
              label="State"
              state={values.residentialAddress.state}
              handleChange={handleChange}
              name="residentialAddress.state"
              haveTopLabel={true}
              id="residentialAddress_state"
              placeholder="Select your state"
              {...handleErrorProps(
                touched?.residentialAddress?.state,
                errors?.residentialAddress?.state
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={country_list}
              label="Country"
              state={values.residentialAddress.country}
              handleChange={handleChange}
              name="residentialAddress.country"
              haveTopLabel={true}
              id="residentialAddress_country"
              placeholder="Select your nationality"
              {...handleErrorProps(
                touched?.residentialAddress?.country,
                errors?.residentialAddress?.country
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="ZipCode"
              value={values.residentialAddress.zipCode}
              name="residentialAddress.zipCode"
              handleChange={handleChange}
              placeholder="Enter zipcode"
              id="residentialAddress_zipCode"
              {...handleErrorProps(
                touched?.residentialAddress?.zipCode,
                errors?.residentialAddress?.zipCode
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Phone Number"
              value={values.residentialAddress.telephone}
              name="residentialAddress.telephone"
              handleChange={handleChange}
              placeholder="Enter Phone Number"
              id="residentialAddress_telephone"
              {...handleErrorProps(
                touched?.residentialAddress?.telephone,
                errors?.residentialAddress?.telephone
              )}
              onBlur={handleBlur}
            />
          </Grid>
          {/* Permanent Address  */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="displaySm">Permanent Address</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Street Address"
              value={values.permanentAddress.address}
              name="permanentAddress.address"
              handleChange={handleChange}
              placeholder="Enter Address"
              id="permanentAddress_address"
              {...handleErrorProps(
                touched?.permanentAddress?.address,
                errors?.permanentAddress?.address
              )}
              onBlur={handleBlur}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Town/City"
              value={values.permanentAddress.city}
              name="permanentAddress.city"
              handleChange={handleChange}
              placeholder="Enter town/city"
              id="permanentAddress_city"
              {...handleErrorProps(
                touched?.permanentAddress?.city,
                errors?.permanentAddress?.city
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={Nigeria_states}
              label="State"
              state={values.permanentAddress.state}
              handleChange={handleChange}
              name="permanentAddress.state"
              haveTopLabel={true}
              id="permanentAddress_state"
              placeholder="Select your state"
              {...handleErrorProps(
                touched?.permanentAddress?.state,
                errors?.permanentAddress?.state
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={country_list}
              label="Country"
              state={values.permanentAddress.country}
              handleChange={handleChange}
              name="permanentAddress.country"
              haveTopLabel={true}
              id="permanentAddress_country"
              placeholder="Select your nationality"
              {...handleErrorProps(
                touched?.permanentAddress?.country,
                errors?.permanentAddress?.country
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="ZipCode"
              value={values.permanentAddress.zipCode}
              name="permanentAddress.zipCode"
              handleChange={handleChange}
              id="permanentAddress_zipCode"
              placeholder="Enter zipcode"
              {...handleErrorProps(
                touched?.permanentAddress?.zipCode,
                errors?.permanentAddress?.zipCode
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Phone Number"
              value={values.permanentAddress.telephone}
              name="permanentAddress.telephone"
              handleChange={handleChange}
              id="permanentAddress_telephone"
              placeholder="Enter Phone Number "
              {...handleErrorProps(
                touched?.permanentAddress?.telephone,
                errors?.permanentAddress?.telephone
              )}
              onBlur={handleBlur}
            />
          </Grid>
          {/* Next of Kin  */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="displaySm">Next of Kin</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="First Name"
              value={values.nextOfKin.firstName}
              name="nextOfKin.firstName"
              handleChange={handleChange}
              placeholder="Enter N.O.K first name"
              id="nextOfKin_firstName"
              {...handleErrorProps(
                touched?.nextOfKin?.firstName,
                errors?.nextOfKin?.firstName
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Middle Name"
              value={values.nextOfKin.middleName}
              name="nextOfKin.middleName"
              handleChange={handleChange}
              placeholder="Enter N.O.K middle name"
              id="nextOfKin_middleName"
              {...handleErrorProps(
                touched?.nextOfKin?.middleName,
                errors?.nextOfKin?.middleName
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Last Name"
              value={values.nextOfKin.lastName}
              name="nextOfKin.lastName"
              id="nextOfKin_lastName"
              handleChange={handleChange}
              placeholder="Enter N.O.K last name"
              {...handleErrorProps(
                touched?.nextOfKin?.lastName,
                errors?.nextOfKin?.lastName
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              title="Date of Birth"
              placeholder="Next of Kin D.O.B"
              disableFuture={true}
              datePickerRootSx={{ height: "auto" }}
              datePickerSx={{ width: "100%" }}
              name="nextOfKin.dateOfBirth"
              id="nextOfKin_dateOfBirth"
              setdate={handleSelectDate}
              date={values?.nextOfKin?.dateOfBirth}
              onOpen={dateBlur.bind(this, "nextOfKin.dateOfBirth")}
              {...handleErrorProps(
                touched?.nextOfKin?.dateOfBirth,
                errors?.nextOfKin?.dateOfBirth
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Street Address"
              value={values.nextOfKin.address}
              name="nextOfKin.address"
              id="nextOfKin_address"
              handleChange={handleChange}
              placeholder="Enter N.O.K address"
              {...handleErrorProps(
                touched?.nextOfKin?.address,
                errors?.nextOfKin?.address
              )}
              onBlur={handleBlur}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Town/City"
              value={values.nextOfKin.city}
              name="nextOfKin.city"
              handleChange={handleChange}
              placeholder="Enter town/city"
              id="nextOfKin_city"
              {...handleErrorProps(
                touched?.nextOfKin?.city,
                errors?.nextOfKin?.city
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={Nigeria_states}
              label="State"
              state={values.nextOfKin.state}
              handleChange={handleChange}
              name="nextOfKin.state"
              haveTopLabel={true}
              placeholder="Select N.O.K state"
              id="nextOfKin_state"
              {...handleErrorProps(
                touched?.nextOfKin?.state,
                errors?.nextOfKin?.state
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={country_list}
              label="Country"
              state={values.nextOfKin.country}
              handleChange={handleChange}
              name="nextOfKin.country"
              haveTopLabel={true}
              id="nextOfKin_country"
              placeholder="Select N.O.K nationality"
              {...handleErrorProps(
                touched?.nextOfKin?.country,
                errors?.nextOfKin?.country
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Postcode"
              value={values.nextOfKin.zipCode}
              name="nextOfKin.zipCode"
              handleChange={handleChange}
              placeholder="Enter N.O.K postcode"
              id="nextOfKin_zipCode"
              {...handleErrorProps(
                touched?.nextOfKin?.zipCode,
                errors?.nextOfKin?.zipCode
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Phone Number"
              value={values.nextOfKin.phoneNumber}
              name="nextOfKin.phoneNumber"
              handleChange={handleChange}
              placeholder="Enter N.O.K Phone Number"
              {...handleErrorProps(
                touched?.nextOfKin?.phoneNumber,
                errors?.nextOfKin?.phoneNumber
              )}
              onBlur={handleBlur}
              id="nextOfKin_phoneNumber"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Email Address"
              value={values.nextOfKin.email}
              name="nextOfKin.email"
              handleChange={handleChange}
              placeholder="Enter N.O.K Email Address"
              type="email"
              id="nextOfKin_email"
              {...handleErrorProps(
                touched?.nextOfKin?.email,
                errors?.nextOfKin?.email
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={[
                "Brother",
                "Sister",
                "Mother",
                "Father",
                "Son",
                "Daughter",
                "Relative",
              ]}
              label="Relationship"
              state={values.nextOfKin.relationship}
              handleChange={handleChange}
              name="nextOfKin.relationship"
              haveTopLabel={true}
              placeholder="Select relationship with N.O.K"
              id="nextOfKin_relationship"
              {...handleErrorProps(
                touched?.nextOfKin?.relationship,
                errors?.nextOfKin?.relationship
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={[
                "single",
                "married",
                "divorced",
                "widowed",
                "separated",
                "other",
              ]}
              label="Marital Status"
              state={values.nextOfKin.maritalStatus}
              handleChange={handleChange}
              name="nextOfKin.maritalStatus"
              haveTopLabel={true}
              {...handleErrorProps(
                touched?.nextOfKin?.maritalStatus,
                errors?.nextOfKin?.maritalStatus
              )}
              onBlur={handleBlur}
              id="nextOfKin_maritalStatus"
            />
          </Grid>
          {/* Payer Details  */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="displaySm">Payer's Details</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="First Name"
              value={values.payerDetails.firstName}
              name="payerDetails.firstName"
              handleChange={handleChange}
              placeholder="Enter first name"
              id="payerDetails_firstName"
              {...handleErrorProps(
                touched?.payerDetails?.firstName,
                errors?.payerDetails?.firstName
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Middle Name"
              value={values.payerDetails.middleName}
              name="payerDetails.middleName"
              handleChange={handleChange}
              placeholder="Enter middle name"
              id="payerDetails_middleName"
              {...handleErrorProps(
                touched?.payerDetails?.middleName,
                errors?.payerDetails?.middleName
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Last Name"
              value={values.payerDetails.lastName}
              name="payerDetails.lastName"
              handleChange={handleChange}
              placeholder="Enter last name"
              {...handleErrorProps(
                touched?.payerDetails?.lastName,
                errors?.payerDetails?.lastName
              )}
              onBlur={handleBlur}
              id="payerDetails_lastName"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Street Address"
              value={values.payerDetails.address}
              name="payerDetails.address"
              handleChange={handleChange}
              placeholder="Enter address"
              {...handleErrorProps(
                touched?.payerDetails?.address,
                errors?.payerDetails?.address
              )}
              onBlur={handleBlur}
              id="payerDetails_address"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Town/City"
              value={values.payerDetails.city}
              name="payerDetails.city"
              handleChange={handleChange}
              placeholder="Enter town/city"
              id="payerDetails_city"
              {...handleErrorProps(
                touched?.payerDetails?.city,
                errors?.payerDetails?.city
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={Nigeria_states}
              label="State"
              state={values.payerDetails.state}
              handleChange={handleChange}
              name="payerDetails.state"
              haveTopLabel={true}
              placeholder="Select state"
              id="payerDetails_state"
              {...handleErrorProps(
                touched?.payerDetails?.state,
                errors?.payerDetails?.state
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={country_list}
              label="Country"
              state={values.payerDetails.country}
              handleChange={handleChange}
              name="payerDetails.country"
              haveTopLabel={true}
              placeholder="Select nationality"
              id="payerDetails_country"
              {...handleErrorProps(
                touched?.payerDetails?.country,
                errors?.payerDetails?.country
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Postcode"
              value={values.payerDetails.zipCode}
              name="payerDetails.zipCode"
              handleChange={handleChange}
              placeholder="Enter postcode"
              id="payerDetails_zipCode"
              {...handleErrorProps(
                touched?.payerDetails?.zipCode,
                errors?.payerDetails?.zipCode
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Phone Number"
              value={values.payerDetails.phoneNumber}
              name="payerDetails.phoneNumber"
              handleChange={handleChange}
              placeholder="Enter Phone Number"
              {...handleErrorProps(
                touched?.payerDetails?.phoneNumber,
                errors?.payerDetails?.phoneNumber
              )}
              onBlur={handleBlur}
              id="payerDetails_phoneNumber"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Email Address"
              value={values.payerDetails.email}
              name="payerDetails.email"
              handleChange={handleChange}
              placeholder="Enter Email Address"
              type="email"
              {...handleErrorProps(
                touched?.payerDetails?.email,
                errors?.payerDetails?.email
              )}
              onBlur={handleBlur}
              id="payerDetails_email"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomSelect
              options={[
                "Brother",
                "Sister",
                "Mother",
                "Father",
                "Son",
                "Daughter",
                "Relative",
              ]}
              label="Relationship"
              state={values.payerDetails.relationship}
              handleChange={handleChange}
              name="payerDetails.relationship"
              haveTopLabel={true}
              placeholder="Select relationship"
              {...handleErrorProps(
                touched?.payerDetails?.relationship,
                errors?.payerDetails?.relationship
              )}
              onBlur={handleBlur}
              id="payerDetails_relationship"
            />
          </Grid>

          {/* health records  */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="displaySm">Health Records</Typography>
          </Grid>
        </Grid>

        <Stack
          direction={"row"}
          spacing={1}
          sx={{
            width: {
              xs: "100%",
              sm: "50%",
            },
            mt: 2,
          }}
        >
          <CustomButton
            text="Save"
            variant="contained"
            color="secondary"
            sx={{ width: "50%" }}
            onClick={onClickSave}
            disabled={isLoading}
          />
          <CustomButton
            text="Cancel"
            variant="containedBrown"
            sx={{ width: "50%" }}
            onClick={() => navigate(-1)}
          />
        </Stack>
      </Paper>
    </Box>
  );
}

export default EmergencyPatientsRegistration;
