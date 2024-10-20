import { Box, IconButton, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import SearchBar from "components/atoms/SearchBar";
import React from "react";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_INVENTORY_PRODUCTS,
  GET_ALL_PHARMACY_PRODUCTS,
} from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import CustomLoader from "components/atoms/CustomLoader";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { red } from "@mui/material/colors";

const DrugList = ({ product, handleSelect, selectedProducts }) => {
  const isSelected = selectedProducts.some(
    (selected) => selected._id === product._id
  );

  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      alignItems={"flex-start"}
      p={2}
      onClick={handleSelect.bind(null, isSelected, product)}
      sx={{
        backgroundColor: isSelected
          ? "background.light"
          : "background.lightest",
        cursor: "pointer",
      }}
    >
      <Stack direction={"row"} alignItems="center" spacing={1}>
        {isSelected ? (
          <IconButton aria-label="check-box">
            <CheckBoxIcon sx={{ color: "primary.main", fontSize: "20px" }} />
          </IconButton>
        ) : (
          <IconButton aria-label="uncheck-box">
            <CheckBoxOutlineBlankIcon
              sx={{ color: "primary.main", fontSize: "20px" }}
            />
          </IconButton>
        )}

        <Stack spacing={0.1}>
          <Typography variant="heading">{product.itemName}</Typography>
          <Stack spacing={1} direction="row">
            <Typography variant="small">Unit Type: </Typography>
            <Typography variant="small" sx={{ fontWeight: "bold" }}>
              {product.unitType}
            </Typography>
          </Stack>
          <Stack spacing={1} direction="row">
            <Typography variant="small">Brand Name: </Typography>
            <Typography variant="small" sx={{ fontWeight: "bold" }}>
              {product.brandName}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction={"row"}
        alignItems="center"
        spacing={0.2}
        sx={{
          backgroundColor: "background.lightest",
          border: "1px solid rgba(0,0,0,0.2)",
          p: 1,

          borderRadius: "5px",
        }}
      >
        <Typography fontSize="0.75rem">Available Qty: </Typography>
        <Typography
          fontSize="0.75rem"
          color={red[600]}
          fontWeight="bold"
          sx={{
            textOverflow: "ellipsis",
            maxWidth: "65px",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {product.availableQuantity}{" "}
        </Typography>
      </Stack>
    </Stack>
  );
};
function InventoryListModal({
  selectedProducts,
  setselectedProducts,
  onClose,
}) {
  const queryClient = useQueryClient();
  const [search, setsearch] = React.useState("");

  //get all inventory products
  const {
    isLoading: productsLoading,

    data: inventoryProdutcs,
  } = useCustomQuery(
    [GET_ALL_INVENTORY_PRODUCTS],
    {
      url: `/itemproduct/getall`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //search pharmacy products
  const {
    isLoading: searchLoading,
    isFetching,

    refetch: refetchProdutcs,
  } = useCustomQuery(
    [GET_ALL_INVENTORY_PRODUCTS, search],
    {
      url: `/itemproduct/getall?search=${search}`,
      method: "get",
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [GET_ALL_INVENTORY_PRODUCTS],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
    }
  );

  const handleSelect = (isSelected, product) => {
    if (isSelected) {
      setselectedProducts((prev) => {
        return prev.filter((selected) => selected._id !== product._id);
      });
    } else {
      setselectedProducts((prev) => [
        ...prev,
        { ...product, quantity: "", unitCost: "", unit: "" },
      ]);
    }
  };
  return (
    <>
      <Stack spacing={2} width="100%" mt={2}>
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Stack spacing={1} width="100%">
            <Typography variant="displaySm">Inventory List</Typography>
            <Typography>Select from list of items available </Typography>
          </Stack>
          <SearchBar
            search={search}
            setsearch={setsearch}
            isLoading={searchLoading || isFetching}
            refetch={refetchProdutcs}
            placeholder="Search"
          />
        </Stack>
        {productsLoading ? (
          <CustomLoader />
        ) : inventoryProdutcs?.data?.allItemProduct?.length ? (
          inventoryProdutcs?.data?.allItemProduct?.map((product) => (
            <DrugList
              key={product._id}
              product={product}
              handleSelect={handleSelect}
              selectedProducts={selectedProducts}
            />
          ))
        ) : (
          <Box mt={3}>No Data found</Box>
        )}

        <Stack
          spacing={1}
          width="fit-content"
          direction={"row"}
          alignItems="center"
        >
          <CustomButton text={"Save"} color="secondary" onClick={onClose} />
        </Stack>
      </Stack>
    </>
  );
}

export default InventoryListModal;
