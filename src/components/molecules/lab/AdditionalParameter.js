import * as React from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { v4 as uuidv4 } from "uuid";
import { Box, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import StockUsageTable from "../tabels/lab/StockUsageTable";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomModal from "components/atoms/CustomModal";

export default function AdditionalParameter({
  defaultValue = [],
  formState,
  setformState,
}) {
  const [rows, setrows] = React.useState(defaultValue);
  const [formsState, setformsState] = React.useState("");

  const modalRef = React.useRef(null);

  const openModal = () => {
    modalRef?.current?.handleToggle();
  };

  const handleAddStock = () => {
    const newRow = {
      id: uuidv4(),
      name: formsState,
    };
    setrows((prev) => [...prev, newRow]);
    openModal();
    setformsState("");
  };
  const handleRemove = (id) => {
    const newRow = rows.filter((row) => row.id !== id);
    setrows(newRow);
  };
  return (
    <Box>
      <Stack width="100%" backgroundColor="background.black" p={2.5}>
        <Typography color="primary.lightest" variant="heading">
          ADDITIONAL PARAMETER
        </Typography>
      </Stack>
      <Stack
        direction={"column"}
        spacing={2}
        alignItems={"flex-start"}
        justifyContent="center"
        sx={{
          width: {
            xs: "100%",
          },
          p: 2,
        }}
        backgroundColor="background.custom"
      >
        <Stack
          direction={"column"}
          spacing={1}
          alignItems={"flex-end"}
          justifyContent="center"
          sx={{
            width: {
              xs: "100%",
            },
            p: { xs: 0.5, sm: 2 },
          }}
        >
          <StockUsageTable
            defaultValue={defaultValue}
            rows={rows}
            handleRemove={handleRemove}
            setformState={setformState}
            formState={formState}
          />
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            justifyContent="space-between"
            sx={{
              width: {
                xs: "100%",
              },
              p: { xs: 0.5, sm: 2 },
            }}
          >
            <CustomButton
              text={"Add"}
              variant="containedBrown"
              onClick={openModal}
            />
            <CustomButton
              text={"Add Parameter"}
              variant="text"
              color="primary"
              startIcon={<AddCircleIcon />}
            />
          </Stack>
        </Stack>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
        }}
        ariaLabel="add-stock-modal"
      >
        <Stack spacing={2}>
          <CustomTextInput
            title="Name"
            value={formsState}
            name="stock"
            handleChange={(e) => setformsState(e.target.value)}
            boxSx={{ width: "100%" }}
            placeholder="Input name"
          />
          <CustomButton
            text={"Add"}
            onClick={handleAddStock}
            variant="contained"
            color="secondary"
          />
        </Stack>
      </CustomModal>
    </Box>
  );
}

AdditionalParameter.defaultProps = {
  defaultValue: [],
  formState: {},
  setformState: () => {},
};
