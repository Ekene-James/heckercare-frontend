import { PrintOutlined, Search, ShortcutOutlined } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Modal,
  Checkbox,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React, { useState } from "react";
import Header from "../components/Header";
import { useFormik } from "formik";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import InputWithAdornment from "../components/InputWithAdornment";
import CustomSelect from "components/atoms/Select";
import CustomTextInput from "components/atoms/CustomTextInput";
import successfulReceipt from "./assets/successful_receipt.svg";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "components/atoms/SearchDropdown";
import { v4 as uuidv4 } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import CustomCheckbox from "components/atoms/CustomCheckbox";
import AddedRequestList from "components/molecules/pharmacy/AddedRequestList";
import {
  SEARCH_BATCH,
  SEARCH_PATIENT,
  SEARCH_PRESCRIPTION,
  SEARCH_PRODUCTS,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import ProductSearchDropdown from "components/atoms/ProductSearchDropdown";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { markSelectedText } from "components/molecules/patient/singlePatient/treatmentTab/assesmentLog/utils";
import { toast } from "react-toastify";
import moment from "moment";

const foodRelationEnum = [
  {
    name: "Before meal",
    value: "BEFORE_MEAL",
  },
  {
    name: "After meal",
    value: "AFTER_MEAL",
  },
  {
    name: "With meal",
    value: "WITH_MEAL",
  },
  {
    name: "Empty stomach",
    value: "EMPTY_STOMACH ",
  },
];

const routeOfAdminEnum = [
  "ORAL",
  "TOPICAL",
  "INHALATION",
  "INJECTION",
  "SUBCUTANEOUS",
  "INTRAVENOUS",
  "INTRAMUSCULAR",
  "RECTAL",
  "NASAL",
  "OPHTHALMIC",
  "OROPHARYNGEAL",
  "NASOPHARYNGEAL",
  "INTRATRACHEAL",
  "INTRACARDIAC",
  "INTRACEREBRAL",
  "INTRACOCCLEAR",
  "INTRACORNEAL",
  "INTRADERMAL",
  "INTRADISCAL",
  "INTRADUCTAL",
  "INTRAEPIDERMAL",
  "INTRAESOPHAGEAL",
  "INTRAGASTRIC",
  "INTRAGINGIVAL",
  "INTRAHEPATIC",
  "VAGINAL",
];

const frequencyEnum = [
  "OD",
  "BD",
  "TDS",
  "QDS",
  "QID",
  "QHS",
  "STAT",
  "PRN",
  "SOS",
  "Q4H",
  "Q8H",
  "Q12H",
  "Q24H",
  "HS",
];

const initialValues = {
  product: "",
  patient: "",
  batchId: "",
  notes: "",
  frequency: "",
  routeOfAdmin: "",
  duration: 0,
  quantity: 0,
  amount: 0,
  batchAmount: 0,
  foodRelation: "",
  brandName: "",
};

const formatPrescriptionList = (prescriptionList) => {
  if (!prescriptionList?.length) return;

  const data = prescriptionList?.map((pres) => {
    const d = pres;
    return {
      product: d?.product,
      notes: d?.notes,
      frequency: d?.frequency,
      routeOfAdmin: d?.routeOfAdmin,
      duration: d?.duration,
      quantity: d?.quantity,
      foodRelation: d?.foodRelation,
      batchId: d?.batchId,
      amount: d?.amount,
    };
  });
  return data;
};
const formatEditPrescriptionList = (prescriptionList) => {
  if (!prescriptionList?.length) return;

  const data = prescriptionList?.map((pres) => {
    const d = pres;
    return {
      product: d?.product,
      notes: d?.notes,
      frequency: d?.frequency,
      routeOfAdmin: d?.routeOfAdmin,
      duration: d?.duration,
      quantity: d?.quantity,
      foodRelation: d?.foodRelation,
      batchId: d?.batchId,
      amount: d?.amount,
      patient: d?.patient,
    };
  });
  return data;
};

const formatPrescription = (prescription) => {
  const d = prescription;
  const data = {
    product: d?.product,
    notes: d?.notes,
    frequency: d?.frequency,
    routeOfAdmin: d?.routeOfAdmin,
    duration: d?.duration,
    quantity: d?.quantity,
    foodRelation: d?.foodRelation,
    batchId: d?.batchId,
    amount: d?.amount,
  };
  return data;
};

function ExpiredDrugDetails({ editData, onClose }) {
  const [values, setValues] = React.useState();
  const navigate = useNavigate();

  return (
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
          <ImageSection editData={editData} />
        </Grid>
      </Grid>
    </Stack>
  );
}

const FormSection = ({ onCloseRequest, editData, amount }) => {
  console.log(editData);
  const [openDispenseDrugModal, setOpenDispenseDrugModal] = useState(false);
  const [onSelectPatient, setonSelectPatient] = React.useState(false);
  const [onSelectProduct, setonSelectProduct] = React.useState(false);
  const [patientId, setpatientId] = React.useState("");
  const [productId, setproductId] = React.useState("");

  const [prescriptionList, setprescriptionList] = React.useState([]);

  const [search, setsearch] = React.useState("");
  const [searchProducts, setsearchProducts] = React.useState("");
  const [batchId, setBatchId] = React.useState("");
  let totalAmount = 0;

  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });
  const dispenseDrugHandler = () => {
    setOpenDispenseDrugModal(true);
  };
  const closeSuccessHandler = () => {
    setOpenDispenseDrugModal(false);
    onCloseRequest?.(false);
  };

  const trayItemKeys = ["drugName", "drugType", "availableQuantity"];

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
          }}
        >
          <Grid item xs={12} sm={12}>
            <CustomTextInput
              title="Medicine Name"
              value={editData?.product?.drugName}
              name="medicineName"
              // defaultValue={prescription?.data?.items[0]?.product?.brandName}
              //   handleChange={handleChange}
              // onBlur={handleBlur}
              disabled="true"
              placeholder="Medicine Name"
              readOnly
              // haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextInput
              title="Manufacturer's Name"
              value={editData?.product?.brandName}
              name="manufacturerName"
              // defaultValue={prescription?.data?.items[0]?.product?.brandName}
              //   handleChange={handleChange}
              // onBlur={handleBlur}
              disabled="true"
              placeholder="Manufacturer's Name"
              readOnly
              // haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Unit Type"
              value={editData?.product?.unit}
              name="unitType"
              // defaultValue={prescription?.data?.items[0]?.product?.brandName}
              //   handleChange={handleChange}
              // onBlur={handleBlur}
              disabled="true"
              placeholder="Unit Type"
              readOnly
              // haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Medicine Type"
              value={editData?.product?.drugType?.name}
              name="medicineType"
              // defaultValue={prescription?.data?.items[0]?.product?.brandName}
              //   handleChange={handleChange}
              // onBlur={handleBlur}
              disabled="true"
              placeholder="Medicine Type"
              readOnly
              // haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Available Quantity"
              value={editData?.product?.availableQuantity}
              name="quantity"
              readOnly
              //   handleChange={handleChange}
              type="number"
              inputProps={{ inputProps: { min: 0 } }}
              placeholder="Available Quantity"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Manufacturer's Price"
              value={editData?.purchasePrice}
              name="manPrice"
              readOnly
              //   handleChange={handleChange}
              type="number"
              inputProps={{ inputProps: { min: 0 } }}
              placeholder="Manufacturer's Price"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Selling Price"
              value={editData?.sellingPrice}
              name="salesPrice"
              // defaultValue={prescription?.data?.items[0]?.quantity}
              readOnly
              type="number"
              inputProps={{ inputProps: { min: 0 } }}
              placeholder="Selling Price"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Expiring Date"
              value={moment(editData?.expiryDate).format("MMMM Do YYYY")}
              name="expirydate"
              readOnly
              inputProps={{ inputProps: { min: 0 } }}
              placeholder="Expiry Date"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomButton
              text={"Close"}
              variant="contained"
              onClick={onCloseRequest}
              // startIcon={<AddIcon />}
              color="secondary"
              sx={{
                marginTop: "16px",
              }}
            />
          </Grid>{" "}
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
              <img src={successfulReceipt} alt="successfully dispensed" />
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

const ImageSection = ({ editData }) => {
  return (
    <Box
      component={"section"}
      aria-label="bill details"
      style={{
        border: "1px dashed #000000",
        borderRadius: "4px",
        padding: "8px",
      }}
    >
      <Stack
        direction="column"
        sx={{
          backgroundColor: "rgba(248, 100, 100, 0.03)",
          width: "100%",
          padding: "28px 16px",
        }}
      >
        <Stack
          direction="column"
          sx={{
            textAlign: "center",
            gap: "9px",
          }}
        >
          <img
            src={`${
              editData?.product?.productImage ||
              "/imgs/black-solid-icon-medicine.jpg"
            }`}
            alt="product_image "
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default ExpiredDrugDetails;
