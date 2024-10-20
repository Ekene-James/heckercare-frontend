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
  Chip,
} from "@mui/material";
import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import SaveIcon from "@mui/icons-material/Save";
import PendingIcon from "@mui/icons-material/Pending";
import CircleIcon from "@mui/icons-material/Circle";
// import successfulReceipt from "./assets/successful_receipt.svg";
import CheckIcon from "@mui/icons-material/Check";

import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import { country_list, Nigeria_states } from "utils/locationData";
import moment from "moment";
import CustomButton from "components/atoms/CustomButton";
import { Link, useNavigate } from "react-router-dom/dist";
import { useFormik } from "formik";
import { handleErrorProps } from "utils/handleErrorProps";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import ImageUpload from "components/atoms/ImageUpload";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import SearchBar from "components/atoms/SearchBar";
import { GET_USAGE_HISTORY, GET_ALL_TRANSACTIONS } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import SearchDropdown from "components/atoms/SearchDropdown";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import CancelIcon from "@mui/icons-material/Cancel";
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

function ViewDisputeModal({ detail, refetch, closeModal, editData, onClose }) {
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
              detail={detail}
              onCloseRequest={onClose}
              onClose={closeModal}
              refetch={refetch}
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

const FormSection = ({ onClose, onCloseRequest, refetch, detail, amount }) => {
  console.log(detail);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isResolved, setIsResolved] = React.useState(false);
  const [openDispenseDrugModal, setOpenDispenseDrugModal] = useState(false);
  const [onSelectPatient, setonSelectPatient] = React.useState(false);
  const [onSelectProduct, setonSelectProduct] = React.useState(false);
  const [patientId, setpatientId] = React.useState("");
  const [productId, setproductId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();
  const [prescriptionList, setprescriptionList] = React.useState([]);
  const [onSelectTransaction, setonSelectTransaction] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState("");

  const [search, setsearch] = React.useState("");
  const [searchProducts, setsearchProducts] = React.useState("");
  const [batchId, setBatchId] = React.useState("");
  let totalAmount = 0;
  // const [formsState, setformsState] = React.useState({
  //   refundAmount: "",
  //   refundReason: "",
  //   otherReason: "",
  // });

  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });
  // const { handleChange, values, resetForm, setValues } = useFormik({
  //   initialValues,
  // });

  // const handleChange = (e) => {
  //   setformsState({
  //     ...formsState,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  const dispenseDrugHandler = () => {
    setOpenDispenseDrugModal(true);
  };
  const closeSuccessHandler = () => {
    setIsResolved(false);
    refetch();
    onClose();
    onCloseRequest?.(false);
  };

  const trayItemKeys = ["drugName", "drugType", "availableQuantity"];

  //get all transaction history items
  const {
    data: allTransactions,
    isLoading: getAllTransactionsLoading,
    refetch: refetchRequest,
    isError,
  } = useCustomQuery(
    [
      GET_ALL_TRANSACTIONS,
      {
        // stockDetails: stockDetails?._id,
        // page: currentPage,
        // limit: PageSize,
      },
    ],
    {
      url: `/accounting/get-all-transactions`,
      method: "post",
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const handleTransactionOnselect = (res) => {
    setonSelectTransaction(true);
    setTransactionId(res?._id);
    setValues({
      ...values,
      transaction: res?._id,
      patientName: `${res?.patient?.firstName} ${res?.patient?.lastName}`,
      amountPaid: res?.totalCost,
      patient: res?.patient?._id,
      patientId: res?.patient?.ID,
      transactionCode: res?.uniqueCode,
    });
    setsearch(res?.uniqueCode);
  };

  const handleSearchTransactionOnChange = (text) => {
    setonSelectTransaction(false);
    setsearch(text);
  };

  //handle open dispute
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
        uniqueCode: values?.transactionCode.toString(),
      },
    },
    {
      onSuccess: (res) => {
        toast.success("Success");
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
  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);
  //handle open dispute
  const { mutate: handleApproveDispute, isLoading: approveDisputeLoading } =
    useCustomMutation(
      {
        url: `/accounting/resolve-dispute/${detail?._id}`,
        method: "post",
        // avoidCancelling: true,
        data: {
          // status: "APPROVED",
          approvalStatus: "APPROVED",
        },
      },
      {
        onSuccess: (res) => {
          toast.success("Success");
          setIsResolved(true);
          setSuccess(false);
          setLoading(true);
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 2000);
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

  //handle open dispute
  const { mutate: handleDeclineDispute, isLoading: declineDisputeLoading } =
    useCustomMutation(
      {
        url: `/accounting/resolve-dispute/${detail._id}`,
        method: "post",
        // avoidCancelling: true,
        data: {
          // status: "DECLINED",
          approvalStatus: "DECLINED",
        },
      },
      {
        onSuccess: (res) => {
          toast.success("Success");
          setIsResolved(true);
          setSuccess(false);
          setLoading(true);
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 2000);
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
            <Stack direction="row" spacing={1}>
              <CustomButton
                text="Open Dispute"
                disableRipple
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
                disableRipple
                variant="contained"
                color="secondary"
                startIcon={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <Typography sx={{ fontSize: "12px" }}>2</Typography>
                  </Avatar>
                }
              />
              <CustomButton
                text="Dispute Finish"
                disableRipple
                variant={
                  detail?.status === "RESOLVED" ? "contained" : "lightSecondary"
                }
                color={`${
                  detail?.status === "RESOLVED" ? "secondary" : "primary"
                }`}
                startIcon={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <Typography sx={{ fontSize: "12px" }}>3</Typography>
                  </Avatar>
                }
              />
            </Stack>
          </Grid>

          {detail?.status === "RESOLVED" && (
            <Stack
              sx={{ width: "100%", mt: 1 }}
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              {detail?.isApproved === true ? (
                <Chip
                  icon={<CheckIcon />}
                  color="success"
                  variant="contained"
                  label="Approved"
                />
              ) : (
                <Chip
                  icon={<CancelIcon />}
                  color="error"
                  variant="contained"
                  label="Declined"
                />
              )}
            </Stack>
          )}

          <Grid sx={{ marginTop: "15px" }} item xs={12} sm={12}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <SearchDropdown
                placeholder="Search with Transaction ID"
                handleOnselect={handleTransactionOnselect}
                title="Request ID"
                boxSx={{ width: "100%" }}
                data={allTransactions?.data?.transactions}
                isLoading={getAllTransactionsLoading}
                search={detail?.transactionId}
                setsearch={handleSearchTransactionOnChange}
                reFetch={refetchRequest}
                setOnSelect={setonSelectTransaction}
                trayItemKeys={["uniqueCode", "totalCost", "status"]}
                traySx={{ minWidth: "25vw", bottom: "-125px" }}
                readOnly
              />
            </Stack>
          </Grid>

          <Grid sx={{ marginTop: "10px" }} item xs={12} sm={12}>
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
                      {`${detail?.patient?.firstName} ${detail?.patient?.lastName}`}
                    </Typography>
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <Typography opacity={0.5}>{`Amount Paid`}</Typography>
                    <Typography fontWeight={"bold"}>
                      {Number(detail?.transactionAmount?.toFixed(2))}
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Stack spacing={2} direction="row">
                    <Typography opacity={0.5}>{`Patient ID`}</Typography>
                    <Typography fontWeight={"bold"}>
                      {detail?.patient?.ID}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Stack>

            <Grid sx={{ marginTop: "15px" }} item xs={6} sm={6}>
              <CustomTextInput
                title="Refund Amount"
                placeholder="Enter Refund Amount"
                helperText={`Maximum refund amount: ₦2,000.00`}
                value={detail?.amount?.toFixed(2)}
                name="refundAmount"
                readOnly
                handleChange={handleChange}
              />
            </Grid>
            <Grid sx={{ marginTop: "15px" }} item xs={6} sm={6}>
              <CustomSelect
                options={["OVERCHARGED", "WRONG_CHARGE", "OTHER"]}
                // defaultValue={prescription?.data?.items[0]?.frequency}
                placeholder="Select Reason to Refund"
                state={detail?.reason}
                handleChange={handleChange}
                label="Reason to Refund"
                // state={values.frequency}
                // handleChange={handleChange}
                readOnly
                name="refundReason"
                haveTopLabel={true}
              />
            </Grid>

            {detail?.notes && (
              <Grid sx={{ marginTop: "15px" }} item xs={12} sm={12}>
                <CustomTextInput
                  title="Please specify other reason for requesting a refund"
                  required={true}
                  multiline
                  value={detail?.notes}
                  name="otherReason"
                  handleChange={handleChange}
                  // onBlur={handleBlur}
                  placeholder="Type in other reason for requesting a refund"
                  readOnly
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
                text="Approve"
                variant="contained"
                color="success"
                sx={{ width: "51%" }}
                onClick={handleApproveDispute}
                disabled={
                  detail?.status === "RESOLVED" ? "true" : approveDisputeLoading
                }
                startIcon={
                  <Avatar
                    sx={{ backgroundColor: "white", width: 14, height: 14 }}
                  >
                    <CheckIcon
                      sx={{
                        width: "14px",
                        color: "green",
                        backgroundColor: "white",
                      }}
                    />
                  </Avatar>
                }
              />
              <CustomButton
                text="Decline"
                variant="outlined"
                color="error"
                sx={{ width: "50%" }}
                onClick={handleDeclineDispute}
                disabled={
                  detail?.status === "RESOLVED" ? "true" : declineDisputeLoading
                }
                startIcon={
                  <Avatar
                    sx={{ backgroundColor: "red", width: 14, height: 14 }}
                  >
                    <CancelIcon
                      sx={{
                        width: "14px",
                        color: "red",
                        backgroundColor: "white",
                      }}
                    />
                  </Avatar>
                }
              />
            </Stack>
          </Grid>
        </Grid>

        <ShowSuccessModal
          detail={detail}
          loading={loading}
          success={success}
          open={isResolved}
          onClose={closeSuccessHandler}
        />

        {/* Form end */}
      </Paper>
    </Box>
  );
};

const ShowSuccessModal = ({ detail, loading, success, open, onClose }) => {
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };
  return (
    <Backdrop sx={{ zIndex: 2 }} open={open}>
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
            <Box sx={{ m: 1, position: "relative" }}>
              <Fab aria-label="save" color="primary" sx={buttonSx}>
                {success ? <CheckIcon /> : <PendingIcon />}
              </Fab>
              {loading && (
                <CircularProgress
                  size={68}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: -6,
                    left: -6,
                    zIndex: 3,
                  }}
                />
              )}
            </Box>
            <Typography variant="displayMd">
              {!success ? "Resolving Dispute" : "Dispute Resolved"}
            </Typography>
            <Typography color="gray" textAlign={"center"}>
              {`The Dispute with request ID ${detail?.transactionId} has been successfully resolved`}
            </Typography>
            <CustomButton
              color="primary"
              variant="outlined"
              text={"Go Back to Dispute List"}
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

export default ViewDisputeModal;
