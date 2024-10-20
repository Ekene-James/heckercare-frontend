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
  // if billed
  if (prescription?.status === "BILLED" || prescription?.status === "PAID") {
    amount = prescription?.totalCost;
  } else {
    prescription?.items?.forEach((item) => {
      const frequencyValue = drugFrequencyValues[item.frequency] || 1;

      //if there is a batch id, it means it was created in pharamacy module and not in patient module
      // const createdAtPharmacyModule = item?.batchId && !item?.batchAmount;
      // const salesPrice = createdAtPharmacyModule
      //   ? item?.product?.salesPrice
      //   :  item?.batchAmount || 0;

      const salesPrice = item?.batchAmount || 0;
      amount =
        amount + item.amount * item.duration * salesPrice * frequencyValue;
    });
  }

  // }

  return amount;
};

function EditDrugOrder({
  refetch,
  refetchDispense,
  editData,
  closeModal,
  table,
}) {
  //search prescription
  const { data: prescription } = useCustomQuery(
    [SEARCH_PRESCRIPTION, editData?._id],
    {
      url: `/prescription/single/${editData?._id}`,
      // url: `/prescription/${editData?._id}`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!editData?._id,

      select: (res) => {
        // console.log("running");
        // console.log(res);
        let data = res.data.items;

        //first load of the data, i.e. prescription has not been edited to accomodate batch id
        if (!res?.data?.isEdit) {
          data = res?.data?.items?.map((pres) => {
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
            };
          });
        }

        return {
          originalData: res.data,
          formattedData: data,
        };
      },
      // onSuccess: (res) => {
      //   setValues(true);
      // },
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
            prescription={prescription?.formattedData || []}
            refetch={refetch}
            refetchDispense={refetchDispense}
            table={table}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ position: "sticky", marginTop: { xs: "24px", md: "0px" } }}
        >
          <BillSection prescription={prescription?.originalData} />
          {/* <BillSection paybackAmount={paybackAmount} /> */}
        </Grid>
      </Grid>
    </Stack>
  );
}

const ViewFormSection = ({
  onCloseRequest,
  prescription,
  refetch,
  table,
  refetchDispense,
  editData,
}) => {
  //   const [openDispenseDrugModal, setOpenDispenseDrugModal] = useState(false);

  const [onSelectProduct, setonSelectProduct] = React.useState(false);

  const [prescriptionList, setprescriptionList] = useState([]);
  const queryClient = useQueryClient();
  const [search, setsearch] = React.useState("");
  const [searchProducts, setsearchProducts] = React.useState("");

  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });

  React.useMemo(() => setprescriptionList(prescription), [prescription]);

  const closeSuccessHandler = () => {
    // setOpenDispenseDrugModal(false);
    onCloseRequest?.(false);
  };

  const handleEdit = (prescrip) => {
    setsearch(prescrip?.patientName);
    setsearchProducts(prescrip?.drugName);
    setonSelectProduct(true);

    setValues(prescrip);
    //delete from various states
    const newState = prescriptionList.filter(
      (pres) => pres?.uid !== prescrip?.uid
    );

    queryClient.setQueryData(
      [SEARCH_PRESCRIPTION, editData?._id],
      (oldQueryData) => {
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData.data,
            items: newState,
            isEdit: true,
          },
        };
      }
    );

    setprescriptionList(newState);
  };

  const handleDelete = (id) => {
    const newState = prescriptionList?.filter((pres) => pres?.uid !== id);
    //delete from various states, i.e local state and api state
    queryClient.setQueryData(
      [SEARCH_PRESCRIPTION, editData?._id],
      (oldQueryData) => {
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData.data,
            items: newState,
            isEdit: true,
          },
        };
      }
    );
    setprescriptionList(newState);

    resetForm();
  };

  //pick certain properties
  function pick(obj, ...props) {
    return props.reduce(function (result, prop) {
      result[prop] = obj[prop];
      return result;
    }, {});
  }

  const handleAdd = () => {
    if (!values.patient) return toast.error("Please select a patient");
    if (!values.amount) return toast.error("Please select an amount");
    if (!values.batchId) return toast.error("Please select a batch");
    if (!values.brandName) return toast.error("Please select a drug");
    if (!values.duration) return toast.error("Please select a duration");
    if (!values.foodRelation) return toast.error("Please select food relation");
    if (!values.frequency) return toast.error("Please select frequency");
    if (!values.routeOfAdmin)
      return toast.error("Please select route of admin");

    setprescriptionList([...prescriptionList, { ...values, uid: uuidv4() }]);

    queryClient.setQueryData(
      [SEARCH_PRESCRIPTION, editData?._id],
      (oldQueryData) => {
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData.data,
            items: [...oldQueryData.data.items, { ...values, uid: uuidv4() }],
            isEdit: true,
          },
        };
      }
    );
    resetForm();
    handleSearchPatientOnChange("");
    handleSearchProductOnChange("");
  };
  const handlePatientOnselect = (res) => {
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

  const handleBatchSelect = (res) => {
    let selectedBatch = batch?.filter((b) => b?.value === res?.target?.value);
    setValues({
      ...values,
      batchId: res.target?.value,
      batchAmount: selectedBatch[0]?.amount,
    });
  };

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
    setsearch(text);
  };

  function sanitizeData(list) {
    const productsAndBatches = list.map((d) => {
      return pick(d, "product", "batchId");
    });
    return {
      items: productsAndBatches,
      totalCost: getAmount({ items: prescriptionList }),
    };
  }

  // //handle generate bill
  const { mutate: generateBill, isLoading: generateBillLoading } =
    useCustomMutation(
      {
        url: `/product/bill-prescription/${prescription[0]?.prescriptionId}`,
        method: "patch",
        avoidCancelling: true,
        data: sanitizeData(prescriptionList),
      },
      {
        onSuccess: (res) => {
          toast.success("Success");
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

  //handle dispense drug
  const { mutate: handleDispenseDrug, isLoading } = useCustomMutation(
    {
      url: `/product/dispense-prescription/${prescription[0]?.prescriptionId}`,
      method: "patch",
      avoidCancelling: true,
      data: {
        id: prescription[0]?.prescriptionId,
      },
    },
    {
      onSuccess: (res) => {
        toast.success("Success");
        refetch();
        refetchDispense();
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
      // enabled: !!search && !onSelectPatient,
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
    },
    {
      select: (res) => {
        if (res?.data?.products) return res;
        return {
          ...res,
          data: {
            products: res.data,
          },
        };
      },
      refetchOnWindowFocus: true,
      enabled: !!searchProducts && !onSelectProduct,
    }
  );
  const handleGenerateBill = () => {
    let errorCount = 0;
    //check if prescription has a batchid and throw error if not
    prescriptionList.forEach((pres) => {
      if (!pres.batchId) {
        errorCount += 1;
        toast.error(`Please select a batch for ${pres.drugName}`);
      }
    });
    if (!errorCount) generateBill();
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
              readOnly={table === "dispensed_table" ? true : false}
              setsearch={handleSearchPatientOnChange}
              reFetch={refetchPatients}
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
              readOnly={table === "dispensed_table" ? true : false}
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
            <CustomSelect
              options={batch}
              label="Batch ID"
              // defaultValue={prescription?.data?.items[0]?.batchId}
              state={values.batchId}
              handleChange={handleBatchSelect}
              name="batchName"
              readOnly={table === "dispensed_table" ? true : false}
              haveTopLabel={true}
              placeholder="Select Batch Number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextInput
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
              label="Frequency"
              state={values.frequency}
              handleChange={handleChange}
              name="frequency"
              readOnly={table === "dispensed_table" ? true : false}
              haveTopLabel={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              options={foodRelationEnum}
              // defaultValue={prescription?.data?.items[0]?.foodRelation}
              label="Food Relation"
              state={values.foodRelation}
              readOnly={table === "dispensed_table" ? true : false}
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
              readOnly={table === "dispensed_table" ? true : false}
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
              readOnly={table === "dispensed_table" ? true : false}
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
              readOnly={table === "dispensed_table" ? true : false}
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

        <Grid item xs={12} sm={12} sx={{ marginTop: "8px" }}>
          {table === "dispensed_table" ? (
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
          ) : (
            <>
              <CustomButton
                text={"Dispense Drug"}
                variant="contained"
                color="secondary"
                disabled={
                  isLoading ||
                  !prescriptionList?.length ||
                  prescriptionList[0]?.status === "BILLED" ||
                  prescriptionList[0]?.status === "PENDING" ||
                  prescriptionList[0]?.status === "DISPENSED"
                }
                onClick={handleDispenseDrug}
                sx={{
                  marginRight: "8px",
                }}
              />

              <CustomButton
                text={"Generate Bill"}
                variant="containedBrown"
                color="primary"
                disabled={
                  !prescriptionList?.length ||
                  prescriptionList[0]?.status === "BILLED" ||
                  prescriptionList[0]?.status === "PAID" ||
                  generateBillLoading
                }
                onClick={handleGenerateBill}
                sx={{
                  marginRight: "8px",
                }}
              />
              <CustomButton
                text={"Cancel Order"}
                variant="containedBrown"
                color="primary"
                // disabled={isLoading}
                onClick={closeSuccessHandler}
                sx={{
                  marginRight: "8px",
                }}
              />
            </>
          )}
        </Grid>

        {/* {openDispenseDrugModal && (
          <ShowSuccessModal
            open={openDispenseDrugModal}
            onClose={closeSuccessHandler}
          />
        )} */}

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
const BillSection = ({ prescription }) => {
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

export default EditDrugOrder;
