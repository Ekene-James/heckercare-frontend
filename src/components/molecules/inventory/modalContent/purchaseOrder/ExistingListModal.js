import { Box, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchBar from "components/atoms/SearchBar";
import React from "react";

const listItems = [
  {
    id: 1,
    item: "Carton of Syringe Case",
    quantity: 2,
    desc: "",
  },
  {
    id: 2,
    item: "Carton of Syringe Case",
    quantity: 2,
    desc: "",
  },
  {
    id: 3,
    item: "Carton of Syringe Case",
    quantity: 2,
    desc: "",
  },
  {
    id: 4,
    item: "Carton of Syringe Case",
    quantity: 2,
    desc: "",
  },
];
const List = ({ list, handleListClick, selectedItems }) => {
  const { item, quantity, desc, id } = list;
  const isSelected = selectedItems.includes(list);
  return (
    <Stack
      direction={"column"}
      spacing={1}
      sx={{
        p: 2,
        border: "0.5px solid rgba(0,0,0,0.1)",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={handleListClick.bind(this, list)}
    >
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ width: "100%" }}
      >
        <Typography sx={{ fontWeight: "bold" }}>{item}</Typography>
        <Stack
          direction={"row"}
          spacing={0.3}
          sx={{
            p: 1,
            border: "0.5px solid rgba(0,0,0,0.1)",
            borderRadius: "5px",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Available Qty:</Typography>
          <Typography sx={{ fontWeight: "bold", color: "red" }}>
            {quantity}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ width: "100%" }}
      >
        <Typography sx={{ opacity: "0.5", width: "70%" }}>{desc}</Typography>
        {isSelected && <CheckCircleIcon sx={{ color: "primary.success" }} />}
      </Stack>
    </Stack>
  );
};
function ExistingListModal({ handleListClick, selectedItems }) {
  return (
    <Stack direction={"column"} spacing={2} sx={{ width: "100%" }}>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
        sx={{ width: "100%" }}
      >
        <Stack direction={"column"} spacing={0.5}>
          <Typography variant="heading">Inventory</Typography>
          <Typography variant="small">
            Select from list of inventory created
          </Typography>
        </Stack>
        <SearchBar handleSearch={() => {}} placeholder="Search" />
      </Stack>
      {listItems.map((list, i) => (
        <List
          list={list}
          key={i}
          handleListClick={handleListClick}
          selectedItems={selectedItems}
        />
      ))}
    </Stack>
  );
}

export default ExistingListModal;
