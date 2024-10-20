import { ShortcutOutlined } from "@mui/icons-material";
import { Backdrop, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";

import { useFormik } from "formik";

import CustomSelect from "components/atoms/Select";
import CustomTextInput from "components/atoms/CustomTextInput";
import successfulReceipt from "./assets/successful_receipt.svg";

import SearchDropdown from "components/atoms/SearchDropdown";
import { v4 as uuidv4 } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  GET_ALL_REQUEST,
  SEARCH_BATCH,
  SEARCH_PATIENT,
  SEARCH_PRESCRIPTION,
  SEARCH_PRODUCTS,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import ProductSearchDropdown from "components/atoms/ProductSearchDropdown";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";

import { numberFormatter } from "utils/numberFormatter";
import { toast } from "react-toastify";
import CustomMenu from "components/atoms/CustomMenu";
import { useQueryClient } from "react-query";
import CustomLoader from "components/atoms/CustomLoader";

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

const drugFrequencyValues = {
  OD: 1,
  BD: 2,
  TDS: 3,
  QDS: 4,
  QID: 6,
  QHS: 8,
  HS: 12,
  Q4H: 6,
  Q6H: 4,
  Q8H: 8,
  Q12H: 12,
  Q24H: 24,
  SOS: 1,
  PRN: 1,
  STAT: 1,
};

const initialValues = {
  product: "",
  patient: "",
  batchId: "",
  notes: "",
  frequency: "",
  routeOfAdmin: "",
  duration: 0,

  amount: 0,
  batchAmount: 0,
  foodRelation: "",
  brandName: "",
};

const getAmount = (prescription) => {
  let amount = 0;

  prescription?.items?.forEach((item) => {
    const frequencyValue = drugFrequencyValues[item.frequency] || 1;

    const salesPrice = item?.salesPrice || 0;
    amount = amount + item.amount * item.duration * salesPrice * frequencyValue;
  });
  // }

  return amount;
};

function DispensedListModal({ editData, closeModal }) {
  //search prescription
  const { data: prescription, isLoading } = useCustomQuery(
    [SEARCH_PRESCRIPTION, editData?._id],
    {
      url: `/prescription/single/${editData?._id}`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!editData?._id,

      select: (res) => {
        const data = res?.data?.items?.map((pres) => {
          const d = pres;
          return {
            product: d?.product?._id,
            notes: d?.notes,
            frequency: d?.frequency,
            routeOfAdmin: d?.routeOfAdmin,
            duration: d?.duration,

            foodRelation: d?.foodRelation,
            batchId: d?.batchId,
            amount: d?.amount,
            brandName: d?.product?.brandName,
            drugName: d?.product?.drugName,
            status: res?.data?.status,
            uid: uuidv4(),
            patientName: `${res?.data?.patient?.firstName} ${res?.data?.patient?.lastName}`,
            patient: res?.data?.patient?._id,
            prescriptionId: res?.data?.id,
            salesPrice: d?.product?.salesPrice,
          };
        });

        return {
          ...res.data,
          items: data,
        };
      },
    }
  );

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
          <ViewFormSection
            editData={editData}
            onCloseRequest={closeModal}
            prescription={prescription?.items || []}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ position: "sticky", marginTop: { xs: "24px", md: "0px" } }}
        >
          <BillSection prescription={prescription} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Stack>
  );
}

const ViewFormSection = ({ onCloseRequest, prescription }) => {
  const [prescriptionList, setprescriptionList] = useState([]);

  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });

  React.useMemo(() => setprescriptionList(prescription), [prescription]);

  const closeSuccessHandler = () => {
    // setOpenDispenseDrugModal(false);
    onCloseRequest?.(false);
  };

  const handleEdit = (prescrip) => {
    setValues(prescrip);
    //delete from various states
    const newState = prescriptionList.filter(
      (pres) => pres?.uid !== prescrip?.uid
    );

    setprescriptionList(newState);
  };

  const handleAdd = () => {
    if (
      !values.patient ||
      !values.amount ||
      !values.brandName ||
      !values.duration ||
      !values.foodRelation ||
      !values.frequency ||
      !values.routeOfAdmin
    )
      return;
    setprescriptionList([...prescriptionList, { ...values, uid: uuidv4() }]);

    resetForm();
  };

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
              title="Patient Name"
              value={values.patientName}
              name="patientName"
              handleChange={handleChange}
              disabled="true"
              placeholder="Enter Drug Name or Select from the dropdown"
              readOnly
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextInput
              title="Medicine/Drug Name"
              value={values.drugName}
              name="drugName"
              handleChange={handleChange}
              disabled="true"
              placeholder="Enter Drug Name or Select from the dropdown"
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextInput
              title="Sales Price"
              value={values.salesPrice}
              name="salesPrice"
              handleChange={handleChange}
              disabled="true"
              placeholder="Selling price"
              readOnly
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title=" Brand Name"
              value={values.brandName}
              name="brandName"
              handleChange={handleChange}
              disabled="true"
              placeholder="Brand Name"
              readOnly
              // haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Amount (Number of Tablets/Drugs)"
              value={values.amount}
              name="amount"
              handleChange={handleChange}
              placeholder="Enter Amount"
              type="number"
              inputProps={{ inputProps: { min: 0 } }}
              readOnly={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={frequencyEnum}
              label="Frequency"
              state={values.frequency}
              handleChange={handleChange}
              name="frequency"
              readOnly={true}
              haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={foodRelationEnum}
              label="Food Relation"
              state={values.foodRelation}
              readOnly={true}
              handleChange={handleChange}
              name="foodRelation"
              haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={routeOfAdminEnum}
              label="Route of administration(e.g Oral/Injection)"
              // defaultValue={prescription?.data?.items[0]?.routeOfAdmin}
              state={values.routeOfAdmin}
              handleChange={handleChange}
              readOnly={true}
              name="routeOfAdmin"
              haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              title="Duration (Number of days)"
              value={values.duration}
              // defaultValue={prescription?.data?.items[0]?.duration}
              name="duration"
              handleChange={handleChange}
              readOnly={true}
              type="number"
              inputProps={{ inputProps: { min: 0 } }}
              placeholder="Enter number of days here"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextInput
              title="Note"
              multiline
              // defaultValue={prescription?.data?.items[0]?.notes}
              value={values.notes}
              name="notes"
              handleChange={handleChange}
              readOnly={true}
              // onBlur={handleBlur}
              placeholder="Enter notes here."
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomButton
              text={"Add"}
              variant="contained"
              onClick={handleAdd}
              // startIcon={<AddIcon />}
              color="secondary"
              sx={{
                marginTop: "16px",
              }}
            />
          </Grid>{" "}
          <Stack direction="column" spacing={1} sx={{ mt: 2, mb: 2 }}>
            {prescriptionList?.map((prescription, i, arr) => (
              <Stack
                sx={{
                  width: { xs: "100%", sm: "80%" },
                  p: 1,
                  borderBottom:
                    i !== arr.length - 1 && "1px solid rgba(0,0,0,0.2)",
                }}
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
                spacing={3}
                key={prescription?.uid}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {prescription?.drugName}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {prescription?.brandName}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <CustomButton
                    text={"View"}
                    variant="custom"
                    rgb="10, 132, 255"
                    endIcon={<CreateIcon />}
                    onClick={handleEdit.bind(this, prescription)}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} sx={{ marginTop: "8px" }}>
          {
            <CustomButton
              text={"Close"}
              variant="contained"
              color="secondary"
              // disabled={isLoading}
              onClick={closeSuccessHandler}
              sx={{
                marginRight: "8px",
              }}
            />
          }
        </Grid>

        {/* Form end */}
      </Paper>
    </Box>
  );
};

const BillSection = ({ prescription, isLoading }) => {
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
        {isLoading ? (
          <CustomLoader size={25} />
        ) : (
          <Stack
            direction="column"
            sx={{
              textAlign: "center",
              gap: "9px",
            }}
          >
            <Typography
              sx={{
                color: "#979797",
                fontWeight: "800",
                fontSize: "20px",
                lineHeight: "120%",
              }}
            >
              Billing Details
            </Typography>

            <Typography
              color="primary"
              sx={{ fontWeight: "700", fontSize: "32px", lineHeight: "150%" }}
            >
              {/* {`₦${numberFormatter(getAmount(prescription))}`} */}
              {`₦${numberFormatter(prescription?.totalCost)}`}
            </Typography>

            <Typography
              color="primary"
              sx={{
                color: "#c4c4c4",
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "150%",
              }}
            >
              Payment has{" "}
              {prescription?.status === "PAID" ||
              prescription?.status === "DISPENSED"
                ? null
                : "not"}{" "}
              been made
            </Typography>
          </Stack>
        )}
        <Stack direction="column" sx={{ margin: "40px 0px", gap: "16px" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ varticalAlign: "center" }}
          >
            <Grid
              item
              sx={{
                color: "#495057",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "150%",
              }}
            >
              Payment Status
            </Grid>

            {!!prescription &&
            (prescription?.status === "PAID" ||
              prescription?.status === "DISPENSED") ? (
              <Grid
                item
                sx={{
                  color: "green",
                  fontSize: "14px",
                  fontWeight: "800",
                  lineHeight: "150%",
                  alignItems: "center",
                  display: "flex",
                  gap: "2px",
                }}
              >
                <DoneIcon fontSize="small" />
                <span>Paid</span>
              </Grid>
            ) : (
              <Grid
                item
                sx={{
                  color: "#DB1E36",
                  fontSize: "14px",
                  fontWeight: "800",
                  lineHeight: "150%",
                  alignItems: "center",
                  display: "flex",
                  gap: "2px",
                }}
              >
                <ShortcutOutlined
                  fontSize="small"
                  sx={{ transform: "rotate(180deg)" }}
                />
                <span>Unpaid</span>
              </Grid>
            )}
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DispensedListModal;
