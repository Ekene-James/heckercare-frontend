import { Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import ImageUpload from "components/atoms/ImageUpload";
import CustomSelect from "components/atoms/Select";
import { useFormik } from "formik";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { handleErrorProps } from "utils/handleErrorProps";
import {
  GET_ALL_PHARMACY_PRODUCTS,
  GET_DRUG_TYPES,
  GET_PHARMACY_GENERICS,
} from "utils/reactQueryKeys";
const initialValues = {
  drugName: "",
  drugType: "",
  unit: "",
  genericName: "",
  strength: "",
  // availableQuantity: "",
  brandName: "",
  prodcutDescription: "",
  filename: "",
};

const requireFields = [
  "drugName",
  "drugType",
  "unit",
  "genericName",
  "strength",
  // "availableQuantity",
  "brandName",
];
const validate = (values) => {
  const errors = {};

  requireFields.forEach((field) => {
    if (!values[field]) return (errors[field] = "Required");
  });

  return errors;
};
const formatData = (data) => {
  if (!data.filename) {
    delete data.filename;
    return data;
  }
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};
function CreateNewProductModal({ closeModal }) {
  const queryClient = useQueryClient();
  const {
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
    setFieldTouched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues,
    validate: (values) => validate(values),
  });
  //get drug types
  const { data: drugTypes } = useCustomQuery(
    GET_DRUG_TYPES,
    {
      url: `/drugtype/getall`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.map((drug) => {
          return { name: drug.name, value: drug._id };
        });
        return formartedData;
      },
    }
  );

  //get pharmacy generics
  const { data: genericNames } = useCustomQuery(
    GET_PHARMACY_GENERICS,
    {
      url: `/generic/getall`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formartedData = data.data.map((generic) => {
          return { name: generic.activeIngredient, value: generic._id };
        });
        return formartedData;
      },
    }
  );

  //create product
  const { mutate: createProduct, isLoading: createProductLoading } =
    useCustomMutation(
      {
        url: `/product/create`,
        method: "post",
        data: formatData(values),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [GET_ALL_PHARMACY_PRODUCTS],
          });
          toast.success("Success");
          resetForm();
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
    createProduct();
  };

  const onAddImg = (file) => {
    setValues((prev) => {
      return {
        ...prev,
        filename: file[0],
      };
    });
  };

  return (
    <Stack spacing={2}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Drug Name"
            value={values.drugName}
            placeholder={"Enter drug name"}
            handleChange={handleChange}
            name="drugName"
            {...handleErrorProps(touched.drugName, errors.drugName)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={drugTypes}
            label="Drug Type"
            state={values.drugType}
            handleChange={handleChange}
            name="drugType"
            haveTopLabel={true}
            placeholder="Select"
            {...handleErrorProps(touched.drugType, errors.drugType)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={["TABLET", "VIAL", "PIECE", "CAPSULE"]}
            state={values.unit}
            handleChange={handleChange}
            name="unit"
            placeholder="Select units"
            boxSx={{
              width: {
                xs: "100%",
              },
            }}
            label="Unit"
            haveTopLabel
            {...handleErrorProps(touched.unit, errors.unit)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={genericNames}
            label="Generic Name"
            state={values.genericName}
            handleChange={handleChange}
            name="genericName"
            haveTopLabel={true}
            placeholder="Select"
            {...handleErrorProps(touched.genericName, errors.genericName)}
            onBlur={handleBlur}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Available Quantity"
            value={values.availableQuantity}
            name="availableQuantity"
            placeholder={"Enter number here"}
            handleChange={handleChange}
            {...handleErrorProps(
              touched.availableQuantity,
              errors.availableQuantity
            )}
            onBlur={handleBlur}
          />
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Brand Name"
            value={values.brandName}
            name="brandName"
            placeholder={"Enter text here"}
            handleChange={handleChange}
            {...handleErrorProps(touched.brandName, errors.brandName)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Drug Strength"
            value={values.strength}
            name="strength"
            placeholder={"Enter text here"}
            handleChange={handleChange}
            {...handleErrorProps(touched.strength, errors.strength)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            title="Product Description"
            value={values.prodcutDescription}
            name="prodcutDescription"
            placeholder={"Enter text here"}
            handleChange={handleChange}
            multiline
            helperText={`${values.prodcutDescription.length}/250`}
          />
        </Grid>
      </Grid>

      <Stack spacing={1} width="fit-content">
        <Typography variant="heading">Add Image</Typography>
        <ImageUpload
          imgTitle=""
          imgStyle={{ borderRadius: "0%" }}
          onAddImg={onAddImg}
          blanckImg="/imgs/black-solid-icon-medicine.jpg"
        />
      </Stack>
      <Stack spacing={1} direction="row" width="fit-content">
        <CustomButton
          text={"Create"}
          color="secondary"
          onClick={onClickSave}
          disabled={createProductLoading}
        />
        <CustomButton
          text={"Cancel"}
          variant="containedBrown"
          onClick={closeModal}
        />
      </Stack>
    </Stack>
  );
}

export default CreateNewProductModal;
