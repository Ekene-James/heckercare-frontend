import { Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import SearchBar from "components/atoms/SearchBar";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

import RequisitionTable from "components/molecules/tabels/pharmacy/RequisitionTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_ALL_NEW_VENDORS, GET_DEPARTMENTS } from "utils/reactQueryKeys";
import Pagination from "components/molecules/pagination/Pagination";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";

import CustomLoader from "components/atoms/CustomLoader";
import { useQueryClient } from "react-query";
import CreateRequistionModal from "components/molecules/inventory/modalContent/requisitionModals/CreateRequistionModal";
import InventoryReqTable from "components/molecules/tabels/inventory/inventoryReqTable";
import ModalParent from "components/molecules/inventory/modalContent/vendorMgt/ModalParent";
import VendorMgtTable from "components/molecules/tabels/inventory/VendorMgtTable";

const pageSize = 10;

function VendorMgt() {
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  const [modalType, setmodalType] = React.useState(0);
  const [search, setsearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  //get vendors
  const {
    isLoading,

    data: vendors,
  } = useCustomQuery(
    [
      GET_ALL_NEW_VENDORS,
      {
        page: currentPage,
        limit: pageSize,
      },
    ],
    {
      url: `/newvendor/getall`,
      method: "post",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //search requisition
  const {
    isLoading: searchLoading,
    isFetching,

    refetch: refetchRequisition,
  } = useCustomQuery(
    [GET_ALL_NEW_VENDORS, search],
    {
      url: `/newvendor/getall`,
      method: "post",
      data: { search },
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_ALL_NEW_VENDORS,
            {
              page: currentPage,
              limit: pageSize,
            },
          ],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
    }
  );

  const toggleModal = (modalType) => {
    setmodalType(modalType);
    modalRef?.current?.handleToggle();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="displayLg">Vendor Management</Typography>
        <Paper>
          <Stack
            width={"100%"}
            direction="row"
            justifyContent={"space-between"}
            alignItems="center"
            p={2}
          >
            <SearchBar
              search={search}
              setsearch={setsearch}
              isLoading={searchLoading || isFetching}
              refetch={refetchRequisition}
              placeholder="Search Vendor Name"
            />

            <Stack
              direction="row"
              justifyContent={"flex-end"}
              alignItems="center"
              spacing={1}
              p={2}
            >
              {/* <CustomButton
                text={"Create New Item"}
                variant="containedBrown"
                startIcon={<AddIcon />}
                // onClick={toggleModal.bind(null, 0)}
              /> */}
              <CustomButton
                text={"Create New Vendor"}
                variant="contained"
                color="secondary"
                onClick={toggleModal.bind(null, 1)}
              />
            </Stack>
          </Stack>
          {isLoading ? (
            <CustomLoader />
          ) : vendors?.data?.newVendors?.length ? (
            <Stack p={2}>
              <VendorMgtTable data={vendors?.data?.newVendors} />
              <Pagination
                currentPage={currentPage}
                totalCount={vendors?.data?.newVendorCount || 5}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </Stack>
          ) : (
            "No data found"
          )}
        </Paper>
      </Stack>
      <CustomRightDrawer
        ref={modalRef}
        title={"Create New Vendor"}
        subTitle={""}
      >
        <ModalParent
          modalType={modalType}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
}

export default VendorMgt;
