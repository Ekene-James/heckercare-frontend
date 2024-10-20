import { Grid, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import UploadBoardWithOverlay from "components/atoms/UploadBoardWithOverlay";
import { useFormik } from "formik";
import moment from "moment";
import React, { useCallback } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { handleErrorProps } from "utils/handleErrorProps";
import { GET_HOSPITAL_DETAILS } from "utils/reactQueryKeys";
const initialValues = {
  name: "",
  address: "",
  phone: "",
  email: "",
  filename: null,

  weekendOpeningHours: null,
  weekDayOpeningHours: null,
  weekDayClosingHours: null,
  weekendClosingHours: null,
};
const requireFields = [
  "name",
  "address",
  "phone",
  "email",
  "weekendOpeningHours",
  "weekDayOpeningHours",
  "weekDayClosingHours",
  "weekendClosingHours",
];
const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.address) {
    errors.address = "Required";
  }

  if (!values.phone) {
    errors.phone = "Required";
  }
  if (!values.email) {
    errors.email = "Required";
  }
  if (!values.weekendClosingHours) {
    errors.weekendClosingHours = "Required";
  }
  if (!values.weekDayClosingHours) {
    errors.weekDayClosingHours = "Required";
  }
  if (!values.weekDayOpeningHours) {
    errors.weekDayOpeningHours = "Required";
  }
  if (!values.weekendOpeningHours) {
    errors.weekendOpeningHours = "Required";
  }

  return errors;
};
function HospitalDetailsModal({ hospitalDetails, closeModal }) {
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
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();

  React.useMemo(() => {
    if (Object.keys(hospitalDetails).length) {
      setValues({
        name: hospitalDetails?.name || "",
        address: hospitalDetails?.address || "",
        phone: hospitalDetails?.phone || "",
        email: hospitalDetails?.email || "",
        filename: hospitalDetails?.picture || null,

        weekendOpeningHours: hospitalDetails?.weekendOpeningHours || null,
        weekDayOpeningHours: hospitalDetails?.weekDayOpeningHours || null,
        weekDayClosingHours: hospitalDetails?.weekDayClosingHours || null,
        weekendClosingHours: hospitalDetails?.weekendClosingHours || null,
      });
    }
  }, [hospitalDetails, setValues]);

  //add hospital profile
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/admin/hospital-profile`,
      method: "post",
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_HOSPITAL_DETAILS]);
        toast.success("Success");
        closeModal();
      },
      onError: (error) => {
        if (typeof error?.message === "object") {
          return error?.message?.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );
  //edit hospital profile
  const { mutate: editHospital, isLoading: editHospitalLoading } =
    useCustomMutation(
      {
        url: `/admin/hospital-profile/${hospitalDetails?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_HOSPITAL_DETAILS]);
          toast.success("Success");
          closeModal();
        },
        onError: (error) => {
          if (typeof error?.message === "object") {
            return error?.message?.map((msg) => toast.error(msg));
          }
          return toast.error(error.message);
        },
      }
    );

  const onSave = () => {
    let emptyRequiredFieldNumber = 0;

    requireFields.forEach((field) => {
      if (!values[field]) {
        emptyRequiredFieldNumber = emptyRequiredFieldNumber + 1;
        setFieldTouched(field, true, true);
      }
    });

    if (emptyRequiredFieldNumber > 0)
      return toast.error("Please fill all fields");
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      //if image is uploaded already and its not been updated to a new image from local file, dont add the 'filename field'
      if (key === "filename" && typeof value === "string") return;
      formData.append(key, value);
    });
    hospitalDetails?._id ? editHospital(formData) : mutate(formData);
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

  const onAddImg = (files) => {
    setValues((prev) => ({ ...prev, filename: files[0] }));
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="displaySm">Hospital Details</Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography sx={{ fontWeight: "bold" }}>Image</Typography>
        <UploadBoardWithOverlay onAddImg={onAddImg} apiImg={values?.filename} />
      </Stack>

      <Grid container spacing={1}>
        <Grid item xs={12} md={10}>
          <CustomTextInput
            value={values.name}
            name="name"
            handleChange={handleChange}
            placeholder="Enter Hospital Name"
            title="Hospital Name"
            {...handleErrorProps(touched.name, errors.name)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} md={10}>
          <CustomTextInput
            value={values.address}
            name="address"
            handleChange={handleChange}
            placeholder="Enter Hospital Address"
            title="Hospital Address"
            {...handleErrorProps(touched.address, errors.address)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CustomTextInput
            value={values.email}
            name="email"
            handleChange={handleChange}
            placeholder="Enter Hospital Email"
            type="email"
            title="Email"
            {...handleErrorProps(touched.email, errors.email)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CustomTextInput
            value={values.phone}
            name="phone"
            handleChange={handleChange}
            placeholder="Enter Hospital Phone Number"
            title="Phone Number"
            {...handleErrorProps(touched.phone, errors.phone)}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} mt={4}>
          <Typography variant="heading">Working Hours</Typography>
        </Grid>
        <Grid item xs={12} mt={3}>
          <Typography sx={{ fontWeight: "bold" }}>WeekDays</Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          <CustomDatePicker
            type="time"
            title="Opening hours"
            placeholder="Enter Time Here"
            name="weekDayOpeningHours"
            date={values?.weekDayOpeningHours}
            setdate={handleSelectDate}
            disableFuture={true}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            required
            {...handleErrorProps(
              touched.weekDayOpeningHours,
              errors.weekDayOpeningHours
            )}
            onOpen={dateBlur.bind(this, "weekDayOpeningHours")}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CustomDatePicker
            type="time"
            title="Closing Hours"
            placeholder="Enter Time Here"
            name="weekDayClosingHours"
            date={values?.weekDayClosingHours}
            setdate={handleSelectDate}
            disableFuture={true}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            required
            {...handleErrorProps(
              touched.weekDayClosingHours,
              errors.weekDayClosingHours
            )}
            onOpen={dateBlur.bind(this, "weekDayClosingHours")}
          />
        </Grid>
        <Grid item xs={12} mt={3}>
          <Typography sx={{ fontWeight: "bold" }}>
            Weekends / Holidays
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <CustomDatePicker
            type="time"
            title="Opening hours"
            placeholder="Enter Time Here"
            name="weekendOpeningHours"
            date={values?.weekendOpeningHours}
            setdate={handleSelectDate}
            disableFuture={true}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            required
            {...handleErrorProps(
              touched.weekendOpeningHours,
              errors.weekendOpeningHours
            )}
            onOpen={dateBlur.bind(this, "weekendOpeningHours")}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CustomDatePicker
            type="time"
            title="Closing hours"
            placeholder="Enter Time Here"
            name="weekendClosingHours"
            date={values?.weekendClosingHours}
            setdate={handleSelectDate}
            disableFuture={true}
            datePickerRootSx={{ height: "auto" }}
            datePickerSx={{ width: "100%" }}
            required
            {...handleErrorProps(
              touched.weekendClosingHours,
              errors.weekendClosingHours
            )}
            onOpen={dateBlur.bind(this, "weekendClosingHours")}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack
            direction={"row"}
            spacing={1}
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
              mt: 5,
            }}
          >
            <CustomButton
              text="Save Changes"
              variant="contained"
              color="secondary"
              sx={{ width: "50%" }}
              onClick={onSave}
              disabled={isLoading || editHospitalLoading}
            />
            <CustomButton
              text="Cancel"
              variant="containedBrown"
              sx={{ width: "50%" }}
              onClick={closeModal}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default HospitalDetailsModal;
