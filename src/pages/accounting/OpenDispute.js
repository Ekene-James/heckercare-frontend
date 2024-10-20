import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  Backdrop,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import React, { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
// import successfulReceipt from "./assets/successful_receipt.svg";

import CustomTextInput from "components/atoms/CustomTextInput";

import CustomSelect from "components/atoms/Select";

import CustomButton from "components/atoms/CustomButton";
import { Link, useNavigate } from "react-router-dom/dist";
import { useFormik } from "formik";

import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";

import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import SearchBar from "components/atoms/SearchBar";
import { GET_USAGE_HISTORY, GET_ALL_TRANSACTIONS } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import SearchDropdown from "components/atoms/SearchDropdown";

const initialValues = {
  refundAmount: "",
  refundReason: "",
  otherReason: "",
  patientName: "",
  amountPaid: "",
  patient: "",
  patientId: "",
  transaction: "",
  transactionCode: "",
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

function OpenDispute({ editData, onClose }) {
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
          Open Dispute
        </Typography>
      </Box>
      <Stack
        direction="column"
        sx={{
          width: "100%",
        }}
      >
        <Grid
          container
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{
            position: "relative",
            width: "100%",
            marginTop: "8px",
            height: "100%",
          }}
        >
          <Grid item xs={12} md={7}>
            <FormSection
              editData={editData}
              onCloseRequest={onClose}
              // amount={handlePaybackAmount}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ position: "sticky", marginTop: { xs: "24px", md: "0px" } }}
          >
            <InfoSection />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

const FormSection = ({ onCloseRequest, editData, amount }) => {
  const navigate = useNavigate();

  const [openDispenseDrugModal, setOpenDispenseDrugModal] = useState(false);

  const [onSelectTransaction, setonSelectTransaction] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState("");

  const [search, setsearch] = React.useState("");

  // const [formsState, setformsState] = React.useState({
  //   refundAmount: "",
  //   refundReason: "",
  //   otherReason: "",
  // });

  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });

  const closeSuccessHandler = () => {
    setOpenDispenseDrugModal(false);
    onCloseRequest?.(false);
  };

  //get all transaction history items
  const {
    data: allTransactions,
    isLoading: getAllTransactionsLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [GET_ALL_TRANSACTIONS, search],

    {
      url: `/accounting/get-all-transactions`,
      data: {
        search,
        limit: 1000,
      },
      method: "post",
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!search && !onSelectTransaction,
    }
  );
  const handleSearchTransactionOnChange = (text) => {
    setonSelectTransaction(false);
    setsearch(text);
  };
  const handleTransactionOnselect = (res) => {
    setonSelectTransaction(true);
    setTransactionId(res?._id);
    setValues({
      ...values,
      transaction: search,
      patientName: `${res?.patient?.firstName} ${res?.patient?.lastName}`,
      amountPaid: res?.totalCost,
      patient: res?.patient?._id,
      patientId: res?.patient?.ID,
      transactionCode: res?.uniqueCode,
    });
    setsearch(res?.uniqueCode);
  };

  //handle account open dispute
  const { mutate: handleOpenDispute, isLoading } = useCustomMutation(
    {
      url: `/accounting/open-dispute`,
      method: "post",
      // avoidCancelling: true,
      data: {
        patient: values?.patient,
        amount: Number(values?.refundAmount),
        notes: values?.otherReason,
        reason: values?.refundReason,
        transactionId: values?.transactionCode.toString(),
        transactionAmount: values?.amountPaid,
      },
    },
    {
      onSuccess: (res) => {
        toast.success("Success");
        resetForm();
        setsearch("");
        setonSelectTransaction(false);
        // refetch();
        // refetchDispense();
        // closeSuccessHandler();
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  return (
    <Box>
      <Paper>
        <Grid
          container
          spacing={1}
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
            },
            padding: "15px",
          }}
        >
          <Grid item xs={12} sm={12}>
            <Stack sx={{ margin: "auto" }} direction="row" spacing={2}>
              <CustomButton
                text="Open Dispute"
                variant="contained"
                color="secondary"
                startIcon={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <Typography sx={{ fontSize: "12px" }}>1</Typography>
                  </Avatar>
                }
              />
              <CustomButton
                text="Waiting for approval"
                variant="lightSecondary"
                startIcon={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <Typography sx={{ fontSize: "12px" }}>2</Typography>
                  </Avatar>
                }
              />
              <CustomButton
                text="Dispute Finish"
                variant="lightSecondary"
                startIcon={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <Typography sx={{ fontSize: "12px" }}>3</Typography>
                  </Avatar>
                }
              />
            </Stack>
          </Grid>

          <Grid sx={{ marginTop: "15px" }} item xs={12} sm={12}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <SearchDropdown
                placeholder="Search with Transaction ID"
                handleOnselect={handleTransactionOnselect}
                title="Request ID"
                boxSx={{ width: "100%" }}
                data={allTransactions?.data?.data}
                isLoading={getAllTransactionsLoading}
                search={search}
                required
                setsearch={handleSearchTransactionOnChange}
                reFetch={refetchRequest}
                setOnSelect={setonSelectTransaction}
                trayItemKeys={["uniqueCode", "totalCost", "status"]}
                traySx={{ minWidth: "25vw", bottom: "-125px" }}
              />
            </Stack>
          </Grid>

          <Grid sx={{ marginTop: "10px" }} item xs={12} sm={12}>
            {onSelectTransaction && (
              <Stack
                p={2}
                backgroundColor="background.custom"
                width={"100%"}
                spacing={1.5}
              >
                <Typography variant="heading">{`Order Details`}</Typography>
                <Divider />

                <Stack direction="row" spacing={15}>
                  <Box>
                    <Stack spacing={2} direction="row">
                      <Typography opacity={0.5}>{`Full name`}</Typography>
                      <Typography fontWeight={"bold"}>
                        {values?.patientName}
                      </Typography>
                    </Stack>
                    <Stack spacing={2} direction="row">
                      <Typography opacity={0.5}>{`Amount Paid`}</Typography>
                      <Typography fontWeight={"bold"}>
                        {Number(values?.amountPaid || 0)?.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack spacing={2} direction="row">
                      <Typography opacity={0.5}>{`Patient ID`}</Typography>
                      <Typography fontWeight={"bold"}>
                        {values?.patientId}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            )}

            <Grid sx={{ marginTop: "15px" }} item xs={6} sm={6}>
              <CustomTextInput
                title="Refund Amount"
                required
                placeholder="Enter Refund Amount"
                helperText={
                  <Typography>
                    Maximum refund amount:{" "}
                    <span style={{ color: "red" }}> ₦2,000.00</span>
                  </Typography>
                }
                value={values?.refundAmount}
                name="refundAmount"
                handleChange={handleChange}
              />
            </Grid>
            <Grid sx={{ marginTop: "15px" }} item xs={6} sm={6}>
              <CustomSelect
                options={["OVERCHARGED", "WRONG_CHARGE", "OTHER"]}
                // defaultValue={prescription?.data?.items[0]?.frequency}
                placeholder="Select Reason to Refund"
                state={values?.refundReason}
                handleChange={handleChange}
                required
                label="Reason to Refund"
                // state={values.frequency}
                // handleChange={handleChange}
                name="refundReason"
                haveTopLabel={true}
              />
            </Grid>
            {values?.refundReason === "OTHER" && (
              <Grid sx={{ marginTop: "15px" }} item xs={12} sm={12}>
                <CustomTextInput
                  title="Please specify other reason for requesting a refund"
                  required={true}
                  multiline
                  value={values?.otherReason}
                  name="otherReason"
                  handleChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Type in other reason for requesting a refund"
                />
              </Grid>
            )}

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
                text="Submit Dispute"
                variant="contained"
                color="secondary"
                sx={{ width: "50%" }}
                onClick={handleOpenDispute}
                disabled={isLoading}
              />
              <CustomButton
                text="Cancel"
                variant="containedBrown"
                sx={{ width: "50%" }}
                onClick={() => navigate(-1)}
              />
            </Stack>
          </Grid>
        </Grid>

        <ShowSuccessModal
          open={openDispenseDrugModal}
          onClose={closeSuccessHandler}
        />
        {/* Form end */}
      </Paper>
    </Box>
  );
};

const ShowSuccessModal = ({ open, onClose }) => {
  return (
    <Backdrop open={open}>
      <Box
        sx={{
          width: { sm: "50%", xs: "90%" },
          maxHeight: "50%",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        <Paper
          sx={{
            p: 2,
            width: "100%",
            minHeight: "100%",
            margin: "auto",
            minWidth: {
              xs: "90%",
              sm: "90%",
            },
            borderRadius: "4px",
            position: "relative",
          }}
        >
          <Stack
            direction="column"
            gap={2}
            alignItems="center"
            sx={{
              width: "70%",
              margin: "auto",
              my: "22px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <img src={successfulReceipt} alt="successfully dispensed" /> */}
            </div>
            <Typography variant="displayMd">
              Drug Successfully Dispensed
            </Typography>
            <Typography color="gray" textAlign={"center"}>
              Your order for Panadol by Antripol Manufacturer at ₦7550:00 has
              been successfully dispensed to Adetokunbo smith
            </Typography>
            <CustomButton
              color="primary"
              variant="outlined"
              text={"Go back to Request List"}
              onClick={onClose}
            />
          </Stack>
        </Paper>
      </Box>
    </Backdrop>
  );
};

const InfoSection = () => {
  return (
    <Paper>
      <Box
        component={"section"}
        aria-label="bill details"
        style={{
          //   border: "1px dashed #000000",
          width: "100%",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        <Stack
          direction="column"
          sx={{
            // backgroundColor: "rgba(248, 100, 100, 0.03)",
            width: "100%",
            padding: "28px 16px",
          }}
        >
          {/* <Stack
            direction="column"
            sx={{
              textAlign: "center",
              gap: "9px",
            }}
          > */}
          <Typography variant="heading">How to Open Dispute</Typography>
          {/* </Stack> */}
          <List>
            <ListItem>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Search for the patient in which you want to create or open a
                dispute"
                secondary="Go to transactions list"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              <ListItemText primary="Copy the transaction ID" />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              <ListItemText primary="Paste the transaction ID to search" />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              <ListItemText primary="Click open dispute" />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography>
                    Click to read the <Link to="/">Privacy Policy</Link> and{" "}
                    <Link to="/">Terms of Conditions</Link>
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Stack>
      </Box>
    </Paper>
  );
};

export default OpenDispute;
