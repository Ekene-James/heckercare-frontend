import { Grid } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CustomSwitch from "components/atoms/Switch";
import UploadBoard from "components/atoms/UploadBoard";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_ALL_DEPARTMENT_INVENTORY } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";

const unitType = [
  "TABLET",
  "VIAL",
  "PIECE",
  "CAPSULE",
  "SYRUP",
  "INJECTION",
  "DROPS",
  "GEL",
  "OINTMENT",
  "LOTION",
  "CREAM",
  "PASTE",
  "SOLUTION",
  "SUSPENSION",
  "EMULSION",
  "LIQUID",
  "PILL",
  "CARTON",
  "BOTTLE",
  "PACKET",
  "BOX",
  "BAG",
  "CAN",
  "TUBE",
  "BOTTLE_OF_100",
  "BOTTLE_OF_500",
  "BOTTLE_OF_1000",
];

function CreateOrUpdateStockForm({ editData, closeHandler }) {
  const [image, setImage] = useState(null);
  const queryClient = useQueryClient();

  const { handleBlur, handleChange, values } = useFormik({
    initialValues: editData || {},
    validate: (values) => {},
    enableReinitialize: true,
  });

  const {
    mutate: handleCreateItem,
    isLoading: handleCreateItemLoading,
    refetch: refetchItemList,
  } = useCustomMutation(
    {
      url: `/itemproduct/create-item-product`,
      method: "post",
      data: {
        ...values,
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_ALL_DEPARTMENT_INVENTORY]);
        toast.success("Success");
        // refetchTests();

        closeHandler();
      },

      onError: (error) => toast.error(error.message),
    }
  );

  useEffect(() => {
    setImage({
      file: null,
      b64: editData?.image_url,
    });
  }, [editData]);
  return (
    <Grid
      container
      alignItems="flex-start"
      justifyContent="space-between"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Grid container xs={12} md={7} spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Item name"
            value={values.itemName}
            required
            name="itemName"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in item name here"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Item type"
            value={values.itemType}
            required
            name="itemType"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={unitType}
            label="Unit type"
            value={values.unitType}
            name="unitType"
            required
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select from the options"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{}}>
          <CustomTextInput
            title="Available quantity"
            type="number"
            value={values.availableQuantity}
            name="availableQuantity"
            required
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Brand name"
            value={values.brandName}
            required
            name="brandName"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Unit cost"
            value={values.unitCost}
            type="number"
            required
            name="unitCost"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
          />
        </Grid>

        <Grid item xs={12} sm={12} sx={{}}>
          <CustomTextInput
            title="Item Description"
            value={values.itemDescription}
            required
            name="itemDescription"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
            multiline
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          {image?.b64 ? (
            <img src={image?.b64} alt="medicine" />
          ) : (
            <UploadBoard
              title={
                <label
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>Upload an Image</span>
                  <span style={{ color: "#979797" }}>
                    (Kindly upload a clear picture in .png or .jpg format)
                  </span>
                </label>
              }
              onAddImg={(fileArr) => {
                setImage({
                  file: fileArr[0].file || fileArr[0],
                  b64: fileArr[0].b64,
                });
                console.log(fileArr);
              }}
            />
          )}
        </Grid>

        <CustomButton
          text={"Create"}
          variant="contained"
          color="secondary"
          disabled={handleCreateItemLoading}
          sx={{
            marginTop: "16px",
            marginRight: "10px",
          }}
          onClick={handleCreateItem}
        />
        <CustomButton
          text={"Cancel"}
          variant="containedBrown"
          color="primary"
          sx={{
            marginTop: "16px",
            marginLeft: "10px",
          }}
          onClick={closeHandler}
        />
      </Grid>
    </Grid>
  );
}

export default CreateOrUpdateStockForm;
