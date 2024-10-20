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
  GET_ALL_PENDING_TRANSACTIONS,
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
  // console.log(prescription);
  let amount = 0;
  // if (prescription?.totalCost) {
  //   amount = prescription.totalCost;
  // } else {
  prescription?.items?.forEach((item) => {
    const frequencyValue = drugFrequencyValues[item.frequency] || 1;
    // const salesPrice = item?.product?.salesPrice
    //   ? item?.product?.salesPrice
    //   : item.batchAmount;
    const salesPrice = item.batchAmount || 0;
    amount = amount + item.amount * item.duration * salesPrice * frequencyValue;
  });
  // }

  return amount;
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

      foodRelation: d?.foodRelation,
      batchId: d?.batchId,
      amount: d?.amount,
    };
  });
  return data;
};

function CreateDrugOrder({ closeModal }) {
  // const [values, setValues] = React.useState();
  const [createPrescriptionList, setcreatePrescriptionList] = React.useState(
    []
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
          <FormSection
            prescriptionList={createPrescriptionList}
            setprescriptionList={setcreatePrescriptionList}
            onCloseRequest={closeModal}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ position: "sticky", marginTop: { xs: "24px", md: "0px" } }}
        >
          <BillSection
            prescription={{
              items: createPrescriptionList || [],
              status: "PENDING",
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

const FormSection = ({
  onCloseRequest,
  prescriptionList,
  setprescriptionList,
}) => {
  const queryClient = useQueryClient();

  const [onSelectPatient, setonSelectPatient] = React.useState(false);
  const [onSelectProduct, setonSelectProduct] = React.useState(false);
  const [patientId, setpatientId] = React.useState("");

  const [search, setsearch] = React.useState("");
  const [searchProducts, setsearchProducts] = React.useState("");

  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });

  const handleEdit = (prescription) => {
    setsearch(prescription?.patientName);
    setsearchProducts(prescription?.drugName);
    setonSelectProduct(true);
    setonSelectPatient(true);
    setValues(prescription);

    const newState = prescriptionList.filter(
      (pres) => pres?.uid !== prescription?.uid
    );
    setprescriptionList(newState);
  };

  const handleDelete = (id) => {
    const newState = prescriptionList?.filter((pres) => pres?.uid !== id);
    setprescriptionList(newState);

    resetForm();
  };

  const handleAdd = () => {
    if (
      values.product.trim() === "" ||
      // batchId.trim() === "" ||
      values.brandName.trim() === "" ||
      values.duration === 0 ||
      values.foodRelation.trim() === "" ||
      values.frequency.trim() === "" ||
      values.patient === "" ||
      values.routeOfAdmin.trim() === ""
    ) {
      toast.error("Please fill out all fields");
      return;
    }

    setprescriptionList([...prescriptionList, { ...values, uid: uuidv4() }]);

    resetForm();
    handleSearchPatientOnChange("");
    handleSearchProductOnChange("");
  };
  const handlePatientOnselect = (res) => {
    setonSelectPatient(true);
    setpatientId(res?._id);
    setValues({
      ...values,
      patient: res?._id,
      patientName: `${res?.firstName} ${res?.lastName}`,
    });
    setsearch(`${res?.firstName} ${res?.lastName}`);
  };

  //search batch

  const { data: batch } = useCustomQuery(
    [SEARCH_BATCH, values?.product],
    {
      url: `/product/get-batch-product/${values?.product}`,

      method: "get",
    },
    {
      refetchOnWindowFocus: true,
      select: (data) => {
        const formattedData = data?.data?.batches?.map((batch) => {
          return {
            name: `${batch.batchNumber} - Qty(${numberFormatter(
              Math.round(batch.quantity)
            )}) - Unit(${batch.product.unit}) -Selling Price(₦${numberFormatter(
              batch.sellingPrice
            )})`,
            value: batch._id,
            amount: batch.sellingPrice,
          };
        });
        return formattedData;
      },
      enabled: onSelectProduct,
    }
  );

  const handleProductOnselect = (res) => {
    setonSelectProduct(true);

    // searchBatch();
    setValues({
      ...values,
      product: res?._id,
      brandName: res?.brandName,
      drugName: res?.drugName,
      batchId: "",
      batchAmount: "",
      batchName: "",
    });
    setsearchProducts(`${res?.drugName}`);
  };

  const handleSearchProductOnChange = (text) => {
    setonSelectProduct(false);
    // setsearchProducts(text);
    setsearchProducts(text);
    // searchBatch();
  };

  const handleSearchPatientOnChange = (text) => {
    setonSelectPatient(false);
    setsearch(text);
  };

  const { mutate: handleSubmitRequest, isLoading } = useCustomMutation(
    {
      url: `/product/create-request`,
      method: "post",
      avoidCancelling: true,
      data: {
        items: formatPrescriptionList(prescriptionList),
        patient: patientId,
        totalCost: getAmount({ items: prescriptionList }),
      },
    },
    {
      onSuccess: (res) => {
        toast.success("Success");
        queryClient.invalidateQueries([GET_ALL_REQUEST]);
        queryClient.invalidateQueries([GET_ALL_PENDING_TRANSACTIONS]);

        onCloseRequest();
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  //search patients
  const {
    isLoading: patientsLoading,

    data: patients,
    refetch: refetchPatients,
  } = useCustomQuery(
    [SEARCH_PATIENT, search],
    {
      url: `/patients/get-all-patients`,
      data: {
        search,
      },
      method: "post",
      avoidCancelling: false,
    },
    {
      refetchOnWindowFocus: true,
      enabled: !!search && !onSelectPatient,
    }
  );

  //search drug
  const {
    isLoading: productsLoading,

    data: products,
    refetch: refetchProducts,
  } = useCustomQuery(
    [SEARCH_PRODUCTS, searchProducts],
    {
      url: `/product/getall?search=${searchProducts}&limit=10000`,

      method: "get",
      avoidCancelling: false,
    },
    {
      refetchOnWindowFocus: true,
      select: (res) => {
        if (res?.data?.products) return res;
        return {
          ...res,
          data: {
            products: res.data,
          },
        };
      },
      enabled: !!searchProducts && !onSelectProduct,
    }
  );

  const handleClickDropdownItem = (item) => {
    setValues({
      ...values,
      batchId: item.value,
      batchAmount: item.amount,
      batchName: item.name,
    });
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
            <SearchDropdown
              placeholder="Search ( with “Patient name” or “Patient ID”)"
              handleOnselect={handlePatientOnselect}
              title="Patient's Name"
              boxSx={{ width: "100%" }}
              data={patients?.data?.patients}
              // defaultValue={`${prescription?.data?.patient?.firstName} ${prescription?.data?.patient?.lastName}`}
              isLoading={patientsLoading}
              search={search}
              setsearch={handleSearchPatientOnChange}
              reFetch={refetchPatients}
              setOnSelect={setonSelectPatient}
              traySx={{ minWidth: "25vw", bottom: "-125px" }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <ProductSearchDropdown
              placeholder="Enter Drug Name or Select from the dropdown"
              handleOnselect={handleProductOnselect}
              title="Medicine/Drug Name"
              boxSx={{ width: "100%" }}
              data={products?.data?.products}
              // defaultValue={prescription?.data?.items[0]?.product?.drugName}
              isLoading={productsLoading}
              searchProducts={searchProducts}
              setsearchProducts={handleSearchProductOnChange}
              reFetch={refetchProducts}
              trayItemKeys={["drugName", "brandName", "availableQuantity"]}
              traySx={{ minWidth: "25vw", bottom: "-125px" }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomMenu
              label="Batch"
              caption={values?.batchName || "Select Batch"}
              items={batch}
              onClickItem={handleClickDropdownItem}
              buttonSx={{
                width: "100%",
                height: "54px",
                justifyContent: "space-between",
                mt: 0.2,
              }}
              popperSx={{
                width: {
                  xs: "100%",
                  sm: "57%",
                },
              }}
              disabled={!values.product}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              required={true}
              title=" Brand Name"
              value={values.brandName}
              name="brandName"
              // defaultValue={prescription?.data?.items[0]?.product?.brandName}
              handleChange={handleChange}
              // onBlur={handleBlur}
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={frequencyEnum}
              // defaultValue={prescription?.data?.items[0]?.frequency}
              label="Frequency"
              state={values.frequency}
              handleChange={handleChange}
              name="frequency"
              haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={foodRelationEnum}
              label="Food Relation"
              state={values.foodRelation}
              handleChange={handleChange}
              name="foodRelation"
              haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={routeOfAdminEnum}
              label="Route of administration(e.g Oral/Injection)"
              state={values.routeOfAdmin}
              handleChange={handleChange}
              name="routeOfAdmin"
              haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
              required={true}
              title="Duration (Number of days)"
              value={values.duration}
              // defaultValue={prescription?.data?.items[0]?.duration}
              name="duration"
              handleChange={handleChange}
              type="number"
              inputProps={{ inputProps: { min: 0 } }}
              placeholder="Enter number of days here"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextInput
              title="Note"
              required={true}
              multiline
              // defaultValue={prescription?.data?.items[0]?.notes}
              value={values.notes}
              name="notes"
              handleChange={handleChange}
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
                    text={"Edit"}
                    variant="custom"
                    rgb="10, 132, 255"
                    endIcon={<CreateIcon />}
                    onClick={handleEdit.bind(this, prescription)}
                  />
                  <CustomButton
                    text={"Delete"}
                    color="error"
                    endIcon={<DeleteIcon />}
                    onClick={handleDelete.bind(this, prescription.uid)}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Grid>

        <CustomButton
          text={"Create Request"}
          variant="contained"
          color="secondary"
          disabled={isLoading}
          onClick={handleSubmitRequest}
          sx={{
            marginTop: "16px",
          }}
        />
      </Paper>
    </Box>
  );
};

const BillSection = ({ prescription }) => {
  // console.log(prescription);
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
            {`₦${numberFormatter(getAmount(prescription))}`}
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

export default CreateDrugOrder;
