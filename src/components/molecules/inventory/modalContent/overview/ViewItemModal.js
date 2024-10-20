import { Box, Grid, Typography, Stack } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CustomSwitch from "components/atoms/Switch";
import UploadBoard from "components/atoms/UploadBoard";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_ALL_DEPARTMENT_INVENTORY } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import moment from "moment";
import MedicationIcon from "@mui/icons-material/Medication";
import { currencyFormatter } from "utils/numberFormatter";

const unitType = [
  "TABLET",
  "VIAL",
  "PIECE",
  "CAPSULE",
  "SYRUP",
  "INJECTION",
  "DROPS",
  "GEL",
  "OINTMENT",
  "LOTION",
  "CREAM",
  "PASTE",
  "SOLUTION",
  "SUSPENSION",
  "EMULSION",
  "LIQUID",
  "PILL",
  "CARTON",
  "BOTTLE",
  "PACKET",
  "BOX",
  "BAG",
  "CAN",
  "TUBE",
  "BOTTLE_OF_100",
  "BOTTLE_OF_500",
  "BOTTLE_OF_1000",
];

function ViewItemModal({ detail, editData, closeHandler }) {
  console.log(detail);
  const [image, setImage] = useState(null);
  const queryClient = useQueryClient();

  const { handleBlur, handleChange, values } = useFormik({
    initialValues: editData || {},
    validate: (values) => {},
    enableReinitialize: true,
  });

  const {
    mutate: handleCreateItem,
    isLoading: handleCreateItemLoading,
    refetch: refetchItemList,
  } = useCustomMutation(
    {
      url: `/itemproduct/create-item-product`,
      method: "post",
      data: {
        ...values,
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_ALL_DEPARTMENT_INVENTORY]);
        toast.success("Success");
        // refetchTests();

        closeHandler();
      },

      onError: (error) => toast.error(error.message),
    }
  );

  useEffect(() => {
    setImage({
      file: null,
      b64: editData?.image_url,
    });
  }, [editData]);
  const navigate = useNavigate();

  return (
    <>
      <Stack spacing={30} direction="row">
        {/* First column */}
        <Stack spacing={4}>
          <Stack>
            <Stack spacing={2} direction="row">
              <Typography>Date Created</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {moment(detail.dateCreated).format("MMM Do YYYY")}
              </Typography>
            </Stack>

            <Stack
              sx={{ marginBottom: "10px", marginTop: "10px" }}
              spacing={2}
              direction="row"
            >
              <MedicationIcon />
              <Box>
                <Typography sx={{ fontWeight: "bold" }} variant="small">
                  Product Name
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {detail.itemName}
                </Typography>
              </Box>
            </Stack>

            <Stack sx={{ marginBottom: "10px" }}>
              <Typography sx={{ fontWeight: "bold" }} variant="small">
                Description
              </Typography>
              <Typography>{detail.itemDescription}</Typography>
            </Stack>
            <Stack direction="row" spacing={4}>
              <Typography sx={{ fontWeight: "bold" }} variant="small">
                Product Category
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "lightgrey",
                  padding: "4px 8px",
                  borderRadius: "8px",
                }}
              >
                {detail.itemType}
              </Typography>
            </Stack>
          </Stack>

          <Stack>
            <Typography sx={{ fontWeight: "bold" }}>
              Cost & Sales Value
            </Typography>
          </Stack>
          <Stack spacing={8} direction="row">
            <Box>
              <Typography sx={{ fontWeight: "bold" }} variant="small">
                Total Cost
              </Typography>
              <Typography sx={{ fontWeight: "bold" }}>{`${currencyFormatter(
                detail.unitCost * detail.availableQuantity
              )}`}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: "bold" }} variant="small">
                Unit Cost
              </Typography>
              <Typography sx={{ fontWeight: "bold" }}>{`${currencyFormatter(
                detail.unitCost
              )}`}</Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Second column */}
        <Stack spacing={6}>
          <Stack spacing={4}>
            <CustomButton
              text="Transaction History"
              variant="contained"
              color="secondary"
              // startIcon={<LocalPrintshopIcon />}
              onClick={() =>
                navigate(
                  `/home/inventory-items/transaction-history/${detail._id}`
                )
              }
            />
            <Stack direction="row" spacing={4}>
              <Stack>
                <Typography>Available</Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {detail.availableQuantity}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={4}></Stack>
            <Stack direction="row" spacing={4}></Stack>
          </Stack>
          {/* <Stack>
            <Typography sx={{ fontWeight: "bold" }}>Product Image</Typography>
            <img src="#979797" alt="item image" />
          </Stack> */}
        </Stack>
      </Stack>
    </>
  );
}

export default ViewItemModal;
