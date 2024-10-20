import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import { country_list, Nigeria_states } from "utils/locationData";
import CustomCheckbox from "components/atoms/CustomCheckbox";
import CustomButton from "components/atoms/CustomButton";
import ProfilePicture from "components/atoms/ImageUpload";
import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_DESIGNATION,
  GET_DESIGNATIONS,
  GET_ROLES,
  GET_ROLE_DESIGNATIONS,
  GET_STAFF,
} from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import secureLocalStorage from "react-secure-storage";

const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  phoneNumber: "",
  gender: "Male",
  role: "",
  designation: "",
  maritalStatus: "single",
  dateOfBirth: null,
  language: "English",
  religion: "Christian",
  email: "",
  signature: "",
  residentialAddress: {
    address: "",
    city: "",
    state: "Abia",
    zipCode: "",
    country: "Nigeria",
    telephone: "",
  },
  permanentAddress: {
    address: "",
    city: "",
    state: "Abia",
    zipCode: "",
    country: "Nigeria",
    telephone: "",
  },
  nextOfKin: {
    firstName: "",
    middleName: "",
    lastName: "",
    // dateOfBirth: "",
    phoneNumber: "",
    relationship: "Brother",
    email: "",
    address: "",
    city: "",
    state: "Abia",
    zipCode: "",
    country: "Nigeria",
  },
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
function EditStaff() {
  const navigate = useNavigate();
  let { id } = useParams();
  const queryClient = useQueryClient();
  const { dispatch, state } = useAuthCtx();

  //formik state
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

  //get roles
  const {
    isLoading: rolesLoading,
    isError: rolesError,
    data: roles,
    refetch: refetchRoles,
  } = useCustomQuery(
    GET_ROLES,
    {
      url: `/role`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        const formartedData = res?.data?.data.map((role) => {
          return { name: role?.name, value: role?._id };
        });
        return formartedData;
      },
    }
  );
  //get designations
  const {
    isLoading: designationsLoading,
    isError: designationsError,
    data: designations,
    refetch: refetchDesignations,
  } = useCustomQuery(
    [GET_ROLE_DESIGNATIONS, values?.role],
    {
      url: `/designation/role/${values?.role}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!values?.role,
      select: (res) => {
        const formartedData = res?.data?.map((role) => {
          return { name: role?.name, value: role?._id };
        });
        return formartedData;
      },
    }
  );

  //get single staff
  const { data } = useCustomQuery(
    [GET_STAFF, id],
    {
      url: `/user/get-single-staff/${id}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        delete res.data._id;
        delete res.data.staffId;
        delete res.data.isFree;
        delete res.data.accountStatus;
        delete res.data.createdAt;
        delete res.data.age;
        delete res?.data?.fullName;
        delete res?.data?.id;
        delete res?.data?.residentialAddress?._id;
        delete res?.data?.residentialAddress?.createdAt;
        delete res?.data?.residentialAddress?.updatedAt;
        delete res?.data?.permanentAddress?._id;
        delete res?.data?.permanentAddress?.createdAt;
        delete res?.data?.permanentAddress?.updatedAt;
        delete res?.data?.nextOfKin?.updatedAt;
        delete res?.data?.nextOfKin?._id;
        delete res?.data?.nextOfKin?.createdAt;
        // delete res?.data?.role;

        setValues({
          ...res.data,
          role: res?.data?.role?._id,
          designation: res?.data?.designation?._id || "",
          signature: res?.data?.signature || "",
        });
      },
    }
  );

  //get designation
  const { refetch: getDesignation } = useCustomQuery(
    [GET_DESIGNATION, values.designation],
    {
      url: `/designation/${values.designation}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  //edit staff
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/user/update-staff/${id}`,
      method: "patch",
    },
    {
      onSuccess: () => {
        toast.success("Success");

        //There is a need to update the top bar details as well if the profile been edited is same as the logged in user since the data it uses is gotten from local storage
        const isLoggedinUser = id === state.user._id;
        if (isLoggedinUser) {
          if (values?.designation) getDesignation();

          queryClient.invalidateQueries([GET_STAFF, state?.user?._id]);

          const user = {
            firstName: values.firstName,
            lastName: values.lastName,
            designation: values?.designation ? values?.designation : "",
          };
          const userData = secureLocalStorage.getItem("hms_user");
          secureLocalStorage.setItem("hms_user", {
            ...userData,
            user: { ...userData.user, ...user },
          });

          dispatch({
            type: "UPDATE_USERNAME",
            payload: user,
          });
        }

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
    setValues({
      ...values,
      [name]: date,
    });
  };

  const dateBlur = (name) => {
    const e = {
      target: {
        name,
      },
    };
    handleBlur(e);
  };

  const onSave = () => {
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
        key === "nextOfKin"
      ) {
        for (let nestedKey in value) {
          formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
        }
      } else {
        if (key === "profilePicture") return;
        //  // the api is throwing error if you want to upload profile pix while signature has already existed
        //     // so its either you upload the two at same time or exclude the one not uploaded in the payload
        if (key === "signature" && typeof value === "string") return;
        formData.append(key, value);
      }
    });

    const data =
      values?.filename ||
      (values?.signature && typeof values?.signature !== "string")
        ? formData
        : values;
    if (data.profilePicture) delete data.profilePicture;

    mutate(data);
  };

  return (
    <Box>
      <Typography variant="displayMd">Edit Staff</Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <ProfilePicture
          blanckImg={
            values?.profilePicture || "/imgs/blank-profile-picture.png"
          }
          onAddImg={(files) =>
            setValues((prev) => ({ ...prev, filename: files[0] }))
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
              placeholder="Enter Middle name"
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
            <CustomTextInput
              title="Phone Number"
              value={values.phoneNumber}
              name="phoneNumber"
              handleChange={handleChange}
              placeholder="Enter Phone Number"
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
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              title="D.O.B"
              placeholder="D.O.B"
              size="large"
              name="dateOfBirth"
              date={values?.dateOfBirth || null}
              setdate={handleSelectDate}
              disableFuture={true}
              datePickerRootSx={{ height: "auto" }}
              datePickerSx={{ width: "100%" }}
              required
              {...handleErrorProps(touched.dateOfBirth, errors.dateOfBirth)}
              onOpen={dateBlur.bind(this, "dateOfBirth")}
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
              options={roles}
              label="Role"
              state={values.role}
              handleChange={handleChange}
              name="role"
              haveTopLabel={true}
              placeholder="Select role"
              {...handleErrorProps(touched.role, errors.role)}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={designations}
              label="Designation"
              state={values.designation}
              handleChange={handleChange}
              name="designation"
              haveTopLabel={true}
              placeholder="Select designation"
              // {...handleErrorProps(touched.designation, errors.designation)}
              // onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{}}>
            <CustomSelect
              options={["Married", "Single", "Divorced"]}
              label="Marital Status"
              state={values.maritalStatus}
              handleChange={handleChange}
              name="maritalStatus"
              haveTopLabel={true}
              {...handleErrorProps(touched.maritalStatus, errors.maritalStatus)}
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
              // {...handleErrorProps(touched.language, errors.language)}
              // onBlur={handleBlur}
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
              {...handleErrorProps(touched.religion, errors.religion)}
              onBlur={handleBlur}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="displaySm">Residential Address</Typography>
        </Grid>
        <Grid
          container
          spacing={1}
          sx={{
            mt: 1,
            width: {
              xs: "100%",
              lg: "70%",
            },
          }}
        >
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Address"
              value={values?.residentialAddress?.address}
              name="residentialAddress.address"
              handleChange={handleChange}
              placeholder="Enter Address"
              {...handleErrorProps(
                touched?.residentialAddress?.address,
                errors?.residentialAddress?.address
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Phone Number"
              value={values?.residentialAddress?.telephone}
              name="residentialAddress.telephone"
              handleChange={handleChange}
              placeholder="Enter Phone Number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Town/City"
              value={values?.residentialAddress?.city}
              name="residentialAddress.city"
              handleChange={handleChange}
              placeholder="Enter town/city"
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
              state={values?.residentialAddress?.state}
              handleChange={handleChange}
              name="residentialAddress.state"
              haveTopLabel={true}
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
              state={values?.residentialAddress?.country}
              handleChange={handleChange}
              name="residentialAddress.country"
              haveTopLabel={true}
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
              title="Zipcode"
              value={values?.residentialAddress?.zipCode}
              name="residentialAddress.zipCode"
              handleChange={handleChange}
              placeholder="Enter Zipcode"
              {...handleErrorProps(
                touched?.residentialAddress?.zipCode,
                errors?.residentialAddress?.zipCode
              )}
              onBlur={handleBlur}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="displaySm">Permanent Address</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Address"
              value={values?.permanentAddress?.address}
              name="permanentAddress.address"
              handleChange={handleChange}
              placeholder="Enter Address"
              {...handleErrorProps(
                touched?.permanentAddress?.address,
                errors?.permanentAddress?.address
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Phone Number"
              value={values?.permanentAddress?.telephone}
              name="permanentAddress.telephone"
              handleChange={handleChange}
              placeholder="Enter Phone Number"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Town/City"
              value={values?.permanentAddress?.city}
              name="permanentAddress.city"
              handleChange={handleChange}
              placeholder="Enter town/city"
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
              state={values?.permanentAddress?.state}
              handleChange={handleChange}
              name="permanentAddress.state"
              haveTopLabel={true}
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
              state={values?.permanentAddress?.country}
              handleChange={handleChange}
              name="permanentAddress.country"
              haveTopLabel={true}
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
              title="Zipcode"
              value={values?.permanentAddress?.zipCode}
              name="permanentAddress.zipCode"
              handleChange={handleChange}
              placeholder="Enter Zipcode"
              {...handleErrorProps(
                touched?.permanentAddress?.zipCode,
                errors?.permanentAddress?.zipCode
              )}
              onBlur={handleBlur}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="displaySm">Next of Kin</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="First Name"
              value={values?.nextOfKin?.firstName}
              name="nextOfKin.firstName"
              handleChange={handleChange}
              placeholder="Enter N.O.K first name"
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
              value={values?.nextOfKin?.middleName}
              name="nextOfKin.middleName"
              handleChange={handleChange}
              placeholder="Enter middle name"
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
              value={values?.nextOfKin?.lastName}
              name="nextOfKin.lastName"
              handleChange={handleChange}
              placeholder="Enter last name"
              {...handleErrorProps(
                touched?.nextOfKin?.lastName,
                errors?.nextOfKin?.lastName
              )}
              onBlur={handleBlur}
            />
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <CustomDatePicker
              type="date"
              views={["year", "month", "day"]}
              title="Date of Birth"
              placeholder="Next of Kin D.O.B"
              disableFuture={true}
              name="dateOfBirth"
              handleSelectDate={handleNestedSelectDate.bind(this, "nextOfKin")}
              datePickerRootSx={{ height: "auto" }}
              datePickerSx={{ width: "100%" }}
              {...handleErrorProps(
                touched?.nextOfKin?.dateOfBirth,
                errors?.nextOfKin?.dateOfBirth
              )}
              onOpen={dateBlur.bind(this, "nextOfKin.dateOfBirth")}
            />
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Street Address"
              value={values?.nextOfKin?.address}
              name="nextOfKin.address"
              handleChange={handleChange}
              placeholder="Enter address"
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
              value={values?.nextOfKin?.city}
              name="nextOfKin.city"
              handleChange={handleChange}
              placeholder="Enter town/city"
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
              state={values?.nextOfKin?.state}
              handleChange={handleChange}
              name="nextOfKin.state"
              haveTopLabel={true}
              placeholder="Select your state"
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
              state={values?.nextOfKin?.country}
              handleChange={handleChange}
              name="nextOfKin.country"
              haveTopLabel={true}
              placeholder="Select your nationality"
              {...handleErrorProps(
                touched?.nextOfKin?.country,
                errors?.nextOfKin?.country
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Zipcode"
              value={values?.nextOfKin?.zipCode}
              name="nextOfKin.zipCode"
              handleChange={handleChange}
              placeholder="Enter Zipcode"
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
              value={values?.nextOfKin?.phoneNumber}
              name="nextOfKin.phoneNumber"
              handleChange={handleChange}
              placeholder="Enter Phone Number"
              {...handleErrorProps(
                touched?.nextOfKin?.phoneNumber,
                errors?.nextOfKin?.phoneNumber
              )}
              onBlur={handleBlur}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextInput
              title="Email Address"
              value={values?.nextOfKin?.email}
              name="nextOfKin.email"
              handleChange={handleChange}
              placeholder="Enter Email Address"
              type="email"
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
              state={values?.nextOfKin?.relationship}
              handleChange={handleChange}
              name="nextOfKin.relationship"
              haveTopLabel={true}
              placeholder="Select relationship with N.O.K"
              {...handleErrorProps(
                touched?.nextOfKin?.relationship,
                errors?.nextOfKin?.relationship
              )}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12}>
            <ProfilePicture
              imgTitle="Signature"
              blanckImg={values?.signature || "/imgs/Vector.png"}
              imgStyle={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                borderRadius: "2%",
              }}
              onAddImg={(files) =>
                setValues((prev) => ({ ...prev, signature: files[0] }))
              }
              accept={{
                "image/*": [],
              }}
            />
          </Grid>
        </Grid>
        <Stack
          direction={"row"}
          spacing={1}
          sx={{
            width: {
              xs: "100%",
              sm: "30%",
            },
            mt: 2,
          }}
        >
          <CustomButton
            text="Edit"
            variant="contained"
            color="secondary"
            sx={{ width: "50%" }}
            onClick={onSave}
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

export default EditStaff;
