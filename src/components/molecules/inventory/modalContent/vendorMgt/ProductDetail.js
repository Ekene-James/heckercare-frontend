import { Divider, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";

import SearchSelectDropdown from "components/atoms/SearchSelectDropDown";

import VendorProductsTable from "components/molecules/tabels/inventory/VendorProductsTable";

import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

import {
  GET_ALL_INVENTORY_PRODUCTS,
  GET_ALL_NEW_VENDORS,
} from "utils/reactQueryKeys";
const Title = ({ title }) => {
  return (
    <Stack width={"100%"} spacing={1.5}>
      <Typography variant="displaySm">{title}</Typography>
      <Divider />
    </Stack>
  );
};

function ProductDetails({ closeModal, detail }) {
  const [search, setsearch] = React.useState("");
  const queryClient = useQueryClient();
  const [selectedProducts, setselectedProducts] = React.useState([]);

  //search inventory products
  const {
    isLoading: searchLoading,

    data: inventoryProdutcs,

    refetch: refetchProducts,
  } = useCustomQuery(
    [GET_ALL_INVENTORY_PRODUCTS, search],
    {
      url: `/itemproduct/getall?search=${search}`,
      method: "get",
      avoidCancelling: "true",
    },
    {
      enabled: !!search,
      refetchOnWindowFocus: false,
    }
  );

  React.useMemo(() => setselectedProducts(detail.addProduct), [detail]);

  //edit vendor
  const { mutate: handleSave, isLoading } = useCustomMutation(
    {
      url: `/newvendor/edit/${detail._id}`,
      method: "patch",
      data: {
        addProduct: selectedProducts.map((product) => product._id),
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_ALL_NEW_VENDORS);
        toast.success("Success");
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );
  const handleOnClickProduct = (item, type) => {
    if (type === "select") {
      setselectedProducts((prev) => [...prev, item]);
    } else {
      setselectedProducts((prev) => {
        return prev.filter((data) => data._id !== item._id);
      });
    }
  };
  const deleteProduct = (item) => {
    setselectedProducts((prev) => {
      return prev.filter((data) => data._id !== item._id);
    });
  };
  const onClickSave = () => {
    if (!selectedProducts.length) {
      return toast.error("Please add a product");
    }
    handleSave();
  };
  return (
    <Stack spacing={5}>
      <Stack spacing={1}>
        <Stack
          direction={"row"}
          spacing={1}
          alignItems="center"
          justifyContent={"space-between"}
          width="100%"
        >
          <Typography variant="displaySm">Add Product</Typography>
          <SearchSelectDropdown
            placeholder="Search Product"
            handleOnselect={handleOnClickProduct}
            selectedItems={selectedProducts}
            createBtnTxt="Create New Product"
            traySx={{ minWidth: "23vw", left: "-40px" }}
            data={inventoryProdutcs?.data?.allItemProduct}
            isLoading={searchLoading}
            search={search}
            setsearch={setsearch}
            reFetch={refetchProducts}

            // createBtnAction={() => openCreateProduct()}
          />
        </Stack>
        <VendorProductsTable
          data={selectedProducts}
          deleteProduct={deleteProduct}
        />
      </Stack>

      <Stack direction={"row"} spacing={1}>
        <CustomButton
          text="Save & Update"
          color="secondary"
          sx={{ minWidth: "20%" }}
          onClick={onClickSave}
          disabled={isLoading}
        />
      </Stack>
    </Stack>
  );
}

export default ProductDetails;
