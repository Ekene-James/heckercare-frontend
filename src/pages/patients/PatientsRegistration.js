import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import { country_list, Nigeria_states } from "utils/locationData";
import ProfilePicture from "components/atoms/ImageUpload";

import CustomButton from "components/atoms/CustomButton";
import { useNavigate } from "react-router-dom/dist";
import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import CustomSwitch from "components/atoms/Switch";
import { GET_TRANSACTION_TYPES } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { numberFormatter } from "utils/numberFormatter";

const initialValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  religion: "Christian",
  middleName: "",
  language: "English",
  occupation: "",
  nationality: "Nigeria",
  gender: "Male",
  genotype: "AA",
  bloodGroup: "A+",
  maritalStatus: "single",
  paymentRequired: false,
  phoneNumber: "",
  residentialAddress: {
    address: "",
    city: "",
    state: "Abia",
    country: "Nigeria",
    zipCode: "",
    telephone: "",
  },
  permanentAddress: {
    address: "",
    city: "",
    state: "Abia",
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
    state: "Abia",
    country: "Nigeria",
    maritalStatus: "",
    relationship: "Brother",
    middleName: "",
    dateOfBirth: "",
  },
  payerDetails: {
    firstName: "",
    lastName: "",
    email: "",
    middleName: "",
    relationship: "Brother",
    phoneNumber: "",
    address: "",
    city: "",
    state: "Abia",
    country: "Nigeria",
    zipCode: "",
  },
  // doctorInCharge: "",
  // clinic: "",
};

const requireFields = [
  "firstName",
  "middleName",
  "lastName",
  "phoneNumber",
  // "dateOfBirth",
  "email",

  "nextOfKin.firstName",
  "nextOfKin.lastName",
  "nextOfKin.middleName",
  "nextOfKin.email",

  "payerDetails.firstName",
  "payerDetails.lastName",
  "payerDetails.middleName",
  "payerDetails.email",
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

function PatientsRegistration() {
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

  //create patient
  const { mutate: handleSave, isLoading } = useCustomMutation(
    {
      url: `/patients/add-patient`,
      method: "post",
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

  //get transaction types for payments
  const {
    data: transactionTypes,

    isError,
  } = useCustomQuery(
    [GET_TRANSACTION_TYPES],
    {
      url: `/transaction-type`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data.data;
      },
    }
  );
  const handleSelectDate = (date, name) => {
    const nameArr = name.split(".");
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
  const handleCheck = (checkState) => {
    setValues((vals) => ({ ...vals, paymentRequired: checkState }));
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
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      //for nested objects

      if (
        key === "residentialAddress" ||
        key === "permanentAddress" ||
        key === "nextOfKin" ||
        key === "payerDetails"
      ) {
        for (let nestedKey in value) {
          formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
        }
      } else {
        formData.append(key, value);
      }
    });

    const data = values?.image
      ? formData
      : { ...values, paymentRequired: String(values.paymentRequired) };
    handleSave(data);
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
          Patient Registration
        </Typography>
      </Box>
      <Stack
        direction={"row"}
        gap={2}
        sx={{
          width: "100%",
          px: 4,
          py: 1,
          backgroundColor: "secondary.main",
          color: "primary.lightest",
        }}
      >
        <svg
          width="60"
          height="52"
          viewBox="0 0 60 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M59.7996 16.7569L32.2295 44.327C32.1013 44.4552 31.9273 44.5273 31.7459 44.5273C31.5646 44.5273 31.3906 44.4552 31.2624 44.327L15.8272 28.8919C15.699 28.7636 15.627 28.5897 15.627 28.4083C15.627 28.2269 15.699 28.053 15.8272 27.9247L43.3972 0.354588C43.5255 0.226343 43.6994 0.154297 43.8808 0.154297C44.0622 0.154297 44.2361 0.226343 44.3644 0.354588L59.7995 15.7897C59.863 15.8532 59.9134 15.9286 59.9478 16.0115C59.9822 16.0945 59.9999 16.1834 59.9999 16.2733C59.9999 16.3631 59.9822 16.452 59.9479 16.535C59.9135 16.618 59.8631 16.6933 59.7996 16.7569Z"
            fill="#C3C3C3"
          />
          <path
            d="M59.6951 16.1578L55.5373 12L27 40.5373L31.1578 44.6951C31.2861 44.8233 31.46 44.8954 31.6414 44.8954C31.8228 44.8954 31.9967 44.8233 32.125 44.6951L59.6951 17.125C59.8233 16.9967 59.8954 16.8228 59.8954 16.6414C59.8954 16.46 59.8233 16.2861 59.6951 16.1578Z"
            fill="#C3C3C3"
          />
          <path
            d="M21.752 30.198C22.3535 29.0851 22.3535 27.7309 21.752 26.6178C21.6713 26.4684 21.6946 26.2845 21.8147 26.1644L41.6376 6.34157C41.7577 6.22145 41.9415 6.19813 42.091 6.27899C43.2036 6.88051 44.558 6.88051 45.6711 6.27887C45.8206 6.19813 46.0044 6.22145 46.1245 6.34145L53.8124 14.0293C53.9325 14.1494 53.9558 14.3333 53.875 14.4827C53.2733 15.5957 53.2733 16.9498 53.875 18.0629C53.9557 18.2123 53.9324 18.3962 53.8124 18.5163L33.9894 38.3393C33.8693 38.4594 33.6854 38.4827 33.536 38.402C32.423 37.8004 31.0688 37.8004 29.956 38.402C29.8065 38.4827 29.6227 38.4594 29.5026 38.3393L21.8147 30.6514C21.6946 30.5313 21.6713 30.3473 21.752 30.198Z"
            fill="#C3C3C3"
          />
          <path
            d="M53.8749 18.0628C53.2732 16.9497 53.2732 15.5956 53.8749 14.4826C53.9556 14.3332 53.9323 14.1493 53.8123 14.0292L49.3856 9.60254C48.5904 10.8376 48.5904 12.4389 49.3856 13.674L29.147 33.9125C27.912 33.1174 26.3105 33.1175 25.0757 33.9125L29.5023 38.3391C29.6224 38.4593 29.8063 38.4825 29.9557 38.4017C31.0685 37.8003 32.4228 37.8002 33.5358 38.4018C33.6852 38.4826 33.8691 38.4593 33.9892 38.3391L53.8122 18.5162C53.9323 18.3962 53.9556 18.2122 53.8749 18.0628Z"
            fill="#C3C3C3"
          />
          <path
            d="M41.7893 26.3164C43.9851 24.1206 43.985 20.5605 41.7892 18.3648C39.5934 16.169 36.0333 16.1691 33.8376 18.3649C31.6418 20.5608 31.6419 24.1208 33.8377 26.3166C36.0335 28.5123 39.5936 28.5123 41.7893 26.3164Z"
            fill="#F3E8D7"
          />
          <path
            d="M31.1459 35.6927L39.629 27.2096C40.6065 26.232 41.0222 25.0627 40.0446 24.0852C38.5038 22.1718 32.8794 23.7062 30.2114 26.3742C29.0205 27.565 27.8298 28.756 26.6392 29.9472C26.243 30.3436 25.706 30.5662 25.1387 30.5662H25.1096C24.1736 30.5662 23.0773 29.6599 22.8359 28.7555L22.8353 20.9169L24.2351 19.5171L25.7731 17.9791L31.8813 11.8708C29.3684 11.5892 26.8695 11.4369 25.9001 11.3207C24.8224 11.1916 23.9032 11.6745 23.0669 12.3664L15.2471 18.5356C14.1437 19.4487 13.3476 20.6789 12.9668 22.0596C12.1131 25.1519 10.3149 30.6219 9.17357 32.7971L3.47217 38.4985L13.3429 48.3692L16.0881 45.624C16.604 45.108 17.2421 44.7309 17.9428 44.5277L23.6762 42.5971C25.4773 41.9792 27.0629 40.8565 28.244 39.3629L31.1459 35.6927Z"
            fill="white"
          />
          <path
            d="M28.2439 39.3623L31.1458 35.6922L39.6289 27.2091C40.6065 26.2315 41.0221 25.0623 40.0446 24.0847C39.4782 23.3813 38.36 23.144 37.0396 23.2576C35.1058 23.4239 33.3037 24.3079 31.9312 25.6804L26.5326 31.079L23.6307 34.7491C22.4497 36.2428 20.8641 37.3654 19.063 37.9833L13.3296 39.9139C12.6288 40.1171 11.9907 40.4942 11.4747 41.0102L8.72949 43.7554L13.3427 48.3686L16.0879 45.6234C16.6039 45.1074 17.2419 44.7303 17.9427 44.5271L23.6761 42.5965C25.4772 41.9786 27.0628 40.8559 28.2439 39.3623Z"
            fill="white"
          />
          <path
            d="M11.742 51.5269L0.317581 40.1024C0.216897 40.0018 0.137029 39.8823 0.0825376 39.7507C0.0280465 39.6192 0 39.4782 0 39.3358C0 39.1935 0.0280465 39.0525 0.0825376 38.921C0.137029 38.7894 0.216897 38.6699 0.317581 38.5693L2.32805 36.5588C2.42871 36.4581 2.54822 36.3782 2.67975 36.3237C2.81128 36.2693 2.95226 36.2412 3.09463 36.2412C3.237 36.2412 3.37798 36.2693 3.50951 36.3237C3.64104 36.3782 3.76055 36.4581 3.86121 36.5588L15.2857 47.9833C15.3864 48.0839 15.4663 48.2035 15.5208 48.335C15.5752 48.4665 15.6033 48.6075 15.6033 48.7499C15.6033 48.8922 15.5752 49.0332 15.5208 49.1647C15.4663 49.2963 15.3864 49.4158 15.2857 49.5164L13.2752 51.5268C13.1746 51.6275 13.0551 51.7074 12.9235 51.7619C12.792 51.8164 12.651 51.8444 12.5086 51.8444C12.3662 51.8445 12.2252 51.8164 12.0937 51.7619C11.9622 51.7075 11.8426 51.6276 11.742 51.5269Z"
            fill="white"
          />
          <path
            d="M15.2856 47.9832L11.4108 44.1084L7.86719 47.652L11.742 51.5268C11.8427 51.6275 11.9622 51.7074 12.0937 51.7619C12.2252 51.8164 12.3662 51.8444 12.5086 51.8444C12.6509 51.8444 12.7919 51.8164 12.9235 51.7619C13.055 51.7074 13.1745 51.6275 13.2752 51.5268L15.2855 49.5165C15.3862 49.4158 15.4661 49.2963 15.5206 49.1648C15.5751 49.0332 15.6031 48.8923 15.6032 48.7499C15.6032 48.6075 15.5751 48.4665 15.5206 48.335C15.4662 48.2034 15.3863 48.0839 15.2856 47.9832Z"
            fill="white"
          />
          <path
            d="M39.2936 26.945C38.1678 25.8191 36.3424 25.8191 35.2165 26.945L33.9357 28.2258C33.3561 28.8054 33.3561 29.745 33.9357 30.3246L35.2245 31.6135L39.5933 27.2447L39.2936 26.945Z"
            fill="#EFEFEF"
          />
        </svg>

        <Typography
          sx={{
            fontSize: "1rem",
            lineHeight: "1.5rem",
          }}
        >
          Please Inform the registering patient of a one-time registration fee
          of
          <strong>{` ${numberFormatter(
            transactionTypes?.["REGISTRATION FEE"]?.[0]?.amount || 0
          )} `}</strong>
          to be paid at the accounting unit.
        </Typography>
      </Stack>
      <Paper sx={{ p: 3, mt: 2 }}>
        <ProfilePicture
          blanckImg={values?.image}
          onAddImg={(files) =>
            setValues((prev) => ({ ...prev, image: files[0] }))
          }
          accept={{
            "image/*": [],
          }}
        />
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

          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={["AA", "AS", "AC", "SS", "SC", "CC"]}
              label="Genotype"
              state={values.genotype}
              handleChange={handleChange}
              name="genotype"
              haveTopLabel={true}
              placeholder="Select"
            />
          </Grid>
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
          <Grid item xs={12}>
            <Stack direction={"row"} spacing={1} alignItems={"start"}>
              <CustomSwitch
                color={"secondary"}
                handleCheck={handleCheck}
                initialState={values.paymentRequired}
              />
              <Stack direction={"column"} spacing={0.5}>
                <Typography
                  fontWeight={"bold"}
                  sx={{ fontSize: "16px", lineHeight: "22.4px" }}
                >
                  Pre-payment Required
                </Typography>
                <Typography sx={{ fontSize: "14px", lineHeight: "19.6px" }}>
                  Payment must be made before any service can be initiated.
                </Typography>
              </Stack>
            </Stack>
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
            mt: 4,
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

export default PatientsRegistration;
