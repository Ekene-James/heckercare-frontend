import { Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import SearchBar from "components/atoms/SearchBar";
import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import { exportToExcel } from "utils/exportToExcel";

import RequisitionTable from "components/molecules/tabels/pharmacy/RequisitionTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_INVENTORY_REQUISITIONS,
  GET_DEPARTMENTS,
} from "utils/reactQueryKeys";
import Pagination from "components/molecules/pagination/Pagination";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";

import CustomLoader from "components/atoms/CustomLoader";
import { useQueryClient } from "react-query";
import CreateRequistionModal from "components/molecules/inventory/modalContent/requisitionModals/CreateRequistionModal";
import InventoryReqTable from "components/molecules/tabels/inventory/inventoryReqTable";

const pageSize = 10;

const formatExportData = (data) => {
  if (!data || !data?.length) return;

  const formartted = data.map((d) => {
    const copy = structuredClone(d);
    let inventoryDetails = {};
    copy.inventoryDetails.forEach((detail, i) => {
      inventoryDetails[`productType_${i + 1}`] = detail.productType;
      inventoryDetails[`unitCost_${i + 1}`] = detail.unitCost;
      inventoryDetails[`quantity_${i + 1}`] = detail.quantity;
    });
    const formart = {
      ...copy,
      ...copy.cost,
      ...inventoryDetails,

      requesterName: copy.requester.fullName,
      vendorAddress: copy.vendorDetails.address,
      vendorPhone: copy.vendorDetails.phoneNumber,
      shippingAddress: copy.shippiongDetails.address,
    };
    delete formart.inventoryDetails;
    delete formart.cost;
    delete formart.requester;
    delete formart.vendorDetails;
    delete formart.shippiongDetails;
    delete formart.id;
    if (formart?.department) delete formart.department;

    return formart;
  });

  return formartted;
};
function RequisitionHistory() {
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  const [search, setsearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  //get pharmacy Requisition history
  const {
    isLoading,

    data: requisitionData,
  } = useCustomQuery(
    [
      GET_ALL_INVENTORY_REQUISITIONS,
      {
        page: currentPage,
        limit: pageSize,
      },
    ],
    {
      url: `/itemrequisition/getall`,
      method: "post",
      data: {
        page: currentPage,
        limit: pageSize,
      },
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
    [GET_ALL_INVENTORY_REQUISITIONS, search],
    {
      url: `/itemrequisition/getall`,
      method: "post",
      data: {
        search,
      },
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_ALL_INVENTORY_REQUISITIONS,
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

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleExport = (item) => {
    exportToExcel(
      formatExportData(requisitionData?.data?.allRequisitions),
      `inventory_requistion_history_${new Date()}`
    );
  };
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="displayLg">Requisition History</Typography>
        <Paper>
          <Stack
            width={"100%"}
            direction="row"
            justifyContent={"flex-end"}
            alignItems="center"
            spacing={1}
            p={2}
            pt={4}
          >
            <SearchBar
              search={search}
              setsearch={setsearch}
              isLoading={searchLoading || isFetching}
              refetch={refetchRequisition}
              placeholder="Search Title"
            />
            <CustomMenu
              caption="Export"
              icon={<PrintIcon />}
              onClickItem={handleExport}
              popperSx={{ width: "12%" }}
              disabled={!requisitionData?.data?.allRequisitions?.length}
              items={[
                {
                  name: "Excel",
                },
              ]}
            />
            <CustomButton
              text={"Create Requisition"}
              variant="contained"
              color="secondary"
              onClick={toggleModal}
            />
          </Stack>
          {isLoading ? (
            <CustomLoader />
          ) : requisitionData?.data?.allRequisitions?.length ? (
            <Stack p={2}>
              <InventoryReqTable
                data={requisitionData?.data?.allRequisitions}
              />
              <Pagination
                currentPage={currentPage}
                totalCount={requisitionData?.data?.count || 5}
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
        title={"Create Requisition"}
        subTitle={"Input information for requisition"}
      >
        <CreateRequistionModal
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomRightDrawer>
    </>
  );
}

export default RequisitionHistory;
