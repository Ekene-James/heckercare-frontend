import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import React from "react";
import ListIcon from "@mui/icons-material/List";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import BackButton from "components/atoms/BackButton";

const options = ["Store 1", "Store 2"];

function AddNewPrescription() {
  const [PrescriptionList, setPrescriptionList] = React.useState([
    {
      store: "Store 1",
      brandName: "Paracetamol",
      uniqueCode: "123",
      genericName: "",
      frequency: "",
      days: "",
      foodRelation: "",
      instructions: "Take before waking up",
      rateOfAdmin: "",
      id: uuidv4(),
    },
    {
      store: "Store 2",
      brandName: "Panadol",
      uniqueCode: "12345",
      genericName: "",
      frequency: "",
      days: "",
      foodRelation: "",
      instructions: "Take before waking up",
      rateOfAdmin: "",
      id: uuidv4(),
    },
  ]);
  const [formsState, setformsState] = React.useState({
    store: "",
    brandName: "",
    uniqueCode: "",
    genericName: "",
    frequency: "",
    days: "",
    foodRelation: "",
    instructions: "",
    rateOfAdmin: "",
  });

  const handleChange = (e) => {
    setformsState({
      ...formsState,
      [e.target.name]: e.target.value,
    });
  };
  const date = new Date();
  const clearState = () =>
    setformsState({
      store: "",
      brandName: "",
      uniqueCode: "",
      genericName: "",
      frequency: "",
      days: "",
      foodRelation: "",
      instructions: "",
      rateOfAdmin: "",
    });

  const handleEdit = (pres) => {
    setformsState(pres);
  };
  const handleDelete = (id) => {
    const newState = PrescriptionList.filter((pres) => pres.id !== id);
    setPrescriptionList(newState);

    clearState();
  };
  const handleAdd = () => {
    setPrescriptionList([...PrescriptionList, { ...formsState, id: uuidv4() }]);

    clearState();
  };
  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"space-between"}
        sx={{ width: "100%", mb: 3 }}
      >
        <BackButton />
        <Typography sx={{ color: "gray" }}>
          {" "}
          {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
        </Typography>
      </Stack>

      <CustomSelect
        options={options}
        label="Pharmaceutical Store"
        state={formsState.store}
        handleChange={handleChange}
        name="store"
        haveTopLabel={true}
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
          },
        }}
      />
      <Stack direction="column" spacing={1} sx={{ mt: 2, mb: 2 }}>
        {PrescriptionList.map((Prescription, i, arr) => (
          <Stack
            sx={{
              width: {
                xs: "100%",
                sm: "80%",
              },
              p: 1,
              borderBottom: i !== arr.length - 1 && "1px solid rgba(0,0,0,0.2)",
            }}
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
            spacing={1}
            key={Prescription.id}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {Prescription.brandName}
            </Typography>
            <Stack direction="row" spacing={1}>
              <CustomButton
                text={"Edit"}
                variant="custom"
                rgb="10, 132, 255"
                endIcon={<CreateIcon />}
                onClick={handleEdit.bind(this, Prescription)}
              />
              <CustomButton
                text={"Delete"}
                color="error"
                endIcon={<DeleteIcon />}
                onClick={handleDelete.bind(this, Prescription.id)}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Grid
        container
        spacing={1}
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
          },
        }}
      >
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Brand name"
            value={formsState.brandName}
            name="brandName"
            handleChange={handleChange}
            placeholder="Enter brand name here"
            inputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ListIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Unique Code"
            value={formsState.uniqueCode}
            name="uniqueCode"
            handleChange={handleChange}
            placeholder="Enter unique code if applicable"
            inputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ListAltIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={["Paracetamol", "Panadol"]}
            label="Generic Name"
            state={formsState.genericName}
            handleChange={handleChange}
            name="genericName"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={options}
            label="Frequency"
            state={formsState.frequency}
            handleChange={handleChange}
            name="frequency"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={options}
            label="Route of administration(e.g Oral/Injection)"
            state={formsState.rateOfAdmin}
            handleChange={handleChange}
            name="rateOfAdmin"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={options}
            label="Days"
            state={formsState.days}
            handleChange={handleChange}
            name="days"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={options}
            label="Food Relation"
            state={formsState.foodRelation}
            handleChange={handleChange}
            name="foodRelation"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            title="Instructions"
            value={formsState.instructions}
            name="instructions"
            handleChange={handleChange}
            placeholder="Add an instruction"
            multiline={true}
          />
        </Grid>
      </Grid>
      <CustomButton
        text={"Add"}
        color="secondary"
        sx={{ mt: 2 }}
        startIcon={<AddIcon />}
        onClick={handleAdd}
      />
      <Stack
        direction={"row"}
        spacing={1}
        sx={{ mt: 3, width: { xs: "100%", sm: "40%" } }}
      >
        <CustomButton text={"Save"} color="secondary" sx={{ width: "100%" }} />
        <CustomButton
          text={"Cancel"}
          variant="containedBrown"
          sx={{ width: "100%" }}
        />
      </Stack>
    </Paper>
  );
}

export default AddNewPrescription;
