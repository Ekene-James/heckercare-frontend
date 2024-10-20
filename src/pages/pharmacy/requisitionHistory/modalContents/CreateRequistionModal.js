import {
  Box,
  colors,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import { useFormik } from "formik";
import React from "react";
import { Nigeria_states } from "utils/locationData";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import CustomButton from "components/atoms/CustomButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CustomModal from "components/atoms/CustomModal";
import DrugListModal from "./DrugListModal";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";
import {
  GET_ACCOUNTING_REQUISITIONS,
  GET_ALL_NEW_VENDORS,
  GET_ALL_PHARMACY_REQUISITIONS,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import DrugDetail from "./DrugDetail";
const initialValues = {
  dueDate: "",
  title: "",

  vendorDetails: {},
  cost: {
    subTotalCost: 0,
    shippingCost: 0,
    salesTax: 0,
  },
  vendor: "",
  shippiongDetails: {
    address: "",
    phoneNumber: "",
  },
  additionalInfo: "",
  drugDetails: {
    productType: "",
    unitCost: 0,
    quantity: 0,
  },
};
const getSubTotal = (selectedProducts) => {
  if (!selectedProducts?.length) return 0;
  const subTotal = selectedProducts.reduce((accumulator, currentValue) => {
    if (!currentValue.quantity || !currentValue.unitCost) return accumulator;
    return accumulator + +currentValue.quantity * +currentValue.unitCost;
  }, 0);

  return subTotal;
};
const formatData = (stateValues, selectedProducts) => {
  const copy = structuredClone(stateValues);

  delete copy.vendor;

  const data = {
    ...copy,
    vendorDetails: {
      ...copy?.vendorDetails?.vendorDetails,
      phoneNumber: copy?.vendorDetails?.contactPerson?.phoneNumber,
    },

    drugDetails: selectedProducts.map((product) => {
      return {
        productType: product?._id,
        // productType: product?.drugType?._id,
        unitCost: product.unitCost,
        quantity: product.quantity,
        unit: product.unit,
      };
    }),
  };
  if (data?.vendorDetails?.status) delete data?.vendorDetails?.status;

  return data;
};
function CreateRequistionModal({ closeModal }) {
  const { state } = useAuthCtx();
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  const [selectedProducts, setselectedProducts] = React.useState([]);
  const { handleChange, values, touched, errors, setValues } = useFormik({
    initialValues,
  });

  //create requisition
  const { mutate: createReq, isLoading: createReqLoading } = useCustomMutation(
    {
      url: `/requisition/create`,
      method: "post",
      data: formatData(values, selectedProducts),
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_ALL_PHARMACY_REQUISITIONS);
        queryClient.invalidateQueries(GET_ACCOUNTING_REQUISITIONS);
        toast.success("Success");
        closeModal();
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  //get all vendors
  const {
    isLoading: vendorLoading,

    data: vendors,
  } = useCustomQuery(
    [GET_ALL_NEW_VENDORS],
    {
      url: `/newvendor/getall`,
      method: "post",
      data: {
        status: true,
      },
    },
    {
      refetchOnWindowFocus: false,
      avoidCancelling: true,
      select: (response) => {
        return response.data.newVendors.map((res) => {
          return {
            ...res,
            name: res.vendorDetails.vendorName,
            value: res._id,
          };
        });
      },
    }
  );
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  const handleSelectDate = (date, name) => {
    setValues({
      ...values,
      [name]: date,
    });
  };
  const handleSelectVendor = (e) => {
    const vendorDetails = vendors.find(
      (vendor) => vendor.value === e.target.value
    );

    setValues({
      ...values,
      vendorDetails: {
        ...vendorDetails,
      },
      vendor: e.target.value,
    });
  };

  const handleChangeDetail = (idx, e) => {
    let details = [];

    setselectedProducts((prev) => {
      const copy = [...prev];
      const itemObj = copy[idx];
      const item = {
        ...itemObj,
        [e.target.name]:
          e.target.name === "unit" ? e.target.value : +e.target.value,
      };
      copy[idx] = item;
      details = copy;
      return copy;
    });

    const subtotal = getSubTotal(details);

    setValues({
      ...values,
      cost: {
        ...values.cost,
        subTotalCost: subtotal,
      },
    });
  };

  const handleDeleteDrugDetail = (drugId) => {
    let details = [];
    setselectedProducts((prev) => {
      const filtered = prev.filter((drug) => drug._id !== drugId);
      details = filtered;
      return filtered;
    });

    //recalculate subtotal on delete
    const subtotal = getSubTotal(details);

    setValues({
      ...values,
      cost: {
        ...values.cost,
        subTotalCost: subtotal,
      },
    });
  };

  return (
    <>
      <Stack spacing={3} width="100%">
        <Stack
          spacing={1}
          width={{
            xs: "100%",
            sm: "60%",
          }}
          p={2}
          sx={{
            backgroundColor: "background.lightBlue",
          }}
        >
          <CustomTextInput
            title="Title"
            value={values.title}
            name="title"
            placeholder={"Enter title"}
            handleChange={handleChange}
            boxSx={{ width: "100%" }}
          />

          <CustomDatePicker
            type="date"
            views={["year", "month", "day"]}
            placeholder="When do you need this?"
            size="small"
            datePickerSx={{ width: "100%" }}
            setdate={handleSelectDate}
            disableFuture={false}
            date={values.dueDate}
            name="dueDate"
            title="Due Date"
          />
        </Stack>
        <>
          <Typography variant="heading">Drug Details</Typography>
          <Stack
            spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={2}
            sx={{
              border: "1px dashed rgba(0,0,0,0.2)",
            }}
          >
            {selectedProducts.map((detail, i) => (
              <DrugDetail
                key={detail._id}
                detail={detail}
                i={i}
                handleChangeDetail={handleChangeDetail}
                handleDelete={handleDeleteDrugDetail}
              />
            ))}
            <Stack spacing={1} width={"fit-content"}>
              <Typography variant="heading">Add from Drug List</Typography>
              <CustomButton
                text="Select from existing list"
                variant="custom"
                rgb="255, 129, 96"
                startIcon={
                  <AddCircleIcon sx={{ color: "rgb(255, 129, 96)" }} />
                }
                onClick={toggleModal}
              />
            </Stack>
          </Stack>
        </>

        <>
          <Typography variant="heading">Cost</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={2}
            sx={{
              border: "1px dashed rgba(0,0,0,0.2)",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Sub-Total Cost"
                  // value={getSubTotal(selectedProducts)}
                  value={values.cost.subTotalCost}
                  placeholder={"Enter quantity"}
                  disabled="true"
                  type="number"
                  inputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Shipping Cost"
                  value={values.cost.shippingCost}
                  placeholder={"Enter quantity"}
                  name="cost.shippingCost"
                  handleChange={handleChange}
                  type="number"
                  inputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Sales Tax"
                  value={values.cost.salesTax}
                  placeholder={"Enter quantity"}
                  name="cost.salesTax"
                  handleChange={handleChange}
                  type="number"
                  inputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextInput
                  title="Grand Total"
                  value={
                    +values.cost.subTotalCost +
                      +values.cost.shippingCost +
                      +values.cost.salesTax || 0
                  }
                  placeholder={"Enter quantity"}
                  disabled="true"
                />
              </Grid>
            </Grid>
          </Stack>
        </>

        <>
          <Typography variant="heading">Requester</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={2}
            sx={{
              border: "1px dashed rgba(0,0,0,0.2)",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Requester"
                  value={state?.user?.fullName}
                  disabled="true"
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Requesters Note"
                  value={values.requesterNote}
                  placeholder={"Enter quantity"}
                  name="requesterNote"
                  handleChange={handleChange}
                  multiline
                />
              </Grid>
            </Grid>
          </Stack>
        </>

        <>
          <Typography variant="heading">Vendor Details</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={3}
            sx={{
              backgroundColor: "background.custom",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={8}>
                <CustomSelect
                  label="Select Vendor"
                  options={vendors}
                  state={values.vendor}
                  handleChange={handleSelectVendor}
                  name="vendor"
                  placeholder="Select"
                  haveTopLabel
                />
              </Grid>

              {values.vendor && (
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextInput
                      title="Vendor Name"
                      value={values?.vendorDetails?.vendorDetails?.vendorName}
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextInput
                      title="Address"
                      value={values?.vendorDetails?.vendorDetails?.address}
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextInput
                      title="Phone Number"
                      value={values?.vendorDetails?.contactPerson?.phoneNumber}
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextInput
                      title="Bank Name"
                      value={values?.vendorDetails?.paymentDetails?.bankName}
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextInput
                      title="Account Number"
                      value={
                        values?.vendorDetails?.paymentDetails?.accountNumber
                      }
                      disabled="true"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextInput
                      title="Account Name"
                      value={values?.vendorDetails?.paymentDetails?.accountName}
                      disabled="true"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Stack>
        </>

        <>
          <Typography variant="heading">Shipping Details</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={3}
            sx={{
              backgroundColor: "background.custom",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Address"
                  value={values.shippiongDetails.address}
                  placeholder="Enter Shipper’s Address here"
                  name="shippiongDetails.address"
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Phone Number"
                  value={values.shippiongDetails.phoneNumber}
                  placeholder="Enter Shipper’s Phone number here"
                  name="shippiongDetails.phoneNumber"
                  handleChange={handleChange}
                />
              </Grid>
            </Grid>
          </Stack>
        </>
        <>
          <Typography variant="heading">Additional information</Typography>
          <Stack
            // spacing={3}
            width={{
              xs: "100%",
              sm: "75%",
            }}
            p={3}
            sx={{
              backgroundColor: "background.custom",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Notes"
                  value={values.additionalInfo}
                  placeholder="Type the product name here"
                  name="additionalInfo"
                  handleChange={handleChange}
                  multiline
                />
              </Grid>
            </Grid>
          </Stack>
        </>
        <Box>
          <CustomButton
            disabled={createReqLoading}
            onClick={createReq}
            text="Create Requisition Form"
            color="secondary"
          />
        </Box>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          width: {
            xs: "90vw",
            sm: "40vw",
          },
        }}
        ariaLabel="modal"
      >
        <DrugListModal
          onClose={toggleModal}
          selectedProducts={selectedProducts}
          setselectedProducts={setselectedProducts}
        />
      </CustomModal>
    </>
  );
}

export default CreateRequistionModal;
