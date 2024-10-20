import { Grid } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import CustomSwitch from "components/atoms/Switch";
import UploadBoard from "components/atoms/UploadBoard";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

function MedicineDetails({ editData }) {
  const [image, setImage] = useState(null);
  const { handleBlur, handleChange, values } = useFormik({
    initialValues: editData || {},
    validate: (values) => {},
    enableReinitialize: true,
  });
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
        <Grid item xs={12}>
          <CustomSelect
            options={["Male", "Female", "Other"]}
            label="Medicine name"
            value={values.medicine_name}
            name="medicine_name"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select from the list or type in a new stack"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomSelect
            options={["Male", "Female", "Other"]}
            label="Manufacturers Name"
            value={values.manufacturers_name}
            name="manufacturers_name"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select from the list"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomSelect
            options={["Blue", "Red", "Other"]}
            label="Shelf"
            value={values.shelf}
            name="shelf"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select from the list"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={["Male", "Female", "Other"]}
            label="Unit type (mg, ml, pcs, )"
            value={values.unit_type}
            name="unit_type"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select from the options"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{}}>
          <CustomSelect
            options={["Male", "Female", "Other"]}
            label="Medicine Type"
            state={values.medicine_type}
            handleChange={handleChange}
            onBlur={handleBlur}
            name="medicine_type"
            placeholder="Select from the options"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={["Male", "Female", "Other"]}
            label="Category"
            value={values.category}
            name="category"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select from list"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{}}>
          <CustomTextInput
            title="Quantity (in number)"
            value={values.quantity}
            name="quantity"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Price"
            value={values.price}
            name="price"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{}}>
          <CustomTextInput
            title="Manufacturers Price"
            value={values.purchase_price}
            name="purchase_price"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{}}>
          <CustomTextInput
            title="Description"
            value={values.quantity}
            name="quantity"
            handleChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{}}>
          <CustomDatePicker
            title="Expiry Date"
            value={values.expiry_date}
            name="expiry_date"
            setdate={handleChange}
            onBlur={handleBlur}
            placeholder="Type in number here"
            type="date"
            views={["year", "month", "day"]}
            size="small"
            lightBorder={true}
            disableFuture={false}
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
          text={"Update"}
          variant="contained"
          color="secondary"
          sx={{
            marginTop: "16px",
            marginLeft: "0px",
          }}
        />
      </Grid>
    </Grid>
  );
}

export default MedicineDetails;
