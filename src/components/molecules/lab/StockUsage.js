import * as React from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { v4 as uuidv4 } from "uuid";
import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import StockUsageTable from "../tabels/lab/StockUsageTable";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomModal from "components/atoms/CustomModal";
import CustomSelect from "components/atoms/Select";

export default function StockUsage({
  defaultValue = [],
  formState,
  setformState,
  testCenter = false,
}) {
  const [rows, setrows] = React.useState(defaultValue);

  const [modalFormsState, setmodalFormsState] = React.useState("");

  const modalRef = React.useRef(null);

  const openModal = () => {
    modalRef?.current?.handleToggle();
  };

  // const handleChange = (e) => {
  //   setformState({
  //     ...formState,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  const handleAddStock = () => {
    if (!modalFormsState) return;
    const trimed = modalFormsState.replace(/\s+/g, "");
    //it already exists
    if (trimed in formState) return;

    const newRow = {
      id: uuidv4(),
      name: modalFormsState,
    };

    setrows((prev) => [...prev, newRow]);
    setformState({ ...formState, otherFields: [...rows, newRow] });
    setmodalFormsState("");

    openModal();
  };

  const handleRemove = (detail) => {
    const newRow = rows.filter((row) => row.id !== detail.id);
    // const formData = { ...formState };
    // delete formData[detail.name.replace(/\s+/g, "")];

    setformState((prev) => ({
      ...prev,
      otherFields: newRow,
    }));
    setrows(newRow);
  };

  return (
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
    >
      <Typography variant="heading">Other Fields</Typography>
      <Stack
        direction={"column"}
        spacing={1}
        alignItems={"flex-end"}
        justifyContent="center"
        sx={{
          width: {
            xs: "100%",
            sm: "85%",
          },
          p: { xs: 0.5, sm: 2 },
          backgroundColor: "background.custom",
        }}
      >
        <StockUsageTable
          defaultValue={defaultValue}
          rows={rows}
          handleRemove={handleRemove}
          formState={formState}
        />

        <CustomButton
          text={"Add Fields"}
          variant="text"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={openModal}
        />
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
        }}
        ariaLabel="add-stock-modal"
      >
        <Stack spacing={2}>
          {testCenter ? (
            <CustomSelect
              options={["Item 1", "Item 2", "Item 3"]}
              label=""
              state={modalFormsState}
              handleChange={(e) => setmodalFormsState(e.target.value)}
              name={modalFormsState}
              haveTopLabel={true}
              placeholder="Select from list"
              boxSx={{ width: "100%" }}
            />
          ) : (
            <CustomTextInput
              title="Field Name"
              value={modalFormsState}
              name={modalFormsState}
              handleChange={(e) => setmodalFormsState(e.target.value)}
              boxSx={{ width: "100%" }}
              placeholder="Input field name"
            />
          )}
          <CustomButton
            text={"Add"}
            onClick={handleAddStock}
            variant="contained"
            color="secondary"
          />
        </Stack>
      </CustomModal>
    </Stack>
  );
}

StockUsage.defaultProps = {
  defaultValue: [],
  formState: {},
  setformState: () => {},
};
