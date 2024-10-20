import { IconButton, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import SearchBar from "components/atoms/SearchBar";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_ALL_PHARMACY_PRODUCTS } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import CustomLoader from "components/atoms/CustomLoader";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { red } from "@mui/material/colors";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import CreateNewProductModal from "./CreateNewProductModal";
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
          <Typography variant="heading">{product.drugName}</Typography>
          <Stack spacing={1} direction="row">
            <Typography variant="small">Generic Name: </Typography>
            <Typography variant="small" sx={{ fontWeight: "bold" }}>
              {product.genericName.activeIngredient}
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
function DrugListModal({ selectedProducts, setselectedProducts, onClose }) {
  const queryClient = useQueryClient();
  const [search, setsearch] = React.useState("");
  const modalRef = React.useRef(null);

  //get all pharmacy products
  const {
    isLoading: productsLoading,

    data: pharmacyProdutcs,
  } = useCustomQuery(
    [GET_ALL_PHARMACY_PRODUCTS],
    {
      url: `/product/getall?limit=10000`,
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
    [GET_ALL_PHARMACY_PRODUCTS, search],
    {
      url: `/product/getall?search=${search}`,
      method: "get",
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [GET_ALL_PHARMACY_PRODUCTS],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
    }
  );

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

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
            <Typography variant="displaySm">Drug List</Typography>
            <Typography>Select from list of drug available </Typography>
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
        ) : (
          pharmacyProdutcs?.data?.products?.map((product) => (
            <DrugList
              key={product._id}
              product={product}
              handleSelect={handleSelect}
              selectedProducts={selectedProducts}
            />
          ))
        )}

        <Stack
          spacing={1}
          width="fit-content"
          direction={"row"}
          alignItems="center"
        >
          <CustomButton text={"Save"} color="secondary" onClick={onClose} />
          <CustomButton
            variant="containedBrown"
            text={"Add New Drug"}
            startIcon={<AddIcon />}
            onClick={toggleModal}
          />
        </Stack>
      </Stack>
      <CustomRightDrawer ref={modalRef} title="Create New  Product" subTitle="">
        <CreateNewProductModal closeModal={toggleModal} />
      </CustomRightDrawer>
    </>
  );
}

export default DrugListModal;
