import { Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomMenu from "components/atoms/CustomMenu";
import SearchBar from "components/atoms/SearchBar";
import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import { exportToExcel } from "utils/exportToExcel";
import CsvDownloader from "react-csv-downloader";
import RequisitionTable from "components/molecules/tabels/pharmacy/RequisitionTable";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_ALL_PHARMACY_REQUISITIONS } from "utils/reactQueryKeys";
import Pagination from "components/molecules/pagination/Pagination";
import CustomRightDrawer from "components/atoms/CustomRightDrawer";
import CreateRequistionModal from "./modalContents/CreateRequistionModal";

import CustomLoader from "components/atoms/CustomLoader";
import { useQueryClient } from "react-query";
const pageSize = 10;

const formatExportData = (data) => {
  if (!data || !data?.length) return;

  const formartted = data.map((d) => {
    const copy = structuredClone(d);
    let drugDetails = {};
    copy.drugDetails.forEach((detail, i) => {
      drugDetails[`productType_${i + 1}`] = detail.productType?.drugName;
      drugDetails[`unitCost_${i + 1}`] = detail.unitCost;
      drugDetails[`quantity_${i + 1}`] = detail.quantity;
      drugDetails[`unit${i + 1}`] = detail.unit;
    });
    const formart = {
      ...copy,
      ...copy.cost,
      ...drugDetails,
      requesterName: copy.requester.fullName,
      vendorAddress: copy.vendorDetails.address,
      vendorPhone: copy.vendorDetails.phoneNumber,
      shippingAddress: copy.shippiongDetails.address,
    };
    delete formart.drugDetails;
    delete formart.cost;
    delete formart.requester;
    delete formart.vendorDetails;
    delete formart.shippiongDetails;
    delete formart.id;
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
      GET_ALL_PHARMACY_REQUISITIONS,
      {
        page: currentPage,
        limit: pageSize,
      },
    ],
    {
      url: `/requisition/getall?page=${currentPage}&limit=${pageSize}&search=`,
      method: "get",
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
    [GET_ALL_PHARMACY_REQUISITIONS, search],
    {
      url: `/requisition/getall?search=${search}`,
      method: "get",
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_ALL_PHARMACY_REQUISITIONS,
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
      formatExportData(requisitionData?.data?.requisitions),
      `requistion_history_${new Date()}`
    );
  };
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h4">Requisition History</Typography>
        <Paper>
          <Stack
            width={"100%"}
            direction="row"
            justifyContent={"flex-end"}
            alignItems="center"
            spacing={1}
            p={2}
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
              disabled={!requisitionData?.data.requisitions?.length}
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
          ) : requisitionData?.data.requisitions?.length ? (
            <Stack p={2}>
              <RequisitionTable data={requisitionData?.data?.requisitions} />
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
