import { Box, Grid, Stack } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useFormik } from "formik";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { handleErrorProps } from "utils/handleErrorProps";
import {
  GET_PENDING_REQUEST,
  SEARCH_BATCH,
  SEARCH_PRODUCTS,
} from "utils/reactQueryKeys";

const initialValues = {
  quantity: 0,
  batchNumber: "",
  expiryDate: "",
  purchasePrice: 0,
  sellingPrice: 0,
  product: "",
};

const requireFields = [
  "quantity",
  "batchNumber",
  "expiryDate",
  "purchasePrice",
  "sellingPrice",
  // "product",
];

const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    if (!values[field]) return (errors[field] = "Required");
  });

  return errors;
};

function AddBatchToProduct({ closeModal }) {
  const queryClient = useQueryClient();
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

  const [searchProducts, setsearchProducts] = React.useState("");
  const [onSelectProduct, setonSelectProduct] = React.useState(false);
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

  //post  {prescription}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/product/add-existing-batch`,
      method: "post",
      avoidCancelling: true,
      data: [values],
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries([GET_PENDING_REQUEST]);

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

  //search batch

  const { data: batch } = useCustomQuery(
    [SEARCH_BATCH, values?.product],
    {
      url: `/product/get-batch-product/${values?.product}`,

      method: "get",
    },
    {
      refetchOnWindowFocus: true,

      enabled: !!values.product,
    }
  );

  const handleProductOnselect = (res) => {
    setonSelectProduct(true);
    setValues((prev) => ({ ...prev, product: res._id }));

    setsearchProducts(`${res?.drugName}`);
  };

  const handleSearchProductOnChange = (text) => {
    setonSelectProduct(false);

    setsearchProducts(text);
  };
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
  const onClickSave = () => {
    let emptyRequiredFieldNumber = 0;

    requireFields.forEach((field) => {
      emptyRequiredFieldNumber =
        values[field] === ""
          ? emptyRequiredFieldNumber + 1
          : emptyRequiredFieldNumber;
      setFieldTouched(field, true, true);
    });

    if (emptyRequiredFieldNumber > 0) return;
    if (!values.product) return toast.error("Please select a drug");
    if (batch?.data?.count > 0)
      return toast.error(
        "You can not add batch to a products with batch in it."
      );
    //make api calls
    mutate();
  };

  return (
    <Stack spacing={2}>
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
        <Grid item xs={12} sm={12}>
          <SearchDropdown
            placeholder="Enter Drug Name or Select from the dropdown"
            handleOnselect={handleProductOnselect}
            title="Medicine/Drug Name"
            boxSx={{ width: "100%" }}
            data={products?.data?.products}
            setOnSelect={setonSelectProduct}
            isLoading={productsLoading}
            search={searchProducts}
            setsearch={handleSearchProductOnChange}
            reFetch={refetchProducts}
            traySx={{ minWidth: "25vw", bottom: "-125px" }}
            trayItemKeys={["drugName", "brandName", "availableQuantity"]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Batch Number"
            value={values.batchNumber}
            name="batchNumber"
            handleChange={handleChange}
            placeholder="Enter batch Number"
            {...handleErrorProps(touched.batchNumber, errors.batchNumber)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            type="date"
            views={["year", "month", "day"]}
            title="Expiry Date"
            placeholder="Enter Expiry Date"
            disableFuture={false}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            name="expiryDate"
            id="expiryDate"
            setdate={handleSelectDate}
            date={values?.expiryDate}
            onOpen={dateBlur.bind(this, "expiryDate")}
            {...handleErrorProps(touched?.expiryDate, errors?.expiryDate)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Quantity"
            value={values.quantity}
            name="quantity"
            handleChange={handleChange}
            placeholder="Enter quantity"
            {...handleErrorProps(touched.quantity, errors.quantity)}
            onBlur={handleBlur}
            type="number"
            inputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Purchase Price"
            value={values.purchasePrice}
            name="purchasePrice"
            handleChange={handleChange}
            placeholder="Enter Purchase Price"
            {...handleErrorProps(touched.purchasePrice, errors.purchasePrice)}
            onBlur={handleBlur}
            type="number"
            inputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Selling Price"
            value={values.sellingPrice}
            name="sellingPrice"
            handleChange={handleChange}
            placeholder="Enter Selling Price"
            {...handleErrorProps(touched.sellingPrice, errors.sellingPrice)}
            onBlur={handleBlur}
            type="number"
            inputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
      </Grid>
      <Box>
        <CustomButton
          text="Save"
          variant="contained"
          color="secondary"
          sx={{ minWidth: "20%" }}
          onClick={onClickSave}
          disabled={isLoading}
        />
      </Box>
    </Stack>
  );
}

export default AddBatchToProduct;
