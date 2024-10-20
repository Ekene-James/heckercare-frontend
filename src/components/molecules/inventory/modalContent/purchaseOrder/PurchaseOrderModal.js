import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomDatePicker from "components/atoms/DatePicker";
import CustomSelect from "components/atoms/Select";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import CustomModal from "components/atoms/CustomModal";
import ExistingListModal from "./ExistingListModal";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentsContainer from "./ContentsContainer";
import { cost, data, shippingDetails, vendorDetails } from "./data";

function PurchaseOrderModal() {
  const modalRef = React.useRef(null);
  const [selectedItems, setselectedItems] = React.useState([]);
  const [formState, setformState] = React.useState({
    category: "",
    vendor: "",

    title: "",
  });

  const handleChange = (e) =>
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  const handleListClick = (list) => {
    setselectedItems([...selectedItems, list]);
  };
  const handleDeleteList = (id) => {
    const filtered = selectedItems.filter((list) => list.id !== id);
    setselectedItems(filtered);
  };
  return (
    <Stack
      direction={"column"}
      sx={{ width: "100%" }}
      spacing={3}
      aria-label="create-inventory-modal-child"
    >
      <Stack direction={"column"} sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayMd">Create Purchase Order</Typography>
      </Stack>
      <Divider />
      <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
        <Grid item xs={12} sm={8} sx={{ backgroundColor: "background.custom" }}>
          <Grid container spacing={1} sx={{ width: "100%", p: 3 }}>
            <Typography variant="displaySm">Purchase Order Details</Typography>
            <Grid item xs={12}>
              <CustomTextInput
                title="Title"
                value={formState.title}
                name="title"
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Purchase Order Title"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomSelect
                options={["one", "Two"]}
                label="Category"
                state={formState.category}
                handleChange={handleChange}
                name="category"
                haveTopLabel={true}
                placeholder="Select Category"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomDatePicker
                type="date"
                views={["year", "month", "day"]}
                title="Due Date"
                size="small"
                datePickerRootSx={{ height: "auto" }}
                datePickerSx={{ width: "100%" }}
                placeholder="When do you need this"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomSelect
                options={["one", "Two"]}
                label="Vendor"
                state={formState.vendor}
                handleChange={handleChange}
                name="vendor"
                haveTopLabel={true}
                placeholder="Select vendor"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="heading">Inventory Details</Typography>

      <Stack
        direction={"column"}
        sx={{ width: "67%", p: 3, border: "0.2px dashed rgba(0,0,0,0.2)" }}
        spacing={1}
      >
        {selectedItems.map((selected, i) => (
          <Stack
            key={i}
            spacing={1}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Box
              sx={{
                p: 2,
                width: "45%",
                backgroundColor: "background.custom",
                color: "text.custom",
              }}
            >
              {selected.item}
            </Box>
            <Box
              sx={{
                p: 2,
                width: "45%",
                backgroundColor: "background.custom",
                color: "text.custom",
              }}
            >
              Available Quantity: {selected.quantity}
            </Box>
            <IconButton
              color="error"
              aria-label="delete-list"
              onClick={handleDeleteList.bind(this, selected.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          Add from Inventory
        </Typography>
        <Stack direction={"row"} sx={{ width: "100%" }} spacing={1}>
          <CustomButton
            text="Select from existing list"
            variant="custom"
            rgb="255, 129, 96"
            sx={{
              width: "100%",
              pt: 2,
              pb: 2,
            }}
            onClick={toggleModal}
            startIcon={<AddCircleIcon />}
          />
          <CustomButton
            text="Add New Inventory"
            color="primary"
            variant="text"
            sx={{ width: "100%", pt: 2, pb: 2 }}
            startIcon={<AddIcon />}
          />
        </Stack>
      </Stack>
      <ContentsContainer
        sx={{
          border: "0.5px dashed rgba(0,0,0,0.1)",
          borderRadius: "5px",
          width: "67%",
        }}
        data={data}
        state={formState}
        handleChange={handleChange}
      />
      <Typography variant="heading" sx={{ fontWeight: "bold" }}>
        Cost
      </Typography>
      <ContentsContainer
        sx={{
          border: "0.5px dashed rgba(0,0,0,0.1)",
          borderRadius: "5px",
          width: "67%",
        }}
        data={cost}
        state={formState}
        handleChange={handleChange}
      />
      <Typography variant="heading" sx={{ fontWeight: "bold" }}>
        Vendor Details
      </Typography>
      <ContentsContainer
        sx={{
          backgroundColor: "background.custom",
          width: "67%",
        }}
        data={vendorDetails}
        state={formState}
        handleChange={handleChange}
      />
      <Typography variant="heading" sx={{ fontWeight: "bold" }}>
        Shipping Details
      </Typography>
      <ContentsContainer
        sx={{
          backgroundColor: "background.custom",
          width: "67%",
        }}
        data={shippingDetails}
        state={formState}
        handleChange={handleChange}
      />
      <Typography variant="heading" sx={{ fontWeight: "bold" }}>
        Additional information
      </Typography>
      <CustomTextInput
        title="Notes"
        value={formState.notes}
        name="notes"
        handleChange={handleChange}
        boxSx={{ width: "67%" }}
        placeholder="Type the product name here"
        multiline
      />
      <Stack direction={"row"} spacing={1}>
        <CustomButton text="Add Purchase Order" color="secondary" />
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 7,
          width: {
            xs: "95%",
            sm: "60vw",
          },
        }}
        ariaLabel="usage-history-modal"
      >
        <ExistingListModal
          selectedItems={selectedItems}
          handleListClick={handleListClick}
        />
      </CustomModal>
    </Stack>
  );
}

export default PurchaseOrderModal;
