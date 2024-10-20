import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomLoader from "components/atoms/CustomLoader";
import CustomTextInput from "components/atoms/CustomTextInput";
import SearchBar from "components/atoms/SearchBar";
import SearchSelectDropdown from "components/atoms/SearchSelectDropDown";
import CustomSelect from "components/atoms/Select";
import VendorProductsTable from "components/molecules/tabels/inventory/VendorProductsTable";
import { useFormik } from "formik";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { handleErrorProps } from "utils/handleErrorProps";
import { country_list, Nigeria_states } from "utils/locationData";
import { GET_ALL_NEW_VENDORS } from "utils/reactQueryKeys";
const Title = ({ title }) => {
  return (
    <Stack width={"100%"} spacing={1.5}>
      <Typography variant="displaySm">{title}</Typography>
      <Divider />
    </Stack>
  );
};

const initialValues = {
  vendorDetails: {
    vendorName: "",
    address: "",
    state: "",
    country: "Nigeria",
  },
  contactPerson: {
    name: "",
    emailAddress: "",
    phoneNumber: "",
  },
  paymentDetails: {
    terms: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
  },
};
const requireFields = [
  "vendorDetails.vendorName",
  "vendorDetails.address",
  "vendorDetails.state",
  "vendorDetails.country",
  "contactPerson.name",
  "contactPerson.emailAddress",
  "contactPerson.phoneNumber",
  "paymentDetails.terms",
  "paymentDetails.bankName",
  "paymentDetails.accountName",
  "paymentDetails.accountNumber",
];
const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    const fieldNames = field.split(".");
    const first = fieldNames[0];
    const second = fieldNames[1];

    //check if its a nested field: 'paymentDetails.bankName'
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
const formatApiData = (values) => {
  if (!Object.keys(values).length) return {};
  const copy = structuredClone(values);
  delete copy._id;
  delete copy.id;
  delete copy.createdAt;
  delete copy.uniqueCode;

  return copy;
};
function VendorDetails({ closeModal, edit, detail }) {
  const queryClient = useQueryClient();

  const {
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
    setFieldTouched,
    setValues,
  } = useFormik({
    initialValues,
    validate: (values) => validate(values),
  });

  React.useMemo(() => setValues({ ...detail }), [detail, setValues]);

  //edit vendor
  const { mutate: handleSave, isLoading } = useCustomMutation(
    {
      url: `/newvendor/edit/${detail._id}`,
      method: "patch",
      // data: formatApiData(values),
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_ALL_NEW_VENDORS);
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

  const onClickSave = () => {
    let emptyRequiredFieldNumber = 0;

    requireFields.forEach((field) => {
      const nameArr = field.split(".");
      const key1 = nameArr[0];
      const key2 = nameArr[1];

      if (key2) {
        //if its  nested like values
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

    handleSave(formatApiData(values));
  };
  return (
    <Stack spacing={5}>
      <Box>
        <Title title="Vendor Details" />
        <Grid container spacing={1}>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Vendor Name"
              value={values.vendorDetails.vendorName}
              placeholder={"Enter vendor name"}
              handleChange={handleChange}
              name="vendorDetails.vendorName"
              {...handleErrorProps(
                touched?.vendorDetails?.vendorName,
                errors?.vendorDetails?.vendorName
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>

          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Vendor Address"
              value={values.vendorDetails.address}
              placeholder={"Enter vendor adrress"}
              handleChange={handleChange}
              name="vendorDetails.address"
              {...handleErrorProps(
                touched?.vendorDetails?.address,
                errors?.vendorDetails?.address
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomSelect
              options={Nigeria_states}
              label="State"
              state={values.vendorDetails.state}
              handleChange={handleChange}
              name="vendorDetails.state"
              haveTopLabel={true}
              id="vendorDetails_state"
              placeholder="Select your state"
              {...handleErrorProps(
                touched?.vendorDetails?.state,
                errors?.vendorDetails?.state
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={!edit}
            />
          </Grid>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomSelect
              options={country_list}
              label="Country"
              state={values.vendorDetails.country}
              handleChange={handleChange}
              name="vendorDetails.country"
              haveTopLabel={true}
              id="vendorDetails_country"
              placeholder="Select your nationality"
              {...handleErrorProps(
                touched?.vendorDetails?.country,
                errors?.vendorDetails?.country
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={!edit}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Title title="Contact Person" />
        <Grid container spacing={1}>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Name"
              value={values.contactPerson.name}
              placeholder={"Enter name"}
              handleChange={handleChange}
              name="contactPerson.name"
              {...handleErrorProps(
                touched?.contactPerson?.name,
                errors?.contactPerson?.name
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>

          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Email Address"
              value={values.contactPerson.emailAddress}
              placeholder={"Enter email adrress"}
              handleChange={handleChange}
              name="contactPerson.emailAddress"
              {...handleErrorProps(
                touched?.contactPerson?.emailAddress,
                errors?.contactPerson?.emailAddress
              )}
              type="email"
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Phone Number"
              value={values.contactPerson.phoneNumber}
              placeholder={"Enter phone number"}
              handleChange={handleChange}
              name="contactPerson.phoneNumber"
              {...handleErrorProps(
                touched?.contactPerson?.phoneNumber,
                errors?.contactPerson?.phoneNumber
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Title title="Payment Details" />
        <Grid container spacing={1}>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Terms"
              value={values.paymentDetails.terms}
              placeholder={"Enter terms"}
              handleChange={handleChange}
              name="paymentDetails.terms"
              {...handleErrorProps(
                touched?.paymentDetails?.terms,
                errors?.paymentDetails?.terms
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>

          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Bank Name"
              value={values.paymentDetails.bankName}
              placeholder={"Enter bank name"}
              handleChange={handleChange}
              name="paymentDetails.bankName"
              {...handleErrorProps(
                touched?.paymentDetails?.bankName,
                errors?.paymentDetails?.bankName
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Account Name"
              value={values.paymentDetails.accountName}
              placeholder={"Enter account name"}
              handleChange={handleChange}
              name="paymentDetails.accountName"
              {...handleErrorProps(
                touched?.paymentDetails?.accountName,
                errors?.paymentDetails?.accountName
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>
          <Grid item xs={12} sm={5} lg={3}>
            <CustomTextInput
              title="Account Number"
              value={values.paymentDetails.accountNumber}
              placeholder={"Enter account number"}
              handleChange={handleChange}
              name="paymentDetails.accountNumber"
              {...handleErrorProps(
                touched?.paymentDetails?.accountNumber,
                errors?.paymentDetails?.accountNumber
              )}
              onBlur={handleBlur}
              readOnly={!edit}
              disabled={`${!edit}`}
            />
          </Grid>
        </Grid>
      </Box>

      <Stack direction={"row"} spacing={1}>
        <CustomButton
          text="Save & Update"
          color="secondary"
          sx={{ minWidth: "20%" }}
          onClick={onClickSave}
          disabled={isLoading}
        />
      </Stack>
    </Stack>
  );
}

export default VendorDetails;
