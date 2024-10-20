import {
  Box,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

import CustomSelect from "components/atoms/Select";

import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";
import GenerateReceiptModal from "components/molecules/accounting/modal/GenerateReceiptModal";
import moment from "moment";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { numberFormatter } from "utils/numberFormatter";
import AddTransactionType from "./ModalContents/AddTransactionType";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PACKAGES, GET_TRANSACTION_TYPES } from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import AddPackages from "./ModalContents/AddPackages";

const Card = ({ details, openEditModal, modalDetail }) => {
  return (
    <>
      <Stack
        spacing={2}
        p={2}
        sx={{
          border: "0.2px solid rgba(0,0,0,0.1)",
          borderRadius: "5px",
          p: 2,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <Stack>
            <Typography
              sx={{
                fontWeight: "bold",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "200px",
              }}
            >
              {details.name}
            </Typography>
            <Typography sx={{ opacity: 0.7 }} variant="small">
              Last updated {moment(details?.createdAt).format("MMMM Do, YYYY")}
            </Typography>
          </Stack>
          <IconButton onClick={() => openEditModal(details, modalDetail)}>
            <BorderColorIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="heading">
          {`₦${numberFormatter(details?.amount)}`}
        </Typography>
      </Stack>
    </>
  );
};
const Card1 = ({ details, openEditModal, modalDetail }) => {
  return (
    <>
      <Stack
        spacing={2}
        p={2}
        sx={{
          border: "0.2px solid rgba(0,0,0,0.1)",
          borderRadius: "5px",
          p: 2,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <Stack>
            <Typography
              sx={{
                fontWeight: "bold",
                overflowX: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "200px",
              }}
            >
              {details.name}
            </Typography>

            <Typography sx={{ opacity: 0.7 }} variant="small">
              Last updated {moment(details?.createdAt).format("MMMM Do, YYYY")}
            </Typography>
          </Stack>
          <IconButton onClick={() => openEditModal(details, modalDetail)}>
            <BorderColorIcon fontSize="small" />
          </IconButton>
        </Stack>
        <CustomButton
          text={"Details"}
          onClick={() =>
            openEditModal(details, { ...modalDetail, disableFields: true })
          }
          variant="lightSecondary"
          sx={{ width: "60px" }}
        />
        <Typography variant="heading">
          {`₦${numberFormatter(details?.amount)}`}
        </Typography>
      </Stack>
    </>
  );
};
const TitleAndBtn = ({ title, toggleModal, showAddBtn = true }) => {
  return (
    <Stack width={"100%"} spacing={1.5}>
      <Stack width={"100%"} direction={"row"} justifyContent={"space-between"}>
        <Typography variant="displaySm">{title}</Typography>
        {showAddBtn && (
          <CustomButton
            text="Add New"
            color="secondary"
            onClick={toggleModal.bind(null, {
              typeText: "Add New",
              transactionType: title,
            })}
            variant="text"
          />
        )}
      </Stack>
      <Divider width="100%" light />
    </Stack>
  );
};

function TransactionTypes() {
  const modalRef = React.useRef(null);
  const modalRef1 = React.useRef(null);
  const [modalDetails, setmodalDetails] = React.useState({
    typeText: "Add New",
    transactionType: "Consultations",
  });
  const [clickedCard, setclickedCard] = React.useState({});

  const toggleModal = (modalDetail) => {
    setmodalDetails(modalDetail);
    modalRef?.current?.handleToggle();
  };
  const toggleModal1 = (modalDetail) => {
    setmodalDetails(modalDetail);
    modalRef1?.current?.handleToggle();
  };
  const closeModal = () => {
    modalRef?.current?.handleToggle();
    setclickedCard({});
  };
  const closeModal1 = () => {
    modalRef1?.current?.handleToggle();
    setclickedCard({});
  };
  const openEditModal = (cardDetails, modalDetail) => {
    setclickedCard(cardDetails);
    toggleModal(modalDetail);
  };
  const openEditModal1 = (cardDetails, modalDetail) => {
    setclickedCard(cardDetails);
    toggleModal1(modalDetail);
  };

  //get transaction types
  const {
    data: transactionTypes,
    isLoading,
    isError,
  } = useCustomQuery(
    [GET_TRANSACTION_TYPES],
    {
      url: `/transaction-type`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data.data;
      },
    }
  );
  //get packages
  const {
    data: packages,
    isPackagesLoading,
    isPackagesError,
  } = useCustomQuery(
    [GET_PACKAGES],
    {
      url: `/package`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data;
      },
    }
  );

  return (
    <>
      <Stack direction="column" spacing={2} sx={{ mt: 0 }}>
        <Typography variant="displayMd">Transaction Types</Typography>

        <Paper sx={{ p: 3, pb: 6 }}>
          {isLoading ? (
            <CustomLoader />
          ) : isError ? (
            <Paper sx={{ p: 1, mt: 2 }}>
              <Typography>
                Something went wrong, refresh and try again Later
              </Typography>
            </Paper>
          ) : (
            <Stack direction="column" spacing={2.5}>
              <TitleAndBtn
                title="Registration Fee"
                toggleModal={toggleModal}
                showAddBtn={false}
              />

              <Grid container spacing={1} sx={{ mt: 2 }}>
                {transactionTypes?.["REGISTRATION FEE"]?.map((details) => (
                  <Grid item xs={12} sm={4} lg={3} key={details._id}>
                    <Card
                      details={details}
                      openEditModal={openEditModal}
                      modalDetail={{
                        typeText: "Edit Details",
                        transactionType: "Regitration fee",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <TitleAndBtn title="Consultations" toggleModal={toggleModal} />

              <Grid container spacing={1} sx={{ mt: 2 }}>
                {transactionTypes?.CONSULTATION?.map((details) => (
                  <Grid item xs={12} sm={4} lg={3} key={details._id}>
                    <Card
                      details={details}
                      openEditModal={openEditModal}
                      modalDetail={{
                        typeText: "Edit Details",
                        transactionType: "Consultations",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <TitleAndBtn
                title="Admissions"
                toggleModal={toggleModal}
                showAddBtn={false}
              />
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {transactionTypes?.ADMISSION?.length ? (
                  transactionTypes?.ADMISSION?.map((details) => (
                    <Grid item xs={12} sm={4} lg={3} key={details._id}>
                      <Card
                        details={details}
                        openEditModal={openEditModal}
                        modalDetail={{
                          typeText: "Edit Details",
                          transactionType: "Admission",
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <Paper sx={{ p: 1, mt: 2 }}>
                    <Typography fontWeight={"bold"}>
                      No Transaction type found
                    </Typography>
                  </Paper>
                )}
              </Grid>

              <TitleAndBtn title="Packages" toggleModal={toggleModal1} />
              {isPackagesLoading ? (
                <CustomLoader />
              ) : isPackagesError ? (
                <Paper sx={{ p: 1, mt: 2 }}>
                  <Typography>
                    Something went wrong, refresh and try again Later
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {packages?.packages?.length ? (
                    packages?.packages?.map((details) => (
                      <Grid item xs={12} sm={4} lg={3} key={details._id}>
                        <Card1
                          details={details}
                          openEditModal={openEditModal1}
                          modalDetail={{
                            typeText: "Edit Details",
                            transactionType: "Packages",
                            disableFields: false,
                          }}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Paper sx={{ p: 1, mt: 2 }}>
                      <Typography fontWeight={"bold"}>
                        No Transaction type found for packages
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              )}
            </Stack>
          )}
        </Paper>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 6,
          width: {
            xs: "95%",
            sm: "40vw",
          },
        }}
        cleanUp={() => setclickedCard({})}
      >
        <AddTransactionType
          close={closeModal}
          typeText={modalDetails.typeText}
          transactionType={modalDetails.transactionType}
          clickedCard={clickedCard}
        />
      </CustomModal>
      <CustomModal
        ref={modalRef1}
        childrenContSx={{
          p: 6,
          width: {
            xs: "95%",
            sm: "60vw",
          },
        }}
        cleanUp={() => setclickedCard({})}
      >
        <AddPackages
          close={closeModal1}
          typeText={modalDetails.typeText}
          disableFields={modalDetails.disableFields}
          clickedCard={clickedCard}
        />
      </CustomModal>
    </>
  );
}

export default TransactionTypes;
