import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import BackButton from "components/atoms/BackButton";
import CustomSelect from "components/atoms/Select";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import StarIcon from "@mui/icons-material/Star";
import { useParams } from "react-router-dom";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";
import GenerateReceiptModal from "components/molecules/accounting/modal/GenerateReceiptModal";
import CustomCheckbox from "components/atoms/CustomCheckbox";
function TransactionDetail() {
  let { transactionId } = useParams();
  const modalRef = React.useRef(null);
  const [formState, setformState] = React.useState({
    requestId: "1234",
    patientsName: "",
    service: "",
    department: "",
    requesters: "",
  });
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleChange = (e) =>
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  return (
    <>
      <Stack direction="column" spacing={2} sx={{ mt: 0 }}>
        <Stack direction="row" spacing={1}>
          <BackButton showText={false} />
          <Typography variant="displayMd">Transaction</Typography>
        </Stack>
        <Paper sx={{ p: 2 }}>
          <Stack
            direction="column"
            spacing={2}
            sx={{ width: { xs: "100%", md: "72%", lg: "57%" } }}
          >
            <Typography variant="displaySm">Transaction Details</Typography>

            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="" sx={{ fontWeight: "bold" }}>
                  Request ID
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomSelect
                  options={["1234"]}
                  state={formState.requestId}
                  handleChange={handleChange}
                  name="requestId"
                  placeholder="Select ID"
                  label=""
                  haveTopLabel={true}
                  readOnly
                />
              </Grid>
            </Grid>

            <Stack
              direction="row"
              justifyContent={"space-between"}
              sx={{
                width: "100%",
                p: 2,
                backgroundColor: "rgba(255, 129, 96, 0.1)",
                border: "0.3px dashed black",
              }}
              spacing={1}
            >
              <Typography sx={{ fontWeight: "bold" }} variant="caption">
                Amount To pay
              </Typography>
              <Typography sx={{ fontWeight: "bold" }} variant="heading">
                ₦65,000.00
              </Typography>
            </Stack>

            <CustomTextInput
              title="Patient Name"
              value={formState.patientsName}
              name="patientsName"
              handleChange={handleChange}
              placeholder="Type in patients name here"
              readOnly
            />
            <CustomTextInput
              title="Service/Order"
              value={formState.service}
              name="service"
              handleChange={handleChange}
              placeholder="Type in service/order here"
            />
            <Grid container spacing={1} sx={{ p: 0, pr: 1 }}>
              <Grid item xs={12} sm={6}>
                <CustomSelect
                  options={["Dep1", "dept2"]}
                  state={formState.department}
                  handleChange={handleChange}
                  name="department"
                  placeholder="Select department"
                  haveTopLabel={true}
                  label="Department "
                  boxSx={{ pt: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomDatePicker
                  title="Date/Time"
                  type="dateAndtime"
                  datePickerRootSx={{ height: "auto" }}
                  datePickerSx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                />
              </Grid>
            </Grid>

            <CustomTextInput
              title="Requesters"
              value={formState.requesters}
              name="requesters"
              handleChange={handleChange}
              placeholder="Type in requester here"
            />

            <Typography
              sx={{ position: "relative", width: "fit-content" }}
              variant="displaySm"
            >
              Payment Method
              <StarIcon
                sx={{
                  color: "red",
                  fontSize: "8px",
                  position: "absolute",
                  right: -10,
                  top: 0,
                }}
              />
            </Typography>

            <Typography sx={{ opacity: 0.5 }} variant="small">
              Select a payment method to complete the transaction
            </Typography>
            <Grid container spacing={0.5} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <CustomButton
                  text="Health Maintenance Organization (HMO)"
                  variant="outlined"
                  sx={{ border: "1px solid black", color: "primary.main" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomButton
                  text="Cash Payment / POS Unit"
                  variant="outlined"
                  sx={{ border: "1px solid black", color: "primary.main" }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomButton
                  text="Insurance"
                  variant="outlined"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  title="Insurance ID"
                  value={formState.insuranceId}
                  name="insuranceId"
                  handleChange={handleChange}
                  placeholder="Type in Insurance ID here"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomSelect
                  options={["insurance period a", "insurance period b"]}
                  state={formState.insuranceType}
                  handleChange={handleChange}
                  name="insuranceType"
                  placeholder="Select insurance type"
                  haveTopLabel={true}
                  label="Insurance Type "
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  p: 1,
                  border: "0.2px solid rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  borderRadius: "5px",
                }}
              >
                <CustomCheckbox
                  desc=""
                  checkColor="secondary.main"
                  onClick={(state) => console.log(state)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  p: 1,
                  border: "0.2px solid rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  borderRadius: "5px",
                }}
              >
                <CustomCheckbox
                  desc=""
                  checkColor="secondary.main"
                  onClick={(state) => console.log(state)}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextInput
                  title="Payment Amount"
                  value={formState.paymentAmount}
                  name="paymentAmount"
                  handleChange={handleChange}
                  placeholder="Type in payment amount here"
                  required
                />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={1}>
              <CustomButton
                text="Generate Receipt"
                color="secondary"
                onClick={toggleModal}
              />
              <CustomButton
                text="Cancel Order"
                variant="outlined"
                sx={{ border: "1px solid black", color: "primary.main" }}
              />
            </Stack>
          </Stack>
        </Paper>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "95%",
            sm: "50vw",
          },
        }}
        ariaLabel="generate-receipt-modal"
      >
        <GenerateReceiptModal toggleModal={toggleModal} />
      </CustomModal>
    </>
  );
}

export default TransactionDetail;
